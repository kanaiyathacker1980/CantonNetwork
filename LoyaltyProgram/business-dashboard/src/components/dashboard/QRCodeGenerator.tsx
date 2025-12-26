"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QRCode from "qrcode"

export default function QRCodeGenerator() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Mock business ID - replace with actual from Canton
  const businessId = "joe-coffee-123"
  const qrData = JSON.stringify({
    type: "loyalty_issue",
    businessId,
    timestamp: Date.now()
  })

  useEffect(() => {
    generateQR()
  }, [])

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrDataUrl(url)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = `loyalty-qr-${businessId}.png`
    link.href = qrDataUrl
    link.click()
  }

  const printQR = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0;
                flex-direction: column;
              }
              h2 { font-family: Arial; text-align: center; }
              img { max-width: 400px; }
            </style>
          </head>
          <body>
            <h2>Scan to Earn Points</h2>
            <img src="${qrDataUrl}" />
            <p style="text-align: center; font-family: Arial;">
              Show this code at checkout
            </p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* QR Code Display */}
      <Card>
        <CardHeader>
          <CardTitle>Your Checkout QR Code</CardTitle>
          <CardDescription>
            Customers scan this to earn loyalty tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {qrDataUrl && (
            <div className="border-4 border-gray-200 rounded-lg p-4 bg-white">
              <img src={qrDataUrl} alt="Loyalty QR Code" className="w-64 h-64" />
            </div>
          )}
          
          <div className="flex gap-3 w-full">
            <Button onClick={downloadQR} variant="outline" className="flex-1">
              Download QR
            </Button>
            <Button onClick={printQR} className="flex-1">
              Print QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            Set up your QR code for token issuance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InstructionStep 
            number={1}
            title="Print or Display"
            description="Print the QR code or display it on a tablet at your checkout counter"
          />
          <InstructionStep 
            number={2}
            title="Customer Scans"
            description="Customers open the Canton Loyalty app and scan the QR code"
          />
          <InstructionStep 
            number={3}
            title="Enter Amount"
            description="You or the customer enters the number of tokens to award"
          />
          <InstructionStep 
            number={4}
            title="Confirm Issue"
            description="Confirm on your device and tokens are instantly credited"
          />
        </CardContent>
      </Card>

      {/* Alternative Methods */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Alternative Methods</CardTitle>
          <CardDescription>
            Other ways to issue tokens to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <MethodCard 
              title="Manual Entry"
              description="Enter customer phone number manually in the 'Issue Tokens' tab"
            />
            <MethodCard 
              title="Customer QR"
              description="Customer shows their wallet QR code for you to scan"
            />
            <MethodCard 
              title="API Integration"
              description="Integrate with your POS system for automatic token issuance"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InstructionStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function MethodCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}
