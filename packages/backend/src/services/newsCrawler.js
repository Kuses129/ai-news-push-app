const axios = require('axios');
const Parser = require('rss-parser');

class NewsCrawler {
  constructor() {
    this.parser = new Parser();
    this.rssUrl = process.env.NEWS_RSS_URL || 'https://techcrunch.com/feed/';
    this.lastFetchTime = null;
  }

  async fetchNews() {
    try {
      console.log(`📰 Fetching news from: ${this.rssUrl}`);
      
      const feed = await this.parser.parseURL(this.rssUrl);
      const articles = feed.items.slice(0, 10); // Get latest 10 articles
      
      console.log(`✅ Fetched ${articles.length} articles from RSS feed`);
      
      // Filter for AI-related articles
      const aiArticles = this.filterAIArticles(articles);
      
      console.log(`🤖 Found ${aiArticles.length} AI-related articles`);
      
      return aiArticles.map(article => ({
        id: article.guid || article.link,
        title: article.title,
        content: article.contentSnippet || article.content,
        link: article.link,
        publishedAt: new Date(article.pubDate),
        source: 'TechCrunch'
      }));
      
    } catch (error) {
      console.error('❌ Error fetching news:', error.message);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }

  filterAIArticles(articles) {
    const aiKeywords = [
      'artificial intelligence', 'AI', 'machine learning', 'ML', 
      'deep learning', 'neural network', 'GPT', 'ChatGPT', 'OpenAI',
      'Google AI', 'Microsoft AI', 'Meta AI', 'Apple AI',
      'automation', 'robotics', 'computer vision', 'NLP',
      'natural language processing', 'transformer', 'LLM'
    ];

    return articles.filter(article => {
      const text = `${article.title} ${article.contentSnippet || ''}`.toLowerCase();
      return aiKeywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  async testCrawler() {
    console.log('🧪 Testing news crawler...');
    try {
      const articles = await this.fetchNews();
      console.log('📊 Test Results:');
      articles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Published: ${article.publishedAt.toLocaleString()}`);
        console.log(`   Link: ${article.link}`);
        console.log('');
      });
      return articles;
    } catch (error) {
      console.error('❌ Crawler test failed:', error.message);
      throw error;
    }
  }
}

module.exports = NewsCrawler; 