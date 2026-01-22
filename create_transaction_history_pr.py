#!/usr/bin/env python3
"""
Script to create a GitHub pull request for the Transaction History Feature
"""

import requests
import json
import os
import subprocess
import sys

def get_github_token():
    """Get GitHub token from environment"""
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

    # GitHub API endpoint - using the new repo URL
    url = "https://api.github.com/repos/BuildersWCT/stakingDapp/pulls"

    # Headers
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }

    # Pull request data
    pr_data = {
        "title": "feat: Add Transaction History Feature (#5)",
        "head": "feature/transaction-history",
        "base": "main",
        "body": """## 📊 Transaction History Feature

This PR implements the complete Transaction History Feature (#5) for the Crystal Stakes DApp, allowing users to track their complete staking transaction history with advanced filtering and export capabilities.

## ✨ Features Implemented

### Core Functionality
- **Complete Transaction Tracking** - Display all user transactions (stake, unstake, claim rewards, emergency withdraw)
- **Real-time Updates** - Automatic polling every 30 seconds for new transactions
- **Subgraph Integration** - Direct integration with The Graph protocol for efficient data fetching

### Advanced Features
- **Smart Filtering** - Filter transactions by type (stake/unstake/claim/emergency) and date range
- **Pagination** - Handle large datasets with 10 transactions per page
- **Export Options** - Export transaction history as CSV or JSON files
- **Block Explorer Links** - Direct links to Etherscan for each transaction
- **Transaction Status** - Clear status indicators (confirmed/pending/failed)

### User Experience
- **Responsive Design** - Mobile-friendly interface with touch-optimized controls
- **Loading States** - Proper loading spinners and error handling
- **Empty States** - Helpful messages when no transactions match filters
- **Error Handling** - Graceful error states with retry options

## 🏗️ Technical Implementation

### New Components
- `TransactionHistory.tsx` - Main transaction history component with full functionality
- Subgraph client setup in `lib/subgraph.ts` with GraphQL queries

### Integration
- Added to main app layout in `App.tsx`
- Uses existing UI components (LoadingSpinner, ErrorMessage) for consistency
- Follows established design patterns and styling

### Data Flow
- Apollo Client for GraphQL subgraph queries
- Real-time polling for transaction updates
- Client-side filtering and pagination
- Export functionality with blob downloads

## 📱 Mobile Optimizations
- Touch-friendly controls and spacing
- Responsive grid layouts
- Optimized for mobile interaction
- Prevents zoom issues on iOS

## ♿ Accessibility
- ARIA labels and semantic markup
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## 📋 Files Changed
- `src/components/TransactionHistory.tsx` - New transaction history component
- `src/lib/subgraph.ts` - Subgraph client and GraphQL queries
- `src/App.tsx` - Integration into main application

## ✅ Testing
- Component renders correctly with and without wallet connection
- Filtering and pagination work as expected
- Export functionality tested (CSV/JSON downloads)
- Error states and loading indicators verified
- Mobile responsiveness confirmed

## 🔧 Technical Details
- Built with TypeScript for type safety
- Uses Apollo Client for GraphQL integration
- Implements proper error boundaries
- Follows React best practices
- CSS-in-JS with Tailwind for styling

This feature significantly enhances the user experience by providing complete transparency into their staking activities, with powerful tools for tracking and managing their transaction history."""
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