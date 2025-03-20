"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Edit, Trash2, AlertTriangle, Loader2, X } from "lucide-react"
import { apiRequest } from "@/utils/api"

// Định nghĩa kiểu dữ liệu
type Word = {
    id: string
    word: string
    pronunciation?: string
    created_at: string
    updated_at: string
    definition_count: number
    synonym_count: number
    etymology_count: number
}

type WordResponse = {
    data: Word[]
    total: number
    total_pages: number
    current_page: number
    limit: number
}

export default function WordsManagement() {
    const router = useRouter()
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Form state
    const [newWord, setNewWord] = useState("")
    const [newPronunciation, setNewPronunciation] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch words with debounced search
    const fetchWords = useCallback(async (page: number, size: number, search?: string) => {
        setLoading(true)
        try {
            const params: Record<string, string> = {
                page: page.toString(),
                size: size.toString(),
                fetchCounts: "true",
            }

            if (search && search.trim()) {
                params.word = search.trim()
            }

            const data = await apiRequest<WordResponse>("words", "GET", undefined, params)

            if (data) {
                setWords(data.data || [])
                setTotalPages(data.total_pages || 1)
                setCurrentPage(data.current_page || 1)
                setTotal(data.total || 0)
            } else {
                setWords([])
                setTotalPages(1)
                setCurrentPage(1)
                setTotal(0)
            }

            setError(null)
        } catch (err) {
            console.error("Error fetching words:", err)
            setError("Không thể tải danh sách từ. Vui lòng thử lại sau.")
            setWords([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Initial fetch
    useEffect(() => {
        fetchWords(currentPage, pageSize)
    }, [fetchWords, currentPage, pageSize])

    // Handle search with debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setCurrentPage(1) // Reset to first page on new search
            fetchWords(1, pageSize, searchTerm)
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchTerm, fetchWords, pageSize])

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    // Handle page size change
    const handlePageSizeChange = (size: string) => {
        setPageSize(Number(size))
        setCurrentPage(1)
    }

    // Xử lý thêm từ mới
    const handleAddWord = async () => {
        if (!newWord.trim()) {
            setFormError("Vui lòng nhập từ cần thêm")
            return
        }

        setSaving(true)
        try {
            const newWordData = await apiRequest<Word>("words", "POST", {
                word: newWord,
                pronunciation: newPronunciation || "",
            })

            if (!newWordData) {
                setFormError("Không thể thêm từ mới. Vui lòng thử lại sau.")
            }

            // Refresh the word list
            fetchWords(currentPage, pageSize, searchTerm)

            // Reset form
            setNewWord("")
            setNewPronunciation("")
            setFormError(null)
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error("Error adding word:", err)
            setFormError("Không thể thêm từ mới. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý sửa từ
    const handleEditWord = async () => {
        if (!selectedWord || !newWord.trim()) {
            setFormError("Vui lòng nhập từ cần sửa")
            return
        }

        setSaving(true)
        try {
            // Thực hiện API call để sửa từ
            const response = await apiRequest(`words/${selectedWord.id}`, "PUT", {
                word: newWord,
                pronunciation: newPronunciation,
            })

            if (response === null) {
                setFormError("Không thể cập nhật từ. Vui lòng thử lại sau.")
                return
            }

            // Refresh the word list
            fetchWords(currentPage, pageSize, searchTerm)

            // Reset form
            setNewWord("")
            setNewPronunciation("")
            setFormError(null)
            setIsEditDialogOpen(false)
        } catch (err) {
            console.error("Error updating word:", err)
            setFormError("Không thể cập nhật từ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý xóa từ
    const handleDeleteWord = async () => {
        if (!selectedWord) return

        setSaving(true)
        try {
            // Thực hiện API call để xóa từ
            await apiRequest(`words/${selectedWord.id}`, "DELETE")

            // Refresh the word list
            fetchWords(currentPage, pageSize, searchTerm)
            setIsDeleteDialogOpen(false)
        } catch (err) {
            console.error("Error deleting word:", err)
            alert("Không thể xóa từ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Mở dialog chỉnh sửa và điền thông tin từ
    const openEditDialog = (word: Word) => {
        setSelectedWord(word)
        setNewWord(word.word)
        setNewPronunciation(word.pronunciation || "")
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Mở dialog xóa
    const openDeleteDialog = (word: Word) => {
        setSelectedWord(word)
        setIsDeleteDialogOpen(true)
    }

    // Chuyển đến tab định nghĩa với từ đã chọn
    const navigateToDefinitions = (word: Word) => {
        // Lưu từ đã chọn vào localStorage để tab định nghĩa có thể lấy ra
        localStorage.setItem(
            "selectedFilterWord",
            JSON.stringify({
                id: word.id,
                word: word.word,
                pronunciation: word.pronunciation,
            }),
        )

        // Chuyển đến tab định nghĩa
        router.push({
            pathname: "/admin/dictionary",
            query: { tab: "definitions", wordId: word.id },
        })
    }

    // Chuyển đến tab từ đồng nghĩa với từ đã chọn
    const navigateToSynonyms = (word: Word) => {
        // Lưu từ đã chọn vào localStorage với thông tin đầy đủ
        const wordToSave = {
            id: word.id,
            word: word.word,
            pronunciation: word.pronunciation,
        }
        console.log("Saving word to localStorage:", wordToSave)
        localStorage.setItem("selectedFilterWord", JSON.stringify(wordToSave))

        // Chuyển đến tab từ đồng nghĩa
        router.push({
            pathname: "/admin/dictionary",
            query: { tab: "synonyms", wordId: word.id },
        })
    }

    // Chuyển đến tab nguồn gốc với từ đã chọn
    const navigateToEtymologies = (word: Word) => {
        localStorage.setItem(
            "selectedFilterWord",
            JSON.stringify({
                id: word.id,
                word: word.word,
                pronunciation: word.pronunciation,
            }),
        )

        router.push({
            pathname: "/admin/dictionary",
            query: { tab: "etymologies", wordId: word.id },
        })
    }

    // Xử lý khi xóa bộ lọc tìm kiếm
    const handleClearSearch = () => {
        setSearchTerm("")
        setCurrentPage(1)
        fetchWords(1, pageSize)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Từ</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm từ mới
                </Button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm từ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10"
                />
                {searchTerm && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                        onClick={handleClearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Bảng danh sách từ */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : error ? (
                <Card className="p-6 text-center text-red-600 bg-red-50">
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => fetchWords(1, pageSize, searchTerm)}>
                        Thử lại
                    </Button>
                </Card>
            ) : (
                <>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Từ</TableHead>
                                    <TableHead>Phát âm</TableHead>
                                    <TableHead className="text-center">Định nghĩa</TableHead>
                                    <TableHead className="text-center">Từ đồng nghĩa</TableHead>
                                    <TableHead className="text-center">Nguồn gốc</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {words.length > 0 ? (
                                    words.map((word) => (
                                        <TableRow key={word.id}>
                                            <TableCell className="font-medium">{word.word}</TableCell>
                                            <TableCell>{word.pronunciation || "-"}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                                                    onClick={() => navigateToDefinitions(word)}
                                                >
                                                    {word.definition_count || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                                                    onClick={() => navigateToSynonyms(word)}
                                                >
                                                    {word.synonym_count || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                                                    onClick={() => navigateToEtymologies(word)}
                                                >
                                                    {word.etymology_count || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(word)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(word)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                            {searchTerm ? "Không tìm thấy từ phù hợp" : "Chưa có từ nào trong từ điển"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Hiển thị {words.length} / {total} kết quả
                </span>
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Số lượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 / trang</SelectItem>
                                        <SelectItem value="10">10 / trang</SelectItem>
                                        <SelectItem value="20">20 / trang</SelectItem>
                                        <SelectItem value="50">50 / trang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Dialog thêm từ mới */}
            <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewWord("")
                        setNewPronunciation("")
                        setFormError(null)
                    }
                    setIsAddDialogOpen(open)
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Thêm từ mới</DialogTitle>
                        <DialogDescription>Điền thông tin để thêm từ mới vào từ điển.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="new-word" className="text-sm font-medium">
                                Từ <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="new-word"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                placeholder="Nhập từ cần thêm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="pronunciation" className="text-sm font-medium">
                                Phát âm
                            </label>
                            <Input
                                id="pronunciation"
                                value={newPronunciation}
                                onChange={(e) => setNewPronunciation(e.target.value)}
                                placeholder="Nhập phát âm của từ"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddWord} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm từ"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog chỉnh sửa từ */}
            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewWord("")
                        setNewPronunciation("")
                        setFormError(null)
                    }
                    setIsEditDialogOpen(open)
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa từ</DialogTitle>
                        <DialogDescription>Chỉnh sửa thông tin của từ.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="edit-word" className="text-sm font-medium">
                                Từ <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="edit-word"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                                placeholder="Nhập từ cần sửa"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-pronunciation" className="text-sm font-medium">
                                Phát âm
                            </label>
                            <Input
                                id="edit-pronunciation"
                                value={newPronunciation}
                                onChange={(e) => setNewPronunciation(e.target.value)}
                                placeholder="Nhập phát âm của từ"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleEditWord} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Cập nhật"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Xác nhận xóa từ
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa từ "{selectedWord?.word}" khỏi từ điển? Hành động này không thể hoàn tác và sẽ
                            xóa tất cả định nghĩa, từ đồng nghĩa, và nguồn gốc liên quan đến từ này.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteWord} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa từ"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}