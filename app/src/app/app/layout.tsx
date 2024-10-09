import Appbar from '@/components/layout/Appbar'
import React from 'react'
import { ToastContainer } from 'react-toastify'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Appbar />
            {children}
            <ToastContainer />
        </div>
    )
}

export default AppLayout