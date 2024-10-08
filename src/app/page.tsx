'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Leaf, Scan, Users, Factory, Store, ShoppingCart } from 'lucide-react'
import Appbar from '@/components/layout/Appbar'

export default function Home() {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [productId, setProductId] = useState('')

  const handleProductSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the product search
    console.log('Searching for product:', productId)
    // Reset the input
    setProductId('')
  }

  return (
    <>
      <Appbar />

      <main className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Revolutionizing</span>
            <span className="block text-green-600">Agricultural Supply Chains</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            FarmChain leverages blockchain technology to bring transparency, traceability, and efficiency to the agricultural supply chain.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Our Supply Chain Participants</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Farmers</h3>
              <p className="text-gray-600 text-center">The backbone of our supply chain, producing high-quality crops.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <Factory className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processors</h3>
              <p className="text-gray-600 text-center">Transforming raw produce into value-added products.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <Store className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Retailers</h3>
              <p className="text-gray-600 text-center">Bringing products to consumers through various channels.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <ShoppingCart className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consumers</h3>
              <p className="text-gray-600 text-center">Enjoying transparent, traceable, and quality products.</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Track Your Product</h2>
          <div className="max-w-md mx-auto">
            <form onSubmit={handleProductSearch} className="flex items-center">
              <Input
                type="text"
                placeholder="Enter Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2">
                Track
              </Button>
              <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <Scan className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                    {/* Placeholder for QR code scanner */}
                    <p className="text-gray-500">QR Code Scanner Placeholder</p>
                  </div>
                </DialogContent>
              </Dialog>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Why Choose FarmChain?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Traceability</h3>
              <p className="text-gray-600">Track your produce from farm to table with our blockchain-powered system.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">Ensure fair practices and build trust with consumers through open data.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Streamline operations and reduce waste in the agricultural supply chain.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}