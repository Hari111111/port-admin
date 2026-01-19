"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ViewBlogPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBlogDetails();
        }
    }, [id]);

    const fetchBlogDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
            if (!res.ok) {
                throw new Error('Blog not found');
            }
            const data = await res.json();
            setBlog(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading details...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'var(--danger)' }}>Error: {error}</div>;
    if (!blog) return <div style={{ padding: '2rem' }}>Blog not found</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                    }}
                >
                    ← Back to List
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Placeholder for Edit button if needed later */}
                    <span className="status active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
                        {blog.category}
                    </span>
                </div>
            </div>

            <div className="card">
                {blog.image && (
                    <div style={{ marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
                        <img
                            src={blog.image}
                            alt={blog.title}
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
                    {blog.title}
                </h1>

                <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>🔗 {blog.slug}</span>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Summary</h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{blog.description}</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Content</h3>
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                        style={{
                            lineHeight: 1.8,
                            fontSize: '1.05rem',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {blog.tags && blog.tags.length > 0 && (
                    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Tags</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        backgroundColor: 'var(--bg-tertiary)',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .blog-content h1, .blog-content h2, .blog-content h3 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        .blog-content p {
            margin-bottom: 1rem;
        }
        .blog-content ul, .blog-content ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }
        .blog-content img {
            max-width: 100%;
            border-radius: 8px;
            margin: 1rem 0;
        }
        .blog-content blockquote {
            border-left: 4px solid var(--accent);
            padding-left: 1rem;
            margin: 1rem 0;
            color: var(--text-secondary);
            font-style: italic;
        }
        .blog-content pre {
            background-color: var(--bg-tertiary);
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
        }
      `}</style>
        </div>
    );
}
