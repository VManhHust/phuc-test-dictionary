"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
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
import {Badge} from "@/components/ui/badge"
import {PlusCircle, Edit, Trash2, AlertTriangle, Loader2, Filter} from "lucide-react"
import WordSearchBar from "./WordSearchBar"

// Types
type Word = {
    id: string
    word: string
    pronunciation?: string
}

type Definition = {
    id: string
    word: Word
    dictionary_name: string
    definition: string
    example?: string
    created_at: string
    updated_at: string
}

type DefinitionsResponse = {
    data: Definition[]
    total: number
    total_pages: number
    current_page: number
    limit: number
}

type Dictionary = {
    id: string
    name: string
}

export default function DefinitionsManagement() {
    // State for selected word and definitions
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)
    const [definitions, setDefinitions] = useState<Definition[]>([])
    const [dictionaries, setDictionaries] = useState<Dictionary[]>([])

    // State for loading and pagination
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize] = useState(5)

    // State for dialogs
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedDefinition, setSelectedDefinition] = useState<Definition | null>(null)

    // Form state
    const [selectedDictionaryId, setSelectedDictionaryId] = useState("")
    const [definitionText, setDefinitionText] = useState("")
    const [exampleText, setExampleText] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch dictionaries on component mount
    useEffect(() => {
        fetchDictionaries()
    }, [])

    // Fetch definitions on initial load and when page changes
    useEffect(() => {
        fetchDefinitions(currentPage, pageSize)
    }, [currentPage, pageSize])

    // Fetch definitions when a word is selected
    useEffect(() => {
        if (selectedWord) {
            setCurrentPage(1)
            fetchDefinitions(1, pageSize)
        }
    }, [selectedWord, pageSize])

    // Function to fetch dictionaries
    const fetchDictionaries = async () => {
        setDictionaries([
            {id: "1", name: "Từ điển Tiếng Việt"},
            {id: "2", name: "Từ điển Hán-Việt"},
            {id: "3", name: "Từ điển Việt-Anh"},
        ])
    }

    // Function to fetch definitions
    const fetchDefinitions = async (page: number, size: number) => {
        setLoading(true)
        try {
            const url = new URL("http://localhost:3001/definitions")
            url.searchParams.append("page", page.toString())
            url.searchParams.append("size", size.toString())

            if (selectedWord) {
                url.searchParams.append("word", selectedWord.id)
            }

            const response = await fetch(url.toString())

            if (!response.ok) {
                setDefinitions([])
            }

            const data: DefinitionsResponse = await response.json()
            setDefinitions(data.data)
            setTotalPages(data.total_pages)
            setCurrentPage(data.current_page)
        } catch (error) {
            console.error("Error fetching definitions:", error)
            setDefinitions([])
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
        fetchDefinitions(1, pageSize)
    }

    // Handle adding a new definition
    const handleAddDefinition = async () => {
        if (!selectedWord) {
            setFormError("Vui lòng chọn từ")
            return
        }
        if (!selectedWord || !definitionText.trim()) {
            setFormError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setSaving(true)
        try {
            const response = await fetch("http://localhost:3001/definitions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wordId: selectedWord.id,
                    definition: definitionText,
                    dictionary_name: selectedDictionaryId,
                    example: exampleText || undefined,
                }),
            })

            if (!response.ok) {
                setFormError("Không thể thêm định nghĩa. Vui lòng thử lại sau.")
                return
            }

            // Refresh definitions list
            fetchDefinitions(currentPage, pageSize)

            // Reset form
            setSelectedDictionaryId("")
            setDefinitionText("")
            setExampleText("")
            setFormError(null)
            setIsAddDialogOpen(false)
        } catch (error) {
            console.error("Error adding definition:", error)
            setFormError("Không thể thêm định nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle editing a definition
    const handleEditDefinition = async () => {
        if (!selectedDefinition || !selectedDictionaryId || !definitionText.trim()) {
            setFormError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setSaving(true)
        try {
            const response = await fetch(`http://localhost:3001/definitions/${selectedDefinition.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dictionary_id: selectedDictionaryId,
                    definition: definitionText,
                    example: exampleText || undefined,
                }),
            })

            if (!response.ok) {
                setFormError("Không thể cập nhật định nghĩa. Vui lòng thử lại sau.")
            }

            // Refresh definitions list
            fetchDefinitions(currentPage, pageSize)

            // Reset form
            setSelectedDictionaryId("")
            setDefinitionText("")
            setExampleText("")
            setFormError(null)
            setIsEditDialogOpen(false)
        } catch (error) {
            console.error("Error updating definition:", error)
            setFormError("Không thể cập nhật định nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Handle deleting a definition
    const handleDeleteDefinition = async () => {
        if (!selectedDefinition) return

        setSaving(true)
        try {
            const response = await fetch(`http://localhost:3001/definitions/${selectedDefinition.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                alert("Không thể xóa định nghĩa. Vui lòng thử lại sau.")
            }

            // Refresh definitions list
            fetchDefinitions(currentPage, pageSize)
            setIsDeleteDialogOpen(false)
        } catch (error) {
            console.error("Error deleting definition:", error)
            alert("Không thể xóa định nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Open edit dialog
    const openEditDialog = (definition: Definition) => {
        setSelectedDefinition(definition)

        // Find dictionary ID from name
        const dictionary = dictionaries.find((d) => d.name === definition.dictionary_name)

        setSelectedDictionaryId(dictionary?.id || "")
        setDefinitionText(definition.definition)
        setExampleText(definition.example || "")
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Open delete dialog
    const openDeleteDialog = (definition: Definition) => {
        setSelectedDefinition(definition)
        setIsDeleteDialogOpen(true)
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Định nghĩa</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Thêm định nghĩa mới
                </Button>
            </div>

            {/* Word search bar */}
            <div className="mb-6">
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <WordSearchBar onWordSelect={handleWordSelect} placeholder="Tìm kiếm từ để lọc định nghĩa..."/>
                    </div>
                    {selectedWord && (
                        <Button variant="outline" size="sm" onClick={clearWordFilter} className="whitespace-nowrap">
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {selectedWord && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md flex items-center">
                        <Filter className="h-4 w-4 text-blue-500 mr-2"/>
                        <p className="text-blue-700 font-medium">
                            Đang lọc định nghĩa của: <span className="font-bold">{selectedWord.word}</span>
                            {selectedWord.pronunciation && ` (${selectedWord.pronunciation})`}
                        </p>
                    </div>
                )}
            </div>

            {/* Definitions table */}
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
                                    <TableHead>Từ điển</TableHead>
                                    <TableHead className="w-[400px]">Định nghĩa</TableHead>
                                    <TableHead>Ví dụ</TableHead>
                                    <TableHead className="text-right w-[120px]">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {definitions.length > 0 ? (
                                    definitions.map((definition) => (
                                        <TableRow key={definition.id}>
                                            <TableCell className="font-medium">{definition.word.word}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{definition.dictionary_name}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-h-20 overflow-auto">{definition.definition}</div>
                                            </TableCell>
                                            <TableCell>
                                                {definition.example ? (
                                                    <div
                                                        className="text-gray-600 italic max-h-20 overflow-auto">"{definition.example}"</div>
                                                ) : (
                                                    <span className="text-gray-400">Không có</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(definition)}
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(definition)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                            {selectedWord ? "Chưa có định nghĩa nào cho từ này" : "Không có định nghĩa nào trong hệ thống"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
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

            {/* Add definition dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm định nghĩa mới</DialogTitle>
                        <DialogDescription>Chọn từ và nhập thông tin định nghĩa</DialogDescription>
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
                                onWordSelect={(word) => setSelectedWord(word)}
                                placeholder="Tìm kiếm từ..."
                                initialValue={selectedWord}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="dictionary" className="text-sm font-medium">
                                Từ điển <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedDictionaryId} onValueChange={setSelectedDictionaryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ điển..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {dictionaries.map((dictionary) => (
                                        <SelectItem key={dictionary.id} value={dictionary.name}>
                                            {dictionary.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="definition" className="text-sm font-medium">
                                Định nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="definition"
                                value={definitionText}
                                onChange={(e) => setDefinitionText(e.target.value)}
                                placeholder="Nhập định nghĩa của từ"
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="example" className="text-sm font-medium">
                                Ví dụ
                            </label>
                            <Textarea
                                id="example"
                                value={exampleText}
                                onChange={(e) => setExampleText(e.target.value)}
                                placeholder="Nhập ví dụ minh họa (nếu có)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false)
                                setSelectedWord(null)
                                setSelectedDictionaryId("")
                                setDefinitionText("")
                                setExampleText("")
                                setFormError(null)
                            }}
                            disabled={saving}
                        >
                            Hủy
                        </Button>
                        <Button onClick={handleAddDefinition} className="bg-blue-600"
                                disabled={saving || !selectedWord}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm định nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit definition dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa định nghĩa</DialogTitle>
                        <DialogDescription>Chỉnh sửa định nghĩa cho từ
                            "{selectedDefinition?.word.word}"</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2"/>
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="edit-dictionary" className="text-sm font-medium">
                                Từ điển <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedDictionaryId} onValueChange={setSelectedDictionaryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ điển..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {dictionaries.map((dictionary) => (
                                        <SelectItem key={dictionary.id} value={dictionary.id}>
                                            {dictionary.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-definition" className="text-sm font-medium">
                                Định nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="edit-definition"
                                value={definitionText}
                                onChange={(e) => setDefinitionText(e.target.value)}
                                placeholder="Nhập định nghĩa của từ"
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-example" className="text-sm font-medium">
                                Ví dụ
                            </label>
                            <Textarea
                                id="edit-example"
                                value={exampleText}
                                onChange={(e) => setExampleText(e.target.value)}
                                placeholder="Nhập ví dụ minh họa (nếu có)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleEditDefinition} className="bg-blue-600" disabled={saving}>
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
                            Xác nhận xóa định nghĩa
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa định nghĩa này của từ "{selectedDefinition?.word.word}"? Hành động
                            này không thể
                            hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDefinition} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa định nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

