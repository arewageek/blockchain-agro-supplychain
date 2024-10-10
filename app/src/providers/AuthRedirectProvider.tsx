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
                args: [`${address}`],
            }
        ]
    })

    useEffect(() => {
        console.log({ role: data?.[0].result })
        setRole(data?.[0].result as string)
    }, [data])

    role && role != 'CUSTOMER' && router.push(`/app/${role.toLowerCase()}`)

    // useEffect(() => {
    //     role && role != 'CUSTOMER' && router.push(`/app/${role.toLowerCase()}`)
    // }, [role])

    return (
        <>{children}</>
    )
}

export default AuthRedirectProvider