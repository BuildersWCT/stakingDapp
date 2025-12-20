import React from 'react';
import { useAccount } from 'wagmi';

interface MobileNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function MobileNavigation({ activeSection = 'stake', onSectionChange }: MobileNavigationProps) {
  const { isConnected } = useAccount();

  const navigationItems = [
    {
      id: 'stake',
      label: 'Stake',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: 'Stake tokens'
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: 'Access staked tokens'
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      description: 'Harvest earnings'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      description: 'Quick exit'
    }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange?.(item.id)}
            className={`mobile-nav-item flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-blue-100 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            title={item.description}
          >
            <div className={`mb-1 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Connection Status Indicator */}
      <div className="absolute -top-1 -right-1">
        {isConnected ? (
          <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
        )}
      </div>
    </nav>
  );
}