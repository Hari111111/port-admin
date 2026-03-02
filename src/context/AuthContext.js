"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMe, logout as logoutService } from '@/services/userService';

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// Public routes that do NOT require authentication
const PUBLIC_ROUTES = ['/login', '/signup'];

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(null);       // null = not loaded yet
    const [loading, setLoading] = useState(true); // true until we verify session

    // On mount: validate JWT cookie by calling /api/users/me
    useEffect(() => {
        const verifySession = async () => {
            try {
                const data = await getMe();
                setUser(data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    // Redirect logic after loading completes
    useEffect(() => {
        if (loading) return;

        const isPublic = PUBLIC_ROUTES.includes(pathname);

        if (!user && !isPublic) {
            // Not logged in → redirect to login
            router.replace('/login');
        } else if (user && isPublic) {
            // Already logged in → redirect to dashboard
            router.replace('/');
        }
    }, [user, loading, pathname, router]);

    const logout = useCallback(async () => {
        try {
            await logoutService();
        } catch {
            // Ignore errors — clear state regardless
        }
        setUser(null);
        router.replace('/login');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
