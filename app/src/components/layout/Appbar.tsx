import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Leaf } from 'lucide-react'
import ConnectButton from './ConnectButton'

const Appbar = () => {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Leaf className="h-8 w-8 text-green-600" />
                            <span className="ml-2 text-xl font-bold text-gray-800">Abdul Aminu</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Appbar