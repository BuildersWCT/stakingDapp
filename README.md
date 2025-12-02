# Crystal Stakes - Professional DeFi Staking Platform

![Crystal Stakes](./src/assets/react.svg)

Crystal Stakes is a sophisticated, elegant decentralized finance (DeFi) staking platform that allows users to stake HAPG tokens and earn rewards in a beautiful, user-friendly interface. Built with modern web3 technologies and designed for both security and user experience.

## 🚀 Features

### Core Functionality
- **Token Staking**: Stake HAPG tokens with competitive reward rates
- **Reward Harvesting**: Claim accumulated rewards at any time
- **Flexible Withdrawals**: Withdraw staked tokens with full transparency
- **Emergency Exit**: Quick withdrawal option for urgent situations
- **Test Token Minting**: Built-in test token minting for development and testing

### Advanced Features
- **Real-time Protocol Statistics**: Live tracking of total staked, active users, and protocol health
- **Network Analytics**: Comprehensive data visualization through subgraph integration
- **User Position Tracking**: Detailed individual staking positions and history
- **Multi-wallet Support**: Seamless integration with popular Web3 wallets via RainbowKit

### Technical Excellence
- **The Graph Integration**: Efficient data indexing and querying
- **Responsive Design**: Beautiful, mobile-first interface built with TailwindCSS
- **Type Safety**: Full TypeScript implementation for enhanced code reliability
- **Modern Architecture**: Built with React 19, Vite, and modern web3 libraries

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript for robust component development
- **Vite** for lightning-fast development and optimized builds
- **TailwindCSS** for elegant, responsive styling
- **RainbowKit** for seamless wallet connectivity
- **Wagmi & Viem** for Ethereum blockchain interactions
- **Apollo Client** for GraphQL data management

### Backend & Indexing
- **The Graph Protocol** for efficient blockchain data indexing
- **Subgraph** for real-time event tracking and analytics
- **GraphQL** for flexible data querying

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm package manager
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stakingDapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

## 🌐 Network Configuration

- **Network**: Ethereum Sepolia Testnet
- **Contract Address**: `0x03149CF87371e7E38714563efAC3E355c0B56752`
- **Subgraph**: Deployed on The Graph Studio for mainnet indexing
- **Currency**: HAPG (ERC-20 token)

## 📊 Protocol Statistics

The platform provides comprehensive analytics including:

- Total amount staked across the protocol
- Number of active stakers
- Current reward rates
- Protocol health metrics
- Historical staking trends
- User-level analytics

## 🎯 Usage Guide

### Getting Started

1. **Connect Your Wallet**: Click the "Connect Wallet" button and select your preferred Web3 wallet
2. **Mint Test Tokens**: Use the built-in minting feature to get HAPG tokens for testing
3. **Stake Tokens**: Enter the amount you wish to stake and confirm the transaction
4. **Monitor Your Position**: Track your staking performance in the "Your Crystal Position" section
5. **Claim Rewards**: Harvest your accumulated rewards at your convenience
6. **Emergency Withdrawal**: Use the emergency exit feature if needed

### Available Actions

| Action | Description | Use Case |
|--------|-------------|----------|
| **Stake** | Lock tokens to earn rewards | Long-term yield generation |
| **Withdraw** | Remove staked tokens | Access your principal |
| **Claim Rewards** | Harvest earned rewards | Realize earnings |
| **Emergency Withdraw** | Quick token withdrawal | Urgent liquidity needs |
| **Mint Tokens** | Generate test tokens | Development and testing |

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ConnectWallet.tsx
│   ├── StakeForm.tsx
│   ├── WithdrawForm.tsx
│   ├── ClaimRewards.tsx
│   ├── EmergencyWithdraw.tsx
│   ├── MintTokens.tsx
│   ├── ProtocolStats.tsx
│   ├── SubgraphStats.tsx
│   └── StakePosition.tsx
├── hooks/              # Custom React hooks
│   └── useSubgraph.ts
├── lib/                # Utility libraries
│   ├── contracts.ts
│   └── wagmi.ts
├── graphql/            # GraphQL queries and client
│   ├── client.ts
│   └── queries.ts
└── App.tsx             # Main application component
```

### Subgraph Components
```
subgraph/
├── schema.graphql      # GraphQL schema definition
├── subgraph.yaml       # Subgraph configuration
├── src/mapping.ts      # Event handlers and data transformation
└── abis/               # Smart contract ABIs
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run codegen` - Generate GraphQL types (subgraph)
- `npm run build` - Build subgraph
- `npm run deploy` - Deploy subgraph to The Graph Studio

## 🔐 Security Features

- **Wallet Integration**: Secure connection via RainbowKit
- **Transaction Signing**: All blockchain interactions require explicit user approval
- **Type Safety**: Full TypeScript coverage for enhanced code reliability
- **Modern Standards**: Built following current web3 security best practices

## 📈 Analytics & Monitoring

Crystal Stakes provides comprehensive analytics through integrated subgraph data:

### User Analytics
- Individual staking history
- Reward accumulation tracking
- Performance metrics
- Transaction history

### Protocol Analytics
- Total value locked (TVL)
- Active user count
- Staking distribution
- Historical trends
- Reward rate changes

## 🚀 Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- IPFS/Arweave

### Subgraph Deployment
The subgraph is deployed to The Graph Studio and can be accessed via GraphQL queries for real-time protocol data.

## 🤝 Contributing

We welcome contributions to Crystal Stakes! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit your changes with clear messages
4. Ensure all tests pass
5. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Documentation

For technical support, feature requests, or bug reports:
- Check the existing documentation
- Search through existing issues
- Create a new issue with detailed information
- Contact the development team

## 🔗 Links

- **Live Application**: [Deployed URL]
- **Subgraph**: [The Graph Studio Link]
- **Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x03149CF87371e7E38714563efAC3E355c0B56752)
- **The Graph Docs**: [Documentation](https://thegraph.com/docs/)

---

**Built with ❤️ and cutting-edge web3 technology**

*Crystal Stakes - Where elegance meets DeFi*
