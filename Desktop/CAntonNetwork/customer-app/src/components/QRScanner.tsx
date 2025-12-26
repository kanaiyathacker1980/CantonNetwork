import { useEffect, useRef } from 'react'

interface QRScannerProps {
  onScan: (data: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // TODO: Integrate with @zxing/library for actual QR code scanning
        // For now, simulate scan after 3 seconds
        setTimeout(() => {
          onScan(JSON.stringify({
            type: 'loyalty_issue',
            businessId: 'test-business-123',
            timestamp: Date.now()
          }))
        }, 3000)
      } catch (error) {
        console.error('Error accessing camera:', error)
        alert('Failed to access camera. Please grant camera permissions.')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onScan])

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '1' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Scanning overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-4 border-white rounded-2xl relative">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1 rounded-br-2xl"></div>
          
          {/* Scanning line animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-1 w-full bg-indigo-500 animate-scan"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white text-sm font-semibold bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
          Position QR code within frame
        </p>
      </div>
    </div>
  )
}
