@description('The name of the static web app')
param staticWebAppName string

@description('The location for the static web app')
param location string

@description('The URL of the Azure Functions backend')
param functionsAppUrl string

@description('GitHub repository URL (e.g., https://github.com/username/repo)')
param repositoryUrl string

@description('GitHub repository branch')
param repositoryBranch string = 'main'

@description('GitHub personal access token for repository access')
@secure()
param githubToken string

@description('Tags for the static web app')
param tags object = {}

// Static Web App with GitHub Integration
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: repositoryUrl
    branch: repositoryBranch
    repositoryToken: githubToken
    buildProperties: {
      appLocation: '/pathfinder-app'
      apiLocation: ''
      outputLocation: 'out'
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

// Static Web App Configuration
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-01-01' = {
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
output githubActionUrl string = '${repositoryUrl}/actions'
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey
