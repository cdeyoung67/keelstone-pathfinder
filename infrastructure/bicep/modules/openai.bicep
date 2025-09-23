@description('The name of the Azure OpenAI account')
param accountName string

@description('The location for the Azure OpenAI account')
param location string

@description('The deployment name for the OpenAI model')
param deploymentName string = 'gpt-4'

@description('The model name and version')
param modelName string = 'gpt-4'
param modelVersion string = '1106-Preview'

@description('Tags for the Azure OpenAI account')
param tags object = {}

@description('SKU for the Azure OpenAI account')
param skuName string = 'S0'

// Azure OpenAI Account
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: accountName
  location: location
  tags: tags
  sku: {
    name: skuName
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: accountName
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Model Deployment
resource modelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: deploymentName
  properties: {
    model: {
      format: 'OpenAI'
      name: modelName
      version: modelVersion
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 20
    raiPolicyName: 'Microsoft.Default'
  }
}

// Content filtering is handled by default Azure OpenAI policies

// Outputs
output accountName string = openAIAccount.name
output endpoint string = openAIAccount.properties.endpoint
output key string = openAIAccount.listKeys().key1
output deploymentName string = modelDeployment.name
output modelName string = modelName
output modelVersion string = modelVersion
