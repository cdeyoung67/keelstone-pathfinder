@description('The name of the application')
param appName string

@description('The environment (dev, staging, prod)')
param environment string = 'dev24'

@description('The location for all resources')
param location string = resourceGroup().location

@description('Tags for the resources')
param tags object = {}

// Variables
var resourcePrefix = '${appName}-${environment}'
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)

// Azure OpenAI Account for Multi-Agent System (Current Available Models)
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${resourcePrefix}-openai-${uniqueSuffix}'
  location: location
  tags: union(tags, {
    Purpose: 'Multi-Agent-Pathfinder'
    AgentTypes: 'Christian,Secular,Wisdom,Courage,Justice,Temperance,Concierge'
    ModelStrategy: 'GPT-4-for-complex-GPT-35-for-fast'
  })
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: '${resourcePrefix}-openai-${uniqueSuffix}'
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
  }
}

// Agent 1: Concierge Agent (Journey Orchestration) - GPT-4
resource conciergeDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'concierge-agent'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10  // Conservative start
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 2: Christian Path Agent (Theological & Spiritual) - GPT-4
resource christianDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'christian-agent'
  dependsOn: [conciergeDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 3: Secular Path Agent (Philosophical & Practical) - GPT-4
resource secularDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'secular-agent'
  dependsOn: [christianDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 4: Wisdom SME Agent (Decision-Making & Logic) - GPT-4
resource wisdomDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'wisdom-agent'
  dependsOn: [secularDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 8
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 5: Courage SME Agent (Action & Overcoming Fear) - GPT-3.5-Turbo
resource courageDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'courage-agent'
  dependsOn: [wisdomDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '1106'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 15  // Higher capacity for cost-effective model
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 6: Justice SME Agent (Relationships & Ethics) - GPT-4
resource justiceDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'justice-agent'
  dependsOn: [courageDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4'
      version: '0125-Preview'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 8
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 7: Temperance SME Agent (Habits & Self-Control) - GPT-3.5-Turbo
resource temperanceDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: 'temperance-agent'
  dependsOn: [justiceDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '1106'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 20  // High capacity for frequent habit interactions
    raiPolicyName: 'Microsoft.Default'
  }
}

// Outputs
output openAIAccountName string = openAIAccount.name
output openAIEndpoint string = openAIAccount.properties.endpoint
output openAIKey string = openAIAccount.listKeys().key1

output deployments object = {
  concierge: {
    name: conciergeDeployment.name
    model: 'gpt-4'
    capacity: 10
    purpose: 'Journey orchestration and user guidance'
    upgrade_path: 'gpt-5-chat'
  }
  christian: {
    name: christianDeployment.name
    model: 'gpt-4'
    capacity: 10
    purpose: 'Christian path with theological depth'
    upgrade_path: 'gpt-5-chat'
  }
  secular: {
    name: secularDeployment.name
    model: 'gpt-4'
    capacity: 10
    purpose: 'Secular path with philosophical wisdom'
    upgrade_path: 'gpt-5-chat'
  }
  wisdom: {
    name: wisdomDeployment.name
    model: 'gpt-4'
    capacity: 8
    purpose: 'Complex decision-making and logical reasoning'
    upgrade_path: 'gpt-5'
  }
  courage: {
    name: courageDeployment.name
    model: 'gpt-35-turbo'
    capacity: 15
    purpose: 'Cost-effective action-oriented encouragement'
    upgrade_path: 'gpt-5-mini'
  }
  justice: {
    name: justiceDeployment.name
    model: 'gpt-4'
    capacity: 8
    purpose: 'Complex ethical reasoning and relationship guidance'
    upgrade_path: 'gpt-5'
  }
  temperance: {
    name: temperanceDeployment.name
    model: 'gpt-35-turbo'
    capacity: 20
    purpose: 'Fast habit formation and self-control practices'
    upgrade_path: 'gpt-5-nano'
  }
}

output agentArchitecture object = {
  totalAgents: 7
  totalCapacity: 81
  currentModels: {
    'gpt-4': 5  // Concierge, Christian, Secular, Wisdom, Justice
    'gpt-35-turbo': 2  // Courage, Temperance (cost/speed optimized)
  }
  upgradePath: 'Ready for GPT-5 migration when available'
  quotaStrategy: 'Conservative initial deployment - 81 TPM total'
}
