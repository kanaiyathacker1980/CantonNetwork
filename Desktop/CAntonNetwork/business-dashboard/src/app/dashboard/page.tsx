"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Users, Gift, TrendingUp, Plus } from "lucide-react"
import StatsOverview from "@/components/dashboard/StatsOverview"
import TokenIssuance from "@/components/dashboard/TokenIssuance"
import RewardsManager from "@/components/dashboard/RewardsManager"
import CustomersTable from "@/components/dashboard/CustomersTable"
import QRCodeGenerator from "@/components/dashboard/QRCodeGenerator"

export default function DashboardPage() {
  // Mock user for development (auth disabled)
  const user = { firstName: "Demo Business" }
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Canton Loyalty</h1>
            <p className="text-sm text-gray-600">Welcome back, {user.firstName}!</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/settings")}>
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="issue">
              <Plus className="h-4 w-4 mr-2" />
              Issue Tokens
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="issue">
            <TokenIssuance />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsManager />
          </TabsContent>

          <TabsContent value="customers">
            <CustomersTable />
          </TabsContent>

          <TabsContent value="qr">
            <QRCodeGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
