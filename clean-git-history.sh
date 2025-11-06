#!/bin/bash

# Git History Cleaning Script
# This script removes sensitive files from git history

echo "🧹 Git History Cleaning Script"
echo "================================"
echo ""
echo "This script will remove get-stripe-prices.js from git history"
echo "⚠️  WARNING: This will rewrite git history!"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "📋 Checking prerequisites..."

# Check if git-filter-repo is installed
if command -v git-filter-repo &> /dev/null; then
    echo "✅ git-filter-repo found"
    echo ""
    echo "🔄 Removing get-stripe-prices.js from history..."
    git filter-repo --path get-stripe-prices.js --invert-paths --force
    
    if [ $? -eq 0 ]; then
        echo "✅ File removed from history"
        echo ""
        echo "📤 Next steps:"
        echo "1. Add remote: git remote add origin https://github.com/terenaanhamiki/elericDp.git"
        echo "2. Force push: git push origin main --force"
        echo ""
        echo "⚠️  Make sure all team members know about this history rewrite!"
    else
        echo "❌ Failed to remove file from history"
        exit 1
    fi
else
    echo "❌ git-filter-repo not found"
    echo ""
    echo "📥 Installation options:"
    echo ""
    echo "Option 1 - Using pip:"
    echo "  pip install git-filter-repo"
    echo ""
    echo "Option 2 - Using BFG Repo-Cleaner:"
    echo "  1. Download from: https://rtyley.github.io/bfg-repo-cleaner/"
    echo "  2. Run: java -jar bfg.jar --delete-files get-stripe-prices.js"
    echo ""
    echo "Option 3 - Manual (not recommended):"
    echo "  git filter-branch --force --index-filter \\"
    echo "    'git rm --cached --ignore-unmatch get-stripe-prices.js' \\"
    echo "    --prune-empty --tag-name-filter cat -- --all"
    echo ""
    exit 1
fi
