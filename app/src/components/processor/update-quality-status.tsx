"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UpdateQualityStatus() {
    const [supplyId, setSupplyId] = useState("")
    const [qualityStatus, setQualityStatus] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this data to your backend
        console.log(`Updating supply ${supplyId} with quality status: ${qualityStatus}`)
        // Reset form
        setSupplyId("")
        setQualityStatus("")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="supplyId">Supply ID</Label>
                <Input
                    id="supplyId"
                    placeholder="Enter supply ID"
                    value={supplyId}
                    onChange={(e) => setSupplyId(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="qualityStatus">Quality Status</Label>
                <Select value={qualityStatus} onValueChange={setQualityStatus} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select quality status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full">Update Status</Button>
        </form>
    )
}