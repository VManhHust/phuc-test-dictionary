"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditArticlePage() {
    const router = useRouter()
    const { id } = router.query

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            fetchArticle(id as string)
        }
    }, [id])

    const fetchArticle = async (articleId: string) => {
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:3001/posts/get-post?id=${articleId}`)

            if (response.ok) {
                const data = await response.json()
                if (data) {
                    setTitle(data.title)
                    setContent(data.content)
                } else {
                    setError("Không tìm thấy bài viết")
                }
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`)
                setError(`Lỗi ${response.status}: Không thể tải bài viết`)
            }
        } catch (err) {
            console.error("Error fetching article:", err)
            setError("Đã xảy ra lỗi khi tải bài viết")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            setError("Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết")
            return
        }

        setSaving(true)
        setError(null)

        try {
            const response = await fetch(`http://localhost:3001/posts/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                // Chuyển hướng đến trang chi tiết bài viết sau khi cập nhật thành công
                router.push(`/news/${data.id}`)
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`)
                setError(`Lỗi ${response.status}: Không thể cập nhật bài viết. Vui lòng thử lại sau.`)
            }
        } catch (err) {
            console.error("Error updating article:", err)
            setError("Đã xảy ra lỗi khi cập nhật bài viết. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    if (error && !title && !content) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-3xl mx-auto border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600">{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => router.push("/news")}>
                            Quay lại danh sách bài viết
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-2xl text-blue-800">Chỉnh sửa bài viết</CardTitle>
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
                                <Button type="button" variant="outline" onClick={() => router.push(`/news/${id}`)}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        "Cập nhật"
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

