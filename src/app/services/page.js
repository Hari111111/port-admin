"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllServices, deleteService } from '@/services/serviceService';
import { ApiError } from '@/lib/api';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllServices();
            setServices(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await deleteService(id);
            fetchServices();
        } catch (err) {
            alert('Delete failed: ' + (err instanceof ApiError ? err.message : err.message));
        }
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Services</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your service offerings</p>
                </div>
                <Link href="/services/add" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Add New Service
                </Link>
            </header>

            {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Icon</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service._id}>
                                    <td style={{ fontWeight: 500 }}>{service.title}</td>
                                    <td>
                                        <div style={{ fontSize: '1.5rem' }}>
                                            {service.icon.startsWith('http') ? (
                                                <img src={service.icon} alt={service.title} style={{ width: '30px' }} />
                                            ) : (
                                                <span>{service.icon}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <p style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {service.description}
                                        </p>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No services found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
