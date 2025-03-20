// API utility functions
const API_BASE_URL = 'http://localhost:3001';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data?: any,
  params?: Record<string, string>
): Promise<T | null> {
  try {
    // Construct URL with query parameters
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          url.searchParams.append(key, params[key]);
        }
      });
    }

    // Configure request options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    };

    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    // Make the request
    const response = await fetch(url.toString(), options);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      
      // For 404 errors, return null instead of throwing
      if (response.status === 404) {
        return null;
      }
      
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    // For DELETE requests that return no content
    if (method === 'DELETE' && response.status === 204) {
      return { success: true } as unknown as T;
    }

    // Parse and return the response data
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}