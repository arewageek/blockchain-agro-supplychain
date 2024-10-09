'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, Truck, Package, Weight, Pin, Compass, Calendar } from "lucide-react"
import { readContract } from '@wagmi/core'
import { configWagmi, contractConfig } from '@/config/wagmi.config'
import { toast } from 'react-toastify'

const formSchema = z.object({
    supplyId: z.string().min(1, {
        message: "Supply ID is required.",
    }),
})

export default function SupplyTracker() {
    const [supplyStatus, setSupplyStatus] = useState<null | any>(null)
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
        // setSupplyStatus({
        //     id: values.supplyId,
        //     status: "In Transit",
        //     location: "Distribution Center",
        //     lastUpdated: new Date().toLocaleString(),
        // })

        const supply: any = await readContract(configWagmi, {
            ...contractConfig,
            functionName: 'bulkSupplies',
            args: [values.supplyId]
        })
        const addy = supply[2] as string
        if (addy == "0x0000000000000000000000000000000000000000") {
            toast.error("Could not find the supply data")
            setSupplyStatus(null)
        }
        else {
            setSupplyStatus(supply)
            console.log({ supply })
        }



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
                            <span>{Number(supplyStatus[0])}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Name:</span>
                            <span className="flex items-center space-x-1">
                                {/* <Truck className="w-4 h-4 text-green-500" /> */}
                                <span>{supplyStatus[1]}</span>
                            </span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Farmer:</span>
                            <span>{supplyStatus[2]}</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Quantity:</span>
                            <span>{Number(supplyStatus[3])}</span>
                        </p>

                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Unit:</span>
                            <Weight className="w-4 h-4 text-green-500" />
                            <span>{supplyStatus[4]}</span>
                        </p>

                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Price Per Unit:</span>
                            <span>${Number(supplyStatus[5]).toLocaleString()}</span>
                        </p>

                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Factory Location:</span>
                            <Compass className="w-4 h-4 text-green-500" />
                            <span>{supplyStatus[6]}</span>
                        </p>

                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Harvest Date:</span>
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span>{Number(supplyStatus[7])}</span>
                        </p>

                        <p className="flex items-center space-x-2">
                            <span className="font-semibold">Status:</span>
                            <span>{supplyStatus[8]}</span>
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}