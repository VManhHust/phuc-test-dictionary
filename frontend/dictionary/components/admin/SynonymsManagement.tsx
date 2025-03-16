"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Edit, Trash2, AlertTriangle, ArrowRight, Loader2, Filter } from "lucide-react"
import WordSearchBar from "./WordSearchBar"

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
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)
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

    // Form state
    const [newSynonymWord, setNewSynonymWord] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch synonyms on initial load and when page or page size changes
    useEffect(() => {
        fetchSynonyms(currentPage, pageSize)
    }, [currentPage, pageSize])

    // Fetch synonyms when a word is selected
    useEffect(() => {
        if (selectedWord !== undefined) {
            setCurrentPage(1)
            fetchSynonyms(1, pageSize)
        }
    }, [selectedWord, pageSize])

    // Function to fetch synonyms
    const fetchSynonyms = async (page: number, size: number) => {
        setLoading(true)
        try {
            const url = new URL("http://localhost:3001/synonyms")
            url.searchParams.append("page", page.toString())
            url.searchParams.append("size", size.toString())

            if (selectedWord) {
                url.searchParams.append("word", selectedWord.id)
            }

            const response = await fetch(url.toString())

            if (!response.ok) {
                setSynonyms([])
            }

            const data: SynonymsResponse = await response.json()
            setSynonyms(data.data)
            setTotalPages(data.total_pages)
            setCurrentPage(data.current_page)
            setTotal(data.total)
        } catch (error) {
                setSynonyms([])
        } finally {
            setLoading(false)
        }
    }

    // Handle word selection from search
    const handleWordSelect = (word: Word) => {
        setSelectedWord(word)
    }

    // Clear word filter
    const clearWordFilter = () => {
        setSelectedWord(null)
        setCurrentPage(1)
        fetchSynonyms(1, pageSize)
    }

    // Handle adding a new synonym
    const handleAddSynonym = async () => {
        if (!selectedWord || !newSynonymWord.trim()) {
            setFormError("Vui lòng nhập từ đồng nghĩa")
            return
        }

        setSaving(true)
        try {
            const response = await fetch("http://localhost:3001/synonyms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    word_id: selectedWord.id,
                    synonym_word: newSynonymWord,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Refresh synonyms list
            fetchSynonyms(currentPage, pageSize)

            // Reset form
            setNewSynonymWord("")
            setFormError(null)
            setIsAddDialogOpen(false)
        } catch (error) {
            console.error("Error adding synonym:", error)
            setFormError("Không thể thêm từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle editing a synonym
    const handleEditSynonym = async () => {
        if (!selectedSynonym || !newSynonymWord.trim()) {
            setFormError("Vui lòng nhập từ đồng nghĩa")
            return
        }

        setSaving(true)
        try {
            const response = await fetch(`http://localhost:3001/synonyms/${selectedSynonym.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    synonym_word: newSynonymWord,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Refresh synonyms list
            fetchSynonyms(currentPage, pageSize)

            // Reset form
            setNewSynonymWord("")
            setFormError(null)
            setIsEditDialogOpen(false)
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
            const response = await fetch(`http://localhost:3001/synonyms/${selectedSynonym.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

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
        setNewSynonymWord(synonym.synonym_word)
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

    // @ts-ignore
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Từ đồng nghĩa</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600" disabled={!selectedWord}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm từ đồng nghĩa mới
                </Button>
            </div>

            {/* Word search bar */}
            <div className="mb-6">
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <WordSearchBar onWordSelect={handleWordSelect} placeholder="Tìm kiếm từ để lọc từ đồng nghĩa..." />
                    </div>
                    {selectedWord && (
                        <Button variant="outline" size="sm" onClick={clearWordFilter} className="whitespace-nowrap">
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {selectedWord && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-center">
                        <Filter className="h-4 w-4 text-blue-500 mr-2" />
                        <p className="text-blue-700 font-medium">
                            Đang lọc từ đồng nghĩa của: <span className="font-bold">{selectedWord.word}</span>
                            {selectedWord.pronunciation && ` (${selectedWord.pronunciation})`}
                        </p>
                    </div>
                )}
            </div>

            {/* Synonyms table */}
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
                                                <ArrowRight className="h-4 w-4 mx-auto" />
                                            </TableCell>
                                            <TableCell className="font-medium">{synonym.synonym_word}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(synonym)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(synonym)}
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
                                            {selectedWord
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

            {/* Add synonym dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm từ đồng nghĩa mới</DialogTitle>
                        <DialogDescription>Thêm từ đồng nghĩa cho từ "{selectedWord?.word}"</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="synonym-word" className="text-sm font-medium">
                                Từ đồng nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="synonym-word"
                                value={newSynonymWord}
                                onChange={(e) => setNewSynonymWord(e.target.value)}
                                placeholder="Nhập từ đồng nghĩa"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddSynonym} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa từ đồng nghĩa</DialogTitle>
                        <DialogDescription>Chỉnh sửa từ đồng nghĩa cho từ "{selectedSynonym?.word.word}"</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="edit-synonym-word" className="text-sm font-medium">
                                Từ đồng nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="edit-synonym-word"
                                value={newSynonymWord}
                                onChange={(e) => setNewSynonymWord(e.target.value)}
                                placeholder="Nhập từ đồng nghĩa"
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

