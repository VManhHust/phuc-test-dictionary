import Link from "next/link"

export default function Footer() {
    return (
        <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">© 2024 TuDien.vn. All rights reserved.</p>
                    <nav>
                        <ul className="flex items-center gap-4">
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                                    Điều khoản
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                                    Bảo mật
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )
}
