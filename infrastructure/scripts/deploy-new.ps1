# Deploy New Infrastructure - PowerShell Script
# This script creates all infrastructure from scratch

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "prod",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus"
)

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    Write-Host "✅ Loaded environment variables from .env.local" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found. Please create it with required variables." -ForegroundColor Red
    exit 1
}

# Check required environment variables
$requiredVars = @(
    "AZURE_SUBSCRIPTION_ID",
    "RESOURCE_GROUP_NAME", 
    "APP_NAME"
)

foreach ($var in $requiredVars) {
    if (-not [Environment]::GetEnvironmentVariable($var)) {
        Write-Host "❌ Missing required environment variable: $var" -ForegroundColor Red
        exit 1
    }
}

$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$resourceGroupName = [Environment]::GetEnvironmentVariable("RESOURCE_GROUP_NAME")
$appName = [Environment]::GetEnvironmentVariable("APP_NAME")
$convertKitApiKey = [Environment]::GetEnvironmentVariable("CONVERTKIT_API_KEY")
$convertKitApiSecret = [Environment]::GetEnvironmentVariable("CONVERTKIT_API_SECRET")

Write-Host "🚀 Deploying Keel Stone Pathfinder Infrastructure" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Subscription: $subscriptionId" -ForegroundColor Yellow
Write-Host "Resource Group: $resourceGroupName" -ForegroundColor Yellow
Write-Host "Location: $Location" -ForegroundColor Yellow
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "App Name: $appName" -ForegroundColor Yellow
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Blue
az account set --subscription $subscriptionId

# Create resource group if it doesn't exist
Write-Host "📦 Creating resource group..." -ForegroundColor Blue
az group create `
    --name $resourceGroupName `
    --location $Location `
    --tags Environment=$Environment Application=$appName

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}

# Deploy infrastructure
Write-Host "🏗️ Deploying infrastructure..." -ForegroundColor Blue
$deploymentName = "pathfinder-infra-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

$deployParams = @(
    "--resource-group", $resourceGroupName,
    "--template-file", "infrastructure/bicep/main.bicep",
    "--parameters", "infrastructure/bicep/parameters/$Environment.bicepparam",
    "--parameters", "appName=$appName",
    "--parameters", "environment=$Environment", 
    "--parameters", "location=$Location",
    "--name", $deploymentName
)

# Add ConvertKit parameters if provided
if ($convertKitApiKey) {
    $deployParams += "--parameters"
    $deployParams += "convertKitApiKey=$convertKitApiKey"
}

if ($convertKitApiSecret) {
    $deployParams += "--parameters" 
    $deployParams += "convertKitApiSecret=$convertKitApiSecret"
}

az deployment group create @deployParams

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
    exit 1
}

# Get deployment outputs
Write-Host "📋 Getting deployment outputs..." -ForegroundColor Blue
$outputs = az deployment group show --resource-group $resourceGroupName --name $deploymentName --query properties.outputs --output json | ConvertFrom-Json

Write-Host "✅ Infrastructure deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Resource Group: $($outputs.resourceGroupName.value)" -ForegroundColor Yellow
Write-Host "Function App: $($outputs.functionAppName.value)" -ForegroundColor Yellow
Write-Host "Function App URL: $($outputs.functionAppUrl.value)" -ForegroundColor Yellow
Write-Host "Static Web App: $($outputs.staticWebAppName.value)" -ForegroundColor Yellow
Write-Host "Static Web App URL: $($outputs.staticWebAppUrl.value)" -ForegroundColor Yellow
Write-Host "Cosmos DB Endpoint: $($outputs.cosmosDbEndpoint.value)" -ForegroundColor Yellow
Write-Host "OpenAI Endpoint: $($outputs.openAIEndpoint.value)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\infrastructure\scripts\deploy-applications.ps1" -ForegroundColor White
Write-Host "2. Configure your GitHub repository for Static Web Apps" -ForegroundColor White
Write-Host "3. Set up CI/CD pipelines" -ForegroundColor White
Write-Host "4. Configure custom domain (if needed)" -ForegroundColor White
