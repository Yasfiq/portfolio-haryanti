import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineContextType {
    isOnline: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <OfflineContext.Provider value={{ isOnline }}>
            {children}
            {/* Offline Popup */}
            {!isOnline && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-cms-bg-card border border-cms-border rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cms-error/10 flex items-center justify-center">
                            <WifiOff size={32} className="text-cms-error" />
                        </div>
                        <h2 className="text-xl font-semibold text-cms-text-primary mb-2">
                            You're Offline
                        </h2>
                        <p className="text-cms-text-secondary text-sm mb-6">
                            Please check your internet connection and try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cms-accent text-black font-medium rounded-lg hover:bg-cms-accent-hover transition-colors"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </OfflineContext.Provider>
    );
}

export function useOffline() {
    const context = useContext(OfflineContext);
    if (context === undefined) {
        throw new Error('useOffline must be used within an OfflineProvider');
    }
    return context;
}
