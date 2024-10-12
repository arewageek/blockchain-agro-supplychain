"use client"

import { useState } from 'react'
import { Button } from '../ui/button'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ConnectButton = ({ classes }: { classes?: string }) => {
    const { address, status } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    const [position, setPosition] = useState("bottom")

    return (
        <div className='h-full flex items-center justify-center'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className={classes}>
                        {status == 'disconnected' ? "Connect Wallet" : status == 'connected' ? `${address.substring(0, 5)}...${address.substring(address.length - 6)}` : `${status}...`}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {
                        address ? <>
                            <DropdownMenuLabel>Connected</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                <div className='cursor-pointer p-2 hover:bg-gray-100' onClick={() => disconnect()}>
                                    Disconnect
                                </div>
                            </DropdownMenuRadioGroup>
                        </> :
                            <>
                                <DropdownMenuLabel>Choose Wallet</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup >
                                    {
                                        connectors.map(connector => <div className='cursor-pointer p-2 hover:bg-gray-100' onClick={() => connector.connect()} key={crypto.randomUUID()}>{connector.name}</div>)
                                    }
                                </DropdownMenuRadioGroup></>
                    }

                </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button onClick={() => connect({ connector: connectors[0] })} variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 capitalize">
                {status == 'disconnected' ? "Connect Wallet" : status == 'connected' ? `${address.substring(0, 5)}...${address.substring(address.length - 6)}` : `${status}...`}
            </Button> */}
        </div>
    )
}

// export const ConnectButton2 = () => {
//     <
// }

export default ConnectButton