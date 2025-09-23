@description('The name of the static web app')
param staticWebAppName string

@description('The location for the static web app')
param location string

@description('The URL of the Azure Functions backend')
param functionsAppUrl string

@description('Tags for the static web app')
param tags object = {
  Application: 'pathfinder'
  Environment: 'test'
  ManagedBy: 'Bicep'
  DeploymentMethod: 'Static-Web-App-Manual'
}

@description('SKU for the static web app')
param skuName string = 'Free'

// Static Web App WITHOUT GitHub integration (manual setup)
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    // No repository configuration - will be set up manually
    buildProperties: {
      appLocation: '/pathfinder-app' // Path to your Next.js app
      apiLocation: '' // API is a separate Azure Function App
      outputLocation: 'out' // Output directory after next build
      appBuildCommand: 'npm run build'
      apiBuildCommand: ''
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Application settings for the Static Web App
resource appSettings 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    NEXT_PUBLIC_API_BASE_URL: functionsAppUrl
    NEXT_PUBLIC_ENVIRONMENT: 'production'
  }
}

// Outputs
output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
output manualSetupInstructions array = [
  'Go to Azure Portal > Static Web Apps > ${staticWebAppName}'
  'Click "Manage deployment token" to get the token'
  'Set up GitHub Actions manually with the deployment token'
  'Use repository: https://github.com/cdeyoung67/keelstone-pathfinder'
  'Configure build settings: App location: /pathfinder-app, Output: out'
]
