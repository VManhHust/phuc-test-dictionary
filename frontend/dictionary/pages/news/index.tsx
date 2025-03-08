"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ThumbsDown, MessageCircle, Share2, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

// Định nghĩa các kiểu dữ liệu
type Author = {
    id: string
    username: string
    email: string
    password: string
    enabled: boolean
    roles: string
    created_at: string
}

type Article = {
    id: string
    title: string
    content: string
    author: Author
    created_at: string
    updated_at: string
    like_counts: number
    dislike_counts: number
}

type ArticleResponse = {
    total: number
    total_pages: number
    current_page: number
    limit: number
    data_list: Article[]
}

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        skip: 0,
    })

    // Hàm để lấy dữ liệu bài viết từ API
    const fetchArticles = async (skip = 0, size = 10) => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3001/posts/all-posts?skip=${skip}&size=${size}`)

            if (response.ok) {
                const data: ArticleResponse = await response.json()
                if (data) {
                    setArticles(data.data_list)
                    setPagination({
                        total: data.total,
                        totalPages: data.total_pages,
                        currentPage: data.current_page,
                        limit: data.limit,
                        skip: skip,
                    })
                } else {
                    setError("Không thể tải bài viết")
                }
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`)
                setError(`Lỗi ${response.status}: Không thể tải danh sách bài viết`)
            }
        } catch (err) {
            console.error("Error fetching articles:", err)
            setError("Đã xảy ra lỗi khi tải bài viết")
        } finally {
            setLoading(false)
        }
    }

    // Gọi API khi component được mount
    useEffect(() => {
        fetchArticles(0, 10)
    }, [])

    // Hàm để định dạng thời gian
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return formatDistanceToNow(date, { addSuffix: true, locale: vi })
        } catch (error) {
            return dateString
        }
    }

    // Hàm xử lý khi chuyển trang
    const handlePageChange = (page: number) => {
        const newSkip = (page - 1) * pagination.limit
        fetchArticles(newSkip, pagination.limit)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            {/* Header */}
            <div className="bg-blue-600 text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-4 text-center">Bài Viết & Tin Tức</h1>
                    <p className="text-center text-blue-100 max-w-2xl mx-auto">
                        Khám phá các bài viết mới nhất về ngôn ngữ, từ vựng và kiến thức hữu ích
                    </p>
                </div>
            </div>

            {/* Article List */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <Card key={article.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-0">
                                        <div className="p-6">
                                            {/* Title */}
                                            <Link
                                                href={`/news/${article.id}`}
                                                className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors block mb-2"
                                            >
                                                {article.title}
                                            </Link>

                                            {/* Author and Date */}
                                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                                <User className="h-4 w-4 mr-1" />
                                                <span className="font-medium mr-3">{article.author.username}</span>
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{formatDate(article.created_at)}</span>
                                            </div>

                                            {/* Content */}
                                            <p className="text-gray-700 mb-4">{article.content}</p>

                                            {/* Interactions */}
                                            <div className="flex items-center gap-4 pt-2 border-t">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <Heart className="mr-1 h-4 w-4" />
                                                    <span>{article.like_counts}</span>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <ThumbsDown className="mr-1 h-4 w-4" />
                                                    <span>{article.dislike_counts}</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <MessageCircle className="mr-1 h-4 w-4" />
                                                    <span>Bình luận</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Share2 className="mr-1 h-4 w-4" />
                                                    <span>Chia sẻ</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500">Không có bài viết nào.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        disabled={pagination.currentPage === 1}
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    >
                                        Trước
                                    </Button>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={pagination.currentPage === page ? "default" : "outline"}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    >
                                        Sau
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Article Button - Only show for admin users */}
                <div className="max-w-4xl mx-auto mt-8 flex justify-end">
                    <Link href="/news/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">Thêm bài viết mới</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

