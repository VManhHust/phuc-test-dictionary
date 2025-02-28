const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"; // Fallback nếu env không tồn tại

export const buildApiUrl = (endpoint: string, params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${API_BASE_URL}/${endpoint}?${queryString}` : `${API_BASE_URL}/${endpoint}`;
};

export const apiRequest = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: Record<string, any>,
    params: Record<string, string> = {}
): Promise<T | null> => {
    const url = buildApiUrl(endpoint, params);
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API request failed: ${error}`);
        return null;
    }
};
