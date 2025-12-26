'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBusinessProfile } from '@/lib/contracts'

export function useBusinessOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      clerkUserId: string
      businessName: string
      category: string
      location: string
      email: string
      phone: string
      programName: string
      tokenName: string
      tokenSymbol: string
      description: string
    }) => {
      const result = await createBusinessProfile(data)

      // Save to database
      await fetch('/api/business/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: data.clerkUserId,
          businessName: data.businessName,
          category: data.category,
          location: data.location,
          email: data.email,
          phone: data.phone,
          cantonPartyId: result.businessParty,
          programName: data.programName,
          tokenName: data.tokenName,
          tokenSymbol: data.tokenSymbol,
          description: data.description,
          cantonProgramId: result.programId,
        }),
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] })
    },
  })
}
