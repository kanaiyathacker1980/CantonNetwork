"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

export default function CustomersTable({ businessParty }: { businessParty: string }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for development
  const mockCustomers = [
    { id: 1, name: "Alice Johnson", phone: "+1234567890", balance: 125, lastVisit: "2 days ago" },
    { id: 2, name: "Bob Smith", phone: "+1234567891", balance: 89, lastVisit: "5 days ago" },
    { id: 3, name: "Carol White", phone: "+1234567892", balance: 200, lastVisit: "1 week ago" },
  ]

  const filteredCustomers = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Customers</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchQuery ? 'No customers found' : 'No customers yet. Issue some tokens to get started!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Phone</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Token Balance</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.phone}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-green-600">{customer.balance}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {customer.lastVisit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
