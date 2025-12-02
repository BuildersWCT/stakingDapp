import { useAppKit, useAppKitState } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

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
        </div>
        <button
          onClick={() => open({ view: 'Account' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        <button
          onClick={() => open({ view: 'Networks' })}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          🔗
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-end mb-8">
      <button
        onClick={() => open({ view: 'Connect' })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Connect Wallet
      </button>
    </div>
  )
}
