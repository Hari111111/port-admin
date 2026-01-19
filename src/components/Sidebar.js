"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/users', label: 'Users', icon: '👥' },
    { href: '/blogs', label: 'Blogs', icon: '📝' },
    { href: '/projects', label: 'Projects', icon: '💻' },
    { href: '/resume-builder', label: 'Resume Builder', icon: '📄' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h1 className="logo">Admin<span style={{ color: 'var(--accent)' }}>Panel</span></h1>
      </div>

      <nav className="nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .logo-container {
          padding: 2rem;
          border-bottom: 1px solid var(--border);
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .nav {
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          color: var(--text-secondary);
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .nav-link.active {
          background-color: var(--accent);
          color: white;
        }

        .icon {
          font-size: 1.25rem;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
