"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/users', label: 'Users', icon: '👥' },
    { href: '/blogs', label: 'Blogs', icon: '📝' },
    { href: '/projects', label: 'Projects', icon: '💻' },
    { href: '/resume-builder', label: 'Resume Builder', icon: '📄' },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  // Generate avatar initials from name
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo-icon">A</div>
        <h1 className="logo">Admin<span style={{ color: 'var(--accent)' }}>Panel</span></h1>
      </div>

      {/* Nav links */}
      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
            {pathname === link.href && <span className="active-indicator" />}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User card + Logout */}
      {user && (
        <div className="user-section">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.isAdmin ? '⭐ Admin' : 'Member'}</div>
            </div>
          </div>
          <button
            className={`logout-btn ${loggingOut ? 'loading' : ''}`}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <span className="logout-spinner" />
            ) : (
              <>
                <span>🚪</span>
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, var(--bg-secondary) 0%, rgba(15,23,42,0.95) 100%);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow: hidden;
        }

        .logo-container {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(99,102,241,0.3);
        }

        .logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .nav {
          padding: 1.25rem 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 0.875rem;
          border-radius: 10px;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.925rem;
          position: relative;
          text-decoration: none;
        }

        .nav-link:hover {
          background-color: rgba(99, 102, 241, 0.08);
          color: var(--text-primary);
          transform: translateX(2px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.25);
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          right: 0.75rem;
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
        }

        .icon { font-size: 1.1rem; }

        /* User section */
        .user-section {
          padding: 1rem 0.875rem 1.25rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }

        .user-info { overflow: hidden; }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.1rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.65rem;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 40px;
        }

        .logout-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #f87171;
        }

        .logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .logout-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(252,165,165,0.3);
          border-top-color: #fca5a5;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </aside>
  );
};

export default Sidebar;
