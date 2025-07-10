require('dotenv').config();
const NewsCrawler = require('../services/newsCrawler');

async function testCrawler() {
  console.log('🚀 Starting News Crawler Test...\n');
  
  try {
    const crawler = new NewsCrawler();
    const articles = await crawler.testCrawler();
    
    console.log(`\n✅ Test completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total articles fetched: ${articles.length}`);
    console.log(`   - Source: ${articles[0]?.source || 'N/A'}`);
    console.log(`   - Latest article: ${articles[0]?.title || 'N/A'}`);
    
    return articles;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCrawler();
}

module.exports = testCrawler; 