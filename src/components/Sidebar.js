"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const menuGroups = [
    {
      title: 'Main',
      links: [
        { href: '/', label: 'Dashboard', icon: '📊' },
        { href: '/profile', label: 'Profile', icon: '👤' },
        { href: '/users', label: 'Users', icon: '👥' },
      ]
    },
    {
      title: 'Content',
      links: [
        { href: '/blogs', label: 'Blogs', icon: '📝' },
        { href: '/projects', label: 'Projects', icon: '💻' },
      ]
    },
    {
      title: 'Tools',
      links: [
        { href: '/resume-builder', label: 'Resume Builder', icon: '📄' },
        { href: '/questions', label: 'Interview Q&A', icon: '❓' },
      ]
    }
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
        {menuGroups.map((group) => (
          <div key={group.title} className="menu-group">
            <h3 className="group-title">{group.title}</h3>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                <span className="icon">{link.icon}</span>
                <span className="label">{link.label}</span>
                {pathname === link.href && <span className="active-glow" />}
              </Link>
            ))}
          </div>
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
          width: 280px;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .logo-container {
          padding: 2rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          background: var(--gradient-accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.25rem;
          color: white;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.25);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .nav {
          padding: 0 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          overflow-y: auto;
        }

        .menu-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .group-title {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          padding-left: 0.75rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          font-size: 0.925rem;
          position: relative;
          text-decoration: none;
        }

        .nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transform: translateX(4px);
        }

        .nav-link.active {
          background: var(--accent-dim);
          color: var(--accent);
          font-weight: 700;
        }

        .active-glow {
          position: absolute;
          left: 0;
          width: 3px;
          height: 20px;
          background: var(--accent);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 12px var(--accent);
        }

        .user-section {
          padding: 1.5rem;
          margin-top: auto;
          background: var(--bg-primary);
          border-top: 1px solid var(--border);
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 600;
          opacity: 0.8;
        }

        .logout-btn {
          width: 100%;
          padding: 0.85rem;
          border-radius: 12px;
          background: rgba(255, 84, 112, 0.08);
          border: 1px solid rgba(255, 84, 112, 0.15);
          color: #ff5470;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover:not(:disabled) {
          background: #ff5470;
          color: white;
          box-shadow: 0 8px 16px rgba(255, 84, 112, 0.25);
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
