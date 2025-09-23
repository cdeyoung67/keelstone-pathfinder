@description('The name of the static web app')
param staticWebAppName string

@description('The location for the static web app')
param location string

@description('The URL of the Azure Functions backend')
param functionsAppUrl string

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
  Environment: 'test'
  ManagedBy: 'Bicep'
  DeploymentMethod: 'Static-Web-App-Only'
}

@description('SKU for the static web app')
param skuName string = 'Free'

// Static Web App with GitHub CI/CD Integration
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
      apiLocation: '' // API is a separate Azure Function App
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

// Application settings for the Static Web App (e.g., backend API URL)
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
output repositoryToken string = staticWebApp.listSecrets().properties.apiKey // This is the deployment token for GitHub Actions
output githubActionsUrl string = '${repositoryUrl}/actions'
