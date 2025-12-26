import { useAuthStore } from '../store/authStore'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-12">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Programs" value="3" />
          <StatCard label="Total Points" value="135" />
          <StatCard label="Redeemed" value="12" />
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <MenuItem icon="🎟️" label="Transaction History" />
          <MenuItem icon="⚙️" label="Settings" />
          <MenuItem icon="🔔" label="Notifications" />
          <MenuItem icon="❓" label="Help & Support" />
          <MenuItem icon="📄" label="Terms & Privacy" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          Sign Out
        </button>

        {/* Canton Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Canton Network</p>
          <p className="mt-1">Party ID: {user?.cantonPartyId}</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  )
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b last:border-0">
      <span className="text-2xl">{icon}</span>
      <span className="flex-1 text-left font-medium text-gray-900">{label}</span>
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
