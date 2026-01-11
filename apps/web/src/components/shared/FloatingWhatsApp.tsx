import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

/**
 * Floating WhatsApp button that appears in bottom-right corner.
 * WhatsApp number is configurable via CMS Settings.
 */
export default function FloatingWhatsApp() {
    const { data: settings } = useSettings();

    // Don't render if no whatsapp number configured
    if (!settings?.whatsappNumber) {
        return null;
    }

    // Clean number (remove any non-digits except leading +)
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat via WhatsApp"
        >
            <div className="relative">
                {/* Pulse animation ring */}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />

                {/* Main button */}
                <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300">
                    <MessageCircle className="w-7 h-7 text-white" fill="currentColor" />
                </div>

                {/* Tooltip */}
                <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
            </div>
        </a>
    );
}
