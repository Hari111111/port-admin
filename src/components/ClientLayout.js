"use client";

import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

const PUBLIC_ROUTES = ['/login', '/signup'];

// Inner component — has access to AuthContext
function LayoutContent({ children }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    // Full-page loading screen while verifying JWT session
    if (loading) {
        return (
            <div className="session-loading">
                <div className="session-logo">
                    <span>A</span>
                </div>
                <div className="session-spinner" />
                <p>Authenticating...</p>
                <style jsx>{`
                    .session-loading {
                        position: fixed;
                        inset: 0;
                        background: var(--bg-primary);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1.25rem;
                        z-index: 9999;
                    }
                    .session-logo {
                        width: 56px;
                        height: 56px;
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        font-weight: 800;
                        color: white;
                        box-shadow: 0 4px 20px rgba(99,102,241,0.4);
                        animation: logoPulse 2s ease-in-out infinite;
                    }
                    @keyframes logoPulse {
                        0%, 100% { box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
                        50% { box-shadow: 0 4px 40px rgba(99,102,241,0.7); }
                    }
                    .session-spinner {
                        width: 32px;
                        height: 32px;
                        border: 3px solid rgba(99,102,241,0.2);
                        border-top-color: #6366f1;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    .session-loading p {
                        color: var(--text-secondary);
                        font-size: 0.9rem;
                        letter-spacing: 0.02em;
                    }
                `}</style>
            </div>
        );
    }

    // Public pages (login/signup) — render without sidebar
    if (isPublic || !user) {
        return <>{children}</>;
    }

    // Authenticated — render with sidebar
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

// Outer wrapper — provides the AuthContext
export default function ClientLayout({ children }) {
    return (
        <AuthProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </AuthProvider>
    );
}
