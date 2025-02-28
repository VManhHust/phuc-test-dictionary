"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EditArticlePage() {
    const router = useRouter()
    const { id } = router.query

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    useEffect(() => {
        // Ở đây bạn sẽ fetch dữ liệu bài viết từ API dựa vào id
        // Đây là dữ liệu mẫu
        setTitle("Tiêu đề bài viết mẫu")
        setContent("Nội dung bài viết mẫu...")
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Ở đây bạn sẽ gửi dữ liệu cập nhật đến API
        console.log({ id, title, content })
        router.push(`/news/${id}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chỉnh sửa bài viết</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Tiêu đề
                        </label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Nội dung
                        </label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
                    </div>
                    <Button type="submit">Cập nhật</Button>
                </form>
            </CardContent>
        </Card>
    )
}

