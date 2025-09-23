# deploy-static-web-app.ps1 - Deploy Static Web App to existing resource group
param (
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-keelstone-dev-core",
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "pathfinder",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",
    
    [Parameter(Mandatory=$false)]
    [string]$RepositoryUrl = "https://github.com/cdeyoung67/keelstone-pathfinder",
    
    [Parameter(Mandatory=$false)]
    [string]$RepositoryBranch = "main"
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
$githubToken = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN")

# Validate required parameters
if (-not $subscriptionId) {
    Write-Host "❌ Missing required environment variable: AZURE_SUBSCRIPTION_ID" -ForegroundColor Red
    exit 1
}

if (-not $githubToken) {
    Write-Host "❌ Missing required environment variable: GITHUB_TOKEN" -ForegroundColor Red
    Write-Host "Please add GITHUB_TOKEN to your .env.local file" -ForegroundColor Yellow
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
$functionAppName = $functionApps[0].name

Write-Host "🚀 Deploying Static Web App with GitHub CI/CD" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host "Subscription: $subscriptionId" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan
Write-Host "Repository: $RepositoryUrl" -ForegroundColor Cyan
Write-Host "Branch: $RepositoryBranch" -ForegroundColor Cyan
Write-Host "Function App URL: $functionAppUrl" -ForegroundColor Cyan
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Yellow
az account set --subscription "$subscriptionId"

# Deploy Static Web App
Write-Host "🏗️ Deploying Static Web App with GitHub integration..." -ForegroundColor Yellow

$uniqueSuffix = (Get-Random -Minimum 100000 -Maximum 999999)
$staticWebAppName = "$AppName-$Environment-web-$uniqueSuffix"

$deploymentResult = az deployment group create `
    --resource-group "$ResourceGroupName" `
    --template-file "infrastructure/bicep/staticwebapp-only.bicep" `
    --parameters `
        staticWebAppName="$staticWebAppName" `
        location="$Location" `
        functionsAppUrl="$functionAppUrl" `
        repositoryUrl="$RepositoryUrl" `
        repositoryBranch="$RepositoryBranch" `
        githubToken="$githubToken" `
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
Write-Host "GitHub Repository: $RepositoryUrl" -ForegroundColor White
Write-Host "Connected Function App: $functionAppUrl" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check GitHub Actions: $RepositoryUrl/actions" -ForegroundColor White
Write-Host "2. Wait for build to complete (5-10 minutes)" -ForegroundColor White
Write-Host "3. Test the deployed app: $($outputs.staticWebAppUrl.value)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "Static Web App: $($outputs.staticWebAppUrl.value)" -ForegroundColor Blue
Write-Host "GitHub Actions: $RepositoryUrl/actions" -ForegroundColor Blue
Write-Host "Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$subscriptionId/resourceGroups/$ResourceGroupName" -ForegroundColor Blue
