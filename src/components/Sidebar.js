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
          background: linear-gradient(180deg, #071a1e 0%, #030d0e 100%);
          border-right: 1px solid rgba(15, 212, 184, 0.08);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow: hidden;
        }

        /* Ambient teal glow strip on the right edge of sidebar */
        .sidebar::after {
          content: '';
          position: absolute;
          right: 0; top: 20%; bottom: 20%;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(15,212,184,0.25), transparent);
        }

        .logo-container {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid rgba(15,212,184,0.08);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #0fd4b8, #06a88f);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          color: #020c0b;
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(15,212,184,0.35);
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
          gap: 0.2rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.7rem 0.875rem;
          border-radius: 10px;
          color: rgba(127, 184, 180, 0.7);
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 0.9rem;
          position: relative;
          text-decoration: none;
          border: 1px solid transparent;
        }

        .nav-link:hover {
          background: rgba(15, 212, 184, 0.06);
          color: var(--text-primary);
          transform: translateX(3px);
          border-color: rgba(15,212,184,0.1);
        }

        .nav-link.active {
          background: linear-gradient(135deg, rgba(15,212,184,0.12), rgba(6,180,150,0.07));
          color: #0fd4b8;
          border-color: rgba(15,212,184,0.2);
          font-weight: 600;
          box-shadow: inset 0 1px 0 rgba(15,212,184,0.1);
        }

        .active-indicator {
          position: absolute;
          right: 0.75rem;
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(15,212,184,0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 6px rgba(15,212,184,0.6); }
          50% { box-shadow: 0 0 14px rgba(15,212,184,1); }
        }

        .icon { font-size: 1.1rem; }

        /* User section */
        .user-section {
          padding: 1rem 0.875rem 1.25rem;
          border-top: 1px solid rgba(15,212,184,0.08);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          background: rgba(15,212,184,0.05);
          border: 1px solid rgba(15,212,184,0.12);
          border-radius: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0fd4b8, #06a88f);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #020c0b;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(15,212,184,0.3);
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
          color: var(--accent);
          margin-top: 0.1rem;
          font-weight: 600;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.65rem;
          border-radius: 10px;
          background: rgba(255, 84, 112, 0.08);
          border: 1px solid rgba(255, 84, 112, 0.18);
          color: rgba(255,120,140,0.9);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 40px;
        }

        .logout-btn:hover:not(:disabled) {
          background: rgba(255, 84, 112, 0.15);
          border-color: rgba(255, 84, 112, 0.3);
          color: #ff5470;
          box-shadow: 0 2px 12px rgba(255,84,112,0.15);
        }

        .logout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .logout-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,120,140,0.25);
          border-top-color: rgba(255,120,140,0.9);
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
