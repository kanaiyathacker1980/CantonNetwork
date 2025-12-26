import { useAuthStore } from '../store/authStore'
import TokenCard from '../components/TokenCard'

export default function WalletPage() {
  const { user } = useAuthStore()

  // Mock data for development
  const mockTokens = [
    {
      id: 1,
      businessName: "Joe's Coffee Shop",
      tokenName: "Coffee Coins",
      balance: 45,
      icon: "☕",
      color: "from-yellow-500 to-orange-600"
    },
    {
      id: 2,
      businessName: "Pizza Palace",
      tokenName: "Pizza Points",
      balance: 120,
      icon: "🍕",
      color: "from-red-500 to-pink-600"
    },
    {
      id: 3,
      businessName: "Fit Zone Gym",
      tokenName: "Fitness Tokens",
      balance: 78,
      icon: "💪",
      color: "from-blue-500 to-indigo-600"
    }
  ]

  const totalBalance = mockTokens.reduce((sum, token) => sum + token.balance, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-1">My Wallet</h1>
        <p className="text-indigo-200">Welcome back, {user?.name}!</p>
      </div>

      {/* Total Balance Card */}
      <div className="px-4 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Total Points Across All Programs</p>
          <p className="text-4xl font-bold text-gray-900">{totalBalance}</p>
          <p className="text-sm text-green-600 mt-2">{mockTokens.length} active programs</p>
        </div>
      </div>

      {/* Token Cards */}
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Loyalty Programs</h2>
        {mockTokens.length > 0 ? (
          mockTokens.map((token) => (
            <TokenCard 
              key={token.id}
              businessName={token.businessName}
              tokenName={token.tokenName}
              balance={token.balance}
              icon={token.icon}
              color={token.color}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No loyalty programs yet</h3>
            <p className="text-gray-600 mb-6">
              Start earning rewards by scanning QR codes at participating businesses
            </p>
          </div>
        )}
      </div>
    </div>
  )
}