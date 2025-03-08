"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateArticlePage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Trong môi trường thực tế, bạn sẽ lấy user_id từ context xác thực
    const user_id = "a1b2c3d4-e5f6-7890-1234-abcdef987654" // ID người dùng hiện tại

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            setError("Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch("http://localhost:3001/posts/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    user_id,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                // Chuyển hướng đến trang chi tiết bài viết sau khi tạo thành công
                router.push(`/news/${data.id}`)
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`)
                setError(`Lỗi ${response.status}: Không thể tạo bài viết. Vui lòng thử lại sau.`)
            }
        } catch (err) {
            console.error("Error creating article:", err)
            setError("Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-2xl text-blue-800">Tạo bài viết mới</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="h-12"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Nhập nội dung bài viết"
                                    className="min-h-[300px]"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.push("/news")}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                            Đang tạo...
                                        </>
                                    ) : (
                                        "Đăng bài"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

