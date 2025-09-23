using '../main.bicep'

param appName = 'pathfinder'
param environment = 'staging'
param location = 'eastus'
param openAIDeploymentName = 'gpt-4'

// ConvertKit parameters (will be provided at deployment time)
param convertKitApiKey = ''
param convertKitApiSecret = ''
