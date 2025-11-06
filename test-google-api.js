// Test script to validate Google Gemini API key
import 'dotenv/config';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

console.log('Testing Google Gemini API Key...\n');
console.log('API Key present:', !!apiKey);
console.log('API Key length:', apiKey?.length || 0);
console.log('API Key starts with:', apiKey?.substring(0, 10) + '...\n');

if (!apiKey) {
  console.error('❌ No API key found in environment variables');
  process.exit(1);
}

// Test the API key
const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Testing API connection...\n');

fetch(testUrl)
  .then(async (response) => {
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.statusText);
      console.error('Error details:', errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('✅ API key is valid!');
    console.log(`Found ${data.models?.length || 0} models\n`);
    
    if (data.models && data.models.length > 0) {
      console.log('Available models:');
      data.models.slice(0, 5).forEach(model => {
        console.log(`  - ${model.name.replace('models/', '')}`);
      });
    }
  })
  .catch((error) => {
    console.error('❌ Network error:', error.message);
    process.exit(1);
  });
