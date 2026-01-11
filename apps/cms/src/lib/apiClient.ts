import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    skipAuth?: boolean;
}

export class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Network error. Please check your connection.') {
        super(message);
        this.name = 'NetworkError';
    }
}

// Event emitter for auth events
type AuthEventType = 'logout';
export type LogoutReason = 'session_expired' | 'unauthorized' | 'manual' | 'no_token';
type AuthEventCallback = (reason?: LogoutReason) => void;
const authEventListeners: Map<AuthEventType, Set<AuthEventCallback>> = new Map();

export const authEvents = {
    on(event: AuthEventType, callback: AuthEventCallback) {
        if (!authEventListeners.has(event)) {
            authEventListeners.set(event, new Set());
        }
        authEventListeners.get(event)!.add(callback);
        return () => {
            authEventListeners.get(event)?.delete(callback);
        };
    },
    emit(event: AuthEventType, reason?: LogoutReason) {
        authEventListeners.get(event)?.forEach(cb => cb(reason));
    }
};

async function getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
}

async function refreshToken(): Promise<string | null> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) {
        return null;
    }
    return data.session.access_token;
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {},
    retryCount = 0
): Promise<T> {
    const { method = 'GET', body, headers = {}, skipAuth = false } = options;
    const maxRetries = 3;

    // Check if online
    if (!navigator.onLine) {
        throw new NetworkError('You are offline. Please check your internet connection.');
    }

    // Get access token
    let token: string | null = null;
    if (!skipAuth) {
        token = await getAccessToken();
        if (!token) {
            authEvents.emit('logout', 'no_token');
            throw new ApiError('No authentication token', 401, 'NO_TOKEN');
        }
    }

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle 401 - Try to refresh token once
        if (response.status === 401 && !skipAuth && retryCount === 0) {
            const newToken = await refreshToken();
            if (newToken) {
                // Retry with new token
                return request<T>(endpoint, options, 1);
            } else {
                // Refresh failed, trigger logout
                authEvents.emit('logout', 'session_expired');
                throw new ApiError('Session expired. Please login again.', 401, 'SESSION_EXPIRED');
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new ApiError(
                errorData.message || `HTTP error! status: ${response.status}`,
                response.status,
                errorData.code
            );
        }

        // Handle empty response
        const text = await response.text();
        if (!text) {
            return {} as T;
        }

        return JSON.parse(text);
    } catch (error) {
        // Network errors - retry with exponential backoff
        if (error instanceof TypeError && error.message.includes('fetch')) {
            if (retryCount < maxRetries) {
                const delay = Math.min(1000 * 2 ** retryCount, 10000);
                await new Promise(resolve => setTimeout(resolve, delay));
                return request<T>(endpoint, options, retryCount + 1);
            }
            throw new NetworkError();
        }

        throw error;
    }
}

// API client instance
export const apiClient = {
    get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'POST', body });
    },

    put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'PUT', body });
    },

    patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'PATCH', body });
    },

    delete<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'DELETE', body });
    },

    // Special method for file uploads with FormData
    async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        // Check if online
        if (!navigator.onLine) {
            throw new NetworkError('You are offline. Please check your internet connection.');
        }

        // Get access token
        const token = await getAccessToken();
        if (!token) {
            authEvents.emit('logout', 'no_token');
            throw new ApiError('No authentication token', 401, 'NO_TOKEN');
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type - browser will set it with boundary for FormData
            },
            body: formData,
        });

        if (response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
                // Retry with new token
                const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                    },
                    body: formData,
                });

                if (!retryResponse.ok) {
                    const errorData = await retryResponse.json().catch(() => ({ message: 'Upload failed' }));
                    throw new ApiError(errorData.message, retryResponse.status, errorData.code);
                }

                return retryResponse.json();
            } else {
                authEvents.emit('logout', 'session_expired');
                throw new ApiError('Session expired. Please login again.', 401, 'SESSION_EXPIRED');
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new ApiError(errorData.message, response.status, errorData.code);
        }

        return response.json();
    },
};
