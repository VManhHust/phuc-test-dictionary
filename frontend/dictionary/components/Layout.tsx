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
import { LogOut, User, Book, Newspaper } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isLoggedIn = false // Replace with actual auth state

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
            <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                TuDien.vn
                            </Link>
                            <nav>
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
                                </ul>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            {isLoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Hồ sơ</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Đăng xuất</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Button variant="ghost" onClick={() => router.push("/login")}>
                                        Đăng nhập
                                    </Button>
                                    <Button onClick={() => router.push("/register")}>Đăng ký</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="mt-auto border-t bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">© 2024 TuDien.vn. All rights reserved.</p>
                        <nav>
                            <ul className="flex items-center gap-4">
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
                            </ul>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    )
}

