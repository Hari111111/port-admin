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
        <div className="admin-layout">
            <Sidebar />
            <div className="app-wrapper">
                <header className="app-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <span className="root">Admin</span>
                            <span className="separator">/</span>
                            <span className="current">{pathname === '/' ? 'Dashboard' : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}</span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input type="text" placeholder="Search anything..." />
                        </div>
                        <div className="header-actions">
                            <button className="action-icon-btn">🔔<span className="badge"></span></button>
                            <button className="action-icon-btn">⚙️</button>
                        </div>
                    </div>
                </header>
                <main className="main-content">
                    {children}
                </main>
            </div>
            <style jsx>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-primary);
                }
                .app-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    height: 100vh;
                    overflow: hidden;
                }
                .app-header {
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2.5rem;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border-bottom: 2px solid var(--bg-primary);
                    z-index: 100;
                }
                .header-left .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .breadcrumb .root {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .breadcrumb .separator {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                .breadcrumb .current {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .search-bar {
                    background: var(--bg-primary);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 300px;
                    transition: all 0.3s ease;
                }
                .search-bar:focus-within {
                    width: 350px;
                    border-color: var(--accent);
                    background: var(--bg-secondary);
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    margin: 0;
                    padding: 0;
                    font-size: 0.85rem;
                    width: 100%;
                    color: var(--text-primary);
                }
                .search-bar input::placeholder { color: var(--text-muted); }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .action-icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .action-icon-btn:hover {
                    background: var(--accent-dim);
                    border-color: var(--accent);
                    color: var(--accent);
                    transform: translateY(-2px);
                }
                .badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 6px;
                    height: 6px;
                    background: var(--danger);
                    border-radius: 50%;
                    box-shadow: 0 0 8px var(--danger);
                }
                .main-content {
                    flex: 1;
                    padding: 2.5rem;
                    overflow-y: auto;
                    background-image: 
                        radial-gradient(circle at top right, rgba(37, 99, 235, 0.03), transparent 500px),
                        radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.02), transparent 500px);
                }
            `}</style>
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
