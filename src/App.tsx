import { ConnectWallet } from './components/ConnectWallet';
import { MintTokens } from './components/MintTokens';
import { StakeForm } from './components/StakeForm';
import { WithdrawForm } from './components/WithdrawForm';
import { ClaimRewards } from './components/ClaimRewards';
import { EmergencyWithdraw } from './components/EmergencyWithdraw';
import { StakePosition } from './components/StakePosition';
import { ProtocolStats } from './components/ProtocolStats';
import { SubgraphStats } from './components/SubgraphStats';
import { NotificationProvider, useNotification } from './components/NotificationProvider';
import { NotificationContainer } from './components/ui/NotificationToast';
import { NotificationTest } from './components/NotificationTest';

// Inner component that uses the notification hook
const HomeContent = () => {
  const { notifications, dismissNotification } = useNotification();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-25 to-purple-50 relative overflow-hidden">
      <NotificationContainer 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-rose-300 rounded-full opacity-20 blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-md border-b border-rose-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'serif' }}>💎</span>
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-800 tracking-wide" style={{ fontFamily: 'serif' }}>
                  Crystal Stakes
                </h1>
                <p className="text-xs text-rose-500 font-medium">Elegant DeFi Experience</p>
              </div>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-block p-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl mb-6 animate-fade-in">
            <div className="bg-white rounded-xl px-6 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'serif' }}>
                ✨ Welcome to Crystal Stakes
              </span>
            </div>
          </div>
          <h2 className="text-5xl font-light text-gray-800 mb-4 tracking-wide animate-slide-up" style={{ fontFamily: 'serif' }}>
            Stake
            <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent font-medium animate-pulse"> HAPG </span>
            tokens
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-300" style={{ fontFamily: 'serif' }}>
            Experience the beauty of decentralized finance. Stake your tokens and watch your rewards grow in our crystal-clear staking platform.
          </p>
        </div>

        {/* Protocol Stats */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl transition-all duration-300 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="w-3 h-12 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full mr-4"></div>
              <h2 className="text-2xl font-light text-gray-800" style={{ fontFamily: 'serif' }}>
                Protocol Overview
              </h2>
            </div>
            <ProtocolStats />
          </div>
        </div>

        {/* Notification Test Section */}
        <div className="mb-12">
          <NotificationTest />
        </div>

        {/* Mint Tokens Section */}
        <div className="mb-12">
          <MintTokens />
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Stake Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: 'serif' }}>Stake Token</h3>
                <p className="text-sm text-gray-500">Begin your staking journey</p>
              </div>
            </div>
            <StakeForm />
          </div>

          {/* Withdraw Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in delay-200">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: 'serif' }}>Withdraw Token</h3>
                <p className="text-sm text-gray-500">Access your staked tokens</p>
              </div>
            </div>
            <WithdrawForm />
          </div>

          {/* Claim Rewards Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in delay-400">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: 'serif' }}>Claim Rewards</h3>
                <p className="text-sm text-gray-500">Harvest your earnings</p>
              </div>
            </div>
            <ClaimRewards />
          </div>

          {/* Emergency Withdraw Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in delay-600">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800" style={{ fontFamily: 'serif' }}>Emergency Exit</h3>
                <p className="text-sm text-gray-500">Quick withdrawal option</p>
              </div>
            </div>
            <EmergencyWithdraw />
          </div>
        </div>

        {/* User Position */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl transition-all duration-300 animate-fade-in delay-800">
          <div className="flex items-center mb-6">
            <div className="w-3 h-12 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full mr-4"></div>
            <h2 className="text-2xl font-light text-gray-800" style={{ fontFamily: 'serif' }}>
              Your Crystal Position
            </h2>
          </div>
          <StakePosition />
        </div>

        {/* Subgraph Analytics */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100/50 p-8 hover:shadow-2xl transition-all duration-300 animate-fade-in delay-1000">
          <div className="flex items-center mb-6">
            <div className="w-3 h-12 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full mr-4"></div>
            <h2 className="text-2xl font-light text-gray-800" style={{ fontFamily: 'serif' }}>
              Network Analytics
            </h2>
          </div>
          <SubgraphStats />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-white/70 backdrop-blur-sm border-t border-rose-100/50 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-light" style={{ fontFamily: 'serif' }}>
              ✨ Crystal Stakes - Where elegance meets DeFi ✨
            </p>
            <p className="text-sm text-rose-500 mt-2 font-medium">
              Built with love and sophistication
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main export that wraps content with NotificationProvider
export default function Home() {
  return (
    <NotificationProvider>
      <HomeContent />
    </NotificationProvider>
  );
}
