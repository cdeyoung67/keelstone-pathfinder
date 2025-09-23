@description('The name of the static web app for demo')
param staticWebAppName string

@description('The location for the static web app')
param location string

@description('GitHub repository URL')
param repositoryUrl string = 'https://github.com/cdeyoung67/keelstone-pathfinder'

@description('GitHub repository branch')
param repositoryBranch string = 'main'

@description('GitHub personal access token')
@secure()
param githubToken string

@description('Tags for the static web app')
param tags object = {
  Application: 'pathfinder'
  Environment: 'demo'
  ManagedBy: 'Bicep'
  Purpose: 'Demo'
  DataSource: 'Mock'
}

@description('SKU for the static web app')
param skuName string = 'Free'

// Static Web App for Demo (Mock Data)
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuName
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: repositoryBranch
    repositoryToken: githubToken
    buildProperties: {
      appLocation: '/pathfinder-app' // Path to your Next.js app
      apiLocation: '' // No API - uses mock data
      outputLocation: 'out' // Output directory after next build
      appBuildCommand: 'npm run build'
      apiBuildCommand: ''
      skipGithubActionWorkflowGeneration: false
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

// Application settings for Demo Environment (Mock Data)
resource appSettings 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    // Configure for mock data - no backend API
    NEXT_PUBLIC_API_BASE_URL: '' // Empty = use mock data
    NEXT_PUBLIC_ENVIRONMENT: 'demo'
    NEXT_PUBLIC_USE_MOCK_DATA: 'true'
    NEXT_PUBLIC_DEMO_MODE: 'true'
  }
}

// Outputs
output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output staticWebAppId string = staticWebApp.id
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
output demoInstructions array = [
  'This is the DEMO environment - uses mock data only'
  'Always working for prospective user demos'
  'No backend dependencies - fully self-contained'
  'Perfect for sales presentations and user testing'
]
