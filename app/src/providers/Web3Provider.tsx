"use client"

import { configWagmi } from '@/config/wagmi.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { WagmiProvider } from 'wagmi'

const Web3Provider = ({ children }: { children: React.ReactNode }) => {

    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={configWagmi}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Web3Provider