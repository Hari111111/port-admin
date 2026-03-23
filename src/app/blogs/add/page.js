"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import FileUpload from '@/components/FileUpload';
import { createBlog, generateBlogDraft } from '@/services/blogService';
import { ApiError } from '@/lib/api';

export default function AddBlogPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState({
        topic: '',
        audience: 'Developers',
        tone: 'Professional',
        keywords: '',
    });
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

    const handleAiPromptChange = (e) => {
        const { name, value } = e.target;
        setAiPrompt((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateDraft = async () => {
        if (!aiPrompt.topic.trim()) {
            alert('Please enter a topic for the AI blog draft');
            return;
        }

        setGenerating(true);
        try {
            const response = await generateBlogDraft({
                ...aiPrompt,
                category: formData.category,
            });

            setFormData((prev) => ({
                ...prev,
                title: response.data.title || '',
                slug: response.data.slug || '',
                image: response.data.image || prev.image,
                category: response.data.category || '',
                description: response.data.description || '',
                content: response.data.content || '',
                tags: Array.isArray(response.data.tags) ? response.data.tags.join(', ') : '',
            }));
        } catch (err) {
            alert('AI Error: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createBlog({
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            });
            router.push('/blogs');
        } catch (err) {
            alert('Error: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Add New Blog Post</h2>

            <div className="card">
                <div style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>AI Blog Draft Generator</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Ek prompt likho, AI response aayega aur form ke fields automatically fill ho jayenge. Aap review karke submit kar sakte ho.
                    </p>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label>AI Prompt / Brief</label>
                            <textarea
                                name="topic"
                                value={aiPrompt.topic}
                                onChange={handleAiPromptChange}
                                rows="4"
                                placeholder="e.g. Write a detailed blog on Next.js performance tips for SaaS apps, include SEO best practices, real examples, and practical optimization steps."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Audience</label>
                                <input
                                    type="text"
                                    name="audience"
                                    value={aiPrompt.audience}
                                    onChange={handleAiPromptChange}
                                    placeholder="Developers"
                                />
                            </div>
                            <div>
                                <label>Tone</label>
                                <input
                                    type="text"
                                    name="tone"
                                    value={aiPrompt.tone}
                                    onChange={handleAiPromptChange}
                                    placeholder="Professional"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Keywords</label>
                            <input
                                type="text"
                                name="keywords"
                                value={aiPrompt.keywords}
                                onChange={handleAiPromptChange}
                                placeholder="next.js, seo, optimization"
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn" onClick={handleGenerateDraft} disabled={generating}>
                                {generating ? 'Filling Fields...' : 'Fill Form With AI'}
                            </button>
                        </div>
                    </div>
                </div>

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
                        <FileUpload 
                            type="image" 
                            label="Blog Image" 
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                        />
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
                        <button type="submit" className="btn" disabled={submitting}>
                            {submitting ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
