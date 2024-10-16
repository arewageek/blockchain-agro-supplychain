'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scan, Leaf, LeafIcon, FactoryIcon, ShoppingCartIcon, User } from 'lucide-react'
import AuthRedirectProvider from '@/providers/AuthRedirectProvider'
import Link from 'next/link'
import { configWagmi, contractConfig } from '@/config/wagmi.config'
import { readContract } from '@wagmi/core'

// Dummy data for product information
interface IProduct {
    id: string, name: string, farmer: string, harvestDate: string, processingDate: string, retailer: string, distributor: string
}
interface UnitHistory {
    id: number;
    batchId: number;
    supplyId: number,
    farmer: string,
    processor: string;
    retailer: string,
    consumer?: string,
    productName?: string,
    factory: string;
    processingDate: number;
    qualityGrade: string;
}

const roles = [
    { name: "Admin", icon: <User />, path: "/admin" },
    { name: "Farmer", icon: <Leaf />, path: "/farmer" },
    { name: "Processor", icon: <FactoryIcon />, path: "/processor" },
    { name: "Retailer", icon: <ShoppingCartIcon />, path: "/retailer" },
]

export default function DashboardPage() {
    const [trackedUnit, setTrackedUnit] = useState<UnitHistory | null>(null);
    const [unitId, setUnitId] = useState('');

    const handleTrackUnit = async () => {
        const data: any = await readContract(configWagmi, {
            ...contractConfig,
            functionName: 'getUnitHistory',
            args: [BigInt(unitId)]
        })

        console.log({ data })

        setTrackedUnit({
            id: Number(data[0]),
            batchId: Number(data[1]),
            supplyId: Number(data[2]),
            farmer: data[3],
            processor: data[4],
            retailer: data[5],
            factory: data[8],
            processingDate: Number(data[9]),
            qualityGrade: data[10]
        });
    };

    return (

        <AuthRedirectProvider>
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Product Tracking Dashboard</h1>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-primary">Track Units</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mb-4">
                                <Input
                                    placeholder="Enter Product ID"
                                    value={unitId}
                                    onChange={(e) => setUnitId(e.target.value)}
                                />
                                <Button onClick={handleTrackUnit}>Track Item</Button>
                            </div>
                            {trackedUnit && (
                                <div className="bg-secondary p-4 rounded-md">
                                    <h3 className="font-semibold mb-2 text-primary">Batch Details:</h3>
                                    <p><strong>ID:</strong> {trackedUnit.id}</p>
                                    <p><strong>Bulk Batch ID:</strong> {trackedUnit.batchId}</p>
                                    <p><strong>Bulk Supply ID:</strong> {trackedUnit.supplyId}</p>
                                    <p><strong>Processor:</strong> {trackedUnit.farmer}</p>
                                    <p><strong>Processor:</strong> {trackedUnit.processor}</p>
                                    <p><strong>Processor:</strong> {trackedUnit.retailer}</p>
                                    <p><strong>Quantity:</strong> {trackedUnit.factory}</p>
                                    <p><strong>Processing Date:</strong> {new Date(trackedUnit.processingDate * 1000).toLocaleDateString()}</p>
                                    <p><strong>Quality Grade:</strong> {trackedUnit.qualityGrade}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* {productInfo && (
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
                    )} */}

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Quick Links</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            {roles.map(role => (
                                <Link href={`/app${role.path}`} className="quick-link-card" key={crypto.randomUUID()}>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-white shadow-md">
                                        <div className="flex items-center">
                                            <div className="pr-3 text-green-500">
                                                {role.icon}
                                            </div>
                                            <h3 className="text-lg font-bold">{role.name} Dashboard</h3>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M12 14l4-4-4-4H6l4 4 4 4z" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthRedirectProvider >
    )
}