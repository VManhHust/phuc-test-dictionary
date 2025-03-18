import { useEffect } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"

// HOC để bảo vệ các trang yêu cầu đăng nhập
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const { user, loading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!loading && !user) {
                router.replace(`/login?redirect=${router.pathname}`)
            }
        }, [user, loading, router])

        // Hiển thị trang loading hoặc null khi đang kiểm tra xác thực
        if (loading || !user) {
            return null
        }

        return <Component {...props} />
    }
}

// HOC để bảo vệ các trang yêu cầu quyền admin
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
    return function AdminAuthenticatedComponent(props: P) {
        const { user, loading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!loading) {
                if (!user) {
                    router.replace(`/login?redirect=${router.pathname}`)
                } else if (!user.roles.includes("ADMIN")) {
                    router.replace("/")
                }
            }
        }, [user, loading, router])

        // Hiển thị trang loading hoặc null khi đang kiểm tra xác thực
        if (loading || !user || !user.roles.includes("ADMIN")) {
            return null
        }

        return <Component {...props} />
    }
}