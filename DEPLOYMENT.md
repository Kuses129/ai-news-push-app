# 🚀 Deployment Guide - AI News App

## Overview

This guide explains how to deploy the AI News App to Heroku using GitHub Actions CI/CD pipeline.

## Architecture

- **Backend**: Node.js/Express server with WebSocket support
- **Frontend**: React app with real-time WebSocket connection
- **Deployment**: Separate Heroku apps for backend and frontend

## Prerequisites

### 1. Heroku Account Setup

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install Heroku CLI: `npm install -g heroku`
3. Login: `heroku login`

### 2. Create Heroku Apps

```bash
# Create backend app
heroku create ai-news-backend-2024

# Create frontend app
heroku create ai-news-frontend-2024
```

### 3. Set Environment Variables

#### Backend App Variables:

```bash
heroku config:set NODE_ENV=production --app ai-news-backend-2024
heroku config:set OPENAI_API_KEY=your_openai_api_key --app ai-news-backend-2024
heroku config:set OPENAI_MODEL=gpt-4o-mini --app ai-news-backend-2024
heroku config:set NEWS_RSS_URL=https://techcrunch.com/feed/ --app ai-news-backend-2024
```

#### Frontend App Variables:

```bash
heroku config:set REACT_APP_WS_URL=wss://ai-news-backend-2024.herokuapp.com --app ai-news-frontend-2024
```

### 4. GitHub Repository Setup

#### Add GitHub Secrets:

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

- `HEROKU_API_KEY`: Your Heroku API key
- `HEROKU_EMAIL`: Your Heroku email
- `HEROKU_BACKEND_APP_NAME`: `ai-news-backend-2024`
- `HEROKU_FRONTEND_APP_NAME`: `ai-news-frontend-2024`

#### Get Heroku API Key:

```bash
heroku auth:token
```

## CI/CD Pipeline

### Workflow Overview

1. **Test**: Runs backend and frontend tests
2. **Build**: Builds both applications
3. **Deploy Backend**: Deploys to Heroku backend app
4. **Deploy Frontend**: Deploys to Heroku frontend app

### Trigger Conditions

- Runs on push to `main` or `master` branch
- Runs on pull requests to `main` or `master` branch
- Only deploys on pushes to main/master (not PRs)

## Manual Deployment

### Backend Deployment

```bash
cd packages/backend
heroku git:remote -a ai-news-backend-2024
git push heroku main
```

### Frontend Deployment

```bash
cd packages/frontend
heroku git:remote -a ai-news-frontend-2024
git push heroku main
```

## Post-Deployment

### Verify Backend Health

```bash
curl https://ai-news-backend-2024.herokuapp.com/health
```

### Test WebSocket Connection

```bash
# Test WebSocket connection
node -e "
const ws = new (require('ws'))('wss://ai-news-backend-2024.herokuapp.com');
ws.on('open', () => console.log('✅ Connected'));
ws.on('message', (data) => console.log('📡 Received:', JSON.parse(data).type));
setTimeout(() => ws.close(), 5000);
"
```

### Access Applications

- **Frontend**: https://ai-news-frontend-2024.herokuapp.com
- **Backend**: https://ai-news-backend-2024.herokuapp.com

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **WebSocket Connection Issues**

   - Verify backend URL is correct in frontend environment
   - Check Heroku logs: `heroku logs --tail --app ai-news-backend-2024`

3. **Environment Variables**
   - Ensure all required env vars are set in Heroku
   - Check variable names match code expectations

### Useful Commands

```bash
# View Heroku logs
heroku logs --tail --app ai-news-backend-2024
heroku logs --tail --app ai-news-frontend-2024

# Check app status
heroku ps --app ai-news-backend-2024
heroku ps --app ai-news-frontend-2024

# Restart apps
heroku restart --app ai-news-backend-2024
heroku restart --app ai-news-frontend-2024
```

## Monitoring

### Health Checks

- Backend: `/health` endpoint returns status
- Frontend: Serves React app with WebSocket connection

### Logs

- GitHub Actions: View workflow runs in GitHub
- Heroku: Use `heroku logs` command
- Application: Check browser console for frontend logs

## Cost Optimization

### Heroku Dynos

- **Backend**: Use `eco` dyno for cost efficiency
- **Frontend**: Use `eco` dyno for cost efficiency
- **Scaling**: Scale up as needed for production traffic

### Environment Variables

- Use production OpenAI API key
- Set appropriate rate limits
- Monitor API usage costs

## Security

### Environment Variables

- Never commit API keys to repository
- Use Heroku config vars for sensitive data
- Rotate API keys regularly

### CORS Configuration

- Backend configured to accept frontend requests
- WebSocket connections secured with proper origin checks
