"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllBlogs, deleteBlog } from '@/services/blogService';
import { ApiError } from '@/lib/api';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllBlogs();
            setBlogs(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            await deleteBlog(id);
            fetchBlogs();
        } catch (err) {
            alert('Delete failed: ' + (err instanceof ApiError ? err.message : err.message));
        }
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Blogs</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your blog posts</p>
                </div>
                <Link href="/blogs/add" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Add New Blog
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
                                <th>Title</th>
                                <th>Category</th>
                                <th>Image</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td>
                                        <Link href={`/blogs/${blog._id}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}>
                                            {blog.title}
                                        </Link>
                                    </td>
                                    <td>
                                        <span className="status active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td>
                                        {blog.image && <img src={blog.image} alt={blog.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/blogs/${blog._id}`}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>View</button>
                                            </Link>
                                            <Link href={`/blogs/edit/${blog._id}`}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}>Edit</button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {blogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No blogs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
