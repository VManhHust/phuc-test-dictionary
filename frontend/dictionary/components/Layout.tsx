"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Book, Newspaper, Settings, BookmarkIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

// Lấy chữ cái đầu tiên của tên người dùng cho avatar fallback
    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "U"
    }

// Kiểm tra xem có đang ở trang đăng nhập/đăng ký không
    const isAuthPage = router.pathname === "/login" || router.pathname === "/register" ||
        router.pathname === "/forgot-password" || router.pathname.startsWith("/reset-password")

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
            <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                TuDien.vn
                            </Link>
                            <nav className="hidden md:block">
                                <ul className="flex items-center gap-6">
                                    <li>
                                        <Link
                                            href="/"
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                                                router.pathname === "/" ? "text-blue-600" : "text-gray-600"
                                            }`}
                                        >
                                            <Book className="h-4 w-4" />
                                            Tra cứu
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/news"
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                                                router.pathname.startsWith("/news") ? "text-blue-600" : "text-gray-600"
                                            }`}
                                        >
                                            <Newspaper className="h-4 w-4" />
                                            Bài viết
                                        </Link>
                                    </li>
                                    {user && (
                                        <li>
                                            <Link
                                                href="/bookmarks"
                                                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                                                    router.pathname.startsWith("/bookmarks") ? "text-blue-600" : "text-gray-600"
                                                }`}
                                            >
                                                <BookmarkIcon className="h-4 w-4" />
                                                Từ đã lưu
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
<span className="text-sm font-medium text-gray-700 hidden md:inline-block">
Xin chào, {user.username}
</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border-2 border-blue-100">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src="/placeholder-avatar.png" alt={user.username} />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                        {getInitials(user.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{user.username}</p>
                                                    <p className="text-xs leading-none text-gray-500">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push("/profile")}>
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Hồ sơ</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push("/bookmarks")}>
                                                <BookmarkIcon className="mr-2 h-4 w-4" />
                                                <span>Từ đã lưu</span>
                                            </DropdownMenuItem>
                                            {user.roles.includes("ADMIN") && (
                                                <DropdownMenuItem onClick={() => router.push("/admin/dictionary")}>
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>Quản trị</span>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Đăng xuất</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                !isAuthPage && (
                                    <>
                                        <Button variant="ghost" onClick={() => router.push("/login")} className="hidden md:flex">
                                            Đăng nhập
                                        </Button>
                                        <Button onClick={() => router.push("/register")} className="bg-blue-600 hover:bg-blue-700">
                                            Đăng ký
                                        </Button>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="mt-auto border-t bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <Link href="/" className="text-xl font-bold text-blue-600">
                                TuDien.vn
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                                Kho từ điển tiếng Việt phong phú và đa dạng
                            </p>
                        </div>
                        <nav>
                            <ul className="flex items-center gap-6">
                                <li>
                                    <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                                        Điều khoản
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                                        Bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">© 2024 TuDien.vn. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}