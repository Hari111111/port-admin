"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/projects');
            const data = await res.json();
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await fetch(`http://localhost:5000/api/projects/${id}`, {
                    method: 'DELETE',
                });
                fetchProjects();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Projects</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your portfolio projects</p>
                </div>
                <Link href="/projects/add" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Add New Project
                </Link>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Tech Stack</th>
                                <th>Links</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project._id}>
                                    <td style={{ fontWeight: 500 }}>{project.title}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '300px' }}>
                                            {project.technologies.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="status" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>+{project.technologies.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                                            {project.liveUrl && <a href={project.liveUrl} target="_blank" style={{ color: 'var(--accent)' }}>Live Demo ↗</a>}
                                            {project.githubUrl && <a href={project.githubUrl} target="_blank" style={{ color: 'var(--text-secondary)' }}>GitHub</a>}
                                        </div>
                                    </td>
                                    <td>
                                        {project.image && <img src={project.image} alt={project.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => deleteProject(project._id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                        >
                                            Delete
                                        </button>
                                        {/* Placeholder for Edit button logic */}
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
