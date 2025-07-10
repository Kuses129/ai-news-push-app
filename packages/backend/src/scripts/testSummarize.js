require('dotenv').config();
const AISummarizer = require('../services/aiSummarizer');

async function testSummarizer() {
  console.log('🚀 Starting AI Summarizer Test...\n');
  
  try {
    const summarizer = new AISummarizer();
    const summary = await summarizer.testSummarizer();
    
    console.log(`\n✅ Test completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Summary length: ${summary.summary.length} characters`);
    console.log(`   - Model used: ${summarizer.model}`);
    console.log(`   - API key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
    
    return summary;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 To fix this:');
    console.log('   1. Set your OpenAI API key in packages/backend/.env');
    console.log('   2. Copy from packages/backend/env.example');
    console.log('   3. Add your actual OpenAI API key');
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSummarizer();
}

module.exports = testSummarizer; 