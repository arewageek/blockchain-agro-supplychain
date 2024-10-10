import React from 'react'

const LayoutProcessor = ({ children }: { children: string }) => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}

export default LayoutProcessor