import { useAuthStore } from '../store/authStore'
import { useRedeemReward } from '../hooks/useRewards'
import { useState } from 'react'

interface RewardCardProps {
  businessName: string
  rewardName: string
  cost: number
  description: string
  icon: string
  userBalance: number
  canRedeem: boolean
}

export default function RewardCard({
  businessName,
  rewardName,
  cost,
  description,
  icon,
  userBalance,
  canRedeem
}: RewardCardProps) {
  const { user } = useAuthStore()
  const redeemReward = useRedeemReward(user?.phone || '')
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleRedeem = async () => {
    if (!canRedeem) return
    
    const confirmed = confirm(`Redeem ${rewardName} for ${cost} points?`)
    if (!confirmed) return

    setIsRedeeming(true)
    try {
      // TODO: Get actual token contract ID from wallet
      await redeemReward.mutateAsync({
        tokenContractId: 'token-contract-id', // Need to fetch from wallet
        rewardId: `reward-${Date.now()}`,
        rewardName,
        tokenCost: cost,
      })
      
      alert('Redemption successful! Show this to the business.')
    } catch (error) {
      console.error('Redemption error:', error)
      alert('Failed to redeem reward. Please try again.')
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${!canRedeem ? 'opacity-60' : ''}`}>
      <div className="p-4 flex gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{businessName}</p>
              <h3 className="font-bold text-gray-900 mt-1">{rewardName}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <span className="font-bold text-indigo-600">{cost}</span>
              <span className="text-sm text-gray-500">points</span>
              {!canRedeem && (
                <span className="ml-2 text-xs text-red-500">
                  (Need {cost - userBalance} more)
                </span>
              )}
            </div>
            
            <button
              onClick={handleRedeem}
              disabled={!canRedeem || isRedeeming}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                canRedeem && !isRedeeming
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isRedeeming ? 'Redeeming...' : canRedeem ? 'Redeem' : 'Locked'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
