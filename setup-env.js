#!/usr/bin/env node

/**
 * Environment Setup Helper
 * Helps configure environment variables for Vercel deployment
 */

const fs = require('fs');
const readline = require('readline');

console.log('🔧 Environment Setup Helper\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env.vercel already exists
if (fs.existsSync('.env.vercel')) {
  console.log('✅ .env.vercel already exists');
  rl.question('Do you want to update it? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled. Your existing .env.vercel is unchanged.');
      rl.close();
    }
  });
} else {
  console.log('📝 Creating new .env.vercel file...');
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n🔑 Let\'s configure your API keys:');
  console.log('(Press Enter to skip any optional keys)\n');

  const questions = [
    {
      key: 'GOOGLE_GENERATIVE_AI_API_KEY',
      prompt: 'Google AI API Key (required for Gemini models): ',
      required: true,
      help: 'Get from: https://makersuite.google.com/app/apikey'
    },
    {
      key: 'OPENAI_API_KEY',
      prompt: 'OpenAI API Key (for GPT models): ',
      required: false,
      help: 'Get from: https://platform.openai.com/api-keys'
    },
    {
      key: 'ANTHROPIC_API_KEY',
      prompt: 'Anthropic API Key (for Claude models): ',
      required: false,
      help: 'Get from: https://console.anthropic.com/'
    },
    {
      key: 'OPEN_ROUTER_API_KEY',
      prompt: 'OpenRouter API Key (for multiple models): ',
      required: false,
      help: 'Get from: https://openrouter.ai/keys'
    },
    {
      key: 'VITE_SUPABASE_URL',
      prompt: 'Supabase URL (required for database): ',
      required: true,
      help: 'Get from: https://supabase.com/dashboard → Project Settings → API'
    },
    {
      key: 'VITE_SUPABASE_ANON_KEY',
      prompt: 'Supabase Anon Key (required): ',
      required: true,
      help: 'Get from: https://supabase.com/dashboard → Project Settings → API'
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      prompt: 'Supabase Service Role Key (required): ',
      required: true,
      help: 'Get from: https://supabase.com/dashboard → Project Settings → API'
    },
    {
      key: 'CLERK_PUBLISHABLE_KEY',
      prompt: 'Clerk Publishable Key (required for auth): ',
      required: true,
      help: 'Get from: https://dashboard.clerk.com → API Keys'
    },
    {
      key: 'CLERK_SECRET_KEY',
      prompt: 'Clerk Secret Key (required): ',
      required: true,
      help: 'Get from: https://dashboard.clerk.com → API Keys'
    },
    {
      key: 'STRIPE_SECRET_KEY',
      prompt: 'Stripe Secret Key (for payments): ',
      required: false,
      help: 'Get from: https://dashboard.stripe.com/apikeys'
    }
  ];

  const envVars = {};
  let currentIndex = 0;

  function askQuestion() {
    if (currentIndex >= questions.length) {
      generateEnvFile(envVars);
      return;
    }

    const question = questions[currentIndex];
    const requiredText = question.required ? ' (REQUIRED)' : ' (optional)';
    
    console.log(`\n${question.help}`);
    rl.question(`${question.prompt}${requiredText}`, (answer) => {
      if (question.required && !answer.trim()) {
        console.log('❌ This field is required. Please provide a value.');
        askQuestion(); // Ask the same question again
        return;
      }
      
      if (answer.trim()) {
        envVars[question.key] = answer.trim();
      }
      
      currentIndex++;
      askQuestion();
    });
  }

  askQuestion();
}

function generateEnvFile(envVars) {
  console.log('\n📝 Generating .env.vercel file...');

  // Read the template from existing .env.vercel or create a new one
  let template = `# Vercel Environment Variables
# Copy these to your Vercel Dashboard → Settings → Environment Variables

# AI Provider API Keys
GOOGLE_GENERATIVE_AI_API_KEY=${envVars.GOOGLE_GENERATIVE_AI_API_KEY || 'your_google_api_key_here'}
OPENAI_API_KEY=${envVars.OPENAI_API_KEY || 'your_openai_api_key_here'}
ANTHROPIC_API_KEY=${envVars.ANTHROPIC_API_KEY || 'your_anthropic_api_key_here'}
OPEN_ROUTER_API_KEY=${envVars.OPEN_ROUTER_API_KEY || 'your_openrouter_api_key_here'}
GROQ_API_KEY=your_groq_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
XAI_API_KEY=your_xai_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
HuggingFace_API_KEY=your_huggingface_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=${envVars.VITE_SUPABASE_URL || 'your_supabase_url_here'}
VITE_SUPABASE_ANON_KEY=${envVars.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'}
SUPABASE_SERVICE_ROLE_KEY=${envVars.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key_here'}
VITE_SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=${envVars.CLERK_PUBLISHABLE_KEY || 'your_clerk_publishable_key_here'}
VITE_CLERK_PUBLISHABLE_KEY=${envVars.CLERK_PUBLISHABLE_KEY || 'your_clerk_publishable_key_here'}
CLERK_SECRET_KEY=${envVars.CLERK_SECRET_KEY || 'your_clerk_secret_key_here'}
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=${envVars.STRIPE_SECRET_KEY || 'your_stripe_secret_key_here'}
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Development Settings
NODE_ENV=production
VITE_LOG_LEVEL=info
`;

  fs.writeFileSync('.env.vercel', template);

  console.log('✅ .env.vercel file created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Review and update .env.vercel with any missing API keys');
  console.log('2. Copy all variables to Vercel Dashboard → Settings → Environment Variables');
  console.log('3. Run: pnpm run deploy:vercel');
  console.log('\n🔗 Helpful links:');
  console.log('• Vercel Dashboard: https://vercel.com/dashboard');
  console.log('• Deployment Guide: ./VERCEL_DEPLOYMENT.md');

  rl.close();
}