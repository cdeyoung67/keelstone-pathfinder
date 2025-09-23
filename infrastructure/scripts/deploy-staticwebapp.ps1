# Deploy Static Web App - Two Options
# Option 1: Manual deployment (current)
# Option 2: GitHub CI/CD integration (recommended)

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("manual", "github")]
    [string]$DeploymentType,
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken = ""
)

# Load environment variables
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$subscriptionId = [Environment]::GetEnvironmentVariable("AZURE_SUBSCRIPTION_ID")
$resourceGroupName = [Environment]::GetEnvironmentVariable("RESOURCE_GROUP_NAME")
$appName = [Environment]::GetEnvironmentVariable("APP_NAME")
$functionsAppUrl = "https://pathfinder-dev-functions-w5fgmr.azurewebsites.net"

Write-Host "🚀 Deploying Static Web App" -ForegroundColor Cyan
Write-Host "Deployment Type: $DeploymentType" -ForegroundColor Yellow
Write-Host ""

if ($DeploymentType -eq "manual") {
    Write-Host "📋 MANUAL DEPLOYMENT (Current Method)" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host "✅ Pros:" -ForegroundColor Green
    Write-Host "  - Quick and simple" -ForegroundColor White
    Write-Host "  - No GitHub setup required" -ForegroundColor White
    Write-Host "  - Full control over deployment timing" -ForegroundColor White
    Write-Host ""
    Write-Host "❌ Cons:" -ForegroundColor Red
    Write-Host "  - Manual process for each update" -ForegroundColor White
    Write-Host "  - No CI/CD automation" -ForegroundColor White
    Write-Host "  - Not true Infrastructure as Code" -ForegroundColor White
    Write-Host ""
    
    # Build and deploy manually
    Write-Host "🔨 Building frontend..." -ForegroundColor Blue
    Push-Location "pathfinder-app"
    npm run build
    
    Write-Host "🚀 Deploying to Azure Static Web Apps..." -ForegroundColor Blue
    $deploymentToken = az staticwebapp secrets list --name "pathfinder-dev-web-w5fgmr" --resource-group $resourceGroupName --query "properties.apiKey" --output tsv
    swa deploy out --deployment-token $deploymentToken --app-name "pathfinder-dev-web-w5fgmr" --env production
    
    Pop-Location
    Write-Host "✅ Manual deployment complete!" -ForegroundColor Green
    
} elseif ($DeploymentType -eq "github") {
    Write-Host "🔄 GITHUB CI/CD DEPLOYMENT (Recommended)" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "✅ Pros:" -ForegroundColor Green
    Write-Host "  - True Infrastructure as Code" -ForegroundColor White
    Write-Host "  - Automatic deployments on git push" -ForegroundColor White
    Write-Host "  - GitHub Actions integration" -ForegroundColor White
    Write-Host "  - Version control for deployments" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️ Requirements:" -ForegroundColor Yellow
    Write-Host "  - GitHub repository" -ForegroundColor White
    Write-Host "  - GitHub Personal Access Token" -ForegroundColor White
    Write-Host ""
    
    if (-not $GitHubRepo -or -not $GitHubToken) {
        Write-Host "❌ Missing required parameters for GitHub deployment:" -ForegroundColor Red
        Write-Host "  -GitHubRepo: GitHub repository URL" -ForegroundColor White
        Write-Host "  -GitHubToken: GitHub Personal Access Token" -ForegroundColor White
        Write-Host ""
        Write-Host "Example usage:" -ForegroundColor Yellow
        Write-Host ".\infrastructure\scripts\deploy-staticwebapp.ps1 -DeploymentType github -GitHubRepo 'https://github.com/yourusername/keelstone-pathfinder' -GitHubToken 'ghp_xxxxxxxxxxxx'" -ForegroundColor White
        exit 1
    }
    
    Write-Host "🏗️ Deploying Static Web App with GitHub integration..." -ForegroundColor Blue
    az deployment group create `
        --resource-group $resourceGroupName `
        --template-file "infrastructure/bicep/staticwebapp-github.bicep" `
        --parameters `
            staticWebAppName="pathfinder-$Environment-web-github" `
            location="eastus2" `
            functionsAppUrl=$functionsAppUrl `
            repositoryUrl=$GitHubRepo `
            repositoryBranch="main" `
            githubToken=$GitHubToken `
        --name "staticwebapp-github-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    Write-Host "✅ GitHub CI/CD deployment complete!" -ForegroundColor Green
    Write-Host "🔗 GitHub Actions will now automatically deploy on git push" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "Method: $DeploymentType" -ForegroundColor Yellow
Write-Host "Static Web App URL: https://kind-rock-05ba4170f.2.azurestaticapps.net" -ForegroundColor Yellow
Write-Host "Functions API URL: $functionsAppUrl" -ForegroundColor Yellow
