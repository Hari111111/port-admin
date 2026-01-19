"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        about: '',
        resumeLink: '',
        socials: { github: '', linkedin: '', website: '' },
        skills: '',
        interests: '', // Comma separated for simplicity in UI, converted to array on submit
        experience: [], // Array of objects
        education: [], // Array of objects
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/profile');
            const data = await res.json();

            setFormData({
                ...data,
                socials: data.socials || { github: '', linkedin: '', website: '' },
                skills: data.skills ? data.skills.join(', ') : '',
                interests: data.interests ? data.interests.join(', ') : '',
                experience: data.experience || [],
                education: data.education || [],
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('socials.')) {
            const socialField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socials: { ...prev.socials, [socialField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Helper to handle changes in array lists (Experience/Education)
    const handleListChange = (index, listName, field, value) => {
        setFormData(prev => {
            const newList = [...prev[listName]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [listName]: newList };
        });
    };

    const addItem = (listName, template) => {
        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], template]
        }));
    };

    const removeItem = (listName, index) => {
        setFormData(prev => {
            const newList = [...prev[listName]];
            newList.splice(index, 1);
            return { ...prev, [listName]: newList };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
            };

            const res = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                alert('Profile updated successfully!');
                fetchProfile();
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading profile...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Edit Profile & Resume</h2>
                <button className="btn" onClick={handleSubmit}>Save Changes</button>
            </header>

            <form onSubmit={handleSubmit}>

                {/* Basic Info */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)', fontSize: '1.25rem' }}>Personal Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Professional Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Education Section */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>Education / Qualifications</h3>
                        <button type="button" onClick={() => addItem('education', { degree: '', school: '', year: '' })}
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                            + Add Education
                        </button>
                    </div>

                    {formData.education.map((edu, index) => (
                        <div key={index} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => removeItem('education', index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Degree / Qualification</label>
                                    <input type="text" value={edu.degree} onChange={(e) => handleListChange(index, 'education', 'degree', e.target.value)} placeholder="e.g. BSc Computer Science" />
                                </div>
                                <div>
                                    <label>School / University</label>
                                    <input type="text" value={edu.school} onChange={(e) => handleListChange(index, 'education', 'school', e.target.value)} placeholder="MIT" />
                                </div>
                                <div>
                                    <label>Year / Duration</label>
                                    <input type="text" value={edu.year} onChange={(e) => handleListChange(index, 'education', 'year', e.target.value)} placeholder="2018 - 2022" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Experience Section */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>Work Experience</h3>
                        <button type="button" onClick={() => addItem('experience', { position: '', company: '', duration: '', description: '' })}
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                            + Add Experience
                        </button>
                    </div>

                    {formData.experience.map((exp, index) => (
                        <div key={index} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => removeItem('experience', index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>Job Title</label>
                                    <input type="text" value={exp.position} onChange={(e) => handleListChange(index, 'experience', 'position', e.target.value)} placeholder="Software Engineer" />
                                </div>
                                <div>
                                    <label>Company</label>
                                    <input type="text" value={exp.company} onChange={(e) => handleListChange(index, 'experience', 'company', e.target.value)} placeholder="Google" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label>Duration</label>
                                    <input type="text" value={exp.duration} onChange={(e) => handleListChange(index, 'experience', 'duration', e.target.value)} placeholder="Jan 2022 - Present" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label>Description</label>
                                    <textarea rows="3" value={exp.description} onChange={(e) => handleListChange(index, 'experience', 'description', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Other Details */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)', fontSize: '1.25rem' }}>Additional Info</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Resume PDF Link</label>
                        <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Professional Summary (Bio)</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Skills (Comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Interests (Comma separated)</label>
                        <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Reading, Hiking, Coding..." />
                    </div>
                </div>

                {/* Socials */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)', fontSize: '1.25rem' }}>Social Links</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>GitHub</label>
                            <input type="url" name="socials.github" value={formData.socials.github} onChange={handleChange} />
                        </div>
                        <div>
                            <label>LinkedIn</label>
                            <input type="url" name="socials.linkedin" value={formData.socials.linkedin} onChange={handleChange} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Website</label>
                            <input type="url" name="socials.website" value={formData.socials.website} onChange={handleChange} />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
