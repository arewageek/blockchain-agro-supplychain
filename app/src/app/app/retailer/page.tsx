"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, LoaderPinwheel, Package, Truck } from 'lucide-react';
import { useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { configWagmi, contractConfig } from '@/config/wagmi.config';
import { readContract, writeContract } from '@wagmi/core';
import { toast } from 'react-toastify';
import { randomIdGenerator } from '@/lib/randomIdGenerator';

// Define the BatchState enum
enum SupplyState {
    Processed = 'Processed',
    InTransit = 'In Transit',
    Delivered = 'Delivered'
}

// Define the ProcessedBatch interface
interface ProcessedBatch {
    id: number;
    bulkSupplyId: number;
    processor: string;
    quantity: number;
    processingDate: number;
    qualityGrade: string;
    state: SupplyState;
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

// Define the BatchQualityReport interface
interface BatchQualityReport {
    batchId: string;
    qualityGrade: 'A' | 'B' | 'C';
}

// Define the NewBatch interface
interface NewRetailUnits {
    batchId: string;
    quantity: number;
    pricePerUnit: number;
}

export default function RetailerDashboard() {
    const [batchId, setBatchId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [trackedBatch, setTrackedBatch] = useState<ProcessedBatch | null>(null);
    const [trackedUnit, setTrackedUnit] = useState<UnitHistory | null>(null);
    const [retailUid, setRetailUid] = useState<number>()

    const { writeContract, error, isError, isPending, data: trxHash, isSuccess, context } = useWriteContract()
    const { data: trxData } = useWaitForTransactionReceipt({ hash: trxHash })

    const handleTrackBatch = async () => {
        const data: any = await readContract(configWagmi, {
            ...contractConfig,
            functionName: 'processedBatches',
            args: [BigInt(batchId)]
        })

        console.log({ data })

        setTrackedBatch({
            id: Number(data[0]),
            bulkSupplyId: Number(data[1]),
            processor: data[2],
            quantity: Number(data[3]),
            processingDate: Number(data[4]),
            qualityGrade: data[5],
            state: data[6]
        });
    };

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

    const handleReportQuality = (report: BatchQualityReport) => {
        // TODO: Implement the logic to submit the quality report
        console.log('Quality report submitted:', { report });

        writeContract({
            ...contractConfig,
            functionName: 'reportBatchQuality',
            args: [BigInt(report.batchId), report.qualityGrade]
        })
    };

    const handleRetailUnitCreate = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newRetailUnits: NewRetailUnits = {
            batchId: formData.get('bulkBatchId') as string,
            quantity: Number(formData.get('quantity')),
            pricePerUnit: parseInt(formData.get('pricePerUnit') as string),
        };

        const uuid = Math.ceil(randomIdGenerator() / 10) * 10
        setRetailUid(uuid)

        console.log({ newRetailUnits })

        writeContract({
            ...contractConfig,
            functionName: 'createRetailUnits',
            args: [BigInt(uuid), BigInt(newRetailUnits.batchId), BigInt(newRetailUnits.quantity), BigInt(newRetailUnits.pricePerUnit)],
        })

    }

    // wagmi hooks
    const { address, isConnecting } = useAccount()
    const { connectors } = useConnect()

    // contract effects
    useEffect(() => {
        console.log({ isPending, isError, error, trxHash, context })
        if (isError) {
            toast.error(error.name)
        }
        if (isSuccess) {
            toast.success("Transaction has been submit")
        }

    }, [isPending, error, trxHash, isSuccess])

    useEffect(() => {
        console.log({ trxData })
    }, [trxHash])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Retailer Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Report Batch Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const report: BatchQualityReport = {
                                batchId: formData.get('batchId') as string,
                                qualityGrade: formData.get('qualityGrade') as 'A' | 'B' | 'C',
                            };
                            handleReportQuality(report);
                        }}>
                            <div>
                                <Label htmlFor="batchId">Batch ID</Label>
                                <Input id="batchId" name="batchId" placeholder="Enter Batch ID" />
                            </div>
                            <div>
                                <Label htmlFor="qualityGrade">Quality Grade</Label>
                                <Select name="qualityGrade">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B">B</SelectItem>
                                        <SelectItem value="C">C</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {
                                address ? <Button type="submit" className="w-full">Submit Report</Button> :
                                    <Button type="button" className="w-full">Connect Metamask
                                    </Button>
                            }
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Create Retail Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleRetailUnitCreate}>
                            <div>
                                <Label htmlFor="bulkBatchId">Batch ID</Label>
                                <Input id="bulkBatchId" name="bulkBatchId" placeholder="Enter Bulk Batch ID" />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" name="quantity" type="number" placeholder="Enter quantity" />
                            </div>
                            <div>
                                <Label htmlFor="pricePerUnit">Price Per Unit</Label>
                                <Input id="pricePerUnit" name="pricePerUnit" type="number" placeholder="e.g $130" />
                            </div>
                            {retailUid && <div className='py-2 font-bold text-sm'>
                                Retail ID: {retailUid}
                            </div>}
                            {
                                address ? <Button type="submit" className="w-full">{
                                    isPending ? "Processing..." : "Create Batch"
                                }</Button> :
                                    <Button type="button" className="w-full" onClick={() => connectors[0].connect()}>
                                        {isConnecting ? "Connecting..." : "Connect MetaMask"}
                                    </Button>
                            }
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-primary">Track Batch</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2 mb-4">
                        <Input
                            placeholder="Enter Batch ID"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                        <Button onClick={handleTrackBatch}>Track</Button>
                    </div>
                    {trackedBatch && (
                        <div className="bg-secondary p-4 rounded-md">
                            <h3 className="font-semibold mb-2 text-primary">Batch Details:</h3>
                            <p><strong>ID:</strong> {trackedBatch.id}</p>
                            <p><strong>Bulk Supply ID:</strong> {trackedBatch.bulkSupplyId}</p>
                            <p><strong>Processor:</strong> {trackedBatch.processor}</p>
                            <p><strong>Quantity:</strong> {trackedBatch.quantity}</p>
                            <p><strong>Processing Date:</strong> {new Date(trackedBatch.processingDate * 1000).toLocaleDateString()}</p>
                            <p><strong>Quality Grade:</strong> {trackedBatch.qualityGrade}</p>
                            <p><strong>State:</strong> {trackedBatch.state}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

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
        </div>
    );
}