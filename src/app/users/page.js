"use client";

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/userService';
import { ApiError } from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const getResumeStatus = (user) => {
        if (!user.resume) {
            return { label: 'No Resume', className: 'inactive' };
        }

        const hasCoreData =
            user.resume.personalInfo?.summary ||
            user.resume.skills?.length ||
            user.resume.experience?.length ||
            user.resume.education?.length;

        if (hasCoreData) {
            return { label: 'Resume Added', className: 'active' };
        }

        return { label: 'Draft Resume', className: 'inactive' };
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Users</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your users here</p>
                </div>
                <button className="btn">Add New User</button>
            </header>

            {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="card table-container">
                    {users.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No users found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Resume</th>
                                    <th>Resume Details</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const resumeStatus = getResumeStatus(user);
                                    const resumeTitle =
                                        user.resume?.personalInfo?.jobTitle ||
                                        user.resume?.personalInfo?.fullName ||
                                        'No resume title';
                                    const resumeSummary =
                                        user.resume?.personalInfo?.summary ||
                                        'Resume summary not added yet.';

                                    return (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{user.name}</div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                                        <td>
                                            <span className={`status ${user.isAdmin ? 'active' : 'inactive'}`}>
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status ${resumeStatus.className}`}>
                                                {resumeStatus.label}
                                            </span>
                                        </td>
                                        <td style={{ minWidth: '280px' }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {resumeTitle}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                                                {resumeSummary.length > 120 ? `${resumeSummary.slice(0, 120)}...` : resumeSummary}
                                            </div>
                                            {user.resume ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                    <span className="status active">
                                                        Skills: {user.resume.skills?.length || 0}
                                                    </span>
                                                    <span className="status">
                                                        Exp: {user.resume.experience?.length || 0}
                                                    </span>
                                                    <span className="status">
                                                        Projects: {user.resume.projects?.length || 0}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    Resume data not found
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                                            {user.resume?.updatedAt && (
                                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                    Resume: {new Date(user.resume.updatedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
