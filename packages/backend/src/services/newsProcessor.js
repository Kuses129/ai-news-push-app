const TechCrunchSource = require('./newsSources/TechCrunchSource');
const fs = require('fs').promises;
const path = require('path');

class NewsProcessor {
  constructor() {
    // Add more sources here as needed
    this.sources = [
      new TechCrunchSource()
      // e.g., new AnotherNewsSource(),
    ];
    this.lastProcessedTime = null;
    this.timestampFile = path.join(__dirname, '../data/lastProcessed.json');
    this.lastProcessedTimestamps = {};
  }

  async loadLastProcessedTimestamps() {
    try {
      const data = await fs.readFile(this.timestampFile, 'utf8');
      this.lastProcessedTimestamps = JSON.parse(data);
      console.log('📅 Loaded last processed timestamps:', this.lastProcessedTimestamps);
    } catch (error) {
      console.log('📅 No previous timestamps found, starting fresh');
      this.lastProcessedTimestamps = {};
    }
  }

  async saveLastProcessedTimestamps() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.timestampFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      await fs.writeFile(this.timestampFile, JSON.stringify(this.lastProcessedTimestamps, null, 2));
      console.log('📅 Saved last processed timestamps:', this.lastProcessedTimestamps);
    } catch (error) {
      console.error('❌ Failed to save timestamps:', error.message);
    }
  }

  async processNews() {
    try {
      console.log('🔄 Starting incremental news processing pipeline...');
      
      // Load previous timestamps
      await this.loadLastProcessedTimestamps();
      
      let allArticles = [];
      let newArticlesCount = 0;
      
      for (const source of this.sources) {
        const sourceName = source.name;
        const lastTimestamp = this.lastProcessedTimestamps[sourceName];
        
        console.log(`📰 [${sourceName}] Checking for new articles since: ${lastTimestamp || 'never'}`);
        
        // Fetch articles with incremental support
        const articles = await source.fetchNews(lastTimestamp);
        
        if (articles.length > 0) {
          console.log(`✅ [${sourceName}] Found ${articles.length} new articles`);
          allArticles = allArticles.concat(articles);
          newArticlesCount += articles.length;
          
          // Update timestamp for this source
          const latestTimestamp = Math.max(...articles.map(a => a.publishedAt.getTime()));
          this.lastProcessedTimestamps[sourceName] = new Date(latestTimestamp).toISOString();
        } else {
          console.log(`ℹ️ [${sourceName}] No new articles found`);
        }
      }
      
      if (newArticlesCount === 0) {
        console.log('ℹ️ No new articles found since last check');
        return [];
      }
      
      // Deduplicate by link
      const uniqueArticles = this.deduplicateArticles(allArticles);
      console.log(`📊 Processing ${uniqueArticles.length} unique new articles`);
      
      if (uniqueArticles.length === 0) {
        console.log('ℹ️ No AI-related articles found');
        return [];
      }
      
      // Summarize articles
      console.log('🤖 Step 2: Summarizing articles...');
      const AISummarizer = require('./aiSummarizer');
      const summarizer = new AISummarizer();
      const summaries = await summarizer.summarizeArticles(uniqueArticles);
      
      // Format for frontend
      console.log('📱 Step 3: Formatting for frontend...');
      const formattedNews = summaries.map(summary => ({
        id: summary.link,
        type: 'ai',
        content: summary.summary,
        timestamp: summary.publishedAt,
        originalTitle: summary.originalTitle,
        link: summary.link,
        source: summary.source
      }));
      
      this.lastProcessedTime = new Date();
      console.log(`✅ Pipeline completed! Processed ${formattedNews.length} new news items`);
      
      // Save updated timestamps
      await this.saveLastProcessedTimestamps();
      
      // Broadcast news updates via WebSocket if available
      if (global.wsManager && formattedNews.length > 0) {
        global.wsManager.broadcastNews(formattedNews);
      }
      
      return formattedNews;
    } catch (error) {
      console.error('❌ News processing failed:', error.message);
      throw error;
    }
  }

  deduplicateArticles(articles) {
    const seen = new Set();
    return articles.filter(article => {
      if (seen.has(article.link)) return false;
      seen.add(article.link);
      return true;
    });
  }

  async testPipeline() {
    console.log('🧪 Testing complete news processing pipeline...\n');
    try {
      const news = await this.processNews();
      console.log('📊 Pipeline Test Results:');
      console.log(`   - Articles fetched: ${news.length}`);
      console.log(`   - Processing time: ${new Date().toLocaleString()}`);
      if (news.length > 0) {
        console.log('\n📰 Sample processed news:');
        news.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.content}`);
          console.log(`   Source: ${item.source} | Link: ${item.link}`);
          console.log('');
        });
      }
      return news;
    } catch (error) {
      console.error('❌ Pipeline test failed:', error.message);
      throw error;
    }
  }

  getLastProcessedTime() {
    return this.lastProcessedTime;
  }

  isProcessing() {
    return false;
  }
}

module.exports = NewsProcessor; 