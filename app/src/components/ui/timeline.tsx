import * as React from "react"

import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
    />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex gap-4", className)}
        {...props}
    />
))
TimelineItem.displayName = "TimelineItem"

const TimelineIcon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900", className)}
        {...props}
    />
))
TimelineIcon.displayName = "TimelineIcon"

const TimelineConnector = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("relative h-full w-px bg-blue-300 dark:bg-blue-700 ml-4 -mt-8 mb-4", className)}
        {...props}
    />
))
TimelineConnector.displayName = "TimelineConnector"

const TimelineContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex-1", className)}
        {...props}
    />
))
TimelineContent.displayName = "TimelineContent"

export { Timeline, TimelineItem, TimelineIcon, TimelineConnector, TimelineContent }