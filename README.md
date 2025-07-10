# AI News Push App

A real-time AI news push notification app that fetches tech news, summarizes them using AI, and delivers concise updates via push notifications.

## Features

- 🔄 **Real-time News Fetching**: Automated news crawling from TechCrunch RSS
- 🤖 **AI Summarization**: OpenAI-powered news summarization to 1-2 sentences
- 📱 **Mobile-Friendly**: Responsive chat-like interface
- ⚡ **Push Notifications**: Real-time WebSocket-based notifications
- 🐳 **Docker Support**: Easy local development setup

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + TypeScript
- **Real-time**: WebSocket
- **AI**: OpenAI API
- **News Source**: TechCrunch RSS
- **Development**: Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- OpenAI API Key

### Local Development

1. **Clone and setup**:

   ```bash
   git clone <your-repo-url>
   cd ai-news-app
   npm run install:all
   ```

2. **Environment Setup**:

   ```bash
   # Create .env file in packages/backend
   cp packages/backend/.env.example packages/backend/.env
   # Add your OpenAI API key
   ```

3. **Start Development**:

   ```bash
   # Option 1: Docker (recommended)
   npm run docker:up

   # Option 2: Local development
   npm run dev
   ```

4. **Test the setup**:
   - Frontend: http://localhost:3000
   - Backend Health: http://localhost:3001/health

## Project Structure

```
ai-news-app/
├── packages/
│   ├── backend/          # Node.js API server
│   └── frontend/         # React web app
├── docker-compose.yml    # Local development setup
├── package.json          # Root package.json for monorepo
└── README.md
```

## Development Phases

### Phase 1: Basic Infrastructure ✅

- [x] Monorepo setup
- [x] Backend foundation
- [x] Frontend foundation
- [x] Docker integration

### Phase 2: News Processing

- [ ] News crawler
- [ ] AI summarization
- [ ] Processing pipeline

### Phase 3: Real-time Notifications

- [ ] WebSocket setup
- [ ] Push notification system
- [ ] Frontend notification display

### Phase 4: Testing & Polish

- [ ] End-to-end testing
- [ ] Mobile optimization
- [ ] Documentation

## Testing Each Phase

Each phase includes specific testing checkpoints:

```bash
# Test Phase 1
npm run docker:up
# Visit http://localhost:3000 and http://localhost:3001/health

# Test Phase 2 (when ready)
npm run test:crawler
npm run test:summarize

# Test Phase 3 (when ready)
# Open multiple browser tabs to test real-time updates
```

## Contributing

1. Follow the phase-by-phase development approach
2. Test each phase locally before moving to the next
3. Ensure mobile responsiveness
4. Add proper error handling

## License

MIT
