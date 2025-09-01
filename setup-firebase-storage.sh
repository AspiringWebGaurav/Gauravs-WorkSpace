#!/bin/bash

echo "Firebase Storage Setup Script"
echo "============================"
echo

echo "Step 1: Deploying Firebase Storage Rules..."
if firebase deploy --only storage; then
    echo
    echo "Step 2: Storage rules deployed successfully!"
    echo
else
    echo
    echo "ERROR: Storage rules deployment failed!"
    echo "Please ensure Firebase Storage is enabled in the console first."
    echo "Go to: https://console.firebase.google.com/project/gauravs-workspace-933d7/storage"
    echo
    exit 1
fi

echo "Step 3: Checking for Google Cloud SDK..."
if command -v gsutil &> /dev/null; then
    echo "Google Cloud SDK found. Configuring CORS..."
    if gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com; then
        echo "CORS configuration successful!"
    else
        echo "CORS configuration failed. Please run manually:"
        echo "gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com"
    fi
else
    echo "Google Cloud SDK not found. Please install it to configure CORS."
    echo "Download from: https://cloud.google.com/sdk/docs/install"
    echo
    echo "Manual CORS setup required:"
    echo "1. Install Google Cloud SDK"
    echo "2. Run: gcloud auth login"
    echo "3. Run: gcloud config set project gauravs-workspace-933d7"
    echo "4. Run: gsutil cors set cors.json gs://gauravs-workspace-933d7.appspot.com"
fi

echo
echo "Setup complete! You can now test the resume upload functionality."
echo