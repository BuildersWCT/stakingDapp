#!/usr/bin/env python3
"""
Script to create a GitHub pull request for the Loading Spinner Components
"""

import requests
import json
import os
import subprocess
import sys

def get_github_token():
    """Get GitHub token from git config or environment"""
    # Try environment variable
    token = os.getenv('GITHUB_TOKEN')
    if token:
        return token
    
    print("No GitHub token found. Please set GITHUB_TOKEN environment variable")
    return None

def create_pull_request():
    """Create the pull request using GitHub API"""
    
    token = get_github_token()
    if not token:
        print("Please set your GitHub token as GITHUB_TOKEN environment variable")
        print("Example: export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx")
        return False
    
    # GitHub API endpoint
    url = "https://api.github.com/repos/Ryjen1/stakingDapp/pulls"
    
    # Headers
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Pull request data
    pr_data = {
        "title": "Create Loading Spinner Components #13",
        "head": "feature/loading-spinner-components",
        "base": "main",
        "body": """## Summary
This PR implements beautiful loading spinner components with crystal/gem theme support for the staking dApp.

## Changes Made

### New Components Created
- **LoadingSpinner.tsx** - Main spinner component with multiple variants:
  - `default` - Classic circular spinner
  - `crystal` - Crystal/gem themed spinner with glow effects
  - `dots` - Bouncing dots animation
  - `pulse` - Expanding pulse animation
  - `ring` - Rotating ring spinner

### Helper Components
- **ButtonSpinner** - Compact spinner for use inside buttons
- **PageLoader** - Full page loading overlay
- **CardLoader** - Loading state for card components
- **InlineLoader** - Compact inline loading indicator

### Features
- Multiple sizes (xs, sm, md, lg, xl)
- Crystal/rose/pink color themes matching the app design
- Proper ARIA labels for accessibility
- Centered option for overlay usage

### Components Updated
- **StakeForm.tsx** - Uses ButtonSpinner for transaction loading
- **ConnectWallet.tsx** - Shows spinner when wallet is connecting
- **ProtocolStats.tsx** - Shows CardLoader while fetching data
- **WithdrawForm.tsx** - Uses ButtonSpinner for withdrawal loading
- **ClaimRewards.tsx** - Uses ButtonSpinner for claim loading
- **MintTokens.tsx** - Uses ButtonSpinner for minting loading
- **EmergencyWithdraw.tsx** - Uses ButtonSpinner for emergency withdrawal

### Exports
- Updated `src/components/ui/index.ts` to export all spinner components

## Testing
- All spinner variants render correctly
- Loading states display properly during transactions
- Accessibility labels are properly set

Closes #13"""
    }
    
    try:
        print("Creating pull request...")
        response = requests.post(url, headers=headers, json=pr_data)
        
        if response.status_code == 201:
            pr_data = response.json()
            print(f"✅ Pull request created successfully!")
            print(f"📋 PR URL: {pr_data['html_url']}")
            print(f"📝 PR Number: #{pr_data['number']}")
            return True
        elif response.status_code == 422:
            print("⚠️  Pull request might already exist or there's a validation error")
            print(f"Response: {response.text}")
            return False
        else:
            print(f"❌ Failed to create pull request")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating pull request: {e}")
        return False

if __name__ == "__main__":
    success = create_pull_request()
    sys.exit(0 if success else 1)
