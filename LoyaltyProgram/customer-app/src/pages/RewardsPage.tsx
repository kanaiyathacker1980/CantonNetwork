import { useAuthStore } from '../store/authStore'
import { useRewards } from '../hooks/useRewards'
import RewardCard from '../components/RewardCard'

export default function RewardsPage() {
  const { user } = useAuthStore()
  const { data: rewards, isLoading } = useRewards(user?.phone || '')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rewards from Canton Network...</p>
        </div>
      </div>
    )
  }

  const availableRewards = rewards?.filter((r: any) => r.canRedeem) || []
  const lockedRewards = rewards?.filter((r: any) => !r.canRedeem) || []

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
        <p className="text-gray-600 text-sm mt-1">Redeem your points for great rewards</p>
      </div>

      {/* Available Rewards */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          Available Now
          <span className="text-sm font-normal text-gray-500">({availableRewards.length})</span>
        </h2>
        <div className="space-y-3">
          {availableRewards.map((reward) => (
            <RewardCard key={reward.id} {...reward} canRedeem={true} />
          ))}
        </div>
      </div>

      {/* Locked Rewards */}
      {lockedRewards.length > 0 && (
        <div className="px-4 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-gray-400">🔒</span>
            Locked
            <span className="text-sm font-normal text-gray-500">({lockedRewards.length})</span>
          </h2>
          <div className="space-y-3">
            {lockedRewards.map((reward: any, index: number) => (
              <RewardCard 
                key={index}
                businessName={reward.businessName || 'Unknown'}
                rewardName={reward.name}
                cost={reward.tokenCost}
                description={reward.description}
                icon={reward.icon || '🎁'}
                userBalance={reward.userBalance}
                canRedeem={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
           