import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2 } from "lucide-react"

type Article = {
    id: number
    title: string
    subtitle: string
    content: string
    likes: number
    comments: number
    author: string
    publishedAt: string
}

export default function NewsPage() {
    // Dữ liệu mẫu - trong thực tế sẽ được lấy từ API
    const articles: Article[] = [
        {
            id: 1,
            title: "Từ mới trong tiếng Việt",
            subtitle: "Sự phát triển của ngôn ngữ",
            content:
                "Ngôn ngữ luôn phát triển theo thời gian, và tiếng Việt cũng không ngoại lệ. Trong những năm gần đây, nhiều từ mới đã xuất hiện và được đưa vào sử dụng rộng rãi trong đời sống hàng ngày...",
            likes: 156,
            comments: 23,
            author: "Nguyễn Văn A",
            publishedAt: "2024-02-28",
        },
        {
            id: 2,
            title: "Cách dùng thành ngữ",
            subtitle: "Giữ gìn sự trong sáng của tiếng Việt",
            content:
                "Thành ngữ là một phần quan trọng trong kho tàng văn học dân gian Việt Nam. Việc sử dụng đúng thành ngữ không chỉ giúp câu văn thêm sinh động mà còn thể hiện sự am hiểu văn hóa...",
            likes: 89,
            comments: 15,
            author: "Trần Thị B",
            publishedAt: "2024-02-27",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            {/* Header */}

            {/* Article List */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {articles.map((article) => (
                        <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                {/* Title and Subtitle */}
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <Link href={`/news/${article.id}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                                        {article.title}
                                    </Link>
                                    <div className="text-lg text-gray-600">{article.subtitle}</div>
                                </div>

                                {/* Content */}
                                <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>

                                {/* Bottom Row */}
                                <div className="flex justify-between items-center">
                                    {/* Interactions */}
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                            <Heart className="mr-2 h-5 w-5" />
                                            {article.likes}
                                        </Button>
                                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                            <MessageCircle className="mr-2 h-5 w-5" />
                                            {article.comments}
                                        </Button>
                                        <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                                            <Share2 className="mr-2 h-5 w-5" />
                                            Chia sẻ
                                        </Button>
                                    </div>

                                    {/* Author and Date */}
                                    <div className="text-gray-600">
                                        <span className="font-medium">{article.author}</span>
                                        <span className="mx-2">•</span>
                                        <time>{new Date(article.publishedAt).toLocaleDateString("vi-VN")}</time>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Add Article Button - Only show for admin users */}
                <div className="max-w-4xl mx-auto mt-8 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700">Thêm bài viết mới</Button>
                </div>
            </div>
        </div>
    )
}

