interface TokenCardProps {
  businessName: string
  tokenName: string
  balance: number
  icon: string
  color: string
}

export default function TokenCard({ businessName, tokenName, balance, icon, color }: TokenCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm opacity-90">{businessName}</p>
          <h3 className="text-xl font-bold mt-1">{tokenName}</h3>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm opacity-90">Balance</p>
          <p className="text-4xl font-bold">{balance}</p>
        </div>
        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-4 py-2 rounded-lg font-semibold text-sm">
          View Details
        </button>
      </div>
    </div>
  )
}
