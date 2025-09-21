#!/bin/bash

# Crace Cloud Run Deployment Script
# Usage: ./deploy.sh [PROJECT_ID] [API_KEY]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PROJECT_ID is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: PROJECT_ID is required${NC}"
    echo "Usage: ./deploy.sh [PROJECT_ID] [API_KEY]"
    exit 1
fi

PROJECT_ID=$1
API_KEY=${2:-""}
REGION="us-central1"
SERVICE_NAME="crace"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo -e "${YELLOW}🚀 Starting deployment of Crace to Cloud Run${NC}"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service Name: $SERVICE_NAME"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting project to $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
echo -e "${YELLOW}🐳 Building Docker image${NC}"
docker build -t $IMAGE_NAME .

# Push the image to Google Container Registry
echo -e "${YELLOW}📤 Pushing image to Google Container Registry${NC}"
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo -e "${YELLOW}🚀 Deploying to Cloud Run${NC}"

if [ -n "$API_KEY" ]; then
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --port 3000 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --concurrency 100 \
        --timeout 300 \
        --set-env-vars NODE_ENV=production,COINMARKETCAP_API_KEY=$API_KEY
else
    echo -e "${YELLOW}⚠️  No API key provided. You'll need to set it manually in Cloud Run console${NC}"
    gcloud run deploy $SERVICE_NAME \
        --image $IMAGE_NAME \
        --region $REGION \
        --platform managed \
        --allow-unauthenticated \
        --port 3000 \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --concurrency 100 \
        --timeout 300 \
        --set-env-vars NODE_ENV=production
fi

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service URL: $SERVICE_URL${NC}"
echo -e "${YELLOW}📝 Don't forget to set your COINMARKETCAP_API_KEY in the Cloud Run console if you didn't provide it${NC}"
