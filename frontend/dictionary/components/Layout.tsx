import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex h-20 items-center justify-between">
                        <h1 className="text-3xl font-bold">Từ Điển & Tin Tức</h1>
                        <nav>
                            <ul className="flex space-x-4">
                                <li>
                                    <Link href="/" className={`hover:text-blue-300 ${router.pathname === '/' ? 'text-blue-300' : ''}`}>
                                        Từ Điển
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/news" className={`hover:text-blue-300 ${router.pathname.startsWith('/news') ? 'text-blue-300' : ''}`}>
                                        Tin Tức
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    © 2024 Từ Điển & Tin Tức. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
