using '../main.bicep'

param appName = 'pathfinder'
param environment = 'dev'
param location = 'eastus'
param openAIDeploymentName = 'gpt-4'

// ConvertKit parameters (optional for dev)
param convertKitApiKey = ''
param convertKitApiSecret = ''
