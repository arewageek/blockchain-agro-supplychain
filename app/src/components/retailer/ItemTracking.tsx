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
import { Loader2, Search, Leaf, Factory, Truck, Store } from "lucide-react"
import { Timeline, TimelineConnector, TimelineContent, TimelineIcon, TimelineItem } from '../ui/timeline'

const formSchema = z.object({
    itemId: z.string().min(1, {
        message: "Item ID is required.",
    }),
})

export default function ItemTracking() {
    const [itemStatus, setItemStatus] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setItemStatus({
            id: values.itemId,
            name: "Organic Apples",
            currentLocation: "Your Store",
            history: [
                { date: "2023-11-01", event: "Harvested", location: "Green Valley Farms" },
                { date: "2023-11-03", event: "Processed", location: "FreshPack Facility" },
                { date: "2023-11-05", event: "Shipped", location: "Distribution Center" },
                { date: "2023-11-10", event: "Received", location: "Your Store" },
            ],
        })
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>Item Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="itemId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter item ID" {...field} className="bg-green-50 dark:bg-green-900" />
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
                                    'Track Item'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {itemStatus && (
                <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300 flex items-center space-x-2">
                            <Search className="w-6 h-6" />
                            <span>Item Status</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Item ID:</span>
                            <Badge variant="secondary">{itemStatus.id}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Name:</span>
                            <span>{itemStatus.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Current Location:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                {itemStatus.currentLocation}
                            </Badge>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Item History:</h4>
                            <Timeline>
                                {itemStatus.history.map((event: any, index: number) => (
                                    <TimelineItem key={index}>
                                        <TimelineIcon>
                                            {event.event === "Harvested" && <Leaf className="h-4 w-4" />}
                                            {event.event === "Processed" && <Factory className="h-4 w-4" />}
                                            {event.event === "Shipped" && <Truck className="h-4 w-4" />}
                                            {event.event === "Received" && <Store className="h-4 w-4" />}
                                        </TimelineIcon>
                                        <TimelineConnector />
                                        <TimelineContent>
                                            <p className="font-medium">{event.event}</p>
                                            <p className="text-sm text-muted-foreground">{event.date}</p>
                                            <p className="text-sm">{event.location}</p>
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                            </Timeline>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}