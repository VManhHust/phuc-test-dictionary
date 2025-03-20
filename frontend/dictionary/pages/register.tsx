"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { register } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validate form
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.")
            return
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.")
            return
        }

        setIsLoading(true)

        try {
            const success = await register(username, email, password)
            if (success) {
                // Redirect to dashboard after successful registration
                router.push("/admin/dictionary")
            } else {
                setError("Đăng ký không thành công. Email có thể đã được sử dụng.")
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.")
            console.error("Registration error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Đăng ký tài khoản</CardTitle>
                    <CardDescription className="text-center">
                        Tạo tài khoản mới để sử dụng hệ thống từ điển
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Tên người dùng</Label>
                            <Input
                                id="username"
                                placeholder="Nhập tên người dùng"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                "Đăng ký"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Đăng nhập
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                            Quay lại trang chủ
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}