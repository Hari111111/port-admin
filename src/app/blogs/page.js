"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/blogs');
            const data = await res.json();
            setBlogs(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const deleteBlog = async (id) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            try {
                await fetch(`http://localhost:5000/api/blogs/${id}`, {
                    method: 'DELETE',
                });
                fetchBlogs();
            } catch (error) {
                console.error(error);
            }
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
                                        <Link href={`/blogs/${blog._id}`} style={{ fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }} className="hover:text-indigo-400">
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
                                            <button
                                                onClick={() => deleteBlog(blog._id)}
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
