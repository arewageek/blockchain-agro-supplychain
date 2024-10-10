"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CreateBatch() {
    const [batchName, setBatchName] = useState("")
    const [supplyIds, setSupplyIds] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this data to your backend
        console.log(`Creating batch "${batchName}" with supplies: ${supplyIds}`)
        // Reset form
        setBatchName("")
        setSupplyIds("")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="batchName">Batch Name</Label>
                <Input
                    id="batchName"
                    placeholder="Enter batch name"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="supplyIds">Supply IDs</Label>
                <Textarea
                    id="supplyIds"
                    placeholder="Enter supply IDs (comma-separated)"
                    value={supplyIds}
                    onChange={(e) => setSupplyIds(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">Create Batch</Button>
        </form>
    )
}