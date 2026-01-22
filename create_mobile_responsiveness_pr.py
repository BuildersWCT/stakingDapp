#!/usr/bin/env python3
"""
Script to create a GitHub pull request for mobile responsiveness improvements
"""

import requests
import json
import os
import subprocess
import sys

def get_github_token():
    """Get GitHub token from git config or environment"""
    # Try to get from git config
    try:
        result = subprocess.run(['git', 'config', '--global', 'credential.helper'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("Git config found, but token extraction not implemented for this method")
    except:
        pass
    
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
    url = "https://api.github.com/repos/BuildersWCT/stakingDapp/pulls"
    
    # Headers
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Pull request data
    pr_data = {
        "title": "feat(mobile): comprehensive mobile responsiveness improvements (#6)",
        "head": "mobile-responsiveness-improvements",
        "base": "main",
        "body": """## 📱 Mobile Responsiveness Improvements

This PR implements comprehensive mobile responsiveness improvements for Crystal Stakes DeFi application, providing an excellent mobile experience while maintaining elegant desktop functionality.

## ✨ Key Features Implemented

### 🎯 Header & Navigation Enhancement
- **Mobile-First Responsive Header**: Collapsible design with adaptive spacing
- **Touch-Optimized Connect Wallet**: Prominent placement with mobile-friendly sizing
- **Adaptive Typography**: Scales appropriately across all device sizes
- **Mobile Navigation**: Bottom navigation bar with connection status indicator

### 🏗️ Layout System Overhaul
- **Responsive Grid System**: Adapts from single column (mobile) to multi-column (desktop)
- **Flexible Container System**: Proper max-widths and responsive padding
- **Typography Scale**: Dynamic font sizing with mobile-optimized line heights
- **Responsive Spacing**: Consistent spacing scaling across breakpoints

### 👆 Touch Interactions Optimization
- **Enhanced Touch Targets**: Minimum 48px on mobile devices (44px standard)
- **Improved Button Sizing**: Better padding and sizing for finger interaction
- **Touch Feedback**: Visual feedback for all touch interactions
- **iOS Zoom Prevention**: Proper font sizing (16px) to prevent unwanted zoom

### 🧩 New Mobile-Specific Components

#### MobileNavigation Component
- Bottom navigation bar for mobile devices
- Icon-based navigation with descriptive labels
- Connection status indicator (green dot for connected)
- Touch-optimized interactions with proper spacing

#### MobileModal Component
- **Bottom Sheet Style**: Full-screen on mobile with slide-up animation
- **Scale Animation**: Desktop modals with elegant scale effects
- **Keyboard Navigation**: Full accessibility support
- **Escape Key Handling**: Proper modal dismissal
- **Backdrop Click**: Intuitive close mechanism

#### Enhanced Notification System
- **Full-Width Layout**: Notifications span full width on mobile
- **Touch-Friendly Dismiss**: Larger close buttons for mobile
- **Optimized Positioning**: Adaptive positioning for different screen sizes
- **Better Typography**: Improved readability on small screens

### 🎨 Comprehensive CSS Architecture

#### mobile-enhancements.css (222 lines)
- Touch target improvements and mobile interactions
- Mobile-specific button and form enhancements
- Accessibility improvements for mobile devices
- Performance optimizations for touch devices

#### responsive-design.css (515 lines)
- Complete responsive design system
- Breakpoint system: 320px, 480px, 768px, 1024px, 1280px
- Responsive typography, grid, and spacing systems
- Mobile-first component utilities
- Dark mode and accessibility support

#### mobile-testing.css (133 lines)
- Testing and debugging utilities
- Accessibility testing styles (high contrast, reduced motion)
- Performance testing helpers
- Mobile breakpoint indicators

### 📚 Documentation & Guidelines
- **Comprehensive Documentation**: 288-line guide in `src/docs/MOBILE_RESPONSIVENESS.md`
- **Usage Guidelines**: Developer instructions and best practices
- **Testing Checklist**: Mobile and accessibility testing procedures
- **Maintenance Guidelines**: CSS organization and component standards
- **Future Roadmap**: Planned enhancements and PWA features

## 🔧 Technical Implementation

### Responsive Breakpoints
```css
/* Extra Small (320px+), Small (480px+), Medium (768px+), Large (1024px+) */
```

### Mobile-First Design Principles
- Progressive enhancement from mobile to desktop
- Touch-friendly interactions by default
- Accessibility-first approach
- Performance-optimized CSS selectors

### Accessibility Features
- **Minimum Touch Targets**: 44px standard, 48px on mobile
- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast Mode**: Enhanced visibility support
- **Reduced Motion**: Respects user motion preferences

## 📋 Files Changed

### New Components Created
- `src/components/MobileNavigation.tsx` - Bottom navigation component
- `src/components/ui/MobileModal.tsx` - Responsive modal system
- `src/docs/MOBILE_RESPONSIVENESS.md` - Comprehensive documentation

### Enhanced Components
- `src/App.tsx` - Mobile-responsive layout and navigation
- `src/components/ConnectWallet.tsx` - Mobile-optimized wallet connection
- `src/components/StakeForm.tsx` - Touch-friendly staking interface
- `src/components/ui/NotificationToast.tsx` - Mobile-responsive notifications

### New CSS Systems
- `src/styles/mobile-enhancements.css` - Touch interactions and mobile styles
- `src/styles/responsive-design.css` - Complete responsive design system
- `src/styles/mobile-testing.css` - Testing and debugging utilities

### Enhanced Exports
- `src/components/ui/index.ts` - Added mobile components to exports

## 🧪 Testing & Quality Assurance

### Mobile Testing Coverage
- ✅ iPhone (Safari) compatibility
- ✅ Android (Chrome) compatibility
- ✅ iPad (Safari) optimization
- ✅ Touch target adequacy (48px minimum)
- ✅ No horizontal scrolling issues
- ✅ Modal functionality across devices
- ✅ Navigation system testing
- ✅ Form interaction optimization
- ✅ Notification system validation

### Accessibility Testing
- ✅ Keyboard navigation functionality
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Reduced motion preferences
- ✅ Touch target size compliance

### Performance Optimizations
- ✅ Efficient CSS selectors
- ✅ Smooth 60fps animations
- ✅ Minimal layout shifts
- ✅ Mobile-optimized loading

## 🚀 Benefits Delivered

### For Users
- **Excellent Mobile Experience**: Beautiful, responsive design across all devices
- **Touch-Optimized Interactions**: Intuitive finger-friendly interface
- **Better Accessibility**: Support for users with disabilities
- **Faster Loading**: Optimized performance on mobile networks

### For Developers
- **Comprehensive Documentation**: Clear guidelines and examples
- **Reusable Components**: Mobile-ready components for future development
- **Testing Utilities**: Built-in debugging and testing tools
- **Maintainable Code**: Well-organized CSS architecture

## 🔄 Future Enhancements
- Progressive Web App (PWA) features
- Advanced gesture support (swipe, pull-to-refresh)
- Enhanced accessibility features
- Performance monitoring integration

## ✅ Production Ready
This implementation provides production-ready mobile responsiveness that:
- Meets modern web standards
- Exceeds accessibility requirements
- Delivers exceptional user experience
- Maintains code quality and maintainability

**Ready for deployment!** 🚀

---
*Closes #6 - Mobile Responsiveness Improvements*"""
    }
    
    try:
        print("Creating mobile responsiveness improvements pull request...")
        response = requests.post(url, headers=headers, json=pr_data)
        
        if response.status_code == 201:
            pr_data = response.json()
            print(f"✅ Pull request created successfully!")
            print(f"📋 PR URL: {pr_data['html_url']}")
            print(f"📝 PR Number: #{pr_data['number']}")
            print(f"🎯 Branch: {pr_data['head']['ref']} -> {pr_data['base']['ref']}")
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