'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-toastify'
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    batchId: z.string().min(1, { message: "Batch ID is required." }),
    status: z.string().min(1, { message: "Status is required." }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
    qualityRating: z.number().min(1).max(5, { message: "Quality rating must be between 1 and 5." }),
    notes: z.string().optional(),
})

export default function BatchReporting() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            batchId: "",
            status: "",
            quantity: 0,
            qualityRating: 0,
            notes: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log(values)
        toast.success("Your batch report has been successfully submitted.", {
            className: 'bg-green-600 text-white dark:bg-green-700',
        })
        form.reset()
        setIsSubmitting(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
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
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-green-50 dark:bg-green-900">
                                        <SelectValue placeholder="Select batch status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="received">Received</SelectItem>
                                    <SelectItem value="inspected">Inspected</SelectItem>
                                    <SelectItem value="stocked">Stocked</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} className="bg-green-50 dark:bg-green-900" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="qualityRating"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Quality Rating (1-5)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="5" {...field} onChange={e => field.onChange(+e.target.value)} className="bg-green-50 dark:bg-green-900" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Any additional notes about the batch" {...field} className="bg-green-50 dark:bg-green-900" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Report...
                        </>
                    ) : (
                        'Submit Batch Report'
                    )}
                </Button>
            </form>
        </Form>
    )
}