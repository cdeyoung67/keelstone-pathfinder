@description('The name of the application')
param appName string

@description('The environment (dev, staging, prod)')
param environment string = 'dev'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The URL of the existing Azure Functions backend')
param functionsAppUrl string

// Variables
var resourcePrefix = '${appName}-${environment}'
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)
var tags = {
  Application: appName
  Environment: environment
  ManagedBy: 'Bicep'
}

// Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: '${resourcePrefix}-web-${uniqueSuffix}'
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/yourusername/keelstone-pathfinder'
    branch: 'main'
    buildProperties: {
      appLocation: '/pathfinder-app'
      apiLocation: ''
      outputLocation: 'out'
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Static Web App Configuration
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    NEXT_PUBLIC_API_BASE_URL: functionsAppUrl
    NEXT_PUBLIC_ENVIRONMENT: environment
  }
}

// Outputs
output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output repositoryToken string = staticWebApp.listSecrets().properties.apiKey
