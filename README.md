# Crystal Stakes - Decentralized Staking Platform

A beautiful and elegant Progressive Web App (PWA) for decentralized staking with offline functionality, push notifications, and native app-like experience.

## ✨ Features

- **Progressive Web App (PWA)**: Install on mobile devices and desktops
- **Offline Functionality**: Queue transactions when offline, sync when back online
- **Push Notifications**: Real-time updates on staking activities
- **Background Sync**: Automatic transaction processing
- **Offline Data Viewing**: View cached staking data without internet
- **Native App Experience**: Works like a native mobile app
- **Fast Loading**: Optimized caching strategies

## 🚀 PWA Installation

### Mobile Installation

#### iOS Safari
1. Open Crystal Stakes in Safari
2. Tap the share button (📤)
3. Select "Add to Home Screen"
4. Tap "Add" to confirm

#### Android Chrome
1. Open Crystal Stakes in Chrome
2. Tap the menu button (⋮)
3. Select "Add to Home Screen"
4. Tap "Add" to confirm

#### Other Mobile Browsers
- Look for "Add to Home Screen" or "Install App" in the browser menu
- Or use the install banner that appears automatically

### Desktop Installation

#### Chrome/Chromium
1. Click the install icon in the address bar (🖥️)
2. Or click the install banner when it appears

#### Firefox
1. Click the install button in the address bar
2. Or use the install banner

#### Edge
1. Click the install icon in the address bar
2. Or use the install banner

## 📱 PWA Features

### Offline Mode
- **Transaction Queuing**: Stake, unstake, and claim operations are queued when offline
- **Automatic Sync**: Transactions sync automatically when connection is restored
- **Offline Indicators**: Clear visual indicators show when you're offline
- **Cached Data**: View your staking position and rewards from cached data

### Push Notifications
- **Transaction Updates**: Get notified when transactions complete
- **Staking Alerts**: Notifications for staking opportunities
- **Reward Notifications**: Alerts when rewards are available
- **Offline Status**: Updates when connection is restored

### Performance
- **Fast Loading**: Cached assets load instantly
- **Background Sync**: Transactions process in the background
- **Optimized Caching**: Smart caching strategies for different content types

## 🛠️ Development

### Prerequisites
- Node.js 18+
- pnpm or npm

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### PWA Testing
```bash
# Build and serve with PWA features
pnpm build && pnpm preview
```

## 🔧 Technical Implementation

### Service Worker
- **Caching Strategy**: Cache-first for static assets, network-first for dynamic content
- **Background Sync**: Handles offline transaction queuing
- **Push Notifications**: Manages notification subscriptions and delivery

### Offline Storage
- **IndexedDB**: Stores staking data and transaction queues
- **Automatic Cleanup**: Removes stale data periodically
- **Data Synchronization**: Syncs with blockchain when online

### Components
- **PWAService**: Manages PWA installation and status
- **PWAStatusIndicator**: Shows offline/online status and queued transactions
- **Background Sync Service**: Handles transaction processing
- **Push Notification Service**: Manages notifications

## 📋 Requirements

- **HTTPS**: Required for PWA installation and service workers
- **Modern Browser**: Chrome 70+, Firefox 68+, Safari 12.2+, Edge 79+
- **Web3 Wallet**: MetaMask, WalletConnect, or compatible wallet

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test PWA functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✨ Acknowledgments

- Built with React, TypeScript, and Vite
- Web3 integration with wagmi and AppKit
- PWA features powered by Service Workers and Web App Manifest
- Beautiful UI with Tailwind CSS and custom animations