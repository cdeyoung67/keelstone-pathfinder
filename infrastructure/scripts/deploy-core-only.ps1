# deploy-core-only.ps1 - Deploy core infrastructure without GitHub CI/CD integration
param (
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ConvertKitApiKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ConvertKitApiSecret = ""
)

# Load environment variables if available
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $value = $matches[2].Split('#')[0].Trim().Trim('"') # Remove comments and quotes
            [Environment]::SetEnvironmentVariable($matches[1], $value)
        }
    }
}

# Set defaults from environment or parameters
$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$appName = [Environment]::GetEnvironmentVariable("APP_NAME")
if (-not $appName) { $appName = "pathfinder" }

# Generate resource group name if not provided
if (-not $ResourceGroupName) {
    $ResourceGroupName = "rg-$appName-$Environment-core"
}

# Override parameters with environment variables if available
if ([Environment]::GetEnvironmentVariable("RESOURCE_GROUP_NAME")) {
    $ResourceGroupName = [Environment]::GetEnvironmentVariable("RESOURCE_GROUP_NAME")
}
if ([Environment]::GetEnvironmentVariable("AZURE_LOCATION")) {
    $Location = [Environment]::GetEnvironmentVariable("AZURE_LOCATION")
}
if ([Environment]::GetEnvironmentVariable("CONVERTKIT_API_KEY")) {
    $ConvertKitApiKey = [Environment]::GetEnvironmentVariable("CONVERTKIT_API_KEY")
}
if ([Environment]::GetEnvironmentVariable("CONVERTKIT_API_SECRET")) {
    $ConvertKitApiSecret = [Environment]::GetEnvironmentVariable("CONVERTKIT_API_SECRET")
}

# Validate required parameters
if (-not $subscriptionId) {
    Write-Host "❌ Missing required environment variable: AZURE_SUBSCRIPTION_ID" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Deploying Core Infrastructure (No GitHub CI/CD)" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Subscription: $subscriptionId" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Cyan
Write-Host "App Name: $appName" -ForegroundColor Cyan
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Yellow
az account set --subscription "$subscriptionId"

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Yellow
az group create `
    --name "$ResourceGroupName" `
    --location "$Location" `
    --tags Environment="$Environment" Application="$appName" DeploymentMethod="Core-Infrastructure"

# Deploy core infrastructure (without Static Web App)
Write-Host "🏗️ Deploying core infrastructure..." -ForegroundColor Yellow
$deploymentResult = az deployment group create `
    --resource-group "$ResourceGroupName" `
    --template-file "infrastructure/bicep/main-core-only.bicep" `
    --parameters `
        appName="$appName" `
        environment="$Environment" `
        location="$Location" `
        convertKitApiKey="$ConvertKitApiKey" `
        convertKitApiSecret="$ConvertKitApiSecret" `
    --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Core infrastructure deployment failed" -ForegroundColor Red
    exit 1
}

$deployment = $deploymentResult | ConvertFrom-Json
$outputs = $deployment.properties.outputs

Write-Host "✅ Core infrastructure deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "Function App: $($outputs.functionAppName.value)" -ForegroundColor White
Write-Host "Function App URL: $($outputs.functionAppUrl.value)" -ForegroundColor White
Write-Host "Cosmos DB Endpoint: $($outputs.cosmosDbEndpoint.value)" -ForegroundColor White
Write-Host "Logic App: $($outputs.logicAppName.value)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy Azure Functions code: .\infrastructure\scripts\deploy-functions.ps1" -ForegroundColor White
Write-Host "2. Deploy frontend manually or set up GitHub CI/CD" -ForegroundColor White
Write-Host "3. Test the deployed APIs" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$subscriptionId/resourceGroups/$ResourceGroupName" -ForegroundColor Blue
Write-Host "Function App: $($outputs.functionAppUrl.value)" -ForegroundColor Blue
