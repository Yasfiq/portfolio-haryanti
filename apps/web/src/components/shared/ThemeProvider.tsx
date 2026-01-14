import { useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

/**
 * Convert hex color to RGB values string (e.g., "243 116 48")
 */
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
    }
    return '243 116 48'; // fallback to default orange
}

/**
 * ThemeProvider - Injects dynamic CSS variables, browser title, and favicon from CMS Settings.
 * This component should be placed at the root of the app to apply theme globally.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { data: settings } = useSettings();

    // Apply color theme
    useEffect(() => {
        if (!settings) return;

        const root = document.documentElement;

        // Apply primary color if set (both hex and RGB for Tailwind opacity support)
        if (settings.primaryColor) {
            root.style.setProperty('--primary', settings.primaryColor);
            root.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
        }

        // Apply secondary color if set
        if (settings.secondaryColor) {
            root.style.setProperty('--secondary', settings.secondaryColor);
            root.style.setProperty('--secondary-rgb', hexToRgb(settings.secondaryColor));
        }

        // Cleanup on unmount
        return () => {
            root.style.removeProperty('--primary');
            root.style.removeProperty('--primary-rgb');
            root.style.removeProperty('--secondary');
            root.style.removeProperty('--secondary-rgb');
        };
    }, [settings?.primaryColor, settings?.secondaryColor]);

    // Apply browser title
    useEffect(() => {
        if (settings?.browserTitle) {
            document.title = settings.browserTitle;
        }
    }, [settings?.browserTitle]);

    // Apply favicon
    useEffect(() => {
        if (settings?.faviconUrl) {
            // Find existing favicon link or create one
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = settings.faviconUrl;
        }
    }, [settings?.faviconUrl]);

    return <>{children}</>;
}
