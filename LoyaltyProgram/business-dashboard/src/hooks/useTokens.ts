'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { issueTokens, getBusinessCustomers } from '@/lib/contracts'

export function useTokenIssuance(businessParty: string, programContractId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      customerPhone: string
      amount: number
      reason: string
    }) => {
      const result = await issueTokens({
        businessParty,
        programContractId,
        customerPhone: data.customerPhone,
        amount: data.amount,
        reason: data.reason,
      })

      // Save transaction to database
      await fetch('/api/tokens/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessParty,
          customerParty: result.customerParty,
          amount: data.amount,
          reason: data.reason,
          tokenContractId: result.tokenContractId,
        }),
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', businessParty] })
      queryClient.invalidateQueries({ queryKey: ['stats', businessParty] })
    },
  })
}

export function useCustomers(businessParty: string) {
  return useQuery({
    queryKey: ['customers', businessParty],
    queryFn: async () => {
      const customers = await getBusinessCustomers(businessParty)

      // Fetch additional customer info from database
      const customerData = await fetch(`/api/customers?businessParty=${businessParty}`).then(r => r.json())

      return customers.map(c => ({
        contractId: c.contractId,
        party: c.payload.customer,
        name: customerData.find((cd: any) => cd.cantonPartyId === c.payload.customer)?.fullName || 'Unknown',
        phone: customerData.find((cd: any) => cd.cantonPartyId === c.payload.customer)?.phone || 'Unknown',
        balance: c.payload.balance,
        lastVisit: 'Recent', // TODO: Get from transaction history
      }))
    },
    enabled: !!businessParty,
  })
}
