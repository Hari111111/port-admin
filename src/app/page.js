export default function Home() {
    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Admin</p>
                </div>
                <button className="btn">Download Report</button>
            </header>

            <div className="grid-3">
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Users</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>1,234</span>
                        <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>+12%</span>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Revenue</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>$12,345</span>
                        <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>+8%</span>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Sessions</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>432</span>
                        <span style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>-2%</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
                <div className="card">
                    <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
                </div>
            </div>
        </div>
    );
}
