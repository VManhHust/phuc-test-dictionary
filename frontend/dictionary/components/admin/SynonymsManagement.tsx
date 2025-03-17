"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {PlusCircle, Edit, Trash2, AlertTriangle, ArrowRight, Loader2, Filter} from "lucide-react"
import WordSearchBar from "./WordSearchBar"
import {apiRequest} from "@/utils/api"

// Types
type Word = {
    id: string
    word: string
    pronunciation?: string
}

type Synonym = {
    id: string
    word: Word
    synonym_word: string
    created_at: string
    updated_at: string
}

type SynonymsResponse = {
    data: Synonym[]
    total: number
    total_pages: number
    current_page: number
    limit: number
}

export default function SynonymsManagement() {
    // State for selected word and synonyms
    const [filterWord, setFilterWord] = useState<Word | null>(null)
    const [synonyms, setSynonyms] = useState<Synonym[]>([])

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
    const [selectedSynonym, setSelectedSynonym] = useState<Synonym | null>(null)

    // Form state - separate from filter state
    const [formSourceWord, setFormSourceWord] = useState<Word | null>(null)
    const [formSynonymWord, setFormSynonymWord] = useState<Word | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch synonyms on initial load and when page or page size changes
    useEffect(() => {
        fetchSynonyms(currentPage, pageSize)
    }, [currentPage, pageSize])

    // Fetch synonyms when filter word is selected
    useEffect(() => {
        if (filterWord !== undefined) {
            setCurrentPage(1)
            fetchSynonyms(1, pageSize)
        }
    }, [filterWord, pageSize])

    // Thêm useEffect để kiểm tra và lấy từ đã chọn từ localStorage khi component mount
    useEffect(() => {
        const savedWord = localStorage.getItem("selectedFilterWord")
        if (savedWord) {
            try {
                const parsedWord = JSON.parse(savedWord) as Word
                console.log("Loading saved word from localStorage:", parsedWord)
                setFilterWord(parsedWord)
                // Xóa từ đã lưu sau khi đã sử dụng
                localStorage.removeItem("selectedFilterWord")
            } catch (error) {
                console.error("Error parsing saved word:", error)
            }
        }
    }, [])

    // Function to fetch synonyms
    const fetchSynonyms = async (page: number, size: number) => {
        setLoading(true)
        try {
            const params: Record<string, string> = {
                page: page.toString(),
                size: size.toString(),
            }

            if (filterWord) {
                params.word = filterWord.id
            }

            const data = await apiRequest<SynonymsResponse>("synonyms", "GET", undefined, params)

            if (data) {
                setSynonyms(data.data)
                setTotalPages(data.total_pages)
                setCurrentPage(data.current_page)
                setTotal(data.total)
            } else {
                setSynonyms([])
                setTotalPages(0)
                setTotal(0)
            }
        } catch (error) {
            console.error("Error fetching synonyms:", error)
            setSynonyms([])
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
        // Explicitly call fetchSynonyms to reload all data
        fetchSynonyms(1, pageSize)
    }

    // Open add dialog with reset form
    const openAddDialog = () => {
        setFormSourceWord(null)
        setFormSynonymWord(null)
        setFormError(null)
        setIsAddDialogOpen(true)
    }

    // Handle adding a new synonym
    const handleAddSynonym = async () => {
        if (!formSourceWord) {
            setFormError("Vui lòng chọn từ")
            return
        }

        if (!formSynonymWord) {
            setFormError("Vui lòng chọn từ đồng nghĩa")
            return
        }

        // Kiểm tra xem từ và từ đồng nghĩa có phải là cùng một từ không
        if (formSourceWord.id === formSynonymWord.id) {
            setFormError("Từ và từ đồng nghĩa không thể là cùng một từ")
            return
        }

        setSaving(true)
        try {
            console.log("Creating synonym with word_id:", formSourceWord.id, "and synonym_word:", formSynonymWord.id)

            const response = await apiRequest<Synonym>("synonyms", "POST", {
                wordId: formSourceWord.id,
                synonym_word: formSynonymWord.word,
            })

            if (response) {
                // Refresh synonyms list
                fetchSynonyms(currentPage, pageSize)

                // Reset form
                setFormSynonymWord(null)
                setFormSourceWord(null)
                setFormError(null)
                setIsAddDialogOpen(false)
            } else {
                setFormError("Không thể thêm từ đồng nghĩa. Vui lòng thử lại sau.")
            }
        } catch (error) {
            console.error("Error adding synonym:", error)
            setFormError("Không thể thêm từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle editing a synonym
    const handleEditSynonym = async () => {
        if (!selectedSynonym || !formSynonymWord) {
            setFormError("Vui lòng chọn từ đồng nghĩa")
            return
        }

        setSaving(true)
        try {
            console.log("Updating synonym with ID:", selectedSynonym.id, "to synonym_word:", formSynonymWord.id)

            const response = await apiRequest<Synonym>(`synonyms/${selectedSynonym.id}`, "PUT", {
                synonym_word: formSynonymWord.word,
            })

            if (response) {
                // Refresh synonyms list
                fetchSynonyms(currentPage, pageSize)

                // Reset form
                setFormSynonymWord(null)
                setFormError(null)
                setIsEditDialogOpen(false)
            } else {
                setFormError("Không thể cập nhật từ đồng nghĩa. Vui lòng thử lại sau.")
            }
        } catch (error) {
            console.error("Error updating synonym:", error)
            setFormError("Không thể cập nhật từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle deleting a synonym
    const handleDeleteSynonym = async () => {
        if (!selectedSynonym) return

        setSaving(true)
        try {
            const response = await apiRequest<{ success: boolean }>(`synonyms/${selectedSynonym.id}`, "DELETE")

            // Refresh synonyms list
            fetchSynonyms(currentPage, pageSize)
            setIsDeleteDialogOpen(false)

        } catch (error) {
            console.error("Error deleting synonym:", error)
            alert("Không thể xóa từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Open edit dialog
    const openEditDialog = (synonym: Synonym) => {
        setSelectedSynonym(synonym)
        // Create a Word object from the synonym_word string
        setFormSynonymWord({
            id: "",
            word: synonym.synonym_word,
        })
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Open delete dialog
    const openDeleteDialog = (synonym: Synonym) => {
        setSelectedSynonym(synonym)
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
                <h2 className="text-2xl font-semibold">Quản lý Từ đồng nghĩa</h2>
                <Button onClick={openAddDialog} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Thêm từ đồng nghĩa mới
                </Button>
            </div>

            {/* Word search bar */}
            <div className="mb-6">
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <WordSearchBar
                            onWordSelect={handleFilterWordSelect}
                            onClear={clearWordFilter}
                            placeholder="Tìm kiếm từ để lọc từ đồng nghĩa..."
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
                        <Filter className="h-4 w-4 text-blue-500 mr-2"/>
                        <p className="text-blue-700 font-medium">
                            Đang lọc từ đồng nghĩa của: <span className="font-bold">{filterWord.word}</span>
                            {filterWord.pronunciation && ` (${filterWord.pronunciation})`}
                        </p>
                    </div>
                )}
            </div>

            {/* Synonyms table */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                </div>
            ) : (
                <>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Từ</TableHead>
                                    <TableHead className="text-center">Mối quan hệ</TableHead>
                                    <TableHead>Từ đồng nghĩa</TableHead>
                                    <TableHead className="text-right w-[120px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {synonyms.length > 0 ? (
                                    synonyms.map((synonym) => (
                                        <TableRow key={synonym.id}>
                                            <TableCell className="font-medium">{synonym.word.word}</TableCell>
                                            <TableCell className="text-center">
                                                <ArrowRight className="h-4 w-4 mx-auto"/>
                                            </TableCell>
                                            <TableCell className="font-medium">{synonym.synonym_word}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(synonym)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(synonym)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                                            {filterWord
                                                ? "Chưa có từ đồng nghĩa nào cho từ này"
                                                : "Không có từ đồng nghĩa nào trong hệ thống"}
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
                  Hiển thị {synonyms.length} / {total} kết quả
                </span>
                                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Số lượng"/>
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
                                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
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

            {/* Add synonym dialog */}
            <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        // Reset form when dialog is closed
                        setFormSourceWord(null)
                        setFormSynonymWord(null)
                        setFormError(null)
                    }
                    setIsAddDialogOpen(open)
                }}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm từ đồng nghĩa mới</DialogTitle>
                        <DialogDescription>Chọn từ và từ đồng nghĩa để thêm mới</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2"/>
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="word-select" className="text-sm font-medium">
                                Chọn từ <span className="text-red-500">*</span>
                            </label>
                            <WordSearchBar
                                onWordSelect={(word) => setFormSourceWord(word)}
                                placeholder="Tìm kiếm từ..."
                                initialValue={formSourceWord}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="synonym-word" className="text-sm font-medium">
                                Chọn từ đồng nghĩa <span className="text-red-500">*</span>
                            </label>
                            <WordSearchBar
                                onWordSelect={(word) => setFormSynonymWord(word)}
                                placeholder="Tìm kiếm từ đồng nghĩa..."
                                initialValue={formSynonymWord}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false)
                                setFormSourceWord(null)
                                setFormSynonymWord(null)
                                setFormError(null)
                            }}
                            disabled={saving}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleAddSynonym} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm từ đồng nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit synonym dialog */}
            <Dialog
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        // Reset form when dialog is closed
                        setFormSynonymWord(null)
                        setFormError(null)
                    }
                    setIsEditDialogOpen(open)
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa từ đồng nghĩa</DialogTitle>
                        <DialogDescription>Chỉnh sửa từ đồng nghĩa cho từ
                            "{selectedSynonym?.word.word}"</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2"/>
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="edit-synonym-word" className="text-sm font-medium">
                                Chọn từ đồng nghĩa mới <span className="text-red-500">*</span>
                            </label>
                            <WordSearchBar
                                onWordSelect={(word) => setFormSynonymWord(word)}
                                placeholder="Tìm kiếm từ đồng nghĩa mới..."
                                initialValue={formSynonymWord}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleEditSynonym} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
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
                            <AlertTriangle className="h-5 w-5 mr-2"/>
                            Xác nhận xóa từ đồng nghĩa
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa từ đồng nghĩa "{selectedSynonym?.synonym_word}" của từ "
                            {selectedSynonym?.word.word}"? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSynonym} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa từ đồng nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

