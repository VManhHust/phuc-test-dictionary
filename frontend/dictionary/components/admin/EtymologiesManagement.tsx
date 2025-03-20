"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, AlertTriangle, Loader2, Filter, Link as LinkIcon } from "lucide-react"
import WordSearchBar from "./WordSearchBar"
import { apiRequest } from "@/utils/api"

// Types
type Word = {
    id: string
    word: string
    pronunciation?: string
}

type Etymology = {
    id: string
    word: Word
    origin: string
    url?: string
    created_at: string
    updated_at: string
}

type EtymologiesResponse = {
    data: Etymology[]
    total: number
    total_pages: number
    current_page: number
    limit: number
}

export default function EtymologiesManagement() {
    // State for filter word and etymologies
    const [filterWord, setFilterWord] = useState<Word | null>(null)
    const [etymologies, setEtymologies] = useState<Etymology[]>([])

    // State for loading and pagination
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)

    // State for dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedEtymology, setSelectedEtymology] = useState<Etymology | null>(null)

    // Form state - separate from filter state
    const [formWord, setFormWord] = useState<Word | null>(null)
    const [originText, setOriginText] = useState("")
    const [urlText, setUrlText] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch etymologies on initial load and when page changes
    useEffect(() => {
        fetchEtymologies(currentPage, pageSize)
    }, [currentPage, pageSize])

    // Fetch etymologies when a filter word is selected
    useEffect(() => {
        if (filterWord !== undefined) {
            setCurrentPage(1)
            fetchEtymologies(1, pageSize)
        }
    }, [filterWord, pageSize])

    // Thêm useEffect để kiểm tra và lấy từ đã chọn từ localStorage khi component mount
    useEffect(() => {
        const savedWord = localStorage.getItem("selectedFilterWord")
        if (savedWord) {
            try {
                const parsedWord = JSON.parse(savedWord) as Word
                console.log("Loading saved word from localStorage for etymologies:", parsedWord)
                setFilterWord(parsedWord)
                // Xóa từ đã lưu sau khi đã sử dụng
                localStorage.removeItem("selectedFilterWord")
            } catch (error) {
                console.error("Error parsing saved word:", error)
            }
        }
    }, [])

    // Function to fetch etymologies
    const fetchEtymologies = async (page: number, size: number) => {
        setLoading(true)
        try {
            const params: Record<string, string> = {
                page: page.toString(),
                size: size.toString(),
            }

            if (filterWord) {
                params.word = filterWord.id
            }

            const data = await apiRequest<EtymologiesResponse>("etymologies", "GET", undefined, params)

            if (data) {
                setEtymologies(data.data)
                setTotalPages(data.total_pages)
                setCurrentPage(data.current_page)
                setTotal(data.total)
            } else {
                setEtymologies([])
                setTotalPages(0)
                setTotal(0)
            }
        } catch (error) {
            console.error("Error fetching etymologies:", error)
            setEtymologies([])
            setTotalPages(0)
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    // Handle word selection from search for filtering
    const handleFilterWordSelect = (word: Word) => {
        setFilterWord(word)
    }

    // Clear word filter
    const clearWordFilter = () => {
        setFilterWord(null)
        setCurrentPage(1)
        fetchEtymologies(1, pageSize)
    }

    // Open add dialog with reset form
    const openAddDialog = () => {
        setFormWord(null)
        setOriginText("")
        setUrlText("")
        setFormError(null)
        setIsAddDialogOpen(true)
    }

    // Handle adding a new etymology
    const handleAddEtymology = async () => {
        if (!formWord) {
            setFormError("Vui lòng chọn từ")
            return
        }
        if (!originText.trim()) {
            setFormError("Vui lòng nhập nguồn gốc của từ")
            return
        }

        setSaving(true)
        try {
            const response = await apiRequest<Etymology>("etymologies", "POST", {
                wordId: formWord.id,
                origin: originText,
                url: urlText || undefined,
            })

            if (response) {
                // Refresh etymologies list
                fetchEtymologies(currentPage, pageSize)

                // Reset form
                setFormWord(null)
                setOriginText("")
                setUrlText("")
                setFormError(null)
                setIsAddDialogOpen(false)
            } else {
                setFormError("Không thể thêm nguồn gốc từ. Vui lòng thử lại sau.")
            }
        } catch (error) {
            console.error("Error adding etymology:", error)
            setFormError("Không thể thêm nguồn gốc từ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle editing an etymology
    const handleEditEtymology = async () => {
        if (!selectedEtymology || !originText.trim()) {
            setFormError("Vui lòng nhập nguồn gốc của từ")
            return
        }

        setSaving(true)
        try {
            const response = await apiRequest<Etymology>(`etymologies/${selectedEtymology.id}`, "PUT", {
                origin: originText,
                url: urlText || undefined,
            })

            if (response) {
                // Refresh etymologies list
                fetchEtymologies(currentPage, pageSize)

                // Reset form
                setOriginText("")
                setUrlText("")
                setFormError(null)
                setIsEditDialogOpen(false)
            } else {
                setFormError("Không thể cập nhật nguồn gốc từ. Vui lòng thử lại sau.")
            }
        } catch (error) {
            console.error("Error updating etymology:", error)
            setFormError("Không thể cập nhật nguồn gốc từ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle deleting an etymology
    const handleDeleteEtymology = async () => {
        if (!selectedEtymology) return

        setSaving(true)
        try {
            const response = await apiRequest<{ success: boolean }>(`etymologies/${selectedEtymology.id}`, "DELETE")

            // Refresh etymologies list
            fetchEtymologies(currentPage, pageSize)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            console.error("Error deleting etymology:", error)
            alert("Không thể xóa nguồn gốc từ. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Open edit dialog
    const openEditDialog = (etymology: Etymology) => {
        setSelectedEtymology(etymology)
        setOriginText(etymology.origin)
        setUrlText(etymology.url || "")
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Open delete dialog
    const openDeleteDialog = (etymology: Etymology) => {
        setSelectedEtymology(etymology)
        setIsDeleteDialogOpen(true)
    }

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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Nguồn gốc từ</h2>
                <Button onClick={openAddDialog} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm nguồn gốc mới
                </Button>
            </div>

            {/* Word search bar */}
            <div className="mb-6">
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <WordSearchBar
                            onWordSelect={handleFilterWordSelect}
                            onClear={clearWordFilter}
                            placeholder="Tìm kiếm từ để lọc nguồn gốc..."
                        />
                    </div>
                    {filterWord && (
                        <Button variant="outline" size="sm" onClick={clearWordFilter} className="whitespace-nowrap">
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {filterWord && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-center">
                        <Filter className="h-4 w-4 text-blue-500 mr-2" />
                        <p className="text-blue-700 font-medium">
                            Đang lọc nguồn gốc của từ: <span className="font-bold">{filterWord.word}</span>
                            {filterWord.pronunciation && ` (${filterWord.pronunciation})`}
                        </p>
                    </div>
                )}
            </div>

            {/* Etymologies table */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Từ</TableHead>
                                    <TableHead className="w-[400px]">Nguồn gốc</TableHead>
                                    <TableHead>Liên kết</TableHead>
                                    <TableHead className="text-right w-[120px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {etymologies.length > 0 ? (
                                    etymologies.map((etymology) => (
                                        <TableRow key={etymology.id}>
                                            <TableCell className="font-medium">{etymology.word.word}</TableCell>
                                            <TableCell>
                                                <div className="max-h-20 overflow-auto">{etymology.origin}</div>
                                            </TableCell>
                                            <TableCell>
                                                {etymology.url ? (
                                                    <a
                                                        href={etymology.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        <LinkIcon className="h-4 w-4 mr-1" />
                                                        Xem nguồn
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">Không có</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(etymology)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(etymology)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                            {filterWord ? "Chưa có nguồn gốc nào cho từ này" : "Không có nguồn gốc nào trong hệ thống"}
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
                                  Hiển thị {etymologies.length} / {total} kết quả
                                </span>
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

            {/* Add etymology dialog */}
            <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        // Reset form when dialog is closed
                        setFormWord(null)
                        setOriginText("")
                        setUrlText("")
                        setFormError(null)
                    }
                    setIsAddDialogOpen(open)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm nguồn gốc mới</DialogTitle>
                        <DialogDescription>Chọn từ và nhập thông tin nguồn gốc</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="word-select" className="text-sm font-medium">
                                Chọn từ <span className="text-red-500">*</span>
                            </label>
                            <WordSearchBar
                                onWordSelect={(word) => setFormWord(word)}
                                placeholder="Tìm kiếm từ..."
                                initialValue={formWord}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="origin" className="text-sm font-medium">
                                Nguồn gốc <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="origin"
                                value={originText}
                                onChange={(e) => setOriginText(e.target.value)}
                                placeholder="Nhập nguồn gốc của từ"
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-medium">
                                Liên kết tham khảo
                            </label>
                            <Input
                                id="url"
                                value={urlText}
                                onChange={(e) => setUrlText(e.target.value)}
                                placeholder="Nhập URL tham khảo (nếu có)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false)
                                setFormWord(null)
                                setOriginText("")
                                setUrlText("")
                                setFormError(null)
                            }}
                            disabled={saving}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleAddEtymology} className="bg-blue-600" disabled={saving || !formWord}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm nguồn gốc"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit etymology dialog */}
            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        // Reset form when dialog is closed
                        setOriginText("")
                        setUrlText("")
                        setFormError(null)
                    }
                    setIsEditDialogOpen(open)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa nguồn gốc</DialogTitle>
                        <DialogDescription>Chỉnh sửa nguồn gốc cho từ "{selectedEtymology?.word.word}"</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="edit-origin" className="text-sm font-medium">
                                Nguồn gốc <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="edit-origin"
                                value={originText}
                                onChange={(e) => setOriginText(e.target.value)}
                                placeholder="Nhập nguồn gốc của từ"
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-url" className="text-sm font-medium">
                                Liên kết tham khảo
                            </label>
                            <Input
                                id="edit-url"
                                value={urlText}
                                onChange={(e) => setUrlText(e.target.value)}
                                placeholder="Nhập URL tham khảo (nếu có)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleEditEtymology} className="bg-blue-600" disabled={saving}>
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

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Xác nhận xóa nguồn gốc
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa nguồn gốc này của từ "{selectedEtymology?.word.word}"? Hành động này không thể
                            hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteEtymology} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa nguồn gốc"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}