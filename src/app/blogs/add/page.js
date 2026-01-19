"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

export default function AddBlogPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        image: '',
        category: '',
        description: '',
        content: '',
        tags: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (name === 'title') {
                return {
                    ...prev,
                    title: value,
                    slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(tag => tag.trim())
                }),
            });

            if (res.ok) {
                router.push('/blogs');
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Add New Blog Post</h2>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter blog title"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="url-friendly-slug"
                            />
                        </div>
                        <div>
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="Technology"
                            />
                        </div>
                    </div>

                    <div>
                        <label>Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label>Short Description (SEO)</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                backgroundColor: 'var(--bg-tertiary)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                marginBottom: '1rem',
                                outline: 'none',
                            }}
                            placeholder="Brief summary for list view and meta tags"
                        />
                    </div>

                    <div>
                        <label>Content</label>
                        <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                            <Editor
                                value={formData.content}
                                onChange={handleContentChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label>Tags (Comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, webdev"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                backgroundColor: 'transparent',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border)',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn">
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
