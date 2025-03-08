"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ThumbsDown, MessageCircle, Share2, Calendar, User, Edit, Trash2, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

type Author = {
    id: string
    username: string
    email: string
    password: string
    enabled: boolean
    roles: string
    created_at: string
}

type Comment = {
    id: string
    user_id: string
    content: string
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
    comments: Comment[]
}

export default function ArticlePage() {
    const router = useRouter()
    const { id } = router.query

    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newComment, setNewComment] = useState("")
    const [commentLoading, setCommentLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // State để theo dõi trạng thái like/dislike của người dùng hiện tại
    const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(null)

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
                const data: Article = await response.json()
                if (data) {
                    setArticle(data)

                    // Trong thực tế, bạn sẽ lấy trạng thái like/dislike của người dùng từ API
                    // Ở đây tôi giả định là chưa có reaction
                    setUserReaction(null)
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

    const handleLike = async () => {
        if (!article) return

        try {
            // Xác định trạng thái like mới dựa trên trạng thái hiện tại
            const newLikeState = userReaction === "like" ? null : "like"

            // Tính toán số lượt like/dislike mới
            let newLikeCount = article.like_counts
            let newDislikeCount = article.dislike_counts

            if (newLikeState === "like") {
                // Thêm like
                newLikeCount += 1

                // Nếu trước đó đã dislike, giảm dislike đi 1
                if (userReaction === "dislike") {
                    newDislikeCount -= 1
                }
            } else {
                // Bỏ like
                newLikeCount -= 1
            }

            // Trong môi trường thực tế, bạn sẽ gọi API để cập nhật like/dislike
            // const response = await fetch(`http://localhost:3001/posts/reaction`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     postId: article.id,
            //     userId: "current-user-id",
            //     reaction: newLikeState
            //   })
            // })

            // Cập nhật UI
            setUserReaction(newLikeState)
            setArticle({
                ...article,
                like_counts: newLikeCount,
                dislike_counts: newDislikeCount,
            })
        } catch (err) {
            console.error("Error updating like:", err)
        }
    }

    const handleDislike = async () => {
        if (!article) return

        try {
            // Xác định trạng thái dislike mới dựa trên trạng thái hiện tại
            const newDislikeState = userReaction === "dislike" ? null : "dislike"

            // Tính toán số lượt like/dislike mới
            let newLikeCount = article.like_counts
            let newDislikeCount = article.dislike_counts

            if (newDislikeState === "dislike") {
                // Thêm dislike
                newDislikeCount += 1

                // Nếu trước đó đã like, giảm like đi 1
                if (userReaction === "like") {
                    newLikeCount -= 1
                }
            } else {
                // Bỏ dislike
                newDislikeCount -= 1
            }

            // Trong môi trường thực tế, bạn sẽ gọi API để cập nhật like/dislike
            // const response = await fetch(`http://localhost:3001/posts/reaction`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     postId: article.id,
            //     userId: "current-user-id",
            //     reaction: newDislikeState
            //   })
            // })

            // Cập nhật UI
            setUserReaction(newDislikeState)
            setArticle({
                ...article,
                like_counts: newLikeCount,
                dislike_counts: newDislikeCount,
            })
        } catch (err) {
            console.error("Error updating dislike:", err)
        }
    }

    // Cập nhật hàm handleComment để sử dụng API thực tế
    const handleComment = async () => {
        if (!article || !newComment.trim()) return

        setCommentLoading(true)
        try {
            const response = await fetch("http://localhost:3001/comments/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: article.id,
                    userId: "a1b2c3d4-e5f6-7890-1234-abcdef987654", // Trong thực tế, lấy từ context xác thực
                    content: newComment,
                }),
            })

            if (response.ok) {
                const newCommentData = await response.json()

                // Cập nhật UI với comment mới
                const updatedComments = article.comments ? [...article.comments] : []
                updatedComments.push({
                    id: newCommentData.id,
                    user_id: newCommentData.user_id,
                    content: newCommentData.content,
                    created_at: newCommentData.created_at,
                })

                setArticle({
                    ...article,
                    comments: updatedComments,
                })
                setNewComment("")
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`)
                alert("Không thể thêm bình luận. Vui lòng thử lại sau.")
            }
        } catch (err) {
            console.error("Error adding comment:", err)
            alert("Đã xảy ra lỗi khi thêm bình luận.")
        } finally {
            setCommentLoading(false)
        }
    }

    // Hàm xử lý xóa bài viết
    const handleDeleteArticle = async () => {
        if (!article) return

        setDeleting(true)
        try {
            // Trong môi trường thực tế, bạn sẽ gọi API để xóa bài viết
            // const response = await fetch(`http://localhost:3001/posts/delete/${article.id}`, {
            //   method: 'DELETE'
            // })

            // if (response.ok) {
            //   router.push('/news')
            // } else {
            //   throw new Error(`Error: ${response.status} ${response.statusText}`)
            // }

            // Giả lập xóa thành công
            setTimeout(() => {
                setDeleteDialogOpen(false)
                router.push("/news")
            }, 1000)
        } catch (err) {
            console.error("Error deleting article:", err)
            alert("Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại sau.")
        } finally {
            setDeleting(false)
        }
    }

    // Hàm để định dạng thời gian
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString)
            return formatDistanceToNow(date, { addSuffix: true, locale: vi })
        } catch (error) {
            return dateString
        }
    }

    // Hàm để lấy tên người dùng từ user_id (trong thực tế sẽ gọi API)
    const getUsernameById = (userId: string): string => {
        // Trong môi trường thực tế, bạn sẽ lấy thông tin người dùng từ API hoặc store
        if (article && userId === article.author.id) {
            return article.author.username
        }
        return "Người dùng"
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-3xl mx-auto border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600">{error || "Không tìm thấy bài viết"}</p>
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
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-blue-50 border-b">
                        <CardTitle className="text-3xl text-blue-800">{article.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm mt-2">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span>{article.author.username}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(article.created_at)}</span>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="prose max-w-none mb-6">
                            <p className="text-gray-700 whitespace-pre-line">{article.content}</p>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4 mt-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    className={`${
                                        userReaction === "like"
                                            ? "bg-green-100 text-green-700"
                                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                                    }`}
                                    onClick={handleLike}
                                >
                                    <Heart className="mr-2 h-5 w-5" fill={userReaction === "like" ? "currentColor" : "none"} />
                                    Thích ({article.like_counts})
                                </Button>
                                <Button
                                    variant="ghost"
                                    className={`${
                                        userReaction === "dislike"
                                            ? "bg-red-100 text-red-700"
                                            : "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    }`}
                                    onClick={handleDislike}
                                >
                                    <ThumbsDown className="mr-2 h-5 w-5" fill={userReaction === "dislike" ? "currentColor" : "none"} />
                                    Không thích ({article.dislike_counts})
                                </Button>
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Chia sẻ
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    className="text-blue-600"
                                    onClick={() => router.push(`/news/edit/${article.id}`)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Sửa
                                </Button>
                                <Button variant="outline" className="text-red-600" onClick={() => setDeleteDialogOpen(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Bình luận ({article.comments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mb-6">
                            {article.comments.length > 0 ? (
                                article.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-blue-700">{getUsernameById(comment.user_id)}</span>
                                            <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Textarea
                                placeholder="Viết bình luận của bạn..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <Button
                                onClick={handleComment}
                                disabled={!newComment.trim() || commentLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {commentLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Gửi bình luận
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dialog xác nhận xóa bài viết */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Xác nhận xóa bài viết
                        </DialogTitle>
                        <DialogDescription className="pt-3">
                            Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteArticle} disabled={deleting}>
                            {deleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa bài viết"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

