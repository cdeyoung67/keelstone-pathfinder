@description('The name of the application')
param appName string

@description('The environment (dev, staging, prod)')
param environment string = 'prod'

@description('The location for all resources')
param location string = resourceGroup().location

// Variables
var resourcePrefix = '${appName}-${environment}'
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)
var tags = {
  Application: appName
  Environment: environment
  ManagedBy: 'Bicep'
}

// Storage Account (required for Azure Functions)
module storage 'modules/storage.bicep' = {
  name: 'storage-deployment'
  params: {
    storageAccountName: '${replace(resourcePrefix, '-', '')}${uniqueSuffix}st'
    location: location
    tags: tags
  }
}

// Cosmos DB
module cosmosDb 'modules/cosmosdb.bicep' = {
  name: 'cosmosdb-deployment'
  params: {
    accountName: '${resourcePrefix}-cosmos-${uniqueSuffix}'
    location: location
    tags: tags
  }
}

// Application Insights
module monitoring 'modules/monitoring.bicep' = {
  name: 'monitoring-deployment'
  params: {
    appInsightsName: '${resourcePrefix}-insights-${uniqueSuffix}'
    location: location
    tags: tags
  }
}

// Azure Functions (without OpenAI for now)
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${resourcePrefix}-functions-plan-${uniqueSuffix}'
  location: location
  tags: tags
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  kind: 'functionapp'
  properties: {
    reserved: true // Linux
  }
}

resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: '${resourcePrefix}-functions-${uniqueSuffix}'
  location: location
  tags: tags
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18'
      alwaysOn: false
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      cors: {
        allowedOrigins: [
          'https://portal.azure.com'
          'https://ms.portal.azure.com'
        ]
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storage.outputs.connectionString
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: storage.outputs.connectionString
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower('${resourcePrefix}-functions-${uniqueSuffix}')
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: monitoring.outputs.instrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: monitoring.outputs.connectionString
        }
        {
          name: 'COSMOS_DB_ENDPOINT'
          value: cosmosDb.outputs.endpoint
        }
        {
          name: 'COSMOS_DB_KEY'
          value: cosmosDb.outputs.primaryKey
        }
        {
          name: 'ALLOWED_ORIGINS'
          value: '*'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
}

// Outputs for reference and CI/CD
output resourceGroupName string = resourceGroup().name
output functionAppName string = functionApp.name
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output cosmosDbEndpoint string = cosmosDb.outputs.endpoint
output storageAccountName string = storage.outputs.storageAccountName
