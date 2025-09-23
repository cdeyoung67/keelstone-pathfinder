# deploy-demo-environment.ps1 - Deploy Demo Environment with Mock Data
param (
    [Parameter(Mandatory=$false)]
    [string]$Environment = "demo",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "pathfinder",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2"
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

$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$githubToken = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN")

if (-not $subscriptionId) {
    Write-Host "❌ Missing required environment variable: AZURE_SUBSCRIPTION_ID" -ForegroundColor Red
    exit 1
}

$resourceGroupName = "rg-$AppName-$Environment"

Write-Host "🎭 Deploying Demo Environment (Mock Data)" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Subscription: $subscriptionId" -ForegroundColor Cyan
Write-Host "Resource Group: $resourceGroupName" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan
Write-Host "Purpose: Always-working demo with mock data" -ForegroundColor Cyan
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Yellow
az account set --subscription "$subscriptionId"

# Create resource group
Write-Host "📦 Creating demo resource group..." -ForegroundColor Yellow
az group create `
    --name "$resourceGroupName" `
    --location "$Location" `
    --tags Environment="$Environment" Application="$AppName" Purpose="Demo" DataSource="Mock"

# Deploy minimal infrastructure for demo (just Static Web App)
Write-Host "🏗️ Deploying demo infrastructure..." -ForegroundColor Yellow

$uniqueSuffix = (Get-Random -Minimum 100000 -Maximum 999999)
$staticWebAppName = "$AppName-$Environment-$uniqueSuffix"

$deploymentResult = az deployment group create `
    --resource-group "$resourceGroupName" `
    --template-file "infrastructure/bicep/staticwebapp-demo.bicep" `
    --parameters `
        staticWebAppName="$staticWebAppName" `
        location="$Location" `
        repositoryUrl="https://github.com/cdeyoung67/keelstone-pathfinder" `
        repositoryBranch="main" `
        githubToken="$githubToken" `
    --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Demo environment deployment failed" -ForegroundColor Red
    exit 1
}

$deployment = $deploymentResult | ConvertFrom-Json
$outputs = $deployment.properties.outputs

Write-Host "✅ Demo environment deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Demo Environment Summary:" -ForegroundColor Cyan
Write-Host "Static Web App: $($outputs.staticWebAppName.value)" -ForegroundColor White
Write-Host "Demo URL: $($outputs.staticWebAppUrl.value)" -ForegroundColor Blue
Write-Host "Data Source: Mock/Local (always working)" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Add GitHub secret for demo deployment" -ForegroundColor White
Write-Host "2. Configure frontend to use mock data" -ForegroundColor White
Write-Host "3. Test demo environment" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "Demo App: $($outputs.staticWebAppUrl.value)" -ForegroundColor Blue
Write-Host "Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName" -ForegroundColor Blue
