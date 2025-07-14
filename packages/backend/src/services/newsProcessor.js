const TechCrunchSource = require('./newsSources/TechCrunchSource');

class NewsProcessor {
  constructor() {
    // Add more sources here as needed
    this.sources = [
      new TechCrunchSource()
      // e.g., new AnotherNewsSource(),
    ];
    this.lastProcessedTime = null;
  }

  async processNews() {
    try {
      console.log('🔄 Starting news processing pipeline...');
      let allArticles = [];
      for (const source of this.sources) {
        const articles = await source.fetchNews();
        allArticles = allArticles.concat(articles);
      }
      // Deduplicate by link
      const uniqueArticles = this.deduplicateArticles(allArticles);
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
      console.log(`✅ Pipeline completed! Processed ${formattedNews.length} news items`);
      
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