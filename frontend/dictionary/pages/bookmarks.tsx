"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon, Trash2, Search, BookOpen } from "lucide-react"
import { withAuth } from "@/utils/auth"

// Giả lập dữ liệu từ đã lưu
const mockBookmarks = [
    { id: 1, word: "Hạnh phúc", definition: "Trạng thái cảm xúc tích cực, vui vẻ và mãn nguyện", createdAt: "2023-12-15" },
    { id: 2, word: "Trí tuệ", definition: "Khả năng nhận thức, hiểu biết và vận dụng kiến thức", createdAt: "2023-12-10" },
    { id: 3, word: "Kiên trì", definition: "Sự bền bỉ, không bỏ cuộc trước khó khăn", createdAt: "2023-12-05" },
    { id: 4, word: "Lạc quan", definition: "Thái độ tích cực, tin tưởng vào điều tốt đẹp", createdAt: "2023-11-28" },
    { id: 5, word: "Tự tin", definition: "Tin tưởng vào khả năng, giá trị của bản thân", createdAt: "2023-11-20" },
]

function BookmarksPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [bookmarks, setBookmarks] = useState(mockBookmarks)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Lọc từ đã lưu theo từ khóa tìm kiếm
    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Xóa từ đã lưu
    const handleRemoveBookmark = (id: number) => {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Từ đã lưu</h1>
                            <p className="text-gray-600 mt-1">Quản lý danh sách từ vựng bạn đã lưu</p>
                        </div>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Tìm kiếm từ đã lưu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có từ nào được lưu</h2>
                            <p className="text-gray-600 mb-6">Bạn chưa lưu từ nào vào danh sách của mình</p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Bắt đầu tra cứu
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                                <TabsList className="grid w-full md:w-auto grid-cols-3">
                                    <TabsTrigger value="all">Tất cả ({bookmarks.length})</TabsTrigger>
                                    <TabsTrigger value="recent">Gần đây</TabsTrigger>
                                    <TabsTrigger value="alphabetical">A-Z</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-4">
                                {filteredBookmarks.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">Không tìm thấy từ nào phù hợp với "{searchTerm}"</p>
                                    </div>
                                ) : (
                                    filteredBookmarks.map(bookmark => (
                                        <Card key={bookmark.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <Link href={`/word/${bookmark.word}`} className="text-xl font-bold text-blue-600 hover:underline">
                                                            {bookmark.word}
                                                        </Link>
                                                        <p className="text-gray-600 mt-1">{bookmark.definition}</p>
                                                        <p className="text-gray-400 text-sm mt-2">Đã lưu: {bookmark.createdAt}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                                                        onClick={() => handleRemoveBookmark(bookmark.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default withAuth(BookmarksPage)