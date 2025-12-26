// Canton Network Ledger API Client
// Documentation: https://docs.daml.com/json-api/index.html

import { z } from 'zod'

const CANTON_LEDGER_URL = process.env.NEXT_PUBLIC_CANTON_LEDGER_URL || 'http://localhost:6865'

// Type definitions for Canton API
export interface CantonParty {
  party: string
  displayName?: string
}

export interface ContractId {
  contractId: string
}

export interface CreateResult<T> {
  contractId: string
  payload: T
}

export interface ExerciseResult<T> {
  exerciseResult: T
  events: Array<{
    created?: Array<{ contractId: string; payload: any }>
    archived?: Array<{ contractId: string }>
  }>
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

  // Allocate a new party on the ledger
  async allocateParty(displayName: string, partyIdHint?: string): Promise<CantonParty> {
    return this.request<CantonParty>('/v1/parties/allocate', {
      method: 'POST',
      body: JSON.stringify({
        identifierHint: partyIdHint || displayName.toLowerCase().replace(/\s+/g, '-'),
        displayName,
      }),
    })
  }

  // Create a new contract
  async create<T>(
    templateId: { moduleName: string; entityName: string },
    payload: T,
    actAs: string[]
  ): Promise<CreateResult<T>> {
    return this.request<CreateResult<T>>('/v1/create', {
      method: 'POST',
      body: JSON.stringify({
        templateId,
        payload,
        meta: { actAs },
      }),
    })
  }

  // Exercise a choice on a contract
  async exercise<TArg, TResult>(
    templateId: { moduleName: string; entityName: string },
    contractId: string,
    choice: string,
    argument: TArg,
    actAs: string[]
  ): Promise<ExerciseResult<TResult>> {
    return this.request<ExerciseResult<TResult>>('/v1/exercise', {
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

  // Query active contracts
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

  // Fetch a specific contract by ID
  async fetch<T>(
    templateId: { moduleName: string; entityName: string },
    contractId: string
  ): Promise<{ contractId: string; payload: T } | null> {
    const response = await this.request<{ result: { contractId: string; payload: T } | null }>(
      '/v1/fetch',
      {
        method: 'POST',
        body: JSON.stringify({
          contractId,
        }),
      }
    )
    return response.result
  }

  // Stream events (for real-time updates)
  async *streamEvents(offset?: string) {
    const url = `${this.baseUrl}/v1/stream/query${offset ? `?offset=${offset}` : ''}`
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'text/event-stream',
      },
    })

    if (!response.ok) {
      throw new Error(`Stream error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader available')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          yield data
        }
      }
    }
  }
}

// Singleton instance
export const cantonClient = new CantonClient()

// Template IDs for our contracts
export const Templates = {
  BusinessProfile: {
    moduleName: 'BusinessProfile',
    entityName: 'BusinessProfile',
  },
  LoyaltyProgram: {
    moduleName: 'BusinessProfile',
    entityName: 'LoyaltyProgram',
  },
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
} as const

// Helper to convert phone number to party ID hint
export function phoneToPartyId(phone: string): string {
  return `customer-${phone.replace(/\D/g, '')}`
}

export function businessToPartyId(businessName: string, email: string): string {
  return `business-${businessName.toLowerCase().replace(/\s+/g, '-')}-${email.split('@')[0]}`
}
