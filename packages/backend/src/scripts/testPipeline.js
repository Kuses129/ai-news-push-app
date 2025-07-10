require('dotenv').config();
const NewsProcessor = require('../services/newsProcessor');

async function testPipeline() {
  console.log('🚀 Starting Complete News Processing Pipeline Test...\n');
  
  try {
    const processor = new NewsProcessor();
    const news = await processor.testPipeline();
    
    console.log(`\n✅ Pipeline test completed!`);
    console.log(`📊 Final Results:`);
    console.log(`   - Total news items processed: ${news.length}`);
    console.log(`   - Last processed: ${processor.getLastProcessedTime()?.toLocaleString() || 'N/A'}`);
    console.log(`   - Processing status: ${processor.isProcessing() ? 'Active' : 'Idle'}`);
    
    if (news.length === 0) {
      console.log('\n💡 No news processed. This could be because:');
      console.log('   1. No AI-related articles found in RSS feed');
      console.log('   2. OpenAI API key not configured');
      console.log('   3. Network issues');
    }
    
    return news;
  } catch (error) {
    console.error('❌ Pipeline test failed:', error.message);
    console.log('\n💡 Common issues:');
    console.log('   1. Check your OpenAI API key in .env file');
    console.log('   2. Verify internet connection');
    console.log('   3. Check if TechCrunch RSS is accessible');
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPipeline();
}

module.exports = testPipeline; 