#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * Automates the deployment process and environment setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Deployment Helper\n');

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json not found. Please ensure you have the Vercel configuration file.');
  process.exit(1);
}

// Check if .env.vercel exists
if (!fs.existsSync('.env.vercel')) {
  console.error('❌ .env.vercel not found. Please create this file with your environment variables.');
  process.exit(1);
}

console.log('✅ Configuration files found');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
    process.exit(1);
  }
}

// Read environment variables from .env.vercel
console.log('\n📋 Environment Variables Summary:');
const envContent = fs.readFileSync('.env.vercel', 'utf8');
const envLines = envContent.split('\n').filter(line => 
  line.trim() && !line.startsWith('#') && line.includes('=')
);

const envVars = {};
envLines.forEach(line => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  envVars[key.trim()] = value.trim();
});

console.log(`   • ${Object.keys(envVars).length} environment variables configured`);

// Check for required variables
const requiredVars = [
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const missingVars = requiredVars.filter(varName => 
  !envVars[varName] || envVars[varName].includes('your_') || envVars[varName].includes('_here')
);

if (missingVars.length > 0) {
  console.log('\n⚠️  Warning: Some required variables may not be configured:');
  missingVars.forEach(varName => {
    console.log(`   • ${varName}`);
  });
  console.log('\n   Please update .env.vercel with your actual API keys before deploying.');
}

// Deployment options
console.log('\n🚀 Deployment Options:');
console.log('1. Deploy to production (recommended)');
console.log('2. Deploy preview');
console.log('3. Just validate configuration');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nSelect option (1-3): ', (answer) => {
  rl.close();
  
  switch (answer.trim()) {
    case '1':
      deployProduction();
      break;
    case '2':
      deployPreview();
      break;
    case '3':
      validateOnly();
      break;
    default:
      console.log('Invalid option. Exiting.');
      process.exit(1);
  }
});

function deployProduction() {
  console.log('\n🚀 Deploying to production...');
  console.log('📝 Remember to set environment variables in Vercel Dashboard!');
  console.log('   Dashboard → Project → Settings → Environment Variables\n');
  
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('\n✅ Production deployment completed!');
    console.log('🔗 Your app is now live on Vercel');
    
    // Show post-deployment checklist
    showPostDeploymentChecklist();
  } catch (error) {
    console.error('\n❌ Deployment failed. Check the error above.');
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   • Ensure all environment variables are set in Vercel Dashboard');
    console.log('   • Check that your GitHub repository is connected');
    console.log('   • Verify your API keys are valid');
    process.exit(1);
  }
}

function deployPreview() {
  console.log('\n🔍 Deploying preview...');
  
  try {
    execSync('vercel', { stdio: 'inherit' });
    console.log('\n✅ Preview deployment completed!');
    console.log('🔗 Preview URL generated above');
  } catch (error) {
    console.error('\n❌ Preview deployment failed. Check the error above.');
    process.exit(1);
  }
}

function validateOnly() {
  console.log('\n✅ Configuration validation completed');
  console.log('\n📋 Summary:');
  console.log(`   • vercel.json: ✅ Found`);
  console.log(`   • .env.vercel: ✅ Found (${Object.keys(envVars).length} variables)`);
  console.log(`   • Required variables: ${missingVars.length === 0 ? '✅' : '⚠️'} ${missingVars.length === 0 ? 'All set' : `${missingVars.length} missing`}`);
  
  console.log('\n🚀 Ready to deploy! Run this script again and choose option 1 or 2.');
}

function showPostDeploymentChecklist() {
  console.log('\n📋 Post-Deployment Checklist:');
  console.log('   □ Test AI chat functionality');
  console.log('   □ Verify authentication works');
  console.log('   □ Check database connections');
  console.log('   □ Test payment processing (if applicable)');
  console.log('   □ Monitor function logs in Vercel Dashboard');
  console.log('   □ Set up custom domain (optional)');
  console.log('\n📊 Monitor your deployment:');
  console.log('   • Functions: Dashboard → Project → Functions');
  console.log('   • Analytics: Dashboard → Project → Analytics');
  console.log('   • Logs: Dashboard → Project → Functions → View Logs');
}