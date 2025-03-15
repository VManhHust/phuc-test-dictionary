"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { PlusCircle, Search, Edit, Trash2, AlertTriangle, ArrowRight } from "lucide-react"

// Định nghĩa kiểu dữ liệu
type Synonym = {
    id: string
    word_id: string
    word: string
    synonym_word_id: string
    synonym_word: string
    created_at: string
    updated_at: string
}

type Word = {
    id: string
    word: string
}

export default function SynonymsManagement() {
    const [synonyms, setSynonyms] = useState<Synonym[]>([])
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSynonym, setSelectedSynonym] = useState<Synonym | null>(null)

    // Form state
    const [selectedWordId, setSelectedWordId] = useState("")
    const [selectedSynonymWordId, setSelectedSynonymWordId] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch data on component mount
    useEffect(() => {
        fetchSynonyms()
        fetchWords()
    }, [])

    // Gọi API để lấy danh sách từ đồng nghĩa
    const fetchSynonyms = async () => {
        setLoading(true)
        try {
            // Đây sẽ là API thực tế trong môi trường production
            // const data = await apiRequest<Synonym[]>("admin/synonyms/list", "GET");

            // Mock data cho việc phát triển
            const mockData: Synonym[] = [
                {
                    id: "1",
                    word_id: "1",
                    word: "học",
                    synonym_word_id: "6",
                    synonym_word: "nghiên cứu",
                    created_at: "2023-01-01T00:00:00Z",
                    updated_at: "2023-01-01T00:00:00Z",
                },
                {
                    id: "2",
                    word_id: "1",
                    word: "học",
                    synonym_word_id: "7",
                    synonym_word: "tiếp thu",
                    created_at: "2023-01-02T00:00:00Z",
                    updated_at: "2023-01-02T00:00:00Z",
                },
                {
                    id: "3",
                    word_id: "2",
                    word: "trường",
                    synonym_word_id: "8",
                    synonym_word: "trường học",
                    created_at: "2023-01-03T00:00:00Z",
                    updated_at: "2023-01-03T00:00:00Z",
                },
                {
                    id: "4",
                    word_id: "3",
                    word: "sách",
                    synonym_word_id: "9",
                    synonym_word: "tài liệu",
                    created_at: "2023-01-04T00:00:00Z",
                    updated_at: "2023-01-04T00:00:00Z",
                },
            ]

            setSynonyms(mockData)
            setError(null)
        } catch (err) {
            console.error("Error fetching synonyms:", err)
            setError("Không thể tải danh sách từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setLoading(false)
        }
    }

    // Gọi API để lấy danh sách từ
    const fetchWords = async () => {
        try {
            // const data = await apiRequest<Word[]>("admin/words/list", "GET");
            const mockWords: Word[] = [
                { id: "1", word: "học" },
                { id: "2", word: "trường" },
                { id: "3", word: "sách" },
                { id: "4", word: "giáo viên" },
                { id: "5", word: "học sinh" },
                { id: "6", word: "nghiên cứu" },
                { id: "7", word: "tiếp thu" },
                { id: "8", word: "trường học" },
                { id: "9", word: "tài liệu" },
                { id: "10", word: "giáo trình" },
            ]
            setWords(mockWords)
        } catch (err) {
            console.error("Error fetching words:", err)
        }
    }

    // Lọc từ đồng nghĩa theo từ khóa tìm kiếm
    const filteredSynonyms = synonyms.filter(
        (syn) =>
            syn.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            syn.synonym_word.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Xử lý thêm từ đồng nghĩa mới
    const handleAddSynonym = async () => {
        if (!selectedWordId || !selectedSynonymWordId) {
            setFormError("Vui lòng chọn từ và từ đồng nghĩa")
            return
        }

        if (selectedWordId === selectedSynonymWordId) {
            setFormError("Từ và từ đồng nghĩa không thể là cùng một từ")
            return
        }

        // Kiểm tra nếu cặp từ đồng nghĩa đã tồn tại
        const exists = synonyms.some(
            (syn) =>
                (syn.word_id === selectedWordId && syn.synonym_word_id === selectedSynonymWordId) ||
                (syn.word_id === selectedSynonymWordId && syn.synonym_word_id === selectedWordId),
        )

        if (exists) {
            setFormError("Cặp từ đồng nghĩa này đã tồn tại")
            return
        }

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để thêm từ đồng nghĩa
            // const response = await apiRequest("admin/synonyms/add", "POST", {
            //   word_id: selectedWordId,
            //   synonym_word_id: selectedSynonymWordId
            // });

            // Mock thêm từ đồng nghĩa
            const selectedWord = words.find((w) => w.id === selectedWordId)
            const selectedSynonymWord = words.find((w) => w.id === selectedSynonymWordId)

            if (!selectedWord || !selectedSynonymWord) {
                throw new Error("Từ hoặc từ đồng nghĩa không tồn tại")
            }

            const newSynonym: Synonym = {
                id: (synonyms.length + 1).toString(),
                word_id: selectedWordId,
                word: selectedWord.word,
                synonym_word_id: selectedSynonymWordId,
                synonym_word: selectedSynonymWord.word,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setSynonyms([...synonyms, newSynonym])

            // Reset form
            setSelectedWordId("")
            setSelectedSynonymWordId("")
            setFormError(null)
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error("Error adding synonym:", err)
            setFormError("Không thể thêm từ đồng nghĩa mới. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý chỉnh sửa từ đồng nghĩa
    const handleEditSynonym = async () => {
        if (!selectedSynonym || !selectedWordId || !selectedSynonymWordId) {
            setFormError("Vui lòng chọn từ và từ đồng nghĩa")
            return
        }

        if (selectedWordId === selectedSynonymWordId) {
            setFormError("Từ và từ đồng nghĩa không thể là cùng một từ")
            return
        }

        // Kiểm tra nếu cặp từ đồng nghĩa đã tồn tại (ngoại trừ bản ghi hiện tại)
        const exists = synonyms.some(
            (syn) =>
                syn.id !== selectedSynonym.id &&
                ((syn.word_id === selectedWordId && syn.synonym_word_id === selectedSynonymWordId) ||
                    (syn.word_id === selectedSynonymWordId && syn.synonym_word_id === selectedWordId)),
        )

        if (exists) {
            setFormError("Cặp từ đồng nghĩa này đã tồn tại")
            return
        }

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để cập nhật từ đồng nghĩa
            // const response = await apiRequest(`admin/synonyms/update/${selectedSynonym.id}`, "PUT", {
            //   word_id: selectedWordId,
            //   synonym_word_id: selectedSynonymWordId
            // });

            // Mock cập nhật từ đồng nghĩa
            const selectedWord = words.find((w) => w.id === selectedWordId)
            const selectedSynonymWord = words.find((w) => w.id === selectedSynonymWordId)

            if (!selectedWord || !selectedSynonymWord) {
                throw new Error("Từ hoặc từ đồng nghĩa không tồn tại")
            }

            const updatedSynonyms = synonyms.map((syn) => {
                if (syn.id === selectedSynonym.id) {
                    return {
                        ...syn,
                        word_id: selectedWordId,
                        word: selectedWord.word,
                        synonym_word_id: selectedSynonymWordId,
                        synonym_word: selectedSynonymWord.word,
                        updated_at: new Date().toISOString(),
                    }
                }
                return syn
            })

            setSynonyms(updatedSynonyms)

            // Reset form
            setSelectedWordId("")
            setSelectedSynonymWordId("")
            setFormError(null)
            setIsEditDialogOpen(false)
        } catch (err) {
            console.error("Error updating synonym:", err)
            setFormError("Không thể cập nhật từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý xóa từ đồng nghĩa
    const handleDeleteSynonym = async () => {
        if (!selectedSynonym) return

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để xóa từ đồng nghĩa
            // const response = await apiRequest(`admin/synonyms/delete/${selectedSynonym.id}`, "DELETE");

            // Mock xóa từ đồng nghĩa
            const updatedSynonyms = synonyms.filter((syn) => syn.id !== selectedSynonym.id)
            setSynonyms(updatedSynonyms)

            setIsDeleteDialogOpen(false)
        } catch (err) {
            console.error("Error deleting synonym:", err)
            alert("Không thể xóa từ đồng nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Mở dialog chỉnh sửa và điền thông tin
    const openEditDialog = (synonym: Synonym) => {
        setSelectedSynonym(synonym)
        setSelectedWordId(synonym.word_id)
        setSelectedSynonymWordId(synonym.synonym_word_id)
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Mở dialog xóa
    const openDeleteDialog = (synonym: Synonym) => {
        setSelectedSynonym(synonym)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Từ đồng nghĩa</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm từ đồng nghĩa mới
                </Button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm từ đồng nghĩa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                />
            </div>

            {/* Bảng danh sách từ đồng nghĩa */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <Card className="p-6 text-center text-red-600 bg-red-50">
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchSynonyms}>
                        Thử lại
                    </Button>
                </Card>
            ) : (
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
                            {filteredSynonyms.length > 0 ? (
                                filteredSynonyms.map((synonym) => (
                                    <TableRow key={synonym.id}>
                                        <TableCell className="font-medium">{synonym.word}</TableCell>
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
                                        {searchTerm ? "Không tìm thấy từ đồng nghĩa phù hợp" : "Chưa có từ đồng nghĩa nào trong từ điển"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog thêm từ đồng nghĩa mới */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm từ đồng nghĩa mới</DialogTitle>
                        <DialogDescription>Chọn cặp từ đồng nghĩa để thêm vào từ điển.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="word" className="text-sm font-medium">
                                Từ <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedWordId} onValueChange={setSelectedWordId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {words.map((word) => (
                                        <SelectItem key={word.id} value={word.id}>
                                            {word.word}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="synonym-word" className="text-sm font-medium">
                                Từ đồng nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedSynonymWordId} onValueChange={setSelectedSynonymWordId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ đồng nghĩa..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {words.map((word) => (
                                        <SelectItem key={word.id} value={word.id}>
                                            {word.word}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddSynonym} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm từ đồng nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog chỉnh sửa từ đồng nghĩa */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa từ đồng nghĩa</DialogTitle>
                        <DialogDescription>Chỉnh sửa cặp từ đồng nghĩa.</DialogDescription>
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
                            <Select value={selectedWordId} onValueChange={setSelectedWordId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {words.map((word) => (
                                        <SelectItem key={word.id} value={word.id}>
                                            {word.word}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-synonym-word" className="text-sm font-medium">
                                Từ đồng nghĩa <span className="text-red-500">*</span>
                            </label>
                            <Select value={selectedSynonymWordId} onValueChange={setSelectedSynonymWordId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn từ đồng nghĩa..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {words.map((word) => (
                                        <SelectItem key={word.id} value={word.id}>
                                            {word.word}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleEditSynonym} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Xác nhận xóa từ đồng nghĩa
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa mối quan hệ đồng nghĩa giữa từ "{selectedSynonym?.word}" và "
                            {selectedSynonym?.synonym_word}"? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSynonym} disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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

