#!/bin/bash

# Exit on error
set -e

echo "Building Next.js app..."
npm run build

echo "Preparing deployment..."
BRANCH_NAME="gh-pages"
CURRENT_BRANCH=$(git branch --show-current)

# Stash any uncommitted changes
git stash

# Create or checkout gh-pages branch
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
  git checkout $BRANCH_NAME
else
  git checkout --orphan $BRANCH_NAME
fi

# Remove all files except .git
git rm -rf . --quiet 2>/dev/null || true

# Copy the built files from the out directory
cp -r out/* .

# Add all files
git add -A

# Commit
git commit -m "Deploy to GitHub Pages" || echo "No changes to commit"

# Push to gh-pages branch
echo "Pushing to gh-pages branch..."
git push origin $BRANCH_NAME --force

# Return to original branch
git checkout $CURRENT_BRANCH

# Restore stashed changes
git stash pop || true

echo "Deployment complete! Your site should be available at:"
echo "https://nisargpatel926.github.io/nisarg-website/"

