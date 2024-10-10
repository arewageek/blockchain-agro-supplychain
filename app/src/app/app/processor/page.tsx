"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, LoaderPinwheel, Package, Truck } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { configWagmi, contractConfig } from '@/config/wagmi.config';
import { writeContract } from '@wagmi/core';

// Define the SupplyState enum
enum SupplyState {
    Processed = 'Processed',
    InTransit = 'In Transit',
    Delivered = 'Delivered'
}

// Define the ProcessedBatch interface
interface ProcessedBatch {
    id: string;
    bulkSupplyId: string;
    processor: string;
    quantity: number;
    batchNumber: string;
    processingDate: string;
    qualityGrade: 'A' | 'B' | 'C';
    state: SupplyState;
}

// Define the SupplyQualityReport interface
interface SupplyQualityReport {
    supplyId: string;
    qualityGrade: 'A' | 'B' | 'C';
    comments: string;
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

    const handleTrackBatch = async () => {
        // TODO: Implement actual blockchain tracking logic
        // This is a placeholder for demonstration purposes
        setTrackedBatch({
            id: batchId,
            bulkSupplyId: '12345',
            processor: '0x1234...5678',
            quantity: 1000,
            batchNumber: 'BATCH-2024-001',
            processingDate: new Date().toISOString(),
            qualityGrade: 'A',
            state: SupplyState.Processed
        });
    };

    const handleReportQuality = (report: SupplyQualityReport) => {
        // TODO: Implement the logic to submit the quality report
        console.log('Quality report submitted:', report);
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
        const createBatch = await writeContract(configWagmi, {
            ...contractConfig,
            functionName: 'processBatch',
            args: [
                344,
                29
            ]
        })

        console.log({ createBatch })

    }

    // wagmi hooks
    const { address, isConnecting } = useAccount()
    const { connectors } = useConnect()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Processor Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Batches Processed</CardTitle>
                        <Package className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardSummary.totalBatchesProcessed}</div>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Supplies Received</CardTitle>
                        <Truck className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardSummary.totalSuppliesReceived} kg</div>
                    </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Quality Grade</CardTitle>
                        <Leaf className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardSummary.averageQualityGrade}</div>
                    </CardContent>
                </Card>
            </div>

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
                                comments: formData.get('comments') as string
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
                            <div>
                                <Label htmlFor="comments">Comments</Label>
                                <Input id="comments" name="comments" placeholder="Additional comments" />
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
                                <Label htmlFor="quantity">Quantity (kg)</Label>
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
                            {
                                address ? <Button type="submit" className="w-full">Create Batch</Button> :
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
                            <p><strong>Quantity:</strong> {trackedBatch.quantity} kg</p>
                            <p><strong>Batch Number:</strong> {trackedBatch.batchNumber}</p>
                            <p><strong>Processing Date:</strong> {new Date(trackedBatch.processingDate).toLocaleDateString()}</p>
                            <p><strong>Quality Grade:</strong> {trackedBatch.qualityGrade}</p>
                            <p><strong>State:</strong> {trackedBatch.state}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}