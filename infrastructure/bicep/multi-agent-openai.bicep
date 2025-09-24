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

// Azure OpenAI Account for Multi-Agent System (Updated for GPT-5)
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: '${resourcePrefix}-openai-${uniqueSuffix}'
  location: location
  tags: union(tags, {
    Purpose: 'Multi-Agent-Pathfinder'
    AgentTypes: 'Christian,Secular,Wisdom,Courage,Justice,Temperance,Concierge'
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

// Agent 1: Concierge Agent (Journey Orchestration) - GPT-5-Chat
resource conciergeDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'concierge-agent'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5-chat'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10  // Start conservative for quota
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 2: Christian Path Agent (Theological & Spiritual) - GPT-5-Chat
resource christianDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'christian-agent'
  dependsOn: [conciergeDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5-chat'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10  // Conservative quota start
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 3: Secular Path Agent (Philosophical & Practical) - GPT-5-Chat
resource secularDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'secular-agent'
  dependsOn: [christianDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5-chat'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 10  // Conservative quota start
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 4: Wisdom SME Agent (Decision-Making & Logic) - GPT-5 (Full Logic)
resource wisdomDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'wisdom-agent'
  dependsOn: [secularDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 8  // Conservative for full GPT-5
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 5: Courage SME Agent (Action & Overcoming Fear) - GPT-5-Mini
resource courageDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'courage-agent'
  dependsOn: [wisdomDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5-mini'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 15  // Higher capacity for cost-effective model
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 6: Justice SME Agent (Relationships & Ethics) - GPT-5 (Full Logic)
resource justiceDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'justice-agent'
  dependsOn: [courageDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 8  // Conservative for full GPT-5
    raiPolicyName: 'Microsoft.Default'
  }
}

// Agent 7: Temperance SME Agent (Habits & Self-Control) - GPT-5-Nano
resource temperanceDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAIAccount
  name: 'temperance-agent'
  dependsOn: [justiceDeployment]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-5-nano'
      version: 'latest'
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
    currentCapacity: 20  // Higher capacity for ultra-fast model
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
    model: 'gpt-5-chat'
    capacity: 10
    purpose: 'Journey orchestration and multimodal user guidance'
  }
  christian: {
    name: christianDeployment.name
    model: 'gpt-5-chat'
    capacity: 10
    purpose: 'Christian path with advanced theological conversations'
  }
  secular: {
    name: secularDeployment.name
    model: 'gpt-5-chat'
    capacity: 10
    purpose: 'Secular path with sophisticated philosophical wisdom'
  }
  wisdom: {
    name: wisdomDeployment.name
    model: 'gpt-5'
    capacity: 8
    purpose: 'Complex decision-making and multi-step logical reasoning'
  }
  courage: {
    name: courageDeployment.name
    model: 'gpt-5-mini'
    capacity: 15
    purpose: 'Cost-effective action-oriented encouragement and fear overcoming'
  }
  justice: {
    name: justiceDeployment.name
    model: 'gpt-5'
    capacity: 8
    purpose: 'Complex ethical reasoning and relationship guidance'
  }
  temperance: {
    name: temperanceDeployment.name
    model: 'gpt-5-nano'
    capacity: 20
    purpose: 'Ultra-fast habit formation and self-control practices'
  }
}

output agentArchitecture object = {
  totalAgents: 7
  totalCapacity: 81
  modelDistribution: {
    'gpt-5': 2  // Wisdom, Justice (complex reasoning)
    'gpt-5-chat': 3  // Concierge, Christian, Secular (conversations)
    'gpt-5-mini': 1  // Courage (cost-effective)
    'gpt-5-nano': 1  // Temperance (ultra-fast)
  }
  quotaStrategy: 'Conservative initial deployment - scale based on usage patterns'
  scalability: 'Each agent can be scaled independently based on customer journey analytics'
}
