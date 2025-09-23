@description('The name of the application')
param appName string

@description('The environment (dev, staging, prod)')
param environment string = 'prod'

@description('The location for all resources')
param location string = resourceGroup().location

@description('OpenAI deployment name')
param openAIDeploymentName string = 'gpt-4'

@description('ConvertKit API key for email integration')
@secure()
param convertKitApiKey string = ''

@description('ConvertKit API secret for email integration')
@secure()
param convertKitApiSecret string = ''

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

// Azure OpenAI
module openAI 'modules/openai.bicep' = {
  name: 'openai-deployment'
  params: {
    accountName: '${resourcePrefix}-openai-${uniqueSuffix}'
    location: location
    deploymentName: openAIDeploymentName
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

// Azure Functions
module functions 'modules/functions.bicep' = {
  name: 'functions-deployment'
  params: {
    functionAppName: '${resourcePrefix}-functions-${uniqueSuffix}'
    location: location
    storageAccountName: storage.outputs.storageAccountName
    appInsightsInstrumentationKey: monitoring.outputs.instrumentationKey
    cosmosDbEndpoint: cosmosDb.outputs.endpoint
    cosmosDbKey: cosmosDb.outputs.primaryKey
    openAIEndpoint: openAI.outputs.endpoint
    openAIKey: openAI.outputs.key
    openAIDeploymentName: openAIDeploymentName
    tags: tags
  }
}

// Static Web App
module staticWebApp 'modules/staticwebapp.bicep' = {
  name: 'staticwebapp-deployment'
  params: {
    staticWebAppName: '${resourcePrefix}-web-${uniqueSuffix}'
    location: location
    functionsAppUrl: functions.outputs.functionAppUrl
    tags: tags
  }
}

// Logic Apps (for ConvertKit integration)
module logicApps 'modules/logicapps.bicep' = {
  name: 'logicapps-deployment'
  params: {
    logicAppName: '${resourcePrefix}-logic-${uniqueSuffix}'
    location: location
    convertKitApiKey: convertKitApiKey
    convertKitApiSecret: convertKitApiSecret
    tags: tags
  }
}

// Outputs for reference and CI/CD
output resourceGroupName string = resourceGroup().name
output functionAppName string = functions.outputs.functionAppName
output functionAppUrl string = functions.outputs.functionAppUrl
output staticWebAppName string = staticWebApp.outputs.staticWebAppName
output staticWebAppUrl string = staticWebApp.outputs.staticWebAppUrl
output cosmosDbEndpoint string = cosmosDb.outputs.endpoint
output openAIEndpoint string = openAI.outputs.endpoint
output logicAppName string = logicApps.outputs.logicAppName
output deploymentSummary object = {
  resourcePrefix: resourcePrefix
  uniqueSuffix: uniqueSuffix
  environment: environment
  location: location
}
