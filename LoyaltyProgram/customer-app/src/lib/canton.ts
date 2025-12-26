// Canton Network Ledger API Client for Customer App
// Documentation: https://docs.daml.com/json-api/index.html

const CANTON_LEDGER_URL = import.meta.env.VITE_CANTON_LEDGER_URL || 'http://localhost:6865'

export interface TokenBalance {
  business: string
  customer: string
  programName: string
  tokenName: string
  tokenSymbol: string
  balance: number
  isLocked: boolean
  businessName?: string
  icon?: string
  color?: string
}

export interface Reward {
  business: string
  rewardId: string
  name: string
  description: string
  tokenCost: number
  category: string
  inventory: number
  imageUrl: string | null
  terms: string | null
  isActive: boolean
  businessName?: string
  icon?: string
}

// Canton Ledger API Client
class CantonClient {
  private baseUrl: string
  private token?: string

  constructor(baseUrl: string = CANTON_LEDGER_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Canton API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async query<T>(
    templateId: { moduleName: string; entityName: string },
    query?: any
  ): Promise<Array<{ contractId: string; payload: T }>> {
    const response = await this.request<{ result: Array<{ contractId: string; payload: T }> }>(
      '/v1/query',
      {
        method: 'POST',
        body: JSON.stringify({
          templateIds: [templateId],
          query,
        }),
      }
    )
    return response.result || []
  }

  async exercise<TArg, TResult>(
    templateId: { moduleName: string; entityName: string },
    contractId: string,
    choice: string,
    argument: TArg,
    actAs: string[]
  ): Promise<any> {
    return this.request('/v1/exercise', {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        contractId,
        choice,
        argument,
        meta: { actAs },
      }),
    })
  }
}

export const cantonClient = new CantonClient()

export const Templates = {
  LoyaltyToken: {
    moduleName: 'LoyaltyToken',
    entityName: 'LoyaltyToken',
  },
  Reward: {
    moduleName: 'Reward',
    entityName: 'Reward',
  },
  RedemptionReceipt: {
    moduleName: 'LoyaltyToken',
    entityName: 'RedemptionReceipt',
  },
}

// Get all token balances for a customer
export async function getCustomerTokens(customerParty: string): Promise<TokenBalance[]> {
  const tokens = await cantonClient.query<TokenBalance>(Templates.LoyaltyToken, {
    customer: customerParty,
  })

  // Fetch business metadata
  const businessData = await fetch('/api/businesses').then(r => r.json())

  return tokens.map(t => {
    const business = businessData.find((b: any) => b.cantonPartyId === t.payload.business)
    return {
      ...t.payload,
      businessName: business?.businessName || 'Unknown Business',
      icon: getCategoryIcon(business?.category || 'other'),
      color: getCategoryColor(business?.category || 'other'),
    }
  })
}

// Get available rewards for a customer
export async function getAvailableRewards(customerParty: string): Promise<Reward[]> {
  // Get customer's tokens first
  const tokens = await getCustomerTokens(customerParty)

  // Get all active rewards
  const allRewards = await cantonClient.query<Reward>(Templates.Reward, {
    isActive: true,
  })

  // Fetch business metadata
  const businessData = await fetch('/api/businesses').then(r => r.json())

  return allRewards.map(r => {
    const business = businessData.find((b: any) => b.cantonPartyId === r.payload.business)
    const customerBalance = tokens.find(t => t.business === r.payload.business)?.balance || 0

    return {
      ...r.payload,
      businessName: business?.businessName || 'Unknown Business',
      icon: getRewardIcon(r.payload.category),
      userBalance: customerBalance,
      canRedeem: customerBalance >= r.payload.tokenCost,
    }
  })
}

// Redeem a reward
export async function redeemReward(data: {
  customerParty: string
  tokenContractId: string
  rewardId: string
  rewardName: string
  tokenCost: number
}) {
  const result = await cantonClient.exercise(
    Templates.LoyaltyToken,
    data.tokenContractId,
    'RedeemTokens',
    {
      rewardId: data.rewardId,
      rewardName: data.rewardName,
      cost: data.tokenCost,
    },
    [data.customerParty]
  )

  return result
}

// Transfer tokens to another customer
export async function transferTokens(data: {
  customerParty: string
  tokenContractId: string
  recipientParty: string
  amount: number
}) {
  const result = await cantonClient.exercise(
    Templates.LoyaltyToken,
    data.tokenContractId,
    'TransferTokens',
    {
      recipient: data.recipientParty,
      amount: data.amount,
    },
    [data.customerParty]
  )

  return result
}

// Helper functions
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    coffee_shop: '☕',
    restaurant: '🍽️',
    gym: '💪',
    salon: '💇',
    retail: '🛍️',
    other: '🎁',
  }
  return icons[category] || '🎁'
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    coffee_shop: 'from-amber-500 to-orange-600',
    restaurant: 'from-red-500 to-pink-600',
    gym: 'from-blue-500 to-cyan-600',
    salon: 'from-pink-500 to-rose-600',
    retail: 'from-purple-500 to-indigo-600',
    other: 'from-gray-500 to-slate-600',
  }
  return colors[category] || 'from-gray-500 to-slate-600'
}

function getRewardIcon(category: string): string {
  const icons: Record<string, string> = {
    FreeItem: '🎁',
    Discount: '💰',
    ServiceUpgrade: '⭐',
    Experience: '🎉',
    Merchandise: '👕',
    FoodDrink: '🍔',
  }
  return icons[category] || '🎁'
}

export function phoneToPartyId(phone: string): string {
  return `customer-${phone.replace(/\D/g, '')}`
}
