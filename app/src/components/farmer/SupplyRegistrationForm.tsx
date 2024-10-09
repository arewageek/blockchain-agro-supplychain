'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, Truck, Package } from "lucide-react"

const formSchema = z.object({
    supplyId: z.string().min(1, {
        message: "Supply ID is required.",
    }),
})

export default function SupplyTracker() {
    const [supplyStatus, setSupplyStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supplyId: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSupplyStatus({
            id: values.supplyId,
            status: "In Transit",
            location: "Distribution Center",
            lastUpdated: new Date().toLocaleString(),
        })
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="supplyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supply ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter supply ID" {...field} className="bg-green-50 dark:bg-green-900" />
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
                            'Track Supply'
                        )}
                    </Button>
                </form>
            </Form>

            {supplyStatus && (
                <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-700">
                    <CardHeader>
                        <CardTitle className="text-green-700 dark:text-green-300 flex items-center space-x-2">
                            <Package className="w-6 h-6" />
                            <span>Supply Status</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">ID:</span>
                            <span>{supplyStatus.id}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Status:</span>
                            <span className="flex items-center space-x-1">
                                <Truck className="w-4 h-4 text-blue-500" />
                                <span>{supplyStatus.status}</span>
                            </span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Location:</span>
                            <span>{supplyStatus.location}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Last Updated:</span>
                            <span>{supplyStatus.lastUpdated}</span>
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}