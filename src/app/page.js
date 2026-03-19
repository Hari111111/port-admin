"use client";
import { useEffect, useState, useMemo } from 'react';
import analyticsService from '@/services/analyticsService';
import { 
    Users, 
    Monitor, 
    Globe, 
    Smartphone, 
    TrendingUp, 
    Clock, 
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function Home() {
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
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

    // Derived Stats
    const totalViews = useMemo(() => views.reduce((acc, curr) => acc + curr.count, 0), [views]);
    
    const liveVisitors = useMemo(() => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return views.filter(v => new Date(v.lastActive) > fiveMinutesAgo).length;
    }, [views]);

    const browserData = useMemo(() => {
        const brands = {};
        views.forEach(v => {
            if (v.browsers) {
                Object.entries(v.browsers).forEach(([name, count]) => {
                    brands[name] = (brands[name] || 0) + count;
                });
            }
        });
        return Object.entries(brands).map(([name, value]) => ({ name, value }));
    }, [views]);

    const deviceData = useMemo(() => {
        const devices = {};
        views.forEach(v => {
            if (v.devices) {
                Object.entries(v.devices).forEach(([name, count]) => {
                    devices[name] = (devices[name] || 0) + count;
                });
            }
        });
        return Object.entries(devices).map(([name, value]) => ({ name, value }));
    }, [views]);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity color="#0ea5e9" size={24} />
                        Analytics Insights
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Real-time overview of your portfolio engagement</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                        backgroundColor: '#f0fdf4', 
                        color: '#15803d', 
                        padding: '8px 16px', 
                        borderRadius: '24px', 
                        fontSize: '13px', 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '1px solid #dcfce7'
                    }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                        {liveVisitors} Active Now
                    </div>
                    <button 
                        onClick={fetchAnalytics}
                        className="btn" 
                        style={{ height: '40px', padding: '0 20px', borderRadius: '10px' }}
                    >
                        Sync Data
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#e0f2fe', p: '10px', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp color="#0ea5e9" size={20} />
                        </div>
                        <ArrowUpRight size={16} color="#64748b" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Total Hits</span>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{totalViews.toLocaleString()}</h2>
                </div>

                <div className="card" style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#fef3c7', p: '10px', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe color="#d97706" size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Top Route</span>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '14px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {views[0]?.pagePath || '/'}
                    </h2>
                </div>

                <div className="card" style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#f0fdf4', p: '10px', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Monitor color="#22c55e" size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Peak Platform</span>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                        {deviceData.length > 0 ? deviceData.sort((a,b) => b.value - a.value)[0].name : 'N/A'}
                    </h2>
                </div>

                <div className="card" style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#fdf2f8', p: '10px', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users color="#db2777" size={20} />
                        </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Unique Pages</span>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{views.length}</h2>
                </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', height: '400px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Traffic Distribution</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={views.slice(0, 7)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="pagePath" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: '24px', backgroundColor: '#fff', border: '1px solid #e2e8f0', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>User Segments</h3>
                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData.length > 0 ? deviceData : [{ name: 'None', value: 1 }]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Smartphone size={16} color="#64748b" />
                                <span style={{ fontSize: '13px', color: '#64748b' }}>Browser Leaders</span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0ea5e9' }}>
                                {browserData.length > 0 ? browserData.sort((a,b) => b.value - a.value)[0].name : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, backgroundColor: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Landing Page Report</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Last synced: {new Date().toLocaleTimeString()}</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Page URL</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Hits</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Device Leader</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Session Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Analyzing metrics...</td></tr>
                            ) : views.length > 0 ? (
                                views.map((v) => {
                                    const topDevice = v.devices ? Object.entries(v.devices).sort((a,b)=>b[1]-a[1])[0]?.[0] : 'N/A';
                                    return (
                                        <tr key={v._id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Globe size={14} color="#64748b" />
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{v.pagePath}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{v.count.toLocaleString()}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                                                    {topDevice === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                                    {topDevice}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ width: '120px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', position: 'relative' }}>
                                                    <div style={{ 
                                                        width: `${Math.min((v.count / views[0].count) * 100, 100)}%`, 
                                                        height: '100%', 
                                                        backgroundColor: '#0ea5e9', 
                                                        borderRadius: '3px',
                                                        boxShadow: '0 0 8px rgba(14, 165, 233, 0.3)'
                                                    }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Waiting for traffic signal...</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.6; }
                }
                .table-row-hover:hover {
                    background-color: #fbfcfd !important;
                }
            `}</style>
        </div>
    );
}
