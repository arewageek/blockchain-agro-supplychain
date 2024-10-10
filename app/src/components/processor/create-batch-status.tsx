"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TrackBatchStatus() {
    const [batchId, setBatchId] = useState("")
    const [batchStatus, setBatchStatus] = useState<string | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically fetch the batch status from your backend
        // For this example, we'll just set a mock status
        setBatchStatus("In Progress")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID</Label>
                <Input
                    id="batchId"
                    placeholder="Enter batch ID"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">Track Status</Button>
            {batchStatus && (
                <div className="mt-4 p-4 bg-secondary rounded-md">
                    <p className="font-semibold">Batch Status: {batchStatus}</p>
                </div>
            )}
        </form>
    )
}