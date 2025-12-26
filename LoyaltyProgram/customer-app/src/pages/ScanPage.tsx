import { useState } from 'react'
import QRScanner from '../components/QRScanner'

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleScan = (data: string) => {
    setResult(data)
    setScanning(false)
    
    try {
      const parsed = JSON.parse(data)
      if (parsed.type === 'loyalty_issue') {
        // TODO: Handle token issuance flow
        alert(`Scanned business: ${parsed.businessId}`)
      }
    } catch (e) {
      alert('Invalid QR code')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
        <p className="text-gray-600 text-sm mt-1">Scan to earn or redeem points</p>
      </div>

      {/* Scanner */}
      <div className="p-4">
        {!scanning ? (
          <div className="space-y-4">
            <button
              onClick={() => setScanning(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Start Scanning
            </button>

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="font-semibold text-green-800 mb-1">Last Scan Result:</p>
                <p className="text-sm text-green-700 break-all">{result}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <QRScanner onScan={handleScan} />
            <button
              onClick={() => setScanning(false)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">How to Use</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Tap "Start Scanning" and point camera at QR code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Business QR codes let you earn points at checkout</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>Reward QR codes let you redeem points for items</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
