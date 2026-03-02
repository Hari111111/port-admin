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
                                    <th>Status</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
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
                                            <span className="status active">Active</span>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
