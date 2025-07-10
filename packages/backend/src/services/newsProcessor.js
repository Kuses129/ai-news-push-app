const NewsCrawler = require('./newsCrawler');
const AISummarizer = require('./aiSummarizer');
const MockSummarizer = require('./mockSummarizer');

class NewsProcessor {
  constructor() {
    this.crawler = new NewsCrawler();
    // Use mock summarizer for testing (switch to AISummarizer when quota is available)
    this.summarizer = new MockSummarizer();
    this.lastProcessedTime = null;
  }

  async processNews() {
    try {
      console.log('🔄 Starting news processing pipeline...');
      
      // Step 1: Fetch news articles
      console.log('📰 Step 1: Fetching news articles...');
      const articles = await this.crawler.fetchNews();
      
      if (articles.length === 0) {
        console.log('ℹ️ No AI-related articles found');
        return [];
      }
      
      // Step 2: Summarize articles
      console.log('🤖 Step 2: Summarizing articles...');
      const summaries = await this.summarizer.summarizeArticles(articles);
      
      // Step 3: Format for frontend
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
      
      return formattedNews;
      
    } catch (error) {
      console.error('❌ News processing failed:', error.message);
      throw error;
    }
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
    // Return true if we're currently processing (for future use)
    return false;
  }
}

module.exports = NewsProcessor; 