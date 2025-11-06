#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if all required files and configurations are ready for Railway deployment
 */

import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${description}`, colors.green);
    return true;
  } else {
    log(`✗ ${description} - Missing: ${filePath}`, colors.red);
    return false;
  }
}

function checkFileContent(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const found = content.includes(searchString);
    if (found) {
      log(`✓ ${description}`, colors.green);
      return true;
    } else {
      log(`✗ ${description}`, colors.yellow);
      return false;
    }
  } catch (error) {
    log(`✗ ${description} - Error reading file`, colors.red);
    return false;
  }
}

function main() {
  log('\n🚀 Railway Deployment Verification\n', colors.blue);
  
  let allChecks = true;

  // Check required files
  log('📁 Checking Required Files:', colors.blue);
  allChecks &= checkFile('railway.json', 'Railway configuration file');
  allChecks &= checkFile('.railwayignore', 'Railway ignore file');
  allChecks &= checkFile('Dockerfile', 'Dockerfile');
  allChecks &= checkFile('docker-start.sh', 'Docker start script');
  allChecks &= checkFile('package.json', 'Package.json');
  allChecks &= checkFile('RAILWAY_DEPLOYMENT.md', 'Deployment guide');
  allChecks &= checkFile('DEPLOYMENT_CHECKLIST.md', 'Deployment checklist');

  // Check gitignore
  log('\n🔒 Checking Security:', colors.blue);
  allChecks &= checkFileContent('.gitignore', 'get-stripe-prices.js', 'Stripe script excluded from git');
  allChecks &= checkFileContent('.gitignore', '.env', 'Environment files excluded from git');

  // Check Dockerfile
  log('\n🐳 Checking Docker Configuration:', colors.blue);
  allChecks &= checkFileContent('Dockerfile', 'bolt-ai-production', 'Production stage defined');
  allChecks &= checkFileContent('Dockerfile', 'HEALTHCHECK', 'Health check configured');
  allChecks &= checkFileContent('Dockerfile', 'EXPOSE 5173', 'Port 5173 exposed');

  // Check package.json scripts
  log('\n📦 Checking Build Scripts:', colors.blue);
  allChecks &= checkFileContent('package.json', '"build":', 'Build script exists');
  allChecks &= checkFileContent('package.json', '"start":', 'Start script exists');

  // Check for sensitive data
  log('\n🔍 Checking for Sensitive Data:', colors.blue);
  const sensitiveFiles = ['get-stripe-prices.js'];
  let hasSensitiveFiles = false;
  
  sensitiveFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`⚠ Warning: ${file} still exists - should be removed before deployment`, colors.yellow);
      hasSensitiveFiles = true;
    }
  });
  
  if (!hasSensitiveFiles) {
    log('✓ No sensitive files found', colors.green);
  }

  // Summary
  log('\n' + '='.repeat(50), colors.blue);
  if (allChecks && !hasSensitiveFiles) {
    log('✅ All checks passed! Ready for Railway deployment', colors.green);
    log('\nNext steps:', colors.blue);
    log('1. Remove get-stripe-prices.js from git history (see DEPLOYMENT_CHECKLIST.md)');
    log('2. Commit changes: git add . && git commit -m "Prepare for Railway deployment"');
    log('3. Push to GitHub: git push origin main');
    log('4. Deploy on Railway: https://railway.app/new');
    log('5. Follow RAILWAY_DEPLOYMENT.md for complete setup\n');
    process.exit(0);
  } else {
    log('❌ Some checks failed. Please fix the issues above before deploying.', colors.red);
    log('\nRefer to RAILWAY_DEPLOYMENT.md for detailed instructions.\n');
    process.exit(1);
  }
}

main();
