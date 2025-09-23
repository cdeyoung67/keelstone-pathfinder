# deploy-static-web-app-manual.ps1 - Deploy Static Web App without GitHub integration
param (
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-keelstone-dev-core",
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test",
    
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

# Set defaults from environment
$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")

# Validate required parameters
if (-not $subscriptionId) {
    Write-Host "❌ Missing required environment variable: AZURE_SUBSCRIPTION_ID" -ForegroundColor Red
    exit 1
}

# Get Function App URL from existing deployment
Write-Host "🔍 Finding Function App URL in existing resource group..." -ForegroundColor Yellow
$functionApps = az functionapp list --resource-group "$ResourceGroupName" --query "[].{name:name, hostName:defaultHostName}" -o json | ConvertFrom-Json

if ($functionApps.Count -eq 0) {
    Write-Host "❌ No Function App found in resource group: $ResourceGroupName" -ForegroundColor Red
    Write-Host "Please deploy core infrastructure first using: .\infrastructure\scripts\deploy-core-only.ps1" -ForegroundColor Yellow
    exit 1
}

$functionAppUrl = "https://$($functionApps[0].hostName)"

Write-Host "🚀 Deploying Static Web App (Manual GitHub Setup)" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Subscription: $subscriptionId" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan
Write-Host "Function App URL: $functionAppUrl" -ForegroundColor Cyan
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Yellow
az account set --subscription "$subscriptionId"

# Deploy Static Web App
Write-Host "🏗️ Deploying Static Web App (no GitHub integration)..." -ForegroundColor Yellow

$uniqueSuffix = (Get-Random -Minimum 100000 -Maximum 999999)
$staticWebAppName = "$AppName-$Environment-web-$uniqueSuffix"

$deploymentResult = az deployment group create `
    --resource-group "$ResourceGroupName" `
    --template-file "infrastructure/bicep/staticwebapp-manual.bicep" `
    --parameters `
        staticWebAppName="$staticWebAppName" `
        location="$Location" `
        functionsAppUrl="$functionAppUrl" `
    --output json

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Static Web App deployment failed" -ForegroundColor Red
    exit 1
}

$deployment = $deploymentResult | ConvertFrom-Json
$outputs = $deployment.properties.outputs

Write-Host "✅ Static Web App deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Static Web App: $($outputs.staticWebAppName.value)" -ForegroundColor White
Write-Host "Static Web App URL: $($outputs.staticWebAppUrl.value)" -ForegroundColor White
Write-Host "Deployment Token: $($outputs.deploymentToken.value.Substring(0, 20))..." -ForegroundColor White
Write-Host ""
Write-Host "🔧 Manual GitHub Setup Required:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository: https://github.com/cdeyoung67/keelstone-pathfinder" -ForegroundColor White
Write-Host "2. Go to Settings > Secrets and variables > Actions" -ForegroundColor White
Write-Host "3. Add new secret: AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor White
Write-Host "4. Value: $($outputs.deploymentToken.value)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up GitHub Actions workflow manually" -ForegroundColor White
Write-Host "2. Or use Azure Portal to connect to GitHub" -ForegroundColor White
Write-Host "3. Test the deployed app: $($outputs.staticWebAppUrl.value)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "Static Web App: $($outputs.staticWebAppUrl.value)" -ForegroundColor Blue
Write-Host "Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$subscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Web/staticSites/$($outputs.staticWebAppName.value)" -ForegroundColor Blue
