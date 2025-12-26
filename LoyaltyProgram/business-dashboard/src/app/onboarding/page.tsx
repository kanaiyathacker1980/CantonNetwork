"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding"

export default function OnboardingPage() {
  const router = useRouter()
  // Mock user for development (auth disabled)
  const user = { id: "demo-user-id", primaryEmailAddress: { emailAddress: "demo@example.com" } }
  const { toast } = useToast()
  const createBusiness = useBusinessOnboarding()
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    location: "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    programName: "",
    tokenName: "",
    tokenSymbol: "",
    description: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createBusiness.mutateAsync({
        clerkUserId: user!.id,
        ...formData,
      })
      
      toast({
        title: "Success!",
        description: "Your business profile has been created on Canton Network.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      console.error('Onboarding error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create business profile.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Set Up Your Business</CardTitle>
          <CardDescription>
            Tell us about your business and create your loyalty program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Joe's Coffee Shop"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee_shop">Coffee Shop</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="salon">Salon</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="123 Main St, San Francisco, CA"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1-555-0100"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Loyalty Program Details</h3>
              
              <div>
                <Label htmlFor="programName">Program Name *</Label>
                <Input
                  id="programName"
                  placeholder="Coffee Rewards"
                  required
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tokenName">Token Name *</Label>
                <Input
                  id="tokenName"
                  placeholder="Joe's Coffee Points"
                  required
                  value={formData.tokenName}
                  onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="JCP"
                  maxLength={5}
                  required
                  value={formData.tokenSymbol}
                  onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <Label htmlFor="description">Program Description *</Label>
                <Input
                  id="description"
                  placeholder="Earn points with every purchase..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createBusiness.isPending}>
              {createBusiness.isPending ? "Creating on Canton Network..." : "Create Business Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
