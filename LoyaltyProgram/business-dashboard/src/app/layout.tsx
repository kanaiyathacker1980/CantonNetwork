import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"
import QueryProvider from "@/providers/QueryProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canton Loyalty - Business Dashboard",
  description: "Manage your loyalty program on Canton Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
