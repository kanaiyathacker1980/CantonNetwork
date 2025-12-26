'use client'

import { useQuery } from '@tanstack/react-query'
import { getBusinessStats } from '@/lib/contracts'

export function useBusinessStats(businessParty: string) {
  return useQuery({
    queryKey: ['stats', businessParty],
    queryFn: () => getBusinessStats(businessParty),
    enabled: !!businessParty,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}
