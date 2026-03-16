"use client";
import { useEffect, useState } from 'react';
import analyticsService from '@/services/analyticsService';

export default function Home() {
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const data = await analyticsService.getAllPageViews();
            setViews(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalViews = views.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Dashboard Analytics</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Monitoring site traffic and engagement</p>
                </div>
                <button className="btn" onClick={fetchAnalytics}>Refresh Stats</button>
            </header>

            <div className="grid-3">
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Page Views</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>{totalViews.toLocaleString()}</span>
                        <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>LIVE</span>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Tracked Pages</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>{views.length}</span>
                        <span style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>Active Routes</span>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Top Performing Page</h3>
                    <div className="flex-between" style={{ marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {views[0]?.pagePath || '/'}
                        </span>
                        <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>{views[0]?.count || 0} hits</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Detailed Traffic Report</h3>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Page Route</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Total Hits</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b' }}>Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading analytics data...</td>
                                </tr>
                            ) : views.length > 0 ? (
                                views.map((v) => (
                                    <tr key={v._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>{v.pagePath}</td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>{v.count.toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '6px', borderRadius: '3px' }}>
                                                <div style={{ 
                                                    width: `${(v.count / views[0].count) * 100}%`, 
                                                    backgroundColor: 'var(--primary)', 
                                                    height: '100%', 
                                                    borderRadius: '3px' 
                                                }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No traffic recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
