"use client";

import { useState } from 'react';
import { apiRequest } from '@/lib/api';

/**
 * FileUpload Component
 * @param {string} type - 'image' or 'pdf'
 * @param {function} onUploadSuccess - callback with the URL of the uploaded file
 * @param {string} label - label for the input
 */
export default function FileUpload({ type = 'image', onUploadSuccess, label }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (type === 'image' && !file.type.startsWith('image/')) {
            setError('Please upload an image file (JPG, PNG, WebP, etc.)');
            return;
        }
        if (type === 'pdf' && file.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            return;
        }

        setError(null);
        setUploading(true);

        // Show local preview for images
        if (type === 'image') {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }

        const formData = new FormData();
        formData.append(type, file); // backend expects 'image' or 'pdf'

        try {
            const endpoint = `/upload/${type}`; // /api/upload/image or /api/upload/pdf
            const result = await apiRequest(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (result && result.url) {
                onUploadSuccess(result.url);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.message || 'Upload failed. Check your connection or backend.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>}
            
            <div 
                className="upload-area"
                style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(13, 35, 38, 0.4)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                }}
            >
                <input
                    type="file"
                    accept={type === 'image' ? 'image/*' : '.pdf'}
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        zIndex: 2
                    }}
                    disabled={uploading}
                />
                
                {uploading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="spinner"></div>
                        <p style={{ margin: 0, color: 'var(--accent)', fontWeight: 500 }}>Uploading to Cloudinary...</p>
                    </div>
                ) : (
                    <div style={{ pointerEvents: 'none' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>
                            {type === 'image' ? '🖼️' : '📄'}
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>
                            {type === 'image' ? 'Drop image here' : 'Drop PDF here'}
                        </p>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                            or click to browse files
                        </p>
                    </div>
                )}

                {/* Success Overlay */}
                {!uploading && !error && preview && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'var(--success)',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        boxShadow: '0 0 10px rgba(16, 212, 142, 0.4)',
                        zIndex: 3
                    }}>
                        ✓
                    </div>
                )}
            </div>

            {error && (
                <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.6rem', fontWeight: 500 }}>
                    ⚠️ {error}
                </p>
            )}

            {preview && type === 'image' && (
                <div style={{ 
                    marginTop: '1.25rem', 
                    padding: '0.5rem', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    display: 'inline-block'
                }}>
                    <img 
                        src={preview} 
                        alt="Preview" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '160px', 
                            borderRadius: '6px', 
                            display: 'block'
                        }} 
                    />
                </div>
            )}

            <style jsx>{`
                .upload-area:hover {
                    border-color: var(--accent);
                    background-color: rgba(15, 212, 184, 0.05);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }
                .spinner {
                    width: 28px; 
                    height: 28px; 
                    border: 3px solid rgba(15, 212, 184, 0.1); 
                    border-top-color: var(--accent); 
                    borderRadius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
