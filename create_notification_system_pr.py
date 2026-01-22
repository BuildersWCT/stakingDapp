#!/usr/bin/env python3
"""
Script to create a GitHub pull request for the real-time notification system
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
        "title": "feat: Add Real-time Notification System (#9)",
        "head": "feature/transaction-history",
        "base": "main",
        "body": """## 🔔 Real-time Notification System

This PR implements a comprehensive real-time notification system for the Crystal Stakes DApp, keeping users informed about important staking events and rewards.

## ✨ Features Implemented

### Notification Types
- **Reward Claiming Reminders** - Automatic notifications when rewards are available
- **Transaction Confirmations** - Real-time updates on staking and claiming transactions
- **Protocol Updates** - Announcements and important protocol information
- **Staking Position Alerts** - Notifications about staking status changes
- **Emergency Withdrawal Warnings** - Critical alerts for emergency situations

### Technical Implementation
- **Browser Notification API** - Native browser notifications with permission management
- **In-app Notification Center** - Modal interface for viewing notification history
- **Notification Preferences** - Granular control over notification types
- **Push Notification Support** - Foundation for future PWA implementation
- **Email Notification Backend** - Ready for backend email integration

### Core Features
- **Customizable Preferences** - Enable/disable specific notification types
- **Notification History** - Persistent storage of all notifications
- **Read/Unread Status** - Track notification engagement
- **Bulk Management** - Mark all as read, delete multiple notifications
- **Time Zone Integration** - Display times in user's local time zone (Africa/Lagos)

## 🎨 User Interface

### Notification Center
- **Modal Design** - Clean, accessible modal interface
- **Filtering System** - Filter by type (all, unread, rewards, transactions, etc.)
- **Unread Badge** - Visual indicator with notification count
- **Bulk Actions** - Mark all read, clear all notifications
- **Preferences Panel** - In-app settings management

### Notification Types & Styling
- **Reward Notifications** - Purple theme with star icon
- **Transaction Notifications** - Indigo theme with card icon
- **Staking Notifications** - Emerald theme with chart icon
- **Emergency Notifications** - Red theme with warning icon
- **Smooth Animations** - Framer Motion powered transitions

## 🔧 Technical Architecture

### Components Created
- `NotificationCenter.tsx` - Main notification center component
- `useRewardReminder.ts` - Hook for automatic reward notifications
- Enhanced `NotificationProvider.tsx` - Extended with history and preferences
- Updated `NotificationToast.tsx` - New notification types and styling

### Key Features
- **Persistent Storage** - localStorage for preferences and history
- **Real-time Monitoring** - Automatic reward balance checking
- **Browser Permissions** - Proper notification permission handling
- **Accessibility** - Full ARIA support and keyboard navigation
- **Mobile Responsive** - Optimized for all device sizes

## 📱 Mobile Experience
- **Touch-Friendly** - Proper touch targets and spacing
- **Responsive Design** - Adapts to all screen sizes
- **Swipe Gestures** - Future enhancement ready
- **Offline Support** - Notifications work offline

## ♿ Accessibility
- **Screen Reader Support** - Proper ARIA labels and live regions
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast** - Meets WCAG guidelines
- **Reduced Motion** - Respects user preferences

## 📋 Files Changed
- `src/components/NotificationProvider.tsx` - Enhanced with history and preferences
- `src/components/ui/NotificationToast.tsx` - Extended notification types
- `src/components/NotificationCenter.tsx` - New notification center component
- `src/hooks/useRewardReminder.ts` - New reward reminder hook
- `src/components/StakeForm.tsx` - Updated to use staking notifications
- `src/components/ClaimRewards.tsx` - Updated to use reward notifications
- `src/App.tsx` - Integrated notification center and reminder system

## ✅ Testing & Validation
- **Notification Types** - All 5 notification types tested
- **Browser Notifications** - Permission handling verified
- **Persistence** - localStorage functionality confirmed
- **Time Zone** - Africa/Lagos time zone integration tested
- **Mobile Responsiveness** - All screen sizes validated
- **Accessibility** - Screen reader and keyboard navigation tested

## 🚀 Future Enhancements
- **Push Notifications** - PWA push notification support
- **Email Integration** - Backend email notification system
- **Advanced Filtering** - Date range and advanced search
- **Notification Templates** - Customizable notification formats
- **Analytics** - Notification engagement tracking

This implementation provides a solid foundation for user engagement and significantly enhances the overall user experience of the Crystal Stakes platform."""
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