const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // GET request
    get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    // POST request
    post<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, headers });
    }

    // PUT request
    put<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }

    // PATCH request
    patch<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'PATCH', body, headers });
    }

    // DELETE request
    delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

export const api = new ApiClient(API_BASE_URL);

// API Endpoints
export const endpoints = {
    // Dashboard
    dashboard: {
        stats: '/dashboard/stats',
    },

    // Profile
    profile: '/profile',

    // Projects
    projects: '/projects',
    project: (id: string) => `/projects/${id}`,
    projectBySlug: (slug: string) => `/projects/slug/${slug}`,

    // Categories
    categories: '/categories',
    category: (id: string) => `/categories/${id}`,

    // Skills
    skills: '/skills',
    skill: (id: string) => `/skills/${id}`,
    skillsReorder: '/skills/reorder',

    // Experience
    experiences: '/experiences',
    experience: (id: string) => `/experiences/${id}`,
    experiencesReorder: '/experiences/reorder',

    // Services
    services: '/services',
    service: (id: string) => `/services/${id}`,
    servicesReorder: '/services/reorder',

    // Messages
    messages: '/messages',
    message: (id: string) => `/messages/${id}`,
    messageRead: (id: string) => `/messages/${id}/read`,

    // Hero Slides
    heroSlides: '/hero-slides',
    heroSlide: (id: string) => `/hero-slides/${id}`,
    heroSlidesReorder: '/hero-slides/reorder',

    // Settings
    settings: '/settings',

    // Upload
    upload: '/upload',
};

