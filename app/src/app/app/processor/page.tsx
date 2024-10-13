"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, LoaderPinwheel, Package, Truck } from 'lucide-react';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { configWagmi, contractConfig } from '@/config/wagmi.config';
import { readContract, writeContract } from '@wagmi/core';
import { toast } from 'react-toastify';
import { randomIdGenerator } from '@/lib/randomIdGenerator';

// Define the SupplyState enum
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

// Define the SupplyQualityReport interface
interface SupplyQualityReport {
    supplyId: string;
    qualityGrade: 'A' | 'B' | 'C';
}

// Define the NewBatch interface
interface NewBatch {
    bulkSupplyId: string;
    quantity: number;
    qualityGrade: 'A' | 'B' | 'C';
}

// Define the DashboardSummary interface
interface DashboardSummary {
    totalBatchesProcessed: number;
    totalSuppliesReceived: number;
    averageQualityGrade: 'A' | 'B' | 'C';
}

export default function ProcessorDashboard() {
    const [batchId, setBatchId] = useState('');
    const [trackedBatch, setTrackedBatch] = useState<ProcessedBatch | null>(null);
    const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>({
        totalBatchesProcessed: 254,
        totalSuppliesReceived: 1234,
        averageQualityGrade: 'A'
    });
    const [uuid, setUuid] = useState<number>()

    const { writeContract, error, isError, isPending, data: trxHash, isSuccess, context } = useWriteContract()

    const handleTrackBatch = async () => {
        // TODO: Implement actual blockchain tracking logic
        // This is a placeholder for demonstration purposes

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

    const handleReportQuality = (report: SupplyQualityReport) => {
        // TODO: Implement the logic to submit the quality report
        console.log('Quality report submitted:', { report });

        writeContract({
            ...contractConfig,
            functionName: 'reportSupplyQuality',
            args: [BigInt(report.supplyId), report.qualityGrade]
        })
    };

    const handleBatchCreate = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newBatch: NewBatch = {
            bulkSupplyId: formData.get('bulkSupplyId') as string,
            quantity: Number(formData.get('quantity')),
            qualityGrade: formData.get('qualityGrade') as 'A' | 'B' | 'C'
        };

        console.log({ newBatch })
        const batchUUID = randomIdGenerator()
        setUuid(batchUUID)

        writeContract({
            ...contractConfig,
            functionName: 'processBatch',
            args: [BigInt(batchUUID), BigInt(newBatch.bulkSupplyId), BigInt(newBatch.quantity)]
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Processor Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Report Supply Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const report: SupplyQualityReport = {
                                supplyId: formData.get('supplyId') as string,
                                qualityGrade: formData.get('qualityGrade') as 'A' | 'B' | 'C',
                            };
                            handleReportQuality(report);
                        }}>
                            <div>
                                <Label htmlFor="supplyId">Supply ID</Label>
                                <Input id="supplyId" name="supplyId" placeholder="Enter Supply ID" />
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
                        <CardTitle className="text-primary">Create New Batch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleBatchCreate}>
                            <div>
                                <Label htmlFor="bulkSupplyId">Bulk Supply ID</Label>
                                <Input id="bulkSupplyId" name="bulkSupplyId" placeholder="Enter Bulk Supply ID" />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input id="quantity" name="quantity" type="number" placeholder="Enter quantity" />
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

                            {uuid && <div className='py-3 text-sm font-bold text-green-600'>
                                New Batch Id Generated: {uuid}
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

        </div>
    );
}