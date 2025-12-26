import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAvailableRewards, redeemReward, phoneToPartyId } from '../lib/canton'

export function useRewards(customerPhone: string) {
  const customerParty = phoneToPartyId(customerPhone)

  return useQuery({
    queryKey: ['rewards', customerParty],
    queryFn: () => getAvailableRewards(customerParty),
    enabled: !!customerPhone,
  })
}

export function useRedeemReward(customerPhone: string) {
  const customerParty = phoneToPartyId(customerPhone)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      tokenContractId: string
      rewardId: string
      rewardName: string
      tokenCost: number
    }) => {
      const result = await redeemReward({
        customerParty,
        ...data,
      })

      // Save redemption to database
      await fetch('/api/redemptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerParty,
          rewardId: data.rewardId,
          tokensCost: data.tokenCost,
        }),
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', customerParty] })
      queryClient.invalidateQueries({ queryKey: ['rewards', customerParty] })
    },
  })
}
