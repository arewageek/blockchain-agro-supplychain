'use client'
import React, { ReactNode, useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { contractConfig } from '@/config/wagmi.config'
import { useRouter } from 'next/navigation'

const AuthRedirectProvider = ({ children }: { children: ReactNode }) => {

    const [role, setRole] = useState<string>('')
    const router = useRouter()
    const { address } = useAccount()

    const { data } = useReadContracts({
        contracts: [
            {
                ...contractConfig,
                functionName: 'role',
                args: ["0xd349d66c50131422F5f7D1220798F55981E15c50"],
            }
        ]
    })

    useEffect(() => {
        console.log({ role: data?.[0].result })
        setRole(data?.[0].result as string)
    }, [data])

    useEffect(() => {
        role && role !== 'CUSTOMER' && router.push(`${role.toLowerCase()}`)
    }, [role])

    return (
        <>{children}</>
    )
}

export default AuthRedirectProvider