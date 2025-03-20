"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiRequest } from "@/utils/api"

type WordOption = {
    id: string
    word: string
    pronunciation?: string
}

type WordSearchResponse = {
    data: WordOption[]
    total: number
    total_pages: number
    current_page: number
    limit: number
}

interface WordSearchBarProps {
    onWordSelect: (word: WordOption) => void
    onClear?: () => void
    className?: string
    placeholder?: string
    initialValue?: WordOption | null
}

export default function WordSearchBar({
                                          onWordSelect,
                                          onClear,
                                          className,
                                          placeholder = "Tìm kiếm từ...",
                                          initialValue = null,
                                      }: WordSearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [options, setOptions] = useState<WordOption[]>([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [selectedWord, setSelectedWord] = useState<WordOption | null>(initialValue)
    const containerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const pageSize = 10

    // Set initial value if provided
    useEffect(() => {
        if (initialValue) {
            setSelectedWord(initialValue)
            setSearchTerm(initialValue.word)
        }
    }, [initialValue])

    // Fetch words based on search term and page
    const fetchWords = useCallback(
        async (term: string, page: number, append = false) => {
            setLoading(true)
            try {
                // Use apiRequest instead of direct fetch
                const params: Record<string, string> = {
                    page: page.toString(),
                    size: pageSize.toString(),
                }

                if (term.trim()) {
                    params.word = term
                }

                const data = await apiRequest<WordSearchResponse>("words", "GET", undefined, params)

                if (data) {
                    if (append) {
                        setOptions((prev) => [...prev, ...data.data])
                    } else {
                        setOptions(data.data)
                    }

                    setTotalPages(data.total_pages)
                    setCurrentPage(data.current_page)
                    setHasMore(data.current_page < data.total_pages)
                    setIsOpen(true)
                } else {
                    if (!append) {
                        setOptions([])
                    }
                    setHasMore(false)
                }
            } catch (error) {
                console.error("Error fetching words:", error)
                if (!append) {
                    setOptions([])
                }
                setHasMore(false)
            } finally {
                setLoading(false)
            }
        },
        [pageSize],
    )

    // Initial fetch and search term changes
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm.trim() && !selectedWord) {
                setCurrentPage(1)
                fetchWords(searchTerm, 1, false)
            } else if (!searchTerm.trim()) {
                setOptions([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchTerm, fetchWords, selectedWord])

    // Handle scroll to load more
    const handleScroll = useCallback(() => {
        if (!dropdownRef.current || loading || !hasMore) return

        const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current

        // If scrolled to bottom (with a small threshold)
        if (scrollHeight - scrollTop - clientHeight < 50) {
            fetchWords(searchTerm, currentPage + 1, true)
        }
    }, [fetchWords, searchTerm, currentPage, loading, hasMore])

    // Add scroll event listener
    useEffect(() => {
        const dropdown = dropdownRef.current
        if (dropdown) {
            dropdown.addEventListener("scroll", handleScroll)
            return () => dropdown.removeEventListener("scroll", handleScroll)
        }
    }, [handleScroll])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (word: WordOption) => {
        setSelectedWord(word)
        setSearchTerm(word.word)
        setIsOpen(false)
        onWordSelect(word)
    }

    const handleClear = () => {
        setSearchTerm("")
        setSelectedWord(null)
        setOptions([])
        setIsOpen(false)

        // Call the onClear callback if provided
        if (onClear) {
            onClear()
        }
    }

    const toggleDropdown = () => {
        if (!isOpen && !selectedWord) {
            fetchWords(searchTerm, 1, false)
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        if (selectedWord) {
                            setSelectedWord(null)
                        }
                    }}
                    placeholder={placeholder}
                    className="pl-10 pr-20 h-10"
                    onFocus={() => {
                        if (!selectedWord && searchTerm.trim()) {
                            setIsOpen(true)
                        }
                    }}
                />
                <div className="absolute right-0 top-0 h-full flex items-center">
                    {searchTerm && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-full px-2 text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2 text-gray-400 hover:text-gray-600"
                        onClick={toggleDropdown}
                    >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {isOpen && !selectedWord && (
                <div
                    className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg"
                    ref={dropdownRef}
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                    {loading && currentPage === 1 ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                            <span>Đang tìm kiếm...</span>
                        </div>
                    ) : (
                        <>
                            <ul className="py-1">
                                {options.map((option) => (
                                    <li
                                        key={option.id}
                                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                        onClick={() => handleSelect(option)}
                                    >
                                        <div>
                                            <div className="font-medium">{option.word}</div>
                                            {option.pronunciation && <div className="text-sm text-gray-500">{option.pronunciation}</div>}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {options.length === 0 && !loading && (
                                <div className="p-4 text-center text-gray-500">
                                    {searchTerm ? "Không tìm thấy từ phù hợp" : "Nhập từ để tìm kiếm"}
                                </div>
                            )}

                            {loading && currentPage > 1 && (
                                <div className="p-2 text-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mx-auto" />
                                </div>
                            )}

                            {!loading && hasMore && (
                                <div className="p-2 text-center text-sm text-gray-500">Cuộn xuống để xem thêm</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}