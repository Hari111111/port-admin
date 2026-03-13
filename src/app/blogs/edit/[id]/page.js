"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '@/components/Editor';
import FileUpload from '@/components/FileUpload';
import { getBlogById, updateBlog } from '@/services/blogService';
import { ApiError } from '@/lib/api';

export default function EditBlogPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        image: '',
        category: '',
        description: '',
        content: '',
        tags: '',
    });

    useEffect(() => {
        if (id) {
            fetchBlogDetails();
        }
    }, [id]);

    const fetchBlogDetails = async () => {
        try {
            const data = await getBlogById(id);
            setFormData({
                title: data.title || '',
                slug: data.slug || '',
                image: data.image || '',
                category: data.category || '',
                description: data.description || '',
                content: data.content || '',
                tags: data.tags ? data.tags.join(', ') : '',
            });
        } catch (err) {
            alert('Failed to load blog details');
            router.push('/blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateBlog(id, {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            });
            router.push('/blogs');
        } catch (err) {
            alert('Error updating blog: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading blog data...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Edit Blog Post</h2>

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
                            />
                        </div>
                    </div>

                    <div>
                        <FileUpload 
                            type="image" 
                            label="Blog Image" 
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                        />
                         {formData.image && (
                            <div style={{ marginBottom: '1rem' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                        )}
                        <div style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Or manually enter image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
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
                        <button type="submit" className="btn" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
