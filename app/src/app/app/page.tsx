'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scan, Leaf } from 'lucide-react'
import AuthRedirectProvider from '@/providers/AuthRedirectProvider'

// Dummy data for product information
interface IProduct {
    id: string, name: string, farmer: string, harvestDate: string, processingDate: string, retailer: string, distributor: string
}

const dummyProducts: IProduct[] = [
    {
        id: "PROD001",
        name: 'Organic Apples',
        farmer: 'Green Acres Farm',
        harvestDate: '2023-09-15',
        processingDate: '2023-09-17',
        distributor: 'Fresh Fruits Co.',
        retailer: 'Wholesome Market'
    },
    {
        id: "PROD002",
        name: 'Free-Range Eggs',
        farmer: 'Happy Hens Farm',
        harvestDate: '2023-10-01',
        processingDate: '2023-10-02',
        distributor: 'Farm Fresh Distributors',
        retailer: 'Local Grocery'
    },
    {
        id: "PROD003",
        name: 'Organic Carrots',
        farmer: 'Sunny Fields Farm',
        harvestDate: '2023-10-10',
        processingDate: '2023-10-12',
        distributor: 'Fresh Produce Inc.',
        retailer: 'Farmers Market'
    },
    {
        id: "PROD004",
        name: 'Honey',
        farmer: 'Bee Happy Apiary',
        harvestDate: '2023-11-05',
        processingDate: '2023-11-07',
        distributor: 'Sweet Treats',
        retailer: 'Health Food Store'
    },
    {
        id: "PROD005",
        name: 'Organic Spinach',
        farmer: 'Leafy Greens Farm',
        harvestDate: '2023-12-01',
        processingDate: '2023-12-03',
        distributor: 'Fresh Veggies',
        retailer: 'Grocery Store'
    },
    {
        id: "PROD006",
        name: 'Local Honey',
        farmer: 'Beehive Farms',
        harvestDate: '2024-01-15',
        processingDate: '2024-01-17',
        distributor: 'Sweet Treats',
        retailer: 'Health Food Store'
    },
]

export default function DashboardPage() {
    const [productId, setProductId] = useState<string>('')
    const [productInfo, setProductInfo] = useState<IProduct | null>()
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)

    const handleProductSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const productSelection = dummyProducts.find(product => product.id == productId)
        const info = productSelection
        setProductInfo(info || null)
        if (!info) {
            alert('Product not found')
        }
    }

    const handleQRScan = () => {
        // Simulating QR scan by using a random product ID
        const product: IProduct = dummyProducts[Math.floor(Math.random() * dummyProducts.length)]
        setProductId(product.id)
        setProductInfo(product)
        setIsQRDialogOpen(false)
    }

    return (
        <AuthRedirectProvider>
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Product Tracking Dashboard</h1>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Track a Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProductSearch} className="flex items-center space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Enter Product ID"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button type="submit">Track</Button>
                                <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Scan className="h-5 w-5 mr-2" />
                                            Scan QR
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Scan QR Code</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                                            <Button onClick={handleQRScan}>Simulate QR Scan</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </form>
                        </CardContent>
                    </Card>

                    {productInfo && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold">Product Name</h3>
                                        <p>{productInfo.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Farmer</h3>
                                        <p>{productInfo.farmer}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Harvest Date</h3>
                                        <p>{productInfo.harvestDate}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Processing Date</h3>
                                        <p>{productInfo.processingDate}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Distributor</h3>
                                        <p>{productInfo.distributor}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Retailer</h3>
                                        <p>{productInfo.retailer}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthRedirectProvider>
    )
}