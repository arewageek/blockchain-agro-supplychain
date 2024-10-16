"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { configWagmi, contractConfig } from '@/config/wagmi.config'
import { toast } from 'react-toastify'
import { readContract } from '@wagmi/core'

const roles = ["Admin", "Farmer", "Processor", "Retailer", "Consumer"]
const AdminPage = () => {
    const [wallet, setWallet] = useState<string>()
    const [vWwallet, setVWallet] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [isVLoading, setIsVLoading] = useState(false)
    const [assignedRole, setAssignedRole] = useState<string>()
    const [role, setRole] = useState<string>('')

    const { data: hash, isError, error, isPending, isSuccess, writeContract } = useWriteContract()

    const handleRoleVerify = async (e: any) => {
        e.preventDefault();
        setIsVLoading(true)

        const accountRole = await readContract(configWagmi, {
            ...contractConfig,
            functionName: 'role',
            args: [vWwallet]
        })

        setRole(accountRole as string)
        console.log({ accountRole })

        setTimeout(() => setIsVLoading(false), 2000)
    }

    const handleRoleAssign = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)

        writeContract({
            ...contractConfig,
            functionName: 'createRole',
            args: [wallet, assignedRole],
        })
    }

    useEffect(() => {
        if (isError || error) {
            toast.error(error.name)
            setIsLoading(false)
        }
        else if (isSuccess) {
            toast.success("Role has been assigned successfully!")
            setIsLoading(false)
        }
        // else {
        //     toast.error("An unknown error occurred!")
        //     setIsLoading(false)
        // }

        console.log({ isSuccess, isPending, isError, error })
        console.log({ wallet, assignedRole })

    }, [isError, hash, isSuccess])

    return (
        <div className='flex h-screen w-full items-center justify-center p-10'>
            <Card className='bg-white shadow w-full lg:w-1/3'>
                <CardHeader>
                    <h3 className='text-sm font-bold'>Create Roles</h3>
                </CardHeader>
                <CardContent className='pb-5 px-6'>
                    <form onSubmit={handleRoleAssign} className='flex flex-col gap-y-4'>
                        <div>
                            <Label htmlFor='wallet' className='text-sm py-2'>
                                Wallet Address
                            </Label>
                            <Input placeholder='0x00s34...' id="wallet" name='wallet' onChange={e => setWallet(e.target.value)} className='border-2 border-gray-600/50' />
                        </div>

                        <div className=''>
                            <Label htmlFor='wallet' className='text-sm py-2'>
                                Role
                            </Label>
                            <Select value={assignedRole} onValueChange={value => setAssignedRole(value)}>
                                <SelectTrigger className='w-full border-2 border-gray-600/50'>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role} value={`${role.toUpperCase()}_ROLE`}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            {
                                isLoading ? <Button type="submit" className='w-full text-sm' disabled>
                                    <div className='w-4 h-4 border-2 rounded-full border-l-0 border-b-0 animate-spin'>

                                    </div>
                                </Button> : <Button type="submit" className='w-full text-sm'>
                                    Assign Role
                                </Button>
                            }

                        </div>
                    </form>
                </CardContent>

                <CardContent className='mt-10'>
                    <div>
                        <h3 className="font-bold my-4">Verify Role</h3>
                        <form onSubmit={handleRoleVerify} className='flex flex-col gap-y-4'>
                            <div>
                                <Label htmlFor='vWallet' className='text-sm py-2'>
                                    Wallet Address
                                </Label>
                                <Input placeholder='0x00s34...' id="vWallet" name='vWallet' onChange={e => setVWallet(e.target.value)} className='border-2 border-gray-600/50' />
                            </div>

                            {role && <div className='text-sm font-bold'>
                                Role: {role}
                            </div>}

                            <div>
                                {
                                    isVLoading ? <Button type="submit" className='w-full text-sm' disabled>
                                        <div className='w-4 h-4 border-2 rounded-full border-l-0 border-b-0 animate-spin'>

                                        </div>
                                    </Button> : <Button type="submit" className='w-full text-sm'>
                                        Verify Role
                                    </Button>
                                }

                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminPage