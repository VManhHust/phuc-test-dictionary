import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Book, LogOut, Settings, User } from "lucide-react"

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push("/")
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center">
                            <Book className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="text-xl font-bold">TuDien.vn</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Link href="/" className="text-gray-600 hover:text-blue-600">
                                Trang chủ
                            </Link>
                            <Link href="/search" className="text-gray-600 hover:text-blue-600">
                                Tra cứu
                            </Link>
                            <Link href="/news" className="text-gray-600 hover:text-blue-600">
                                Tin tức
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                                    {user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                <p className="font-medium">{user.username}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Hồ sơ</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        {user.roles?.includes("ADMIN") && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin/dictionary" className="cursor-pointer">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Quản trị</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Đăng xuất</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link href="/login">Đăng nhập</Link>
                                    </Button>
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                        <Link href="/register">Đăng ký</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
                            <p className="text-gray-600">
                                TuDien.vn là từ điển tiếng Việt trực tuyến, cung cấp các định nghĩa, từ đồng nghĩa và nguồn gốc của từ.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/about" className="text-gray-600 hover:text-blue-600">
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                                        Liên hệ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                                        Điều khoản sử dụng
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6"
                                    >
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.71 10.71 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} TuDien.vn. Tất cả các quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}