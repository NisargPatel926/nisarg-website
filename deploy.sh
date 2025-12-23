#!/bin/bash

# Exit on error
set -e

echo "Building Next.js app..."
npm run build

echo "Preparing deployment..."
BRANCH_NAME="gh-pages"
CURRENT_BRANCH=$(git branch --show-current)

# Ensure out directory exists
if [ ! -d "out" ]; then
  echo "Error: 'out' directory not found. Make sure the build completed successfully."
  exit 1
fi

# Create a temporary directory to hold the deployment files
TEMP_DIR=$(mktemp -d)
cp -r out/* "$TEMP_DIR/"

# Stash any uncommitted changes
git stash

# Create or checkout gh-pages branch
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
  git checkout $BRANCH_NAME
  # Remove all files except .git
  git rm -rf . --quiet 2>/dev/null || true
else
  git checkout --orphan $BRANCH_NAME
fi

# Copy files from temp directory
cp -r "$TEMP_DIR"/* .

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Add all files
git add -A

# Verify no node_modules are being added
if git ls-files | grep -q "node_modules"; then
  echo "Warning: node_modules detected in staging. Removing..."
  git reset HEAD node_modules 2>/dev/null || true
  git rm -rf --cached node_modules 2>/dev/null || true
fi

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

