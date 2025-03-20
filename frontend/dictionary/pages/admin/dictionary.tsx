// "use client"
//
// import { useState, useEffect } from "react"
// import { useRouter } from "next/router"
// import Layout from "@/components/Layout"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Search, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
// import { DictionaryService, Word } from "@/services/dictionary.service"
// import { withAdminAuth } from "@/utils/auth"
// import { Alert, AlertDescription } from "@/components/ui/alert"
//
// function AdminDictionaryPage() {
//   const router = useRouter()
//   const [words, setWords] = useState<Word[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [currentWord, setCurrentWord] = useState<Word | null>(null)
//   const [formData, setFormData] = useState({ word: "", definition: "" })
//   const [formErrors, setFormErrors] = useState({ word: "", definition: "" })
//   const [isSaving, setIsSaving] = useState(false)
//
//   // Lấy danh sách từ vựng
//   useEffect(() => {
//     const fetchWords = async () => {
//       setLoading(true)
//       try {
//         const data = await DictionaryService.search("")
//         setWords(data)
//       } catch (err) {
//         console.error("Error fetching words:", err)
//         setError("Không thể tải danh sách từ vựng")
//       } finally {
//         setLoading(false)
//       }
//     }
//
//     fetchWords()
//   }, [])
//
//   // Lọc từ vựng theo từ khóa tìm kiếm
//   const filteredWords = words.filter(word =>
//     word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     word.definition.toLowerCase().includes(searchTerm.toLowerCase())
//   )
//
//   // Xử lý mở dialog thêm/sửa từ
//   const handleOpenDialog = (word: Word | null = null) => {
//     setCurrentWord(word)
//     if (word) {
//       setFormData({ word: word.word, definition: word.definition })
//     } else {
//       setFormData({ word: "", definition: "" })
//     }
//     setFormErrors({ word: "", definition: "" })
//     setIsDialogOpen(true)
//   }
//
//   // Xử lý mở dialog xóa từ
//   const handleOpenDeleteDialog = (word: Word) => {
//     setCurrentWord(word)
//     setIsDeleteDialogOpen(true)
//   }
//
//   // Xử lý thay đổi form
//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//
//     // Xóa lỗi khi người dùng nhập
//     if (value.trim()) {
//       setFormErrors(prev => ({ ...prev, [name]: "" }))
//     }
//   }
//
//   // Xác thực form
//   const validateForm = () => {
//     const errors = { word: "", definition: "" }
//     let isValid = true
//
//     if (!formData.word.trim()) {
//       errors.word = "Từ vựng không được để trống"
//       isValid = false
//     }
//
//     if (!formData.definition.trim()) {
//       errors.definition = "Định nghĩa không được để trống"
//       isValid = false
//     }
//
//     setFormErrors(errors)
//     return isValid
//   }
//
//   // Xử lý lưu từ vựng
//   const handleSaveWord = async () => {
//     if (!validateForm()) return
//
//     setIsSaving(true)
//     try {
//       if (currentWord) {
//         // Cập nhật từ vựng
//         const updatedWord = await DictionaryService.updateWord(currentWord.id, formData)
//         if (updatedWord) {
//           setWords(words.map(w => (w.id === currentWord.id ? updatedWord : w)))
//         }
//       } else {
//         // Thêm từ vựng mới
//         const newWord = await DictionaryService.createWord(formData)
//         if (newWord) {
//           setWords([...words, newWord])
//         }
//       }
//       setIsDialogOpen(false)
//     } catch (err) {
//       console.error("Error saving word:", err)
//     } finally {
//       setIsSaving(false)
//     }
//   }
//
//   // Xử lý xóa từ vựng
//   const handleDeleteWord = async () => {
//     if (!currentWord) return
//
//     setIsSaving(true)
//     try {
//       const result = await DictionaryService.deleteWord(currentWord.id)
//       if (result && result.success) {
//         setWords(words.filter(w => w.id !== currentWord.id))
//       }
//       setIsDeleteDialogOpen(false)
//     } catch (err) {
//       console.error("Error deleting word:", err)
//     } finally {
//       setIsSaving(false)
//     }
//   }
//
//   if (loading) {
//     return (
//       <Layout>
//         <div className="container mx-auto px-4 py-12 flex justify-center items-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
//             <p>Đang tải danh sách từ vựng...</p>
//           </div>
//         </div>
//       </Layout>
//     )
//   }
//
//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//             <div>
//               <h1 className="text-3xl font-bold">Quản lý từ điển</h1>
//               <p className="text-gray-600 mt-1">Thêm, sửa, xóa từ vựng trong từ điển</p>
//             </div>
//             <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
//               <div className="relative w-full md:w-64">
//                 <input
//                   type="text"
//                   placeholder="Tìm kiếm từ vựng..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               </div>
//               <Button
//                 className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
//                 onClick={() => handleOpenDialog()}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Thêm từ mới
//               </Button>
//             </div>
//           </div>
//
//           {error && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//
//           <Card className="border-0 shadow-lg">
//             <CardHeader className="bg-gray-50 border-b">
//               <CardTitle>Danh sách từ vựng</CardTitle>
//             </CardHeader>
//             <CardContent className="p-0">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-1/4">Từ vựng</TableHead>
//                     <TableHead className="w-1/2">Định nghĩa</TableHead>
//                     <TableHead className="w-1/4 text-right">Thao tác</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredWords.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={3} className="text-center py-8 text-gray-500">
//                         {searchTerm
//                           ? `Không tìm thấy từ vựng nào phù hợp với "${searchTerm}"`
//                           : "Chưa có từ vựng nào trong từ điển"}
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredWords.map(word => (
//                       <TableRow key={word.id}>
//                         <TableCell className="font-medium">{word.word}</TableCell>
//                         <TableCell className="text-gray-600 truncate max-w-xs">
//                           {word.definition}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-blue-600 hover:bg-blue-50"
//                               onClick={() => handleOpenDialog(word)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-red-600 hover:bg-red-50"
//                               onClick={() => handleOpenDeleteDialog(word)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//
//       {/* Dialog thêm/sửa từ vựng */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {currentWord ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label htmlFor="word" className="text-sm font-medium">
//                 Từ vựng <span className="text-red-500">*</span>
//               </label>
//               <Input
//                 id="word"
//                 name="word"
//                 value={formData.word}
//                 onChange={handleFormChange}
//                 className={formErrors.word ? "border-red-500" : ""}
//               />
//               {formErrors.word && (
//                 <p className="text-sm text-red-500">{formErrors.word}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="definition" className="text-sm font-medium">
//                 Định nghĩa <span className="text-red-500">*</span>
//               </label>
//               <Textarea
//                 id="definition"
//                 name="definition"
//                 value={formData.definition}
//                 onChange={handleFormChange}
//                 rows={5}
//                 className={formErrors.definition ? "border-red-500" : ""}
//               />
//               {formErrors.definition && (
//                 <p className="text-sm text-red-500">{formErrors.definition}</p>
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDialogOpen(false)}
//               disabled={isSaving}
//             >
//               Hủy
//             </Button>
//             <Button
//               onClick={handleSaveWord}
//               className="bg-blue-600 hover:bg-blue-700"
//               disabled={isSaving}
//             >
//               {isSaving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                   Đang lưu...
//                 </>
//               ) : (
//                 currentWord ? "Cập nhật" : "Thêm mới"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//
//       {/* Dialog xác nhận xóa từ vựng */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Xác nhận xóa</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p>Bạn có chắc chắn muốn xóa từ vựng <strong>{currentWord?.word}</strong>?</p>
//             <p className="text-gray-500 text-sm mt-2">Hành động này không thể hoàn tác.</p>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsDeleteDialogOpen(false)}
//               disabled={isSaving}
//             >
//               Hủy
//             </Button>
//             <Button
//               onClick={handleDeleteWord}
//               variant="destructive"
//               disabled={isSaving}
//             >
//               {isSaving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//                   Đang xóa...
//                 </>
//               ) : (
//                 "Xóa"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   )
// }
//
// export default withAdminAuth(AdminDictionaryPage)