// Business contract operations using Canton API
import { cantonClient, Templates, businessToPartyId, phoneToPartyId } from './canton'

export interface BusinessProfilePayload {
  businessId: string
  businessName: string
  category: string
  location: string
  email: string
  phone: string
  createdAt: string
  isActive: boolean
}

export interface LoyaltyProgramPayload {
  business: string
  programName: string
  tokenName: string
  tokenSymbol: string
  description: string
  totalIssued: number
  totalRedeemed: number
  isActive: boolean
}

export interface RewardPayload {
  business: string
  rewardId: string
  name: string
  description: string
  tokenCost: number
  category: string
  inventory: number
  imageUrl: string | null
  terms: string | null
  validFrom: string
  validUntil: string | null
  isActive: boolean
}

export interface TokenBalancePayload {
  business: string
  customer: string
  programName: string
  tokenName: string
  tokenSymbol: string
  balance: number
  isLocked: boolean
}

// Create a new business profile and loyalty program
export async function createBusinessProfile(data: {
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
}) {
  // 1. Allocate a party for the business
  const partyIdHint = businessToPartyId(data.businessName, data.email)
  const party = await cantonClient.allocateParty(data.businessName, partyIdHint)

  // 2. Create BusinessProfile contract
  const businessProfile = await cantonClient.create<BusinessProfilePayload>(
    Templates.BusinessProfile,
    {
      businessId: party.party,
      businessName: data.businessName,
      category: data.category,
      location: data.location,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      isActive: true,
    },
    [party.party]
  )

  // 3. Create LoyaltyProgram via BusinessProfile choice
  const programResult = await cantonClient.exercise<
    {
      programName: string
      tokenName: string
      tokenSymbol: string
      description: string
    },
    { _1: string; _2: string }
  >(
    Templates.BusinessProfile,
    businessProfile.contractId,
    'CreateLoyaltyProgram',
    {
      programName: data.programName,
      tokenName: data.tokenName,
      tokenSymbol: data.tokenSymbol,
      description: data.description,
    },
    [party.party]
  )

  // Extract program contract ID from events
  const programContractId = programResult.events
    .find(e => e.created?.some(c => c.payload.programName === data.programName))
    ?.created?.[0]?.contractId

  return {
    businessParty: party.party,
    businessProfileId: businessProfile.contractId,
    programId: programContractId,
  }
}

// Issue tokens to a customer
export async function issueTokens(data: {
  businessParty: string
  programContractId: string
  customerPhone: string
  amount: number
  reason: string
}) {
  // 1. Allocate party for customer if not exists
  const customerPartyId = phoneToPartyId(data.customerPhone)
  let customerParty: string

  try {
    const party = await cantonClient.allocateParty(data.customerPhone, customerPartyId)
    customerParty = party.party
  } catch (error) {
    // Party might already exist
    customerParty = customerPartyId
  }

  // 2. Issue tokens via LoyaltyProgram choice
  const result = await cantonClient.exercise<
    {
      customer: string
      amount: number
      reason: string
    },
    { _1: string; _2: string }
  >(
    Templates.LoyaltyProgram,
    data.programContractId,
    'IssueTokens',
    {
      customer: customerParty,
      amount: data.amount,
      reason: data.reason,
    },
    [data.businessParty]
  )

  // Extract token contract ID from events
  const tokenContractId = result.events
    .find(e => e.created?.some(c => 'balance' in c.payload))
    ?.created?.[0]?.contractId

  return {
    customerParty,
    tokenContractId,
    newProgramContractId: result.exerciseResult._1,
  }
}

// Create a reward
export async function createReward(data: {
  businessParty: string
  rewardId: string
  name: string
  description: string
  tokenCost: number
  category: string
  inventory: number
  imageUrl?: string
  terms?: string
}) {
  const result = await cantonClient.create<RewardPayload>(
    Templates.Reward,
    {
      business: data.businessParty,
      rewardId: data.rewardId,
      name: data.name,
      description: data.description,
      tokenCost: data.tokenCost,
      category: data.category,
      inventory: data.inventory,
      imageUrl: data.imageUrl || null,
      terms: data.terms || null,
      validFrom: new Date().toISOString(),
      validUntil: null,
      isActive: true,
    },
    [data.businessParty]
  )

  return result.contractId
}

// Update a reward
export async function updateReward(data: {
  businessParty: string
  rewardContractId: string
  updates: {
    newName?: string
    newDescription?: string
    newTokenCost?: number
    newInventory?: number
    newIsActive?: boolean
  }
}) {
  const result = await cantonClient.exercise(
    Templates.Reward,
    data.rewardContractId,
    'UpdateReward',
    {
      newName: data.updates.newName ? { tag: 'Some', value: data.updates.newName } : { tag: 'None', value: {} },
      newDescription: data.updates.newDescription ? { tag: 'Some', value: data.updates.newDescription } : { tag: 'None', value: {} },
      newTokenCost: data.updates.newTokenCost !== undefined ? { tag: 'Some', value: data.updates.newTokenCost } : { tag: 'None', value: {} },
      newInventory: data.updates.newInventory !== undefined ? { tag: 'Some', value: data.updates.newInventory } : { tag: 'None', value: {} },
      newIsActive: data.updates.newIsActive !== undefined ? { tag: 'Some', value: data.updates.newIsActive } : { tag: 'None', value: {} },
    },
    [data.businessParty]
  )

  return result
}

// Query all rewards for a business
export async function getBusinessRewards(businessParty: string): Promise<Array<{ contractId: string; payload: RewardPayload }>> {
  return cantonClient.query<RewardPayload>(Templates.Reward, {
    business: businessParty,
  })
}

// Query loyalty program for a business
export async function getBusinessProgram(businessParty: string): Promise<{ contractId: string; payload: LoyaltyProgramPayload } | null> {
  const programs = await cantonClient.query<LoyaltyProgramPayload>(Templates.LoyaltyProgram, {
    business: businessParty,
  })
  return programs[0] || null
}

// Query all customers' token balances for a business
export async function getBusinessCustomers(businessParty: string): Promise<Array<{ contractId: string; payload: TokenBalancePayload }>> {
  return cantonClient.query<TokenBalancePayload>(Templates.LoyaltyToken, {
    business: businessParty,
  })
}

// Get business statistics
export async function getBusinessStats(businessParty: string) {
  const [program, customers, rewards] = await Promise.all([
    getBusinessProgram(businessParty),
    getBusinessCustomers(businessParty),
    getBusinessRewards(businessParty),
  ])

  const totalCustomers = new Set(customers.map(c => c.payload.customer)).size
  const totalTokensIssued = program?.payload.totalIssued || 0
  const totalRedeemed = program?.payload.totalRedeemed || 0
  const activeRewards = rewards.filter(r => r.payload.isActive).length

  return {
    totalCustomers,
    totalTokensIssued,
    totalRedeemed,
    activeRewards,
    engagementRate: totalCustomers > 0 ? ((totalRedeemed / totalTokensIssued) * 100).toFixed(1) : '0',
  }
}
