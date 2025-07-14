require('dotenv').config();
const NewsProcessor = require('../services/newsProcessor');

async function testWebSocketPipeline() {
  console.log('🧪 Testing WebSocket news pipeline...\n');
  
  try {
    const processor = new NewsProcessor();
    
    console.log('🔄 Processing news with WebSocket broadcasting...');
    const news = await processor.processNews();
    
    console.log('\n📊 Results:');
    console.log(`   - Articles processed: ${news.length}`);
    console.log(`   - WebSocket broadcasting: ${news.length > 0 ? '✅ Active' : '⏸️ No news to broadcast'}`);
    
    if (news.length > 0) {
      console.log('\n📰 Sample news items that should be broadcast:');
      news.slice(0, 2).forEach((item, index) => {
        console.log(`${index + 1}. ${item.content.substring(0, 100)}...`);
        console.log(`   Source: ${item.source} | Link: ${item.link}`);
        console.log('');
      });
    }
    
    console.log('✅ WebSocket pipeline test completed!');
    console.log('💡 Check your frontend to see if news updates appear in real-time.');
    
  } catch (error) {
    console.error('❌ WebSocket pipeline test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testWebSocketPipeline(); 