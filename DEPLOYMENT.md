# Crace - Cloud Run Deployment Guide

This guide will help you deploy the Crace crypto race app to Google Cloud Run.

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud CLI installed and configured
3. Docker installed locally (for testing)
4. CoinMarketCap API key

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# CoinMarketCap API Configuration
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here

# Next.js Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Cloud Run Configuration
PORT=3000
HOSTNAME=0.0.0.0
```

## Local Testing

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API key
   ```

3. Build and test locally:
   ```bash
   pnpm run build
   pnpm run start
   ```

4. Test Docker build:
   ```bash
   docker build -t crace .
   docker run -p 3000:3000 crace
   ```

## Cloud Run Deployment

### Option 1: Using Cloud Build (Recommended)

1. Enable required APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

2. Set up Cloud Build trigger:
   ```bash
   gcloud builds triggers create github \
     --repo-name=your-repo-name \
     --repo-owner=your-github-username \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

3. Update the `cloudbuild.yaml` file with your CoinMarketCap API key:
   ```yaml
   substitutions:
     _COINMARKETCAP_API_KEY: 'your-actual-api-key-here'
   ```

4. Push to your main branch to trigger deployment.

### Option 2: Manual Deployment

1. Build and push the image:
   ```bash
   # Build the image
   docker build -t gcr.io/$PROJECT_ID/crace .
   
   # Push to Google Container Registry
   docker push gcr.io/$PROJECT_ID/crace
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy crace \
     --image gcr.io/$PROJECT_ID/crace \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --port 3000 \
     --memory 1Gi \
     --cpu 1 \
     --min-instances 0 \
     --max-instances 10 \
     --concurrency 100 \
     --timeout 300 \
     --set-env-vars NODE_ENV=production,COINMARKETCAP_API_KEY=your-api-key
   ```

## Configuration

### Cloud Run Settings

- **Memory**: 1Gi (adjust based on usage)
- **CPU**: 1 (adjust based on usage)
- **Min Instances**: 0 (for cost optimization)
- **Max Instances**: 10 (adjust based on expected traffic)
- **Concurrency**: 100 (requests per instance)
- **Timeout**: 300 seconds

### Security Headers

The app includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### PWA Features

- Service Worker for offline functionality
- Manifest for app installation
- Optimized for mobile and desktop

## Monitoring

1. **Cloud Run Metrics**: Monitor CPU, memory, and request metrics
2. **Logs**: View logs in Google Cloud Console
3. **Error Reporting**: Set up error reporting for production issues

## Custom Domain (Optional)

1. Map a custom domain in Cloud Run
2. Update DNS records
3. Configure SSL certificate

## Troubleshooting

### Common Issues

1. **API Key Not Working**: Ensure the environment variable is set correctly
2. **Build Failures**: Check Docker build logs
3. **Memory Issues**: Increase memory allocation
4. **Cold Starts**: Consider setting min-instances > 0

### Debug Commands

```bash
# View logs
gcloud run logs read crace --region us-central1

# Check service status
gcloud run services describe crace --region us-central1

# Update environment variables
gcloud run services update crace --region us-central1 --set-env-vars KEY=value
```

## Cost Optimization

1. Set min-instances to 0 for development
2. Use appropriate memory/CPU allocation
3. Monitor usage and adjust accordingly
4. Consider using Cloud Run's pay-per-use model

## Security Best Practices

1. Never commit API keys to version control
2. Use Google Secret Manager for sensitive data
3. Enable Cloud Armor for DDoS protection
4. Regularly update dependencies

## Support

For issues related to:
- **Next.js**: Check Next.js documentation
- **Cloud Run**: Check Google Cloud Run documentation
- **CoinMarketCap API**: Check CoinMarketCap API documentation
