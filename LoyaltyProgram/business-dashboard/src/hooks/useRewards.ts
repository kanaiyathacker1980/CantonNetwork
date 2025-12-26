'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBusinessRewards, createReward, updateReward } from '@/lib/contracts'

export function useRewards(businessParty: string) {
  return useQuery({
    queryKey: ['rewards', businessParty],
    queryFn: () => getBusinessRewards(businessParty),
    enabled: !!businessParty,
  })
}

export function useCreateReward(businessParty: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      description: string
      tokenCost: number
      category: string
      inventory: number
      imageUrl?: string
      terms?: string
    }) => {
      const rewardId = `reward-${Date.now()}`
      const contractId = await createReward({
        businessParty,
        rewardId,
        ...data,
      })

      // Save to database
      await fetch('/api/rewards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessParty,
          rewardId,
          cantonContractId: contractId,
          ...data,
        }),
      })

      return contractId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards', businessParty] })
    },
  })
}

export function useUpdateReward(businessParty: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      rewardContractId: string
      updates: {
        newName?: string
        newDescription?: string
        newTokenCost?: number
        newInventory?: number
        newIsActive?: boolean
      }
    }) => {
      return updateReward({
        businessParty,
        ...data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards', businessParty] })
    },
  })
}
