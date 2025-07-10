class MockSummarizer {
  constructor() {
    this.model = 'mock-gpt-3.5-turbo';
  }

  async summarizeArticle(article) {
    try {
      // Create a mock summary based on the article title
      const mockSummary = this.createMockSummary(article.title);
      
      console.log(`🤖 Mock Summarized: "${article.title}" → "${mockSummary}"`);
      
      return {
        originalTitle: article.title,
        summary: mockSummary,
        link: article.link,
        publishedAt: article.publishedAt,
        source: article.source
      };
      
    } catch (error) {
      console.error('❌ Error in mock summarization:', error.message);
      throw new Error(`Failed to summarize article: ${error.message}`);
    }
  }

  async summarizeArticles(articles) {
    console.log(`🤖 Starting MOCK summarization of ${articles.length} articles...`);
    
    const summaries = [];
    
    for (const article of articles) {
      try {
        const summary = await this.summarizeArticle(article);
        summaries.push(summary);
        
        // Add a small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to summarize "${article.title}":`, error.message);
      }
    }
    
    console.log(`✅ Successfully mock-summarized ${summaries.length} articles`);
    return summaries;
  }

  createMockSummary(title) {
    const mockSummaries = [
      "AI breakthrough: New development in artificial intelligence technology",
      "Tech innovation: Latest advancement in machine learning systems",
      "AI update: Significant progress in neural network research",
      "Tech news: Important development in AI and automation",
      "AI advancement: New capabilities in artificial intelligence",
      "Tech breakthrough: Latest innovation in AI technology",
      "AI development: Progress in machine learning applications",
      "Tech update: New features in AI-powered systems"
    ];
    
    // Use a simple hash of the title to pick a consistent summary
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return mockSummaries[Math.abs(hash) % mockSummaries.length];
  }

  async testSummarizer() {
    console.log('🧪 Testing MOCK AI summarizer...');
    
    const testArticle = {
      title: 'OpenAI launches GPT-5 with improved reasoning capabilities',
      content: 'OpenAI has released GPT-5, their latest language model featuring enhanced reasoning abilities and improved performance across various tasks.',
      link: 'https://example.com/test',
      publishedAt: new Date(),
      source: 'Test'
    };
    
    try {
      const summary = await this.summarizeArticle(testArticle);
      console.log('📊 Test Results:');
      console.log(`Original: ${testArticle.title}`);
      console.log(`Summary: ${summary.summary}`);
      console.log(`Character count: ${summary.summary.length}`);
      
      return summary;
    } catch (error) {
      console.error('❌ Mock summarizer test failed:', error.message);
      throw error;
    }
  }
}

module.exports = MockSummarizer; 