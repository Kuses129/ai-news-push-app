require('dotenv').config();
const NewsProcessor = require('../services/newsProcessor');

async function testIncrementalProcessing() {
  console.log('🧪 Testing Incremental News Processing...\n');
  
  const processor = new NewsProcessor();
  
  try {
    // First run - should process all articles
    console.log('🔄 First run (initial processing)...');
    const firstRun = await processor.processNews();
    console.log(`✅ First run completed with ${firstRun.length} articles\n`);
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Second run - should find no new articles
    console.log('🔄 Second run (should find no new articles)...');
    const secondRun = await processor.processNews();
    console.log(`✅ Second run completed with ${secondRun.length} articles\n`);
    
    // Third run - should still find no new articles
    console.log('🔄 Third run (should still find no new articles)...');
    const thirdRun = await processor.processNews();
    console.log(`✅ Third run completed with ${thirdRun.length} articles\n`);
    
    console.log('📊 Incremental Processing Test Results:');
    console.log(`   - First run articles: ${firstRun.length}`);
    console.log(`   - Second run articles: ${secondRun.length}`);
    console.log(`   - Third run articles: ${thirdRun.length}`);
    console.log(`   - Timestamps saved: ${Object.keys(processor.lastProcessedTimestamps).length} sources`);
    
    if (secondRun.length === 0 && thirdRun.length === 0) {
      console.log('✅ Incremental processing working correctly!');
    } else {
      console.log('⚠️ Incremental processing may have issues');
    }
    
  } catch (error) {
    console.error('❌ Incremental processing test failed:', error.message);
  }
}

// Run the test
testIncrementalProcessing(); 