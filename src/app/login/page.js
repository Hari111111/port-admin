"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(formData);
            setUser(user);
            router.replace('/');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Animated background blobs */}
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />

            <div className="auth-card-wrapper">
                {/* Logo / Brand */}
                <div className="auth-brand">
                    <div className="auth-logo">
                        <span>A</span>
                    </div>
                    <h1 className="auth-brand-name">Admin<span>Panel</span></h1>
                </div>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your admin dashboard</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">⚠</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="email">Email address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">✉</span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    required
                                    autoComplete="email"
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="auth-input"
                                />
                                <button
                                    type="button"
                                    className="auth-eye-btn"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? '👁' : '🙈'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-spinner" />
                            ) : (
                                'Sign In →'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="auth-link">Create account</Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    overflow: hidden;
                    z-index: 1000;
                }

                /* Animated gradient blobs */
                .auth-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: blobFloat 8s ease-in-out infinite;
                }
                .auth-blob-1 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, #6366f1, #8b5cf6);
                    top: -150px; left: -150px;
                    animation-delay: 0s;
                }
                .auth-blob-2 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, #06b6d4, #3b82f6);
                    bottom: -100px; right: -100px;
                    animation-delay: -3s;
                }
                .auth-blob-3 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, #10b981, #6366f1);
                    bottom: 20%; left: 10%;
                    animation-delay: -6s;
                }
                @keyframes blobFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(20px, -20px) scale(1.05); }
                    66% { transform: translate(-15px, 15px) scale(0.95); }
                }

                .auth-card-wrapper {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 420px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                /* Brand */
                .auth-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .auth-logo {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
                }
                .auth-brand-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                }
                .auth-brand-name span {
                    color: var(--accent);
                }

                /* Card */
                .auth-card {
                    width: 100%;
                    background: rgba(30, 41, 59, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow:
                        0 0 0 1px rgba(99,102,241,0.1),
                        0 20px 60px rgba(0,0,0,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.05);
                }

                .auth-card-header {
                    text-align: center;
                    margin-bottom: 1.75rem;
                }
                .auth-card-header h2 {
                    font-size: 1.625rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.375rem;
                }
                .auth-card-header p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                /* Error banner */
                .auth-error {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    margin-bottom: 1.25rem;
                    animation: slideInDown 0.2s ease;
                }
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .auth-error-icon { font-size: 1rem; }

                /* Form */
                .auth-form { display: flex; flex-direction: column; gap: 0; }
                .auth-field { margin-bottom: 1.25rem; }
                .auth-field label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .auth-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .auth-input-icon {
                    position: absolute;
                    left: 0.875rem;
                    font-size: 0.95rem;
                    pointer-events: none;
                    z-index: 1;
                }
                .auth-input {
                    width: 100%;
                    background: rgba(51, 65, 85, 0.6);
                    border: 1px solid rgba(51, 65, 85, 0.8);
                    border-radius: 10px;
                    padding: 0.8rem 2.75rem 0.8rem 2.75rem;
                    color: var(--text-primary);
                    font-size: 0.925rem;
                    margin-bottom: 0;
                    transition: all 0.2s;
                    outline: none;
                }
                .auth-input::placeholder { color: rgba(203,213,225,0.4); }
                .auth-input:focus {
                    border-color: var(--accent);
                    background: rgba(51, 65, 85, 0.9);
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
                }

                .auth-eye-btn {
                    position: absolute;
                    right: 0.875rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 0;
                    color: var(--text-secondary);
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .auth-eye-btn:hover { opacity: 1; }

                /* Submit button */
                .auth-submit-btn {
                    width: 100%;
                    padding: 0.875rem;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 0.5rem;
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 48px;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.35);
                }
                .auth-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 30px rgba(99,102,241,0.5);
                }
                .auth-submit-btn:active:not(:disabled) { transform: translateY(0); }
                .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .auth-submit-btn.loading { pointer-events: none; }

                /* Spinner */
                .auth-spinner {
                    width: 20px; height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Footer link */
                .auth-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }
                .auth-link {
                    color: var(--accent);
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .auth-link:hover { color: #818cf8; text-decoration: underline; }
            `}</style>
        </div>
    );
}
