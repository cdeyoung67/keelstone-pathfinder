# Deploy Complete Infrastructure as Code with GitHub CI/CD
# This script creates everything from scratch with full automation

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus2",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ConvertKitApiKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$ConvertKitApiSecret = ""
)

# Load environment variables if available
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $value = $matches[2].Trim('"') # Remove quotes
            [Environment]::SetEnvironmentVariable($matches[1], $value)
        }
    }
}

# Set defaults from environment or parameters
$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$appName = [Environment]::GetEnvironmentVariable("APP_NAME")
if (-not $appName) { $appName = "pathfinder" }

# Get GitHub token from environment if not provided as parameter
if (-not $GitHubToken) {
    $GitHubToken = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN")
    # Remove quotes if present
    if ($GitHubToken) {
        $GitHubToken = $GitHubToken.Trim('"')
    }
}

# Generate resource group name if not provided
if (-not $ResourceGroupName) {
    $ResourceGroupName = "rg-$appName-$Environment-iac"
}

Write-Host "🚀 Deploying Complete Infrastructure as Code" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Yellow
Write-Host "Location: $Location" -ForegroundColor Yellow
Write-Host "Repository: https://github.com/cdeyoung67/keelstone-pathfinder" -ForegroundColor Yellow
Write-Host "Deployment Method: GitHub Actions CI/CD" -ForegroundColor Yellow
Write-Host ""

if (-not $subscriptionId) {
    Write-Host "❌ Missing AZURE_SUBSCRIPTION_ID. Please set in .env.local or environment." -ForegroundColor Red
    exit 1
}

if (-not $GitHubToken) {
    Write-Host "❌ Missing GitHub Token. Please provide -GitHubToken parameter." -ForegroundColor Red
    Write-Host "Create token at: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "Required scopes: repo (Full control of private repositories)" -ForegroundColor White
    exit 1
}

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Blue
az account set --subscription $subscriptionId

# Create resource group
Write-Host "📦 Creating resource group..." -ForegroundColor Blue
az group create `
    --name $ResourceGroupName `
    --location $Location `
    --tags Environment=$Environment Application=$appName DeploymentMethod="Infrastructure-as-Code"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}

# Deploy complete infrastructure
Write-Host "🏗️ Deploying complete infrastructure with GitHub CI/CD..." -ForegroundColor Blue
$deploymentName = "$appName-full-iac-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

$deployParams = @(
    "--resource-group", $ResourceGroupName,
    "--template-file", "infrastructure/bicep/main-full-iac.bicep",
    "--parameters", "appName=$appName",
    "--parameters", "environment=$Environment",
    "--parameters", "location=$Location",
    "--parameters", "githubToken=$GitHubToken",
    "--name", $deploymentName
)

# Add optional parameters
if ($ConvertKitApiKey) {
    $deployParams += "--parameters"
    $deployParams += "convertKitApiKey=$ConvertKitApiKey"
}

if ($ConvertKitApiSecret) {
    $deployParams += "--parameters"
    $deployParams += "convertKitApiSecret=$ConvertKitApiSecret"
}

az deployment group create @deployParams

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
    exit 1
}

# Get deployment outputs
Write-Host "📋 Getting deployment outputs..." -ForegroundColor Blue
$outputs = az deployment group show --resource-group $ResourceGroupName --name $deploymentName --query properties.outputs --output json | ConvertFrom-Json

Write-Host "✅ Complete Infrastructure as Code deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Resource Group: $($outputs.resourceGroupName.value)" -ForegroundColor Yellow
Write-Host "Function App: $($outputs.functionAppName.value)" -ForegroundColor Yellow
Write-Host "Function App URL: $($outputs.functionAppUrl.value)" -ForegroundColor Yellow
Write-Host "Static Web App: $($outputs.staticWebAppName.value)" -ForegroundColor Yellow
Write-Host "Static Web App URL: $($outputs.staticWebAppUrl.value)" -ForegroundColor Yellow
Write-Host "Cosmos DB Endpoint: $($outputs.cosmosDbEndpoint.value)" -ForegroundColor Yellow
Write-Host "GitHub Actions: $($outputs.githubActionsUrl.value)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. ✅ Infrastructure deployed with GitHub CI/CD" -ForegroundColor Green
Write-Host "2. ✅ GitHub Actions workflow automatically created" -ForegroundColor Green
Write-Host "3. ✅ Any git push to main will trigger deployment" -ForegroundColor Green
Write-Host "4. 🔗 Visit GitHub Actions: $($outputs.githubActionsUrl.value)" -ForegroundColor White
Write-Host "5. 🌐 Test the application: $($outputs.staticWebAppUrl.value)" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test the deployment:" -ForegroundColor Cyan
Write-Host "curl $($outputs.functionAppUrl.value)/api/health" -ForegroundColor White
