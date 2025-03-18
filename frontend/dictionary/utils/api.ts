// API utility function
export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    params?: Record<string, string>
): Promise<T | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const url = new URL(`${baseUrl}/${endpoint}`)

        // Add query parameters if provided
        if (params) {
            Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key])
            })
        }

        // Get token from localStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        }

        // Add authorization header if token exists
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        const options: RequestInit = {
            method,
            headers,
        }

        // Add body for non-GET requests
        if (method !== "GET" && body) {
            options.body = JSON.stringify(body)
        }

        const response = await fetch(url.toString(), options)

        // Handle unauthorized response
        if (response.status === 401) {
            // Clear stored credentials
            if (typeof window !== "undefined") {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                // Redirect to login page if not already there
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login"
                }
            }
            return null
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error(`API Error (${response.status}):`, errorData)
            throw new Error(errorData.message || `Request failed with status ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("API request error:", error)
        return null
    }
}