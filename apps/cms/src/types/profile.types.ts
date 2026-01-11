// Profile API types
// Re-export from ts-types for convenience, with API-specific additions

import type { Profile, UpdateProfileInput, Education } from '@repo/ts-types';

// Re-export types from shared package
export type { Profile, UpdateProfileInput, Education };

// Profile with educations (as returned by API)
export interface ProfileWithEducations extends Omit<Profile, 'updatedAt'> {
    updatedAt: string; // API returns ISO string
    educations: Education[];
}

// API response types
export interface ProfileResponse extends Omit<Profile, 'updatedAt'> {
    updatedAt: string;
    educations?: EducationResponse[];
}

export interface EducationResponse extends Omit<Education, 'startDate' | 'endDate'> {
    startDate: string;
    endDate: string | null;
}

// API Input types (strings instead of Date for API calls)
export interface CreateEducationInput {
    schoolName: string;
    degree?: string;
    startDate: string;  // ISO date string
    endDate?: string;   // ISO date string
    isCurrent?: boolean;
}

export interface UpdateEducationInput {
    schoolName?: string;
    degree?: string;
    startDate?: string;  // ISO date string
    endDate?: string;    // ISO date string
    isCurrent?: boolean;
}

