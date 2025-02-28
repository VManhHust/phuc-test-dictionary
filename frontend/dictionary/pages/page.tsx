"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiRequest } from "../utils/api"

export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState("")
    type WordData = {
        word: string
        pronunciation?: string
        definitions: { dictionary_name: string; definition: string; example?: string }[]
        synonyms: { synonym_word: string }[]
    }
    const [wordData, setWordData] = useState<WordData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!searchTerm) return
        setLoading(true)
        setError(null)
        setWordData(null) // Reset wordData when starting a new search

        try {
            const data = await apiRequest<WordData>("words/find-word", "GET", undefined, { word: searchTerm })
            if (data) {
                setWordData(data)
            } else {
                setError("Không tìm thấy từ này.")
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="container flex h-20 items-center px-4">
                    <h1 className="text-3xl font-bold">Từ Điển Tiếng Việt</h1>
                </div>
            </header>
            <main className="container px-4 py-8">
                <div className="mx-auto max-w-2xl space-y-8">
                    <div className="flex gap-2">
                        <Input
                            className="h-12 text-lg border-2 border-gray-300 focus:border-blue-400 transition-colors rounded-lg"
                            placeholder="Nhập từ bạn cần tra cứu..."
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            className="h-12 px-6 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
                            size="lg"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <Search className="mr-2" />
                            Tìm kiếm
                        </Button>
                    </div>
                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-2 text-blue-600 font-medium">Đang tìm kiếm...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500 font-medium bg-red-50 py-3 px-4 rounded-lg">{error}</p>
                        </div>
                    )}
                    {wordData && (
                        <Card className="overflow-hidden shadow-lg rounded-lg border border-gray-200">
                            <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200">
                                <div className="flex items-baseline justify-between">
                                    <div>
                                        <CardTitle className="text-5xl font-bold text-gray-800 mb-2">{wordData.word}</CardTitle>
                                        <CardDescription className="text-xl text-gray-600 font-medium">
                                            {wordData.pronunciation}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700"
                                    >
                                        🔊 Nghe
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <Tabs defaultValue="definitions" className="space-y-6">
                                    <TabsList className="bg-gray-100 p-1 rounded-lg border border-gray-200">
                                        <TabsTrigger
                                            value="definitions"
                                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md px-6 py-2"
                                        >
                                            Định nghĩa
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="examples"
                                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md px-6 py-2"
                                        >
                                            Ví dụ
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="synonyms"
                                            className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md px-6 py-2"
                                        >
                                            Từ đồng nghĩa
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="definitions" className="space-y-6">
                                        <div className="space-y-6">
                                            {wordData.definitions.map((def, index) => (
                                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <Badge className="bg-blue-100 text-blue-800 mb-3 text-sm px-3 py-1">
                                                        {def.dictionary_name}
                                                    </Badge>
                                                    <p className="text-gray-700 text-lg leading-relaxed">{def.definition}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="examples" className="space-y-4">
                                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                                            <ul className="space-y-4">
                                                {wordData.definitions.map(
                                                    (def, index) =>
                                                        def.example && (
                                                            <li key={index} className="flex items-start space-x-3">
                                                                <span className="text-blue-500 mt-1">•</span>
                                                                <p className="text-gray-700 text-lg leading-relaxed">{def.example}</p>
                                                            </li>
                                                        ),
                                                )}
                                            </ul>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="synonyms" className="space-y-4">
                                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                                            <div className="flex flex-wrap gap-2">
                                                {wordData.synonyms.map((syn, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className={`
                              ${
                                                            [
                                                                "bg-blue-100 text-blue-800",
                                                                "bg-purple-100 text-purple-800",
                                                                "bg-green-100 text-green-800",
                                                                "bg-yellow-100 text-yellow-800",
                                                                "bg-red-100 text-red-800",
                                                            ][index % 5]
                                                        }
                              text-sm px-3 py-1.5 font-medium
                            `}
                                                    >
                                                        {syn.synonym_word}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}
                    {!wordData && !loading && !error && (
                        <Card className="shadow-lg rounded-lg border border-gray-200">
                            <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200">
                                <CardTitle className="text-gray-800 text-2xl">Từ gợi ý</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                                    >
                                        bàn ghế
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                                    >
                                        bàn luận
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                                    >
                                        bàn tay
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                                    >
                                        bàn chân
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 rounded-lg"
                                    >
                                        bàn thờ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}

