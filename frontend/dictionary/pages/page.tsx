"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
        setWordData(null)

        try {
            const data = await apiRequest<WordData>("words/find-word", "GET", undefined, {word: searchTerm})
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
        <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Từ Điển Tiếng Việt</h1>

                {/* Search Section */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex gap-3">
                        <Input
                            className="flex-1 h-14 text-lg bg-white border-2 border-blue-200 focus:border-blue-400 rounded-full"
                            placeholder="Nhập từ cần tra cứu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button
                            className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    <span>Đang tìm</span>
                                </div>
                            ) : (
                                <>
                                    <Search className="mr-2" />
                                    Tìm kiếm
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                {error && (
                    <Card className="max-w-3xl mx-auto border-red-200 bg-red-50">
                        <CardContent className="p-4 text-center">
                            <p className="text-red-600">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {wordData && (
                    <Card className="max-w-3xl mx-auto border-0 shadow-lg overflow-hidden">
                        <CardContent className="p-0">
                            <div className="bg-blue-50 p-6 border-b">
                                <h2 className="text-3xl font-bold text-blue-800 mb-2">{wordData.word}</h2>
                                {wordData.pronunciation && <p className="text-gray-600 text-lg">{wordData.pronunciation}</p>}
                            </div>
                            <Tabs defaultValue="definition" className="w-full">
                                <TabsList className="w-full justify-start bg-gray-100 p-0 h-12">
                                    <TabsTrigger
                                        value="definition"
                                        className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow"
                                    >
                                        Định nghĩa
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="synonyms"
                                        className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow"
                                    >
                                        Từ đồng nghĩa
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="origin"
                                        className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:shadow"
                                    >
                                        Nguồn gốc
                                    </TabsTrigger>
                                </TabsList>

                                <div className="p-6 min-h-[300px] bg-white">
                                    <TabsContent value="definition">
                                        <div className="space-y-4">
                                            {wordData.definitions.map((def, index) => (
                                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                    <Badge variant="secondary" className="mb-2">
                                                        {def.dictionary_name}
                                                    </Badge>
                                                    <p className="text-gray-800 text-lg">{def.definition}</p>
                                                    {def.example && <p className="text-gray-600 mt-2 italic">"{def.example}"</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="synonyms">
                                        <div className="flex flex-wrap gap-2">
                                            {wordData.synonyms.map((syn, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-blue-100 text-blue-600 px-3 py-1 text-sm"
                                                    onClick={() => {
                                                        setSearchTerm(syn.synonym_word)
                                                        handleSearch()
                                                    }}
                                                >
                                                    {syn.synonym_word}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="origin">
                                        <p className="text-gray-600">
                                            Thông tin về nguồn gốc của từ "{wordData.word}" sẽ được cập nhật soon.
                                        </p>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {!wordData && !error && !loading && (
                    <div className="max-w-3xl mx-auto text-center text-gray-600">
                        Nhập từ bạn muốn tra cứu vào ô tìm kiếm phía trên
                    </div>
                )}
            </div>
        </div>
    )
}

