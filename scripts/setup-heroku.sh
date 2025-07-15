#!/bin/bash

# Heroku Setup Script for AI News App
# This script helps set up the initial Heroku configuration

set -e

echo "🚀 Setting up Heroku deployment for AI News App..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   npm install -g heroku"
    exit 1
fi

# Check if user is logged in
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Please run:"
    echo "   heroku login"
    exit 1
fi

echo "✅ Heroku CLI is ready"

# Create apps
echo "📦 Creating Heroku apps..."

# Create backend app
echo "Creating backend app..."
heroku create ai-news-backend-2024 --buildpack heroku/nodejs

# Create frontend app
echo "Creating frontend app..."
heroku create ai-news-frontend-2024 --buildpack heroku/nodejs

echo "✅ Apps created successfully"

# Set environment variables
echo "🔧 Setting environment variables..."

# Backend variables
echo "Setting backend environment variables..."
heroku config:set NODE_ENV=production --app ai-news-backend-2024
heroku config:set OPENAI_MODEL=gpt-4o-mini --app ai-news-backend-2024
heroku config:set NEWS_RSS_URL=https://techcrunch.com/feed/ --app ai-news-backend-2024

# Frontend variables
echo "Setting frontend environment variables..."
heroku config:set REACT_APP_WS_URL=wss://ai-news-backend-2024.herokuapp.com --app ai-news-frontend-2024

echo "⚠️  IMPORTANT: You need to set your OpenAI API key manually:"
echo "   heroku config:set OPENAI_API_KEY=your_api_key --app ai-news-backend-2024"

echo ""
echo "🎉 Heroku setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your OpenAI API key:"
echo "   heroku config:set OPENAI_API_KEY=your_api_key --app ai-news-backend-2024"
echo ""
echo "2. Add GitHub secrets:"
echo "   - HEROKU_API_KEY: $(heroku auth:token)"
echo "   - HEROKU_EMAIL: your_email@example.com"
echo "   - HEROKU_BACKEND_APP_NAME: ai-news-backend-2024"
echo "   - HEROKU_FRONTEND_APP_NAME: ai-news-frontend-2024"
echo ""
echo "3. Push to GitHub to trigger deployment:"
echo "   git push origin main"
echo ""
echo "Your apps will be available at:"
echo "   Frontend: https://ai-news-frontend-2024.herokuapp.com"
echo "   Backend: https://ai-news-backend-2024.herokuapp.com" 