@description('The name of the function app')
param functionAppName string

@description('The location for the function app')
param location string

@description('The name of the storage account')
param storageAccountName string

@description('Application Insights instrumentation key')
param appInsightsInstrumentationKey string

@description('Cosmos DB endpoint')
param cosmosDbEndpoint string

@description('Cosmos DB key')
@secure()
param cosmosDbKey string

@description('Azure OpenAI endpoint')
param openAIEndpoint string

@description('Azure OpenAI key')
@secure()
param openAIKey string

@description('Azure OpenAI deployment name')
param openAIDeploymentName string

@description('Tags for the resources')
param tags object = {}

@description('Function app SKU')
param skuName string = 'Y1'

@description('Node.js version')
param nodeVersion string = '18'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${functionAppName}-plan'
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuName == 'Y1' ? 'Dynamic' : 'Standard'
  }
  kind: 'functionapp'
  properties: {
    reserved: true // Linux
  }
}

// Function App
resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: functionAppName
  location: location
  tags: tags
  kind: 'functionapp,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersion}'
      alwaysOn: skuName != 'Y1'
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
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${listKeys(resourceId('Microsoft.Storage/storageAccounts', storageAccountName), '2023-01-01').keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};AccountKey=${listKeys(resourceId('Microsoft.Storage/storageAccounts', storageAccountName), '2023-01-01').keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower(functionAppName)
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
          value: '~${nodeVersion}'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsightsInstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: 'InstrumentationKey=${appInsightsInstrumentationKey}'
        }
        {
          name: 'COSMOS_DB_ENDPOINT'
          value: cosmosDbEndpoint
        }
        {
          name: 'COSMOS_DB_KEY'
          value: cosmosDbKey
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: openAIEndpoint
        }
        {
          name: 'AZURE_OPENAI_API_KEY'
          value: openAIKey
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT_NAME'
          value: openAIDeploymentName
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

// Enable system-assigned managed identity
resource functionAppIdentity 'Microsoft.Web/sites@2023-01-01' = {
  name: functionApp.name
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: functionApp.properties
}

// Outputs
output functionAppName string = functionApp.name
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output functionAppId string = functionApp.id
output principalId string = functionApp.identity.principalId
output hostKeys object = listKeys('${functionApp.id}/host/default', '2023-01-01')
