require('dotenv').config();
const OpenAI = require('openai');

async function testOpenAI() {
  console.log('🔍 Testing OpenAI API connection...\n');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment');
    return;
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  console.log(`🔑 API Key: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);
  console.log(`🤖 Model: ${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}`);
  
  // Test with a simple request
  try {
    console.log('\n🧪 Testing simple API call...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, API is working!"'
        }
      ],
      max_tokens: 10,
    });
    
    console.log('✅ API call successful!');
    console.log(`📝 Response: "${response.choices[0].message.content}"`);
    
    // Try with gpt-4o-mini (newer, cheaper model)
    console.log('\n🧪 Testing with gpt-4o-mini...');
    
    const response2 = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, API is working!"'
        }
      ],
      max_tokens: 10,
    });
    
    console.log('✅ gpt-4o-mini call successful!');
    console.log(`📝 Response: "${response2.choices[0].message.content}"`);
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    console.error('📊 Error details:', {
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    if (error.status === 429) {
      console.log('\n💡 Quota exceeded. Try:');
      console.log('   1. Check your OpenAI billing at https://platform.openai.com/account/billing');
      console.log('   2. Try using gpt-4o-mini instead of gpt-3.5-turbo');
      console.log('   3. Check if you have credits in your account');
    }
  }
}

if (require.main === module) {
  testOpenAI();
}

module.exports = testOpenAI; 