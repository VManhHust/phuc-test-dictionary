"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { withAdminAuth } from "@/utils/auth"

const AdminDashboard = () => {
    const router = useRouter()

    useEffect(() => {
        router.push("/admin/dictionary")
    }, [router])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-4 text-gray-600">Đang chuyển hướng đến trang quản trị từ điển...</p>
        </div>
    )
}

export default withAdminAuth(AdminDashboard)

