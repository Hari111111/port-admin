"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/services/projectService';
import FileUpload from '@/components/FileUpload';
import { ApiError } from '@/lib/api';

export default function AddProjectPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        description: '',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createProject({
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
            });
            router.push('/projects');
        } catch (err) {
            alert('Error: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Add New Project</h2>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Project Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. E-Commerce Dashboard"
                        />
                    </div>

                    <div>
                        <FileUpload 
                            type="image" 
                            label="Project Thumbnail" 
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
                        />
                        <div style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Or manually enter image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/project-thumb.jpg"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Live Demo URL</label>
                            <input
                                type="url"
                                name="liveUrl"
                                value={formData.liveUrl}
                                onChange={handleChange}
                                placeholder="https://my-app.com"
                            />
                        </div>
                        <div>
                            <label>GitHub Repository URL</label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/user/repo"
                            />
                        </div>
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
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
                            placeholder="Describe the project, its features, and challenges solved..."
                        />
                    </div>

                    <div>
                        <label>Technologies Used (Comma separated)</label>
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React, Redux, Node.js, MongoDB"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            style={{ width: 'auto', margin: 0 }}
                        />
                        <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>Mark as Featured Project</label>
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
                            {submitting ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
