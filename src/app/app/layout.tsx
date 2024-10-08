import Appbar from '@/components/layout/Appbar'
import React from 'react'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Appbar />
            {children}
        </div>
    )
}

export default AppLayout