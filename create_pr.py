#!/usr/bin/env python3
"""
Script to create a GitHub pull request for the enhanced form input styling
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
    url = "https://api.github.com/repos/Ryjen1/stakingDapp/pulls"
    
    # Headers
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Pull request data
    pr_data = {
        "title": "feat: Enhance Form Input Styling (#14)",
        "head": "feature/optimize-card-layout-spacing",
        "base": "main",
        "body": """## 🎨 Enhanced Form Input Styling

This PR enhances all form inputs in Crystal Stakes with beautiful, user-friendly styling and improved interactions.

## ✨ Features Added

### EnhancedInput Component
- **Floating Labels** - Smooth animation above input when focused/filled
- **Multiple Variants** - default, crystal (glass morphism), and minimal styles
- **Error States** - Red borders with shake animation and clear error messages
- **Success States** - Green borders with checkmark icons
- **Mobile Friendly** - Touch targets meet 44px minimum (48px on mobile)
- **Accessibility** - Full ARIA support and screen reader compatibility

### Visual Enhancements
- **Elegant Box Shadows** - Subtle depth and modern appearance
- **Smooth Focus Transitions** - Color changes and shadow effects
- **Better Placeholder Text** - Improved typography and positioning
- **Consistent Padding** - Harmonized spacing across all forms
- **Mobile Touch Targets** - Optimized for mobile interaction

### Updated Forms
- **StakeForm.tsx** - Enhanced with detailed error messages showing available balance
- **WithdrawForm.tsx** - Improved validation with crystal variant styling
- **MintTokens.tsx** - Added mint-specific validation and cooldown feedback

## 🎭 Animation Features
- Floating label transitions
- Success icon fade-in animation
- Error state shake animation
- Input focus glow effects
- Smooth state transitions

## 📱 Mobile Optimizations
- Touch targets minimum 44px (48px on coarse pointers)
- Prevents zoom on iOS with proper font sizing
- Responsive design for all screen sizes
- Improved tap targets and spacing

## ♿ Accessibility
- ARIA labels and descriptions
- Screen reader support with proper semantic markup
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion support

## 🎨 Styling Variants

### Crystal Variant
- Glass morphism effects with backdrop blur
- Semi-transparent backgrounds
- Elegant border treatments
- Perfect for modal/dark contexts

### Default Variant
- Clean, modern borders
- Subtle shadows
- Standard white backgrounds

### Minimal Variant
- Underlined input style
- Minimalist design approach
- Perfect for simple forms

## 📚 Documentation
- Comprehensive component documentation
- Usage examples and prop descriptions
- Accessibility guidelines
- Theming information

## 🔧 Technical Details
- Built with TypeScript for type safety
- Supports all standard HTML input props
- Integrates with existing form validation
- CSS custom properties for easy theming
- Responsive breakpoints included

## 📋 Files Changed
- `src/components/ui/EnhancedInput.tsx` - New enhanced input component
- `src/components/StakeForm.tsx` - Updated with enhanced input
- `src/components/WithdrawForm.tsx` - Updated with enhanced input
- `src/components/MintTokens.tsx` - Updated with enhanced input
- `src/index.css` - Added enhanced input styles and animations
- `src/components/ui/ENHANCED_INPUT.md` - Component documentation

## ✅ Testing
- All forms tested with new styling
- Mobile responsiveness verified
- Accessibility compliance checked
- Animation performance optimized

This enhancement significantly improves the user experience across all forms in the Crystal Stakes application, making them more beautiful, accessible, and user-friendly."""
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