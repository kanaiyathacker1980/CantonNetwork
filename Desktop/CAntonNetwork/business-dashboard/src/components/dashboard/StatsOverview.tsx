"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coins, Gift, TrendingUp } from "lucide-react"

export default function StatsOverview({ businessParty }: { businessParty: string }) {
  // Mock stats for development
  const stats = [
    {
      title: "Total Customers",
      value: "127",
      change: "+12% from last month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Tokens Issued",
      value: "3,456",
      change: "+8% from last month",
      icon: Coins,
      color: "text-green-600"
    },
    {
      title: "Rewards Redeemed",
      value: "89",
      change: "+23% from last month",
      icon: Gift,
      color: "text-purple-600"
    },
    {
      title: "Engagement Rate",
      value: "68%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem 
              customer="Alice Johnson"
              action="Earned 10 tokens"
              time="2 minutes ago"
            />
            <ActivityItem 
              customer="Bob Smith"
              action="Redeemed Free Coffee"
              time="15 minutes ago"
            />
            <ActivityItem 
              customer="Carol White"
              action="Earned 5 tokens"
              time="1 hour ago"
            />
            <ActivityItem 
              customer="David Brown"
              action="Transferred 3 tokens"
              time="2 hours ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityItem({ customer, action, time }: { customer: string; action: string; time: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-sm">{customer}</p>
        <p className="text-sm text-gray-600">{action}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}
