# Deploy Applications - PowerShell Script
# This script deploys the applications to existing infrastructure

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "prod"
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

$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$resourceGroupName = [Environment]::GetEnvironmentVariable("RESOURCE_GROUP_NAME")
$appName = [Environment]::GetEnvironmentVariable("APP_NAME")

Write-Host "🚀 Deploying Keel Stone Pathfinder Applications" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Set subscription
az account set --subscription $subscriptionId

# Get resource names from deployment
Write-Host "🔍 Finding deployed resources..." -ForegroundColor Blue
$functionAppName = az functionapp list --resource-group $resourceGroupName --query "[?contains(name, '$appName-$Environment')].name" --output tsv
$staticWebAppName = az staticwebapp list --resource-group $resourceGroupName --query "[?contains(name, '$appName-$Environment')].name" --output tsv

if (-not $functionAppName) {
    Write-Host "❌ Function App not found. Please run deploy-new.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "Found Function App: $functionAppName" -ForegroundColor Yellow
Write-Host "Found Static Web App: $staticWebAppName" -ForegroundColor Yellow
Write-Host ""

# Build and deploy Azure Functions
Write-Host "🔨 Building Azure Functions..." -ForegroundColor Blue
Push-Location "pathfinder-api"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Build TypeScript
Write-Host "🏗️ Building TypeScript..." -ForegroundColor Blue
npm run build

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Blue
$deploymentPath = "deployment"
if (Test-Path $deploymentPath) {
    Remove-Item $deploymentPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deploymentPath

# Copy necessary files for deployment
Copy-Item "dist/*" -Destination $deploymentPath -Recurse
Copy-Item "package.json" -Destination $deploymentPath
Copy-Item "host.json" -Destination $deploymentPath
Copy-Item "health/" -Destination "$deploymentPath/health/" -Recurse
Copy-Item "intake-test/" -Destination "$deploymentPath/intake-test/" -Recurse

# Deploy to Azure Functions
Write-Host "🚀 Deploying to Azure Functions..." -ForegroundColor Blue
az functionapp deployment source config-zip --resource-group $resourceGroupName --name $functionAppName --src "$deploymentPath.zip"

Pop-Location

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Function App deployment failed" -ForegroundColor Red
    exit 1
}

# Build and prepare frontend for Static Web Apps
Write-Host "🔨 Building frontend application..." -ForegroundColor Blue
Push-Location "pathfinder-app"

# Install dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install

# Build for production
Write-Host "🏗️ Building for production..." -ForegroundColor Blue
$env:NEXT_PUBLIC_API_BASE_URL = "https://$functionAppName.azurewebsites.net"
$env:NEXT_PUBLIC_ENVIRONMENT = $Environment
npm run build

Pop-Location

Write-Host "✅ Application deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Function App: https://$functionAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "Static Web App: https://$staticWebAppName.azurestaticapps.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test your deployment:" -ForegroundColor Cyan
Write-Host "curl https://$functionAppName.azurewebsites.net/api/health" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure GitHub Actions for CI/CD" -ForegroundColor White
Write-Host "2. Set up custom domain (if needed)" -ForegroundColor White
Write-Host "3. Configure ConvertKit email sequences" -ForegroundColor White
Write-Host "4. Set up monitoring and alerts" -ForegroundColor White
