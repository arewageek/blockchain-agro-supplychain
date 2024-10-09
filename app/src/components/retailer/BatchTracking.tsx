'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Truck, CheckCircle2 } from "lucide-react"

const formSchema = z.object({
    batchId: z.string().min(1, {
        message: "Batch ID is required.",
    }),
})

export default function BatchTracking() {
    const [batchStatus, setBatchStatus] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            batchId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setBatchStatus({
            id: values.batchId,
            status: "In Transit",
            origin: "Green Valley Farms",
            destination: "Your Store",
            estimatedArrival: "2023-12-15",
            items: [
                { id: "ITEM001", name: "Organic Apples", quantity: 500 },
                { id: "ITEM002", name: "Fresh Strawberries", quantity: 300 },
            ],
        })
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>Batch Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="batchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter batch ID" {...field} className="bg-green-50 dark:bg-green-900" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Tracking...
                                    </>
                                ) : (
                                    'Track Batch'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {batchStatus && (
                <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300 flex items-center space-x-2">
                            <Package className="w-6 h-6" />
                            <span>Batch Status</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Batch ID:</span>
                            <Badge variant="secondary">{batchStatus.id}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Status:</span>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                {batchStatus.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Origin:</span>
                            <span>{batchStatus.origin}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Destination:</span>
                            <span>{batchStatus.destination}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Estimated Arrival:</span>
                            <span>{batchStatus.estimatedArrival}</span>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Items in Batch:</h4>
                            <ul className="space-y-2">
                                {batchStatus.items.map((item: any) => (
                                    <li key={item.id} className="flex justify-between items-center bg-green-50 dark:bg-green-900 p-2 rounded">
                                        <span>{item.name}</span>
                                        <Badge variant="secondary">{item.quantity}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}