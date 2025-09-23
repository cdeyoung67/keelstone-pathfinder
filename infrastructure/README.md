# 🏗️ Keel Stone Pathfinder - Infrastructure as Code

This directory contains all Azure infrastructure definitions using Azure Bicep templates.

## 📋 **Prerequisites**

### 1. Azure Subscription & CLI
- Azure Subscription ID
- Azure CLI installed (`az --version`)
- Logged into Azure (`az login`)

### 2. Required Information
Create a `.env.local` file in the **root directory** with:

```bash
# Azure Subscription (REQUIRED)
AZURE_SUBSCRIPTION_ID="your-subscription-id-here"
AZURE_TENANT_ID="your-tenant-id-here"

# Deployment Settings (REQUIRED)
AZURE_LOCATION="eastus"  # or your preferred region
RESOURCE_GROUP_NAME="rg-pathfinder-prod"
ENVIRONMENT="prod"  # or "dev", "staging"

# Application Settings (REQUIRED)
APP_NAME="pathfinder"

# Optional Settings
DOMAIN_NAME="yourdomain.com"  # for custom domain
CONVERTKIT_API_KEY="your-convertkit-api-key"
CONVERTKIT_API_SECRET="your-convertkit-secret"
```

### 3. Get Your Azure Information
```powershell
# Login to Azure
az login

# Get your subscription and tenant IDs
az account show --query "{subscriptionId:id, tenantId:tenantId}" --output table
```

## 🚀 **Deployment Commands**

### First Time Deployment (New Infrastructure)
```powershell
# 1. Deploy all infrastructure
.\infrastructure\scripts\deploy-new.ps1

# 2. Deploy applications
.\infrastructure\scripts\deploy-applications.ps1
```

### Update Existing Infrastructure
```powershell
# Update infrastructure only
.\infrastructure\scripts\deploy-new.ps1 -Environment prod

# Update applications only  
.\infrastructure\scripts\deploy-applications.ps1 -Environment prod
```

## 📁 **File Structure**

```
infrastructure/
├── bicep/
│   ├── main.bicep              # Main deployment template
│   ├── modules/
│   │   ├── functions.bicep     # Azure Functions
│   │   ├── cosmosdb.bicep      # Cosmos DB
│   │   ├── openai.bicep        # Azure OpenAI
│   │   ├── staticwebapp.bicep  # Static Web Apps
│   │   ├── logicapps.bicep     # Logic Apps (email)
│   │   ├── monitoring.bicep    # Application Insights
│   │   └── storage.bicep       # Storage Account
│   └── parameters/
│       ├── prod.bicepparam     # Production parameters
│       ├── dev.bicepparam      # Development parameters
│       └── staging.bicepparam  # Staging parameters
├── scripts/
│   ├── deploy-new.ps1          # First-time deployment
│   └── deploy-applications.ps1 # Application deployments
└── README.md                   # This file
```

## 🎯 **Azure Resources Created**

### Core Infrastructure
- **Azure Functions**: Serverless backend APIs
- **Azure Cosmos DB**: NoSQL database (serverless)
- **Azure OpenAI**: GPT-4 for personalized plan generation
- **Azure Static Web Apps**: Frontend hosting
- **Azure Storage Account**: Functions storage
- **Application Insights**: Monitoring and analytics

### Optional Integrations
- **Azure Logic Apps**: ConvertKit email integration
- **Custom Domain**: For branded experience

## 🔒 **Security & Best Practices**

- **Managed Identity**: Secure authentication between services
- **HTTPS Only**: All endpoints enforce HTTPS
- **Minimal Permissions**: Least privilege access
- **Content Filtering**: Azure OpenAI content safety
- **Monitoring**: Full observability with Application Insights
- **Backup**: Automatic Cosmos DB backups

## 💰 **Cost Optimization**

### Development Environment
- **Cosmos DB**: Serverless (pay per request)
- **Azure Functions**: Consumption plan (pay per execution)
- **Static Web Apps**: Free tier
- **OpenAI**: Pay per token
- **Storage**: Minimal usage

### Production Environment
- Same as dev but with monitoring alerts
- Auto-scaling based on demand
- Resource tagging for cost tracking

## 🧪 **Testing Your Deployment**

After deployment, test your endpoints:

```powershell
# Health check
curl https://your-function-app.azurewebsites.net/api/health

# Test intake endpoint
curl -X POST https://your-function-app.azurewebsites.net/api/intake `
  -H "Content-Type: application/json" `
  -d '{
    "assessment": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "struggles": ["social-media-overwhelm"],
      "door": "secular",
      "timeBudget": "10-15",
      "daypart": "morning"
    }
  }'
```

## 🔧 **Troubleshooting**

### Common Issues
1. **Resource name conflicts**: The templates use unique suffixes to avoid conflicts
2. **Permission errors**: Ensure you have Contributor access to the subscription
3. **Region availability**: Some services may not be available in all regions
4. **Quota limits**: Check Azure quotas for OpenAI and other services

### Deployment Logs
```powershell
# View deployment status
az deployment group list --resource-group rg-pathfinder-prod --output table

# View deployment details
az deployment group show --resource-group rg-pathfinder-prod --name deployment-name
```

## 🚀 **CI/CD Integration**

The infrastructure supports GitHub Actions for automated deployments. See the deployment outputs for webhook URLs and secrets needed for CI/CD setup.

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review Azure deployment logs
3. Verify all environment variables are set correctly
4. Ensure you have the required Azure permissions
