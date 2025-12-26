"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2 } from "lucide-react"

// Mock rewards data
const mockRewards = [
  { id: "1", name: "Free Regular Coffee", cost: 10, inventory: 100, category: "FreeItem", isActive: true },
  { id: "2", name: "Free Pastry", cost: 5, inventory: 50, category: "FreeItem", isActive: true },
  { id: "3", name: "10% Discount", cost: 3, inventory: 999, category: "Discount", isActive: true },
  { id: "4", name: "Free Upgrade", cost: 8, inventory: 75, category: "ServiceUpgrade", isActive: false },
]

export default function RewardsManager() {
  const { toast } = useToast()
  const [rewards, setRewards] = useState(mockRewards)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    inventory: "",
    category: "FreeItem"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Deploy reward contract to Canton Network
      
      toast({
        title: editingReward ? "Reward Updated" : "Reward Created",
        description: `${formData.name} has been ${editingReward ? 'updated' : 'created'} successfully.`,
      })
      
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save reward. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cost: "",
      inventory: "",
      category: "FreeItem"
    })
    setEditingReward(null)
  }

  const handleEdit = (reward: any) => {
    setEditingReward(reward)
    setFormData({
      name: reward.name,
      description: "",
      cost: reward.cost.toString(),
      inventory: reward.inventory.toString(),
      category: reward.category
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (rewardId: string) => {
    if (confirm("Are you sure you want to delete this reward?")) {
      try {
        // TODO: Archive reward contract on Canton
        toast({
          title: "Reward Deleted",
          description: "The reward has been removed.",
        })
        setRewards(rewards.filter(r => r.id !== rewardId))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete reward.",
          variant: "destructive"
        })
      }
    }
  }

  const toggleActive = async (rewardId: string) => {
    try {
      // TODO: Toggle reward active status on Canton
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, isActive: !r.isActive } : r
      ))
      toast({
        title: "Status Updated",
        description: "Reward status has been changed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rewards Catalog</h2>
          <p className="text-gray-600">Manage what customers can redeem</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReward ? 'Edit Reward' : 'Create New Reward'}</DialogTitle>
              <DialogDescription>
                Set up a new reward that customers can redeem with their tokens
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Reward Name *</Label>
                <Input
                  id="name"
                  placeholder="Free Regular Coffee"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Any size regular coffee, hot or iced"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cost">Token Cost *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="1"
                  placeholder="10"
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="inventory">Inventory *</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  placeholder="100"
                  required
                  value={formData.inventory}
                  onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FreeItem">Free Item</SelectItem>
                    <SelectItem value="Discount">Discount</SelectItem>
                    <SelectItem value="ServiceUpgrade">Service Upgrade</SelectItem>
                    <SelectItem value="Experience">Experience</SelectItem>
                    <SelectItem value="Merchandise">Merchandise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingReward ? 'Update' : 'Create'} Reward
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rewards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card key={reward.id} className={!reward.isActive ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {reward.category}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(reward)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(reward.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Token Cost:</span>
                  <span className="font-bold text-green-600">{reward.cost} tokens</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inventory:</span>
                  <span className="font-medium">{reward.inventory} available</span>
                </div>
                <Button
                  variant={reward.isActive ? "outline" : "default"}
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => toggleActive(reward.id)}
                >
                  {reward.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
