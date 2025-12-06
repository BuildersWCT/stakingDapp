import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { HelpIcon } from './ui'

export function ConnectWallet() {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { selectedNetworkId } = useAppKitState()

  if (isConnected && address) {
    return (
      <div className="flex justify-end mb-8 space-x-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-600">
            {selectedNetworkId ? `Network: ${selectedNetworkId}` : ''}
          </span>
          <HelpIcon
            content="Current blockchain network you're connected to. Different networks may have different transaction costs."
            position="bottom"
            variant="subtle"
            size="sm"
          />
        </div>
        <HelpIcon
          content="View your account details, transaction history, and disconnect wallet"
          position="bottom"
          variant="primary"
          size="sm"
        >
          <button
            onClick={() => open({ view: 'Account' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium btn-crystal-secondary btn-glow-blue btn-ripple"
          >
            {address.slice(0, 6)}...{address.slice(-4)}
          </button>
        </HelpIcon>
        <HelpIcon
          content="Switch to a different blockchain network for transactions"
          position="bottom"
          variant="primary"
          size="sm"
        >
          <button
            onClick={() => open({ view: 'Networks' })}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm btn-crystal-utility btn-glow-gray btn-ripple"
          >
            🔗
          </button>
        </HelpIcon>
      </div>
    )
  }

  return (
    <div className="flex justify-end mb-8">
      <HelpIcon
        content="Connect your crypto wallet to start using Crystal Stakes. Your wallet will store your HAPG tokens and handle transactions securely."
        position="bottom"
        variant="primary"
        size="sm"
      >
        <button
          onClick={() => open({ view: 'Connect' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium btn-crystal-secondary btn-glow-blue btn-ripple"
        >
          Connect Wallet
        </button>
      </HelpIcon>
    </div>
  )
}
