"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreateArticlePage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Ở đây bạn sẽ gửi dữ liệu đến API
        console.log({ title, content })
        router.push("/news")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tạo bài viết mới</CardTitle>
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
                    <Button type="submit">Đăng bài</Button>
                </form>
            </CardContent>
        </Card>
    )
}

