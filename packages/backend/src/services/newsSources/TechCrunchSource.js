const NewsSource = require('./NewsSource');
const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');

class TechCrunchSource extends NewsSource {
  constructor() {
    super('TechCrunch');
    this.parser = new Parser();
    this.rssUrl = process.env.NEWS_RSS_URL || 'https://techcrunch.com/feed/';
  }

  async fetchNews() {
    try {
      console.log(`📰 [TechCrunch] Fetching news from: ${this.rssUrl}`);
      const feed = await this.parser.parseURL(this.rssUrl);
      const articles = feed.items.slice(0, 10);
      console.log(`✅ [TechCrunch] Fetched ${articles.length} articles from RSS feed`);
      const aiArticles = this.filterAIArticles(articles);
      console.log(`🤖 [TechCrunch] Found ${aiArticles.length} AI-related articles`);
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
      console.error('[TechCrunch] ❌ Error fetching news:', error.message);
      throw new Error(`[TechCrunch] Failed to fetch news: ${error.message}`);
    }
  }

  async fetchFullContent(articles) {
    const articlesWithContent = [];
    for (const article of articles) {
      try {
        console.log(`[TechCrunch] 📄 Fetching full content for: ${article.title}`);
        const fullContent = await this.scrapeArticleContent(article.link);
        articlesWithContent.push({ ...article, fullContent });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`[TechCrunch] ❌ Failed to fetch content for "${article.title}":`, error.message);
        articlesWithContent.push(article);
      }
    }
    console.log(`[TechCrunch] ✅ Successfully fetched full content for ${articlesWithContent.length} articles`);
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
      let content = '';
      const articleContent = $('.article-content, .article-body, .entry-content, .post-content').text();
      if (articleContent && articleContent.length > 100) content = articleContent;
      if (!content || content.length < 100) {
        const paragraphs = $('article p, .article-content p, .entry-content p').text();
        if (paragraphs && paragraphs.length > 100) content = paragraphs;
      }
      if (!content || content.length < 100) {
        const contentDiv = $('div[class*="content"]').text();
        if (contentDiv && contentDiv.length > 100) content = contentDiv;
      }
      if (content) {
        content = content.replace(/\s+/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();
        content = content.replace(/Topics Latest AI Amazon Apps Biotech & Health Climate Cloud Computing Commerce Crypto Enterprise EVs/g, '');
        content = content.replace(/Subscribe to TechCrunch/g, '');
        content = content.replace(/Follow us on Twitter/g, '');
        content = content.replace(/Sign up for TechCrunch/g, '');
        if (content.length > 2000) content = content.substring(0, 2000) + '...';
        if (content.length > 100) return content;
      }
      console.log(`[TechCrunch] ⚠️ Could not extract full content from ${url}, using RSS snippet`);
      return null;
    } catch (error) {
      console.error(`[TechCrunch] ❌ Error scraping ${url}:`, error.message);
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
}

module.exports = TechCrunchSource; 