import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomerTokens, phoneToPartyId } from '../lib/canton'

export function useWallet(customerPhone: string) {
  const customerParty = phoneToPartyId(customerPhone)

  return useQuery({
    queryKey: ['wallet', customerParty],
    queryFn: () => getCustomerTokens(customerParty),
    enabled: !!customerPhone,
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

export function useWalletStats(customerPhone: string) {
  const { data: tokens } = useWallet(customerPhone)

  const totalBalance = tokens?.reduce((sum, token) => sum + token.balance, 0) || 0
  const totalPrograms = tokens?.length || 0
  const activeBusinesses = new Set(tokens?.map(t => t.business)).size

  return {
    totalBalance,
    totalPrograms,
    activeBusinesses,
  }
}
