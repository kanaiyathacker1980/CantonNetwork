"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Coins } from "lucide-react"

export default function TokenIssuance({ businessParty, programContractId }: { businessParty: string; programContractId: string }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerPhone: "",
    amount: "",
    reason: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock token issuance - replace with actual Canton integration
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Tokens Issued!",
        description: `${formData.amount} tokens issued successfully on Canton Network.`,
      })

      // Reset form
      setFormData({
        customerPhone: "",
        amount: "",
        reason: ""
      })
    } catch (error) {
      console.error('Token issuance error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to issue tokens.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Issue Form */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Tokens</CardTitle>
          <CardDescription>
            Award loyalty tokens to your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerPhone">Customer Phone/ID *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+1-555-0100 or scan QR"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Or have customer scan their QR code
              </p>
            </div>

            <div>
              <Label htmlFor="amount">Token Amount *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="10"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                placeholder="Purchase, check-in, etc."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Coins className="h-4 w-4 mr-2" />
              {loading ? "Issuing on Canton..." : "Issue Tokens"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Commonly used token amounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <QuickActionButton 
            amount={5}
            label="Small Purchase"
            onClick={() => setFormData({ ...formData, amount: "5", reason: "Purchase" })}
          />
          <QuickActionButton 
            amount={10}
            label="Regular Purchase"
            onClick={() => setFormData({ ...formData, amount: "10", reason: "Purchase" })}
          />
          <QuickActionButton 
            amount={20}
            label="Large Purchase"
            onClick={() => setFormData({ ...formData, amount: "20", reason: "Purchase" })}
          />
          <QuickActionButton 
            amount={50}
            label="Welcome Bonus"
            onClick={() => setFormData({ ...formData, amount: "50", reason: "Welcome bonus" })}
          />
        </CardContent>
      </Card>

      {/* Recent Issuances */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Token Issuances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <IssuanceRecord 
              customer="+1-555-0123"
              amount={10}
              reason="Purchase"
              time="2 min ago"
            />
            <IssuanceRecord 
              customer="+1-555-0456"
              amount={5}
              reason="Check-in"
              time="15 min ago"
            />
            <IssuanceRecord 
              customer="+1-555-0789"
              amount={50}
              reason="Welcome bonus"
              time="1 hour ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickActionButton({ amount, label, onClick }: { amount: number; label: string; onClick: () => void }) {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-between" 
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className="font-bold text-green-600">{amount} tokens</span>
    </Button>
  )
}

function IssuanceRecord({ customer, amount, reason, time }: { customer: string; amount: number; reason: string; time: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-sm">{customer}</p>
        <p className="text-sm text-gray-600">{reason}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600">+{amount}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}
