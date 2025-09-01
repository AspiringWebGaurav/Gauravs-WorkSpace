@echo off
echo Firebase Storage Setup Script
echo ============================
echo.

echo Step 1: Deploying Firebase Storage Rules...
firebase deploy --only storage
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Storage rules deployment failed!
    echo Please ensure Firebase Storage is enabled in the console first.
    echo Go to: https://console.firebase.google.com/project/gauravs-workspace-933d7/storage
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Storage rules deployed successfully!
echo.

echo Step 3: Checking for Google Cloud SDK...
gsutil version >nul 2>&1
if %errorlevel% neq 0 (
    echo Google Cloud SDK not found. Please install it to configure CORS.
    echo Download from: https://cloud.google.com/sdk/docs/install
    echo.
    echo Manual CORS setup required:
    echo 1. Install Google Cloud SDK
    echo 2. Run: gcloud auth login
    echo 3. Run: gcloud config set project gauravs-workspace-933d7
    echo 4. Run: gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com
) else (
    echo Google Cloud SDK found. Configuring CORS...
    gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com
    if %errorlevel% neq 0 (
        echo CORS configuration failed. Please run manually:
        echo gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com
    ) else (
        echo CORS configuration successful!
    )
)

echo.
echo Setup complete! You can now test the resume upload functionality.
echo.
pause