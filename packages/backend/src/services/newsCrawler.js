const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');

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
      
      // Fetch full content for each article
      console.log(`📖 Fetching full article content...`);
      const articlesWithFullContent = await this.fetchFullContent(aiArticles);
      
      return articlesWithFullContent.map(article => ({
        id: article.guid || article.link,
        title: article.title,
        content: article.fullContent || article.contentSnippet || article.content,
        link: article.link,
        publishedAt: new Date(article.pubDate),
        source: 'TechCrunch'
      }));
      
    } catch (error) {
      console.error('❌ Error fetching news:', error.message);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }

  async fetchFullContent(articles) {
    const articlesWithContent = [];
    
    for (const article of articles) {
      try {
        console.log(`📄 Fetching full content for: ${article.title}`);
        const fullContent = await this.scrapeArticleContent(article.link);
        
        articlesWithContent.push({
          ...article,
          fullContent: fullContent
        });
        
        // Add delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to fetch content for "${article.title}":`, error.message);
        // Keep the article with just the snippet if full content fetch fails
        articlesWithContent.push(article);
      }
    }
    
    console.log(`✅ Successfully fetched full content for ${articlesWithContent.length} articles`);
    return articlesWithContent;
  }

  async scrapeArticleContent(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      // Try multiple selectors for TechCrunch articles
      let content = '';
      
      // Method 1: Look for article content
      const articleContent = $('.article-content, .article-body, .entry-content, .post-content').text();
      if (articleContent && articleContent.length > 100) {
        content = articleContent;
      }
      
      // Method 2: Look for paragraphs within article
      if (!content || content.length < 100) {
        const paragraphs = $('article p, .article-content p, .entry-content p').text();
        if (paragraphs && paragraphs.length > 100) {
          content = paragraphs;
        }
      }
      
      // Method 3: Look for any content div
      if (!content || content.length < 100) {
        const contentDiv = $('div[class*="content"]').text();
        if (contentDiv && contentDiv.length > 100) {
          content = contentDiv;
        }
      }
      
      if (content) {
        // Clean up the content
        content = content.replace(/\s+/g, ' ') // Replace multiple spaces with single space
                        .replace(/&nbsp;/g, ' ') // Replace HTML entities
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .trim();
        
        // Remove common navigation text that might be captured
        content = content.replace(/Topics Latest AI Amazon Apps Biotech & Health Climate Cloud Computing Commerce Crypto Enterprise EVs/g, '');
        content = content.replace(/Subscribe to TechCrunch/g, '');
        content = content.replace(/Follow us on Twitter/g, '');
        content = content.replace(/Sign up for TechCrunch/g, '');
        
        // Limit content length to avoid token limits
        if (content.length > 2000) {
          content = content.substring(0, 2000) + '...';
        }
        
        // Only return if we have meaningful content
        if (content.length > 100) {
          return content;
        }
      }
      
      // Fallback to RSS snippet if we can't extract full content
      console.log(`⚠️ Could not extract full content from ${url}, using RSS snippet`);
      return null;
      
    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
      return null;
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
        console.log(`   Content length: ${article.content.length} characters`);
        console.log(`   Content preview: ${article.content.substring(0, 200)}...`);
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