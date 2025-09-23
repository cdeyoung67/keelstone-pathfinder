# deploy-functions.ps1 - Deploy Azure Functions code to existing infrastructure
param (
    [Parameter(Mandatory=$false)]
    [string]$Environment = "test",
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "",
    
    [Parameter(Mandatory=$false)]
    [string]$FunctionAppName = ""
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
    $ResourceGroupName = "rg-keelstone-dev-core" # Use the core resource group name
}

# Validate required parameters
if (-not $subscriptionId) {
    Write-Host "❌ Missing required environment variable: AZURE_SUBSCRIPTION_ID" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Deploying Azure Functions Code" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "Subscription: $subscriptionId" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Cyan
Write-Host ""

# Set subscription
Write-Host "🔧 Setting Azure subscription..." -ForegroundColor Yellow
az account set --subscription "$subscriptionId"

# Get Function App name if not provided
if (-not $FunctionAppName) {
    Write-Host "🔍 Finding Function App in resource group..." -ForegroundColor Yellow
    $functionApps = az functionapp list --resource-group "$ResourceGroupName" --query "[].name" -o tsv
    if ($functionApps) {
        $FunctionAppName = $functionApps.Split("`n")[0].Trim()
        Write-Host "Found Function App: $FunctionAppName" -ForegroundColor Green
    } else {
        Write-Host "❌ No Function App found in resource group: $ResourceGroupName" -ForegroundColor Red
        exit 1
    }
}

# Build the Functions project
Write-Host "🏗️ Building Azure Functions project..." -ForegroundColor Yellow
Push-Location "pathfinder-api"
try {
    # Install dependencies
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install

    # Build TypeScript
    Write-Host "🔨 Building TypeScript..." -ForegroundColor Cyan
    npm run build

    # Create deployment package
    Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan
    $tempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
    
    # Copy built files and dependencies
    Copy-Item "dist/*" -Destination $tempDir -Recurse -Force
    Copy-Item "package.json" -Destination $tempDir -Force
    Copy-Item "host.json" -Destination $tempDir -Force -ErrorAction SilentlyContinue
    
    # Create ZIP file
    $zipPath = Join-Path $env:TEMP "functions-deployment.zip"
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
    
    Write-Host "✅ Deployment package created: $zipPath" -ForegroundColor Green

    # Deploy to Azure Functions
    Write-Host "🚀 Deploying to Azure Functions..." -ForegroundColor Yellow
    az functionapp deployment source config-zip `
        --resource-group "$ResourceGroupName" `
        --name "$FunctionAppName" `
        --src "$zipPath"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Azure Functions deployment complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Function App URL: https://$FunctionAppName.azurewebsites.net" -ForegroundColor Blue
        Write-Host ""
        Write-Host "🧪 Test endpoints:" -ForegroundColor Cyan
        Write-Host "Health Check: https://$FunctionAppName.azurewebsites.net/api/health" -ForegroundColor White
        Write-Host "Intake: https://$FunctionAppName.azurewebsites.net/api/intake" -ForegroundColor White
        Write-Host "Progress: https://$FunctionAppName.azurewebsites.net/api/progress" -ForegroundColor White
        Write-Host ""
        Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
        Write-Host "1. Test the APIs using the URLs above" -ForegroundColor White
        Write-Host "2. Update frontend environment variables with the Function App URL" -ForegroundColor White
        Write-Host "3. Deploy frontend (manually or via CI/CD)" -ForegroundColor White
    } else {
        Write-Host "❌ Azure Functions deployment failed" -ForegroundColor Red
        exit 1
    }

    # Cleanup
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

} finally {
    Pop-Location
}
