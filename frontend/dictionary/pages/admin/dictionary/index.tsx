"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { withAdminAuth } from "@/utils/auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Book, Tag, History, ArrowLeftCircle } from "lucide-react"
import Link from "next/link"
import WordsManagement from "@/components/admin/WordsManagement"
import DefinitionsManagement from "@/components/admin/DefinitionsManagement"
import SynonymsManagement from "@/components/admin/SynonymsManagement"
import EtymologiesManagement from "@/components/admin/EtymologiesManagement"

const DictionaryAdminPage = () => {
    const router = useRouter()
    const { tab, wordId } = router.query
    const [activeTab, setActiveTab] = useState("words")

    // Khi component mount hoặc router.query thay đổi, cập nhật activeTab
    useEffect(() => {
        if (tab && typeof tab === "string" && ["words", "definitions", "synonyms", "etymologies"].includes(tab)) {
            setActiveTab(tab)

            // Nếu có wordId trong query, đảm bảo nó được lưu vào localStorage
            if (wordId && typeof wordId === "string") {
                console.log("Found wordId in URL:", wordId)
                // Có thể thêm logic để fetch thông tin từ nếu cần
            }
        }
    }, [tab, wordId])

    // Khi chuyển tab, cập nhật URL
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        router.push(
            {
                pathname: router.pathname,
                query: { tab: value },
            },
            undefined,
            { shallow: true },
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Thanh tiêu đề */}
            <div className="bg-blue-600 text-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Quản trị Từ điển</h1>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" className="text-white border-white hover:bg-blue-700">
                                    <ArrowLeftCircle className="mr-2 h-4 w-4" />
                                    Quay lại trang chính
                                </Button>
                            </Link>
                            <Button variant="outline" className="text-white border-white hover:bg-blue-700">
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nội dung trang */}
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="words" value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="words" className="flex items-center">
                            <Book className="mr-2 h-4 w-4" />
                            Quản lý Từ
                        </TabsTrigger>
                        <TabsTrigger value="definitions" className="flex items-center">
                            <Book className="mr-2 h-4 w-4" />
                            Quản lý Định nghĩa
                        </TabsTrigger>
                        <TabsTrigger value="synonyms" className="flex items-center">
                            <Tag className="mr-2 h-4 w-4" />
                            Quản lý Từ đồng nghĩa
                        </TabsTrigger>
                        <TabsTrigger value="etymologies" className="flex items-center">
                            <History className="mr-2 h-4 w-4" />
                            Quản lý Nguồn gốc
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="words" className="bg-white p-6 rounded-lg shadow-md">
                        <WordsManagement />
                    </TabsContent>

                    <TabsContent value="definitions" className="bg-white p-6 rounded-lg shadow-md">
                        <DefinitionsManagement />
                    </TabsContent>

                    <TabsContent value="synonyms" className="bg-white p-6 rounded-lg shadow-md">
                        <SynonymsManagement />
                    </TabsContent>

                    <TabsContent value="etymologies" className="bg-white p-6 rounded-lg shadow-md">
                        <EtymologiesManagement />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Bọc component trong HOC bảo vệ
export default withAdminAuth(DictionaryAdminPage)

