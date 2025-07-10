const OpenAI = require('openai');

class AISummarizer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async summarizeArticle(article) {
    try {
      const prompt = `Summarize this AI/tech news article in 1-2 concise sentences (max 150 characters). Focus on the key AI development or impact:

Title: ${article.title}
Content: ${article.content}

Summary:`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a news summarizer that creates concise, engaging summaries of AI and tech news. Keep summaries under 150 characters and focus on the most important development.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      const summary = response.choices[0].message.content.trim();
      
      console.log(`🤖 Summarized: "${article.title}" → "${summary}"`);
      
      return {
        originalTitle: article.title,
        summary: summary,
        link: article.link,
        publishedAt: article.publishedAt,
        source: article.source
      };
      
    } catch (error) {
      console.error('❌ Error summarizing article:', error.message);
      throw new Error(`Failed to summarize article: ${error.message}`);
    }
  }

  async summarizeArticles(articles) {
    console.log(`🤖 Starting AI summarization of ${articles.length} articles...`);
    
    const summaries = [];
    
    for (const article of articles) {
      try {
        const summary = await this.summarizeArticle(article);
        summaries.push(summary);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to summarize "${article.title}":`, error.message);
        // Continue with other articles even if one fails
      }
    }
    
    console.log(`✅ Successfully summarized ${summaries.length} articles`);
    return summaries;
  }

  async testSummarizer() {
    console.log('🧪 Testing AI summarizer...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    const testArticle = {
      title: 'OpenAI launches GPT-5 with improved reasoning capabilities',
      content: 'OpenAI has released GPT-5, their latest language model featuring enhanced reasoning abilities and improved performance across various tasks. The new model shows significant improvements in logical reasoning, mathematical problem solving, and creative writing.',
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
      console.error('❌ Summarizer test failed:', error.message);
      throw error;
    }
  }
}

module.exports = AISummarizer; 