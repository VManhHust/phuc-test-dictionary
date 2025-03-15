"use client"

import { useState, useEffect } from "react"
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
import { PlusCircle, Search, Edit, Trash2, AlertTriangle } from "lucide-react"
import {apiRequest} from "@/utils/api";

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

export default function WordsManagement() {
    const [words, setWords] = useState<Word[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedWord, setSelectedWord] = useState<Word | null>(null)

    // Form state
    const [newWord, setNewWord] = useState("")
    const [newPronunciation, setNewPronunciation] = useState("")
    const [formError, setFormError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Fetch words on component mount
    useEffect(() => {
        fetchWords()
    }, [])

    // Gọi API để lấy danh sách từ
    const fetchWords = async () => {
        setLoading(true)
        try {
            // Make a real API call to fetch words
            const data = await apiRequest<Word[] | Word>("words/list", "GET")

            if (Array.isArray(data)) {
                // If data is an array, use it directly
                setWords(data)
            } else if (data && typeof data === "object") {
                // If data is a single word object, wrap it in an array
                setWords([data])
            } else {
                // Handle empty or invalid response
                setWords([])
            }

            setError(null)
        } catch (err) {
            console.error("Error fetching words:", err)
            setError("Không thể tải danh sách từ. Vui lòng thử lại sau.")

            // Fallback to mock data if API fails
            const mockData: Word[] = [
                {
                    id: "1",
                    word: "học",
                    pronunciation: "/hɔk̚˧˧/",
                    created_at: "2023-01-01T00:00:00Z",
                    updated_at: "2023-01-01T00:00:00Z",
                    definition_count: 3,
                    synonym_count: 5,
                    etymology_count: 1,
                },
                {
                    id: "2",
                    word: "trường",
                    pronunciation: "/ʈɨəŋ˧˧/",
                    created_at: "2023-01-02T00:00:00Z",
                    updated_at: "2023-01-02T00:00:00Z",
                    definition_count: 2,
                    synonym_count: 4,
                    etymology_count: 1,
                },
                {
                    id: "3",
                    word: "sách",
                    pronunciation: "/saːk̚˧˥/",
                    created_at: "2023-01-03T00:00:00Z",
                    updated_at: "2023-01-03T00:00:00Z",
                    definition_count: 1,
                    synonym_count: 3,
                    etymology_count: 0,
                },
                {
                    id: "4",
                    word: "giáo viên",
                    pronunciation: "/zaːw˧˧ viən˧˧/",
                    created_at: "2023-01-04T00:00:00Z",
                    updated_at: "2023-01-04T00:00:00Z",
                    definition_count: 1,
                    synonym_count: 2,
                    etymology_count: 0,
                },
                {
                    id: "5",
                    word: "học sinh",
                    pronunciation: "/hɔk̚˧˧ siŋ˧˧/",
                    created_at: "2023-01-05T00:00:00Z",
                    updated_at: "2023-01-05T00:00:00Z",
                    definition_count: 1,
                    synonym_count: 2,
                    etymology_count: 0,
                },
            ]
            setWords(mockData)
        } finally {
            setLoading(false)
        }
    }

    // Lọc từ theo từ khóa tìm kiếm
    const filteredWords = words.filter((word) => word.word.toLowerCase().includes(searchTerm.toLowerCase()))

    // Xử lý thêm từ mới
    const handleAddWord = async () => {
        if (!newWord.trim()) {
            setFormError("Vui lòng nhập từ cần thêm")
            return
        }

        setSaving(true)
        try {
            // Make a real API call to add a new word
            // const response = await fetch("http://localhost:3001/words", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({
            //     word: newWord,
            //     pronunciation: newPronunciation || "",
            //   }),
            // })

            // if (!response.ok) {
            //   throw new Error(`Error: ${response.status} ${response.statusText}`)
            // }

            // const newWordData = await response.json()
            const newWordData = await apiRequest<Word>("words/create", "POST", {
                word: newWord,
                pronunciation: newPronunciation || "",
            })

            // Add the new word to the state
            // @ts-ignore
            // @ts-ignore
            const newWordObj: Word = {
                id: newWordData.id,
                word: newWordData.word,
                pronunciation: newWordData.pronunciation,
                created_at: newWordData.created_at,
                updated_at: newWordData.updated_at,
                definition_count: 0,
                synonym_count: 0,
                etymology_count: 0,
            }

            setWords([...words, newWordObj])

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
            const response = await apiRequest(`words/update/${selectedWord.id}`, "PUT", {
                word: newWord,
                pronunciation: newPronunciation,
            })

            // Mock sửa từ
            // const updatedWords = words.map((word) => {
            //   if (word.id === selectedWord.id) {
            //     return {
            //       ...word,
            //       word: newWord,
            //       pronunciation: newPronunciation,
            //       updated_at: new Date().toISOString(),
            //     }
            //   }
            //   return word
            // })

            // setWords(updatedWords)
            fetchWords()

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
            const response = await apiRequest(`words/delete/${selectedWord.id}`, "DELETE")

            // Mock xóa từ
            // const updatedWords = words.filter((word) => word.id !== selectedWord.id)
            // setWords(updatedWords)
            fetchWords()

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
                    className="pl-10 h-10"
                />
            </div>

            {/* Bảng danh sách từ */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <Card className="p-6 text-center text-red-600 bg-red-50">
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchWords}>
                        Thử lại
                    </Button>
                </Card>
            ) : (
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
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word) => (
                                    <TableRow key={word.id}>
                                        <TableCell className="font-medium">{word.word}</TableCell>
                                        <TableCell>{word.pronunciation || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{word.definition_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{word.synonym_count}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{word.etymology_count}</Badge>
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
            )}

            {/* Dialog thêm từ mới */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
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

