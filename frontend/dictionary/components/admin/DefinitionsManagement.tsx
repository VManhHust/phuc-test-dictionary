"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Edit, Trash2, AlertTriangle } from "lucide-react"
import SearchableSelect from "@/components/ui/searchable-select"

// Định nghĩa kiểu dữ liệu
type Definition = {
    id: string
    word_id: string
    word: string
    dictionary_name: string
    definition: string
    example?: string
    created_at: string
    updated_at: string
}

type Word = {
    id: string
    word: string
}

type Dictionary = {
    id: string
    name: string
}

export default function DefinitionsManagement() {
    const [definitions, setDefinitions] = useState<Definition[]>([])
    const [words, setWords] = useState<Word[]>([])
    const [dictionaries, setDictionaries] = useState<Dictionary[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedDefinition, setSelectedDefinition] = useState<Definition | null>(null)

    // Form state
    const [selectedWordId, setSelectedWordId] = useState("")
    const [selectedDictionaryId, setSelectedDictionaryId] = useState("")
    const [definitionText, setDefinitionText] = useState("")
    const [exampleText, setExampleText] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch data on component mount
    useEffect(() => {
        fetchDefinitions()
        fetchWords()
        fetchDictionaries()
    }, [])

    // Gọi API để lấy danh sách định nghĩa
    const fetchDefinitions = async () => {
        setLoading(true)
        try {
            // Đây sẽ là API thực tế trong môi trường production
            // const data = await apiRequest<Definition[]>("admin/definitions/list", "GET");

            // Mock data cho việc phát triển
            const mockData: Definition[] = [
                {
                    id: "1",
                    word_id: "1",
                    word: "học",
                    dictionary_name: "Từ điển Tiếng Việt",
                    definition: "Lĩnh hội tri thức, kỹ năng qua sách vở, thầy dạy hoặc thực tiễn",
                    example: "Học từ vựng mới hàng ngày",
                    created_at: "2023-01-01T00:00:00Z",
                    updated_at: "2023-01-01T00:00:00Z",
                },
                {
                    id: "2",
                    word_id: "1",
                    word: "học",
                    dictionary_name: "Từ điển Hán-Việt",
                    definition: "Tiếp thu tri thức; noi theo, bắt chước",
                    example: "Học tập kinh nghiệm từ người đi trước",
                    created_at: "2023-01-02T00:00:00Z",
                    updated_at: "2023-01-02T00:00:00Z",
                },
                {
                    id: "3",
                    word_id: "2",
                    word: "trường",
                    dictionary_name: "Từ điển Tiếng Việt",
                    definition: "Nơi dạy học có tổ chức, có chương trình",
                    example: "Trường học",
                    created_at: "2023-01-03T00:00:00Z",
                    updated_at: "2023-01-03T00:00:00Z",
                },
                {
                    id: "4",
                    word_id: "3",
                    word: "sách",
                    dictionary_name: "Từ điển Tiếng Việt",
                    definition: "Tác phẩm in thành tập, đóng bìa để đọc",
                    example: "Đọc sách mỗi ngày",
                    created_at: "2023-01-04T00:00:00Z",
                    updated_at: "2023-01-04T00:00:00Z",
                },
            ]

            setDefinitions(mockData)
            setError(null)
        } catch (err) {
            console.error("Error fetching definitions:", err)
            setError("Không thể tải danh sách định nghĩa. Vui lòng thử lại sau.")
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
            ]
            setWords(mockWords)
        } catch (err) {
            console.error("Error fetching words:", err)
        }
    }

    // Gọi API để lấy danh sách từ điển
    const fetchDictionaries = async () => {
        try {
            // const data = await apiRequest<Dictionary[]>("admin/dictionaries/list", "GET");
            const mockDictionaries: Dictionary[] = [
                { id: "1", name: "Từ điển Tiếng Việt" },
                { id: "2", name: "Từ điển Hán-Việt" },
                { id: "3", name: "Từ điển Việt-Anh" },
            ]
            setDictionaries(mockDictionaries)
        } catch (err) {
            console.error("Error fetching dictionaries:", err)
        }
    }

    // Lọc định nghĩa theo từ khóa tìm kiếm
    const filteredDefinitions = definitions.filter(
        (def) =>
            def.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            def.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            def.dictionary_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Xử lý thêm định nghĩa mới
    const handleAddDefinition = async () => {
        if (!selectedWordId || !selectedDictionaryId || !definitionText.trim()) {
            setFormError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để thêm định nghĩa
            // const response = await apiRequest("admin/definitions/add", "POST", {
            //   word_id: selectedWordId,
            //   dictionary_id: selectedDictionaryId,
            //   definition: definitionText,
            //   example: exampleText || undefined
            // });

            // Mock thêm định nghĩa
            const selectedWord = words.find((w) => w.id === selectedWordId)
            const selectedDictionary = dictionaries.find((d) => d.id === selectedDictionaryId)

            if (!selectedWord || !selectedDictionary) {
                throw new Error("Từ hoặc từ điển không tồn tại")
            }

            const newDefinition: Definition = {
                id: (definitions.length + 1).toString(),
                word_id: selectedWordId,
                word: selectedWord.word,
                dictionary_name: selectedDictionary.name,
                definition: definitionText,
                example: exampleText || undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            setDefinitions([...definitions, newDefinition])

            // Reset form
            setSelectedWordId("")
            setSelectedDictionaryId("")
            setDefinitionText("")
            setExampleText("")
            setFormError(null)
            setIsAddDialogOpen(false)
        } catch (err) {
            console.error("Error adding definition:", err)
            setFormError("Không thể thêm định nghĩa mới. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý chỉnh sửa định nghĩa
    const handleEditDefinition = async () => {
        if (!selectedDefinition || !selectedWordId || !selectedDictionaryId || !definitionText.trim()) {
            setFormError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để cập nhật định nghĩa
            // const response = await apiRequest(`admin/definitions/update/${selectedDefinition.id}`, "PUT", {
            //   word_id: selectedWordId,
            //   dictionary_id: selectedDictionaryId,
            //   definition: definitionText,
            //   example: exampleText || undefined
            // });

            // Mock cập nhật định nghĩa
            const selectedWord = words.find((w) => w.id === selectedWordId)
            const selectedDictionary = dictionaries.find((d) => d.id === selectedDictionaryId)

            if (!selectedWord || !selectedDictionary) {
                throw new Error("Từ hoặc từ điển không tồn tại")
            }

            const updatedDefinitions = definitions.map((def) => {
                if (def.id === selectedDefinition.id) {
                    return {
                        ...def,
                        word_id: selectedWordId,
                        word: selectedWord.word,
                        dictionary_name: selectedDictionary.name,
                        definition: definitionText,
                        example: exampleText || undefined,
                        updated_at: new Date().toISOString(),
                    }
                }
                return def
            })

            setDefinitions(updatedDefinitions)

            // Reset form
            setSelectedWordId("")
            setSelectedDictionaryId("")
            setDefinitionText("")
            setExampleText("")
            setFormError(null)
            setIsEditDialogOpen(false)
        } catch (err) {
            console.error("Error updating definition:", err)
            setFormError("Không thể cập nhật định nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Xử lý xóa định nghĩa
    const handleDeleteDefinition = async () => {
        if (!selectedDefinition) return

        setSaving(true)
        try {
            // Trong thực tế, sẽ gọi API để xóa định nghĩa
            // const response = await apiRequest(`admin/definitions/delete/${selectedDefinition.id}`, "DELETE");

            // Mock xóa định nghĩa
            const updatedDefinitions = definitions.filter((def) => def.id !== selectedDefinition.id)
            setDefinitions(updatedDefinitions)

            setIsDeleteDialogOpen(false)
        } catch (err) {
            console.error("Error deleting definition:", err)
            alert("Không thể xóa định nghĩa. Vui lòng thử lại sau.")
        } finally {
            setSaving(false)
        }
    }

    // Mở dialog chỉnh sửa và điền thông tin
    const openEditDialog = (definition: Definition) => {
        setSelectedDefinition(definition)

        // Tìm ID từ điển từ tên
        const dictionary = dictionaries.find((d) => d.name === definition.dictionary_name)

        setSelectedWordId(definition.word_id)
        setSelectedDictionaryId(dictionary?.id || "")
        setDefinitionText(definition.definition)
        setExampleText(definition.example || "")
        setFormError(null)
        setIsEditDialogOpen(true)
    }

    // Mở dialog xóa
    const openDeleteDialog = (definition: Definition) => {
        setSelectedDefinition(definition)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý Định nghĩa</h2>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm định nghĩa mới
                </Button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm định nghĩa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                />
            </div>

            {/* Bảng danh sách định nghĩa */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <Card className="p-6 text-center text-red-600 bg-red-50">
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchDefinitions}>
                        Thử lại
                    </Button>
                </Card>
            ) : (
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
                            {filteredDefinitions.length > 0 ? (
                                filteredDefinitions.map((definition) => (
                                    <TableRow key={definition.id}>
                                        <TableCell className="font-medium">{definition.word}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{definition.dictionary_name}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-h-20 overflow-auto">{definition.definition}</div>
                                        </TableCell>
                                        <TableCell>
                                            {definition.example ? (
                                                <div className="text-gray-600 italic max-h-20 overflow-auto">"{definition.example}"</div>
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
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteDialog(definition)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                                        {searchTerm ? "Không tìm thấy định nghĩa phù hợp" : "Chưa có định nghĩa nào trong từ điển"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog thêm định nghĩa mới */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm định nghĩa mới</DialogTitle>
                        <DialogDescription>Điền thông tin để thêm định nghĩa mới vào từ điển.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="word" className="text-sm font-medium">
                                    Từ <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    value={selectedWordId}
                                    onValueChange={setSelectedWordId}
                                    placeholder="Chọn từ..."
                                    searchPlaceholder="Tìm kiếm từ..."
                                    endpoint="words/search"
                                    className="w-full"
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
                                            <SelectItem key={dictionary.id} value={dictionary.id}>
                                                {dictionary.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddDefinition} className="bg-blue-600" disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Thêm định nghĩa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog chỉnh sửa định nghĩa */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa định nghĩa</DialogTitle>
                        <DialogDescription>Chỉnh sửa thông tin của định nghĩa.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {formError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {formError}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="edit-word" className="text-sm font-medium">
                                    Từ <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    value={selectedWordId}
                                    onValueChange={setSelectedWordId}
                                    placeholder="Chọn từ..."
                                    searchPlaceholder="Tìm kiếm từ..."
                                    endpoint="words/search"
                                    className="w-full"
                                />
                            </div>
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
                            Xác nhận xóa định nghĩa
                        </DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa định nghĩa của từ "{selectedDefinition?.word}" trong{" "}
                            {selectedDefinition?.dictionary_name}? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDefinition} disabled={saving}>
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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

