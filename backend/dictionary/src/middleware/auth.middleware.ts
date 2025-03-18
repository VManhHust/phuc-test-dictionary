import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" })
            }

            // Lưu thông tin người dùng vào request
            ;(req as any).user = user
            next()
        })
    } else {
        res.status(401).json({ message: "Không tìm thấy token xác thực" })
    }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if (user && user.roles && user.roles.includes("ADMIN")) {
        next()
    } else {
        res.status(403).json({ message: "Không có quyền truy cập" })
    }
}