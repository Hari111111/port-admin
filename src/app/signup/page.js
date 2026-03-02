"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const user = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            setUser(user);
            router.replace('/');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = () => {
        const p = formData.password;
        if (!p) return null;
        if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '20%' };
        if (p.length < 8) return { label: 'Weak', color: '#f59e0b', width: '40%' };
        if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#eab308', width: '60%' };
        if (!/[^A-Za-z0-9]/.test(p)) return { label: 'Good', color: '#10b981', width: '80%' };
        return { label: 'Strong', color: '#10b981', width: '100%' };
    };
    const strength = passwordStrength();

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />

            <div className="auth-card-wrapper">
                <div className="auth-brand">
                    <div className="auth-logo"><span>A</span></div>
                    <h1 className="auth-brand-name">Admin<span>Panel</span></h1>
                </div>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Create account</h2>
                        <p>Register a new admin account</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">⚠</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="name">Full Name</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">👤</span>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    autoComplete="name"
                                    className="auth-input"
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    required
                                    autoComplete="new-password"
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
                            {/* Password strength meter */}
                            {strength && (
                                <div className="strength-bar-container">
                                    <div className="strength-bar-track">
                                        <div
                                            className="strength-bar-fill"
                                            style={{ width: strength.width, background: strength.color }}
                                        />
                                    </div>
                                    <span className="strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔑</span>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    autoComplete="new-password"
                                    className="auth-input"
                                    style={{
                                        borderColor: formData.confirmPassword
                                            ? formData.confirmPassword === formData.password
                                                ? 'rgba(16,185,129,0.6)'
                                                : 'rgba(239,68,68,0.6)'
                                            : undefined
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <span className="auth-spinner" /> : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <Link href="/login" className="auth-link">Sign in</Link>
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
                .auth-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.15;
                    animation: blobFloat 8s ease-in-out infinite;
                }
                .auth-blob-1 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, #8b5cf6, #6366f1);
                    top: -150px; right: -150px;
                    animation-delay: 0s;
                }
                .auth-blob-2 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, #10b981, #06b6d4);
                    bottom: -100px; left: -100px;
                    animation-delay: -3s;
                }
                .auth-blob-3 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, #f59e0b, #ef4444);
                    top: 20%; right: 15%;
                    animation-delay: -5s;
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
                .auth-brand-name span { color: var(--accent); }
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
                .auth-form { display: flex; flex-direction: column; gap: 0; }
                .auth-field { margin-bottom: 1rem; }
                .auth-field label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.45rem;
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
                    padding: 0.75rem 2.75rem 0.75rem 2.75rem;
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
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .auth-eye-btn:hover { opacity: 1; }

                /* Password strength */
                .strength-bar-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.4rem;
                }
                .strength-bar-track {
                    flex: 1;
                    height: 4px;
                    background: rgba(51,65,85,0.8);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .strength-bar-fill {
                    height: 100%;
                    border-radius: 9999px;
                    transition: width 0.3s ease, background 0.3s ease;
                }
                .strength-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    min-width: 50px;
                    text-align: right;
                }

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
                    margin-top: 0.75rem;
                    transition: all 0.2s;
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
                .auth-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .auth-spinner {
                    width: 20px; height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
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
