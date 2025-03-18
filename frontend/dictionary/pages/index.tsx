"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Book, BookOpen, Bookmark, TrendingUp, Users } from "lucide-react"

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    const { user } = useAuth()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
        }
    }

    return (
        <Layout>
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Khám phá kho từ vựng tiếng Việt phong phú
                        </h1>
                        <p className="text-xl mb-8 text-blue-100">
                            Tra cứu nhanh chóng, chính xác và dễ dàng với TuDien.vn
                        </p>

                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
                            <Input
                                type="text"
                                placeholder="Nhập từ cần tra cứu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-4 pr-12 py-6 rounded-full text-lg text-gray-800 border-0 shadow-lg focus:ring-2 focus:ring-blue-400"
                            />
                            <Button
                                type="submit"
                                className="absolute right-1.5 top-1.5 rounded-full w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </form>

                        {!user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                    <Link href="/register">Đăng ký miễn phí</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                                    <Link href="/login">Đăng nhập</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Tra cứu đa dạng</h3>
                                <p className="text-gray-600">
                                    Hỗ trợ tra cứu từ vựng, thành ngữ, tục ngữ với đầy đủ nghĩa và ví dụ minh họa.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                                    <Bookmark className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Lưu trữ từ vựng</h3>
                                <p className="text-gray-600">
                                    Đăng nhập để lưu lại các từ vựng đã tra cứu, tạo danh sách từ yêu thích để học tập.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Cập nhật liên tục</h3>
                                <p className="text-gray-600">
                                    Kho từ điển được cập nhật thường xuyên với các từ mới, giúp bạn bắt kịp xu hướng ngôn ngữ.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-6">Tạo tài khoản để trải nghiệm đầy đủ</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Đăng ký miễn phí để lưu lịch sử tra cứu, tạo danh sách từ vựng cá nhân và nhiều tính năng hữu ích khác.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    <Link href="/register">Đăng ký ngay</Link>
                                </Button>
                                <Button asChild size="lg" variant="outline">
                                    <Link href="/login">Đã có tài khoản? Đăng nhập</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Words Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Từ vựng phổ biến</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Hạnh phúc', 'Trí tuệ', 'Kiên trì', 'Lạc quan'].map((word, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-blue-600">{word}</h3>
                                    <p className="text-gray-600 text-sm">
                                        Nhấp để xem định nghĩa đầy đủ và ví dụ minh họa.
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/popular">Xem thêm từ phổ biến</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Tham gia cộng đồng người dùng</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Kết nối với hàng nghìn người dùng khác, chia sẻ kiến thức và cùng nhau phát triển vốn từ vựng tiếng Việt.
                            </p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/news">Khám phá bài viết</Link>
                            </Button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Cộng đồng năng động</h3>
                                        <p className="text-gray-600">Hơn 10,000 thành viên tích cực</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    "TuDien.vn đã giúp tôi cải thiện vốn từ vựng tiếng Việt rất nhiều. Giao diện dễ sử dụng và kho từ điển phong phú!"
                                </p>
                                <div className="mt-4 text-right">
                                    <p className="font-medium">Nguyễn Văn A</p>
                                    <p className="text-sm text-gray-500">Thành viên từ 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}