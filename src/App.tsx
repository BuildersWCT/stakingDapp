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
    <div className="min-h-screen crystal-pattern crystal-particles relative overflow-hidden">
      <NotificationContainer 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
      {/* Enhanced decorative background elements with crystal colors */}
      <div className="absolute top-0 left-0 w-full h-full crystal-noise">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 blur-xl animate-pulse" 
             style={{ background: 'var(--crystal-primary-200)' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-15 blur-lg animate-pulse delay-1000" 
             style={{ background: 'var(--crystal-secondary-200)' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-10 blur-2xl animate-pulse delay-500" 
             style={{ background: 'var(--crystal-primary-300)' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full opacity-20 blur-xl animate-pulse delay-700" 
             style={{ background: 'var(--crystal-primary-400)' }}></div>
      </div>

      {/* Header */}
      <header className="relative crystal-glass border-b sticky top-0 z-50 shadow-crystal">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-crystal animate-bounce crystal-gradient-primary">
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'serif' }}>💎</span>
              </div>
              <div>
                <h1 className="text-3xl font-light tracking-wide crystal-gradient-text" style={{ fontFamily: 'serif' }}>
                  Crystal Stakes
                </h1>
                <p className="text-sm font-medium" style={{ color: 'var(--crystal-primary-600)' }}>Elegant DeFi Experience</p>
              </div>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="inline-block p-2 rounded-2xl mb-8 animate-fade-in crystal-gradient-primary">
            <div className="bg-white rounded-xl px-8 py-3 shadow-crystal">
              <span className="text-sm font-medium crystal-gradient-text" style={{ fontFamily: 'serif' }}>
                ✨ Welcome to Crystal Stakes
              </span>
            </div>
          </div>
          <h2 className="text-6xl font-light mb-6 tracking-wide animate-slide-up crystal-gradient-text" style={{ fontFamily: 'serif' }}>
            Stake
            <span className="font-medium crystal-pulse" style={{ fontFamily: 'serif', color: 'var(--crystal-primary-600)' }}> HAPG </span>
            tokens
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300" style={{ color: 'var(--crystal-text-secondary)', fontFamily: 'serif' }}>
            Experience the beauty of decentralized finance. Stake your tokens and watch your rewards grow in our crystal-clear staking platform.
          </p>
        </div>

        {/* Protocol Stats */}
        <div className="mb-16">
          <div className="crystal-card p-10 hover:scale-[1.01] transition-all duration-300 animate-fade-in crystal-hover-lift">
            <div className="flex items-center mb-8">
              <div className="w-4 h-16 rounded-full mr-6 crystal-gradient-primary"></div>
              <h2 className="text-3xl font-light" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>
                Protocol Overview
              </h2>
            </div>
            <ProtocolStats />
          </div>
        </div>

        {/* Notification Test Section */}
        <div className="mb-16">
          <NotificationTest />
        </div>

        {/* Mint Tokens Section */}
        <div className="mb-16">
          <MintTokens />
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Stake Card */}
          <div className="group crystal-card p-10 animate-fade-in crystal-hover-lift">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-crystal" 
                   style={{ background: 'linear-gradient(135deg, var(--crystal-accent-emerald), #059669)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>Stake Token</h3>
                <p className="text-base" style={{ color: 'var(--crystal-text-muted)' }}>Begin your staking journey</p>
              </div>
            </div>
            <StakeForm />
          </div>

          {/* Withdraw Card */}
          <div className="group crystal-card p-10 animate-fade-in delay-200 crystal-hover-lift">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-crystal" 
                   style={{ background: 'linear-gradient(135deg, var(--crystal-accent-blue), #2563eb)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>Withdraw Token</h3>
                <p className="text-base" style={{ color: 'var(--crystal-text-muted)' }}>Access your staked tokens</p>
              </div>
            </div>
            <WithdrawForm />
          </div>

          {/* Claim Rewards Card */}
          <div className="group crystal-card p-10 animate-fade-in delay-400 crystal-hover-lift">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-crystal" 
                   style={{ background: 'linear-gradient(135deg, var(--crystal-accent-amber), #d97706)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>Claim Rewards</h3>
                <p className="text-base" style={{ color: 'var(--crystal-text-muted)' }}>Harvest your earnings</p>
              </div>
            </div>
            <ClaimRewards />
          </div>

          {/* Emergency Withdraw Card */}
          <div className="group crystal-card p-10 animate-fade-in delay-600 crystal-hover-lift">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-crystal" 
                   style={{ background: 'linear-gradient(135deg, var(--crystal-accent-red), #dc2626)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>Emergency Exit</h3>
                <p className="text-base" style={{ color: 'var(--crystal-text-muted)' }}>Quick withdrawal option</p>
              </div>
            </div>
            <EmergencyWithdraw />
          </div>
        </div>

        {/* User Position */}
        <div className="crystal-card p-10 transition-all duration-300 animate-fade-in delay-800 crystal-hover-lift">
          <div className="flex items-center mb-8">
            <div className="w-4 h-16 rounded-full mr-6 crystal-gradient-primary"></div>
            <h2 className="text-3xl font-light" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>
              Your Crystal Position
            </h2>
          </div>
          <StakePosition />
        </div>

        {/* Subgraph Analytics */}
        <div className="mt-16 crystal-card p-10 transition-all duration-300 animate-fade-in delay-1000 crystal-hover-lift">
          <div className="flex items-center mb-8">
            <div className="w-4 h-16 rounded-full mr-6" style={{ background: 'var(--crystal-gradient-secondary)' }}></div>
            <h2 className="text-3xl font-light" style={{ color: 'var(--crystal-text-primary)', fontFamily: 'serif' }}>
              Network Analytics
            </h2>
          </div>
          <SubgraphStats />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative crystal-glass border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="font-light crystal-gradient-text" style={{ fontFamily: 'serif' }}>
              ✨ Crystal Stakes - Where elegance meets DeFi ✨
            </p>
            <p className="text-sm mt-2 font-medium" style={{ color: 'var(--crystal-primary-600)' }}>
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
