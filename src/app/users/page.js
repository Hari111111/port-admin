"use client";

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/userService';
import { ApiError } from '@/lib/api';

// ─── Resume Modal Component ───────────────────────────────────────────────────

function ResumeModal({ user, onClose }) {
    if (!user || !user.resume) return null;

    const { personalInfo, skills, experience, education, projects, languages } = user.resume;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                            {personalInfo?.fullName || user.name}'s Resume
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {personalInfo?.jobTitle || 'User Profile'}
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {/* Summary */}
                    {personalInfo?.summary && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Summary</h4>
                            <p style={{ lineHeight: 1.6 }}>{personalInfo.summary}</p>
                        </section>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Skills</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {skills.map((skill, i) => (
                                    <span key={i} className="status active">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Experience</h4>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: '1.25rem', borderLeft: '2px solid var(--accent-dim)', paddingLeft: '1rem' }}>
                                    <div style={{ fontWeight: 700 }}>{exp.position}</div>
                                    <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500 }}>{exp.company} | {exp.duration}</div>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Education</h4>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '0.75rem' }}>
                                    <div style={{ fontWeight: 600 }}>{edu.degree}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{edu.school} • {edu.year}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Projects</h4>
                            {projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{proj.title}</div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{proj.description}</p>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>View Project &rarr;</a>}
                                </div>
                            ))}
                        </section>
                    )}
                </div>
                <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={onClose}>Close View</button>
                </div>
            </div>
        </div>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const getResumeStatus = (user) => {
        if (!user.resume) {
            return { label: 'No Resume', className: 'inactive' };
        }

        const hasCoreData =
            user.resume.personalInfo?.summary ||
            user.resume.skills?.length ||
            user.resume.experience?.length ||
            user.resume.education?.length;

        if (hasCoreData) {
            return { label: 'Resume Added', className: 'active' };
        }

        return { label: 'Draft Resume', className: 'inactive' };
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Users</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your users here</p>
                </div>
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
                                    <th>Resume Status</th>
                                    <th>Preview</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const resumeStatus = getResumeStatus(user);
                                    const resumeTitle =
                                        user.resume?.personalInfo?.jobTitle ||
                                        'No Job Title';
                                    const resumeSummary =
                                        user.resume?.personalInfo?.summary ||
                                        'No summary added.';

                                    return (
                                        <tr key={user._id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {user._id.slice(-6)}</div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                                            <td>
                                                <span className={`status ${user.isAdmin ? 'active' : 'inactive'}`}>
                                                    {user.isAdmin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status ${resumeStatus.className}`}>
                                                    {resumeStatus.label}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '250px' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{resumeTitle}</div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {resumeSummary}
                                                </div>
                                            </td>
                                            <td>
                                                {user.resume ? (
                                                    <button 
                                                        className="btn" 
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        View Resume
                                                    </button>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No Data</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Resume Modal */}
            {selectedUser && (
                <ResumeModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
}
