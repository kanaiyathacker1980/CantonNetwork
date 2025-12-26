import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: {
    phone: string
    name: string
    cantonPartyId: string
  } | null
  login: (phone: string, name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (phone: string, name: string) => {
    // TODO: Integrate with Canton Network to create/get party ID
    const cantonPartyId = `customer-${phone.replace(/\D/g, '')}`
    set({ 
      isAuthenticated: true, 
      user: { phone, name, cantonPartyId } 
    })
  },
  logout: () => set({ isAuthenticated: false, user: null })
}))
