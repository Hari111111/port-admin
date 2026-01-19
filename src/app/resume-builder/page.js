"use client";

import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

// --- TEMPLATES ---

const ClassicTemplate = ({ data }) => (
    <div style={{ width: '100%', height: '100%', fontFamily: "'Times New Roman', Times, serif", color: 'black', lineHeight: '1.5' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #000', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '2.2rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{data.name}</h1>
            <p style={{ fontSize: '1.1rem', margin: '0.25rem 0', fontStyle: 'italic' }}>{data.title}</p>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                {data.email && <span>{data.email}</span>}
                {data.phone && <span>• {data.phone}</span>}
                {data.location && <span>• {data.location}</span>}
                {data.website && <span>• {data.website}</span>}
                {data.linkedin && <span>• {data.linkedin}</span>}
            </div>
        </div>

        {data.summary && (
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Professional Summary</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{data.summary}</p>
            </div>
        )}

        {data.skills.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Skills</h3>
                <div style={{ fontSize: '0.95rem' }}>{data.skills.join(' • ')}</div>
            </div>
        )}

        {data.experience.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '10px', fontWeight: 'bold' }}>Work Experience</h3>
                {data.experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{exp.position}</h4>
                            <span style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{exp.duration}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '0.25rem' }}>{exp.company}</div>
                        <p style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{exp.description}</p>
                    </div>
                ))}
            </div>
        )}

        {/* ... (Projects, Certifications, Education similar pattern) */}
        {data.projects.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Projects</h3>
                {data.projects.map((proj, i) => (
                    <div key={i} style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{proj.name}</h4>
                        </div>
                        {proj.link && <div style={{ fontSize: '0.85rem', color: '#444' }}>{proj.link}</div>}
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{proj.description}</p>
                    </div>
                ))}
            </div>
        )}
        {data.education.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>Education</h3>
                {data.education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{edu.school}</h4>
                            <span style={{ fontSize: '0.9rem' }}>{edu.year}</span>
                        </div>
                        <div style={{ fontSize: '0.95rem' }}>{edu.degree}</div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const ModernTemplate = ({ data }) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", color: '#333' }}>
        {/* Left Sidebar */}
        <div style={{ width: '30%', backgroundColor: '#2d3748', color: 'white', padding: '1.5rem', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#4a5568', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                    {data.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Contact</h3>
                <div style={{ fontSize: '0.8rem', lineHeight: '1.6', opacity: '0.9' }}>
                    <div style={{ marginBottom: '0.5rem' }}>{data.email}</div>
                    <div style={{ marginBottom: '0.5rem' }}>{data.phone}</div>
                    <div style={{ marginBottom: '0.5rem' }}>{data.location}</div>
                    {data.website && <div>{data.website}</div>}
                    {data.linkedin && <div>{data.linkedin}</div>}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #4a5568', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {data.skills.map((skill, i) => (
                        <span key={i} style={{ fontSize: '0.85rem', backgroundColor: '#4a5568', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{skill}</span>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #4a5568', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Education</h3>
                {data.education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.2rem' }}>{edu.degree}</div>
                        <div>{edu.school}</div>
                        <div style={{ opacity: 0.7 }}>{edu.year}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Content */}
        <div style={{ width: '70%', padding: '2rem', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#2d3748', lineHeight: 1 }}>{data.name.split(' ')[0]} <span style={{ color: '#4299e1' }}>{data.name.split(' ').slice(1).join(' ')}</span></h1>
                <p style={{ fontSize: '1.2rem', color: '#718096', margin: '0.5rem 0 0', fontWeight: '500' }}>{data.title}</p>
            </div>

            {data.summary && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Profile</h3>
                    <p style={{ lineHeight: 1.6, color: '#4a5568' }}>{data.summary}</p>
                </div>
            )}

            {data.experience.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Experience</h3>
                    {data.experience.map((exp, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>{exp.position}</h4>
                                <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '500' }}>{exp.duration}</span>
                            </div>
                            <div style={{ color: '#4299e1', fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{exp.company}</div>
                            <p style={{ margin: 0, color: '#4a5568', lineHeight: 1.5, fontSize: '0.95rem' }}>{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {data.projects.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Projects</h3>
                    {data.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#2d3748' }}>{proj.name}</h4>
                            </div>
                            {proj.link && <a style={{ color: '#4299e1', fontSize: '0.85rem', textDecoration: 'none' }}>{proj.link}</a>}
                            <p style={{ margin: '0.25rem 0 0', color: '#4a5568', lineHeight: 1.5, fontSize: '0.95rem' }}>{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

const MinimalTemplate = ({ data }) => (
    <div style={{ width: '100%', height: '100%', fontFamily: "'Inter', sans-serif", color: '#1a202c', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '300', margin: 0, letterSpacing: '-0.05em' }}>{data.name}</h1>
            <p style={{ fontSize: '1rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>{data.title}</p>
            <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
                {[data.email, data.phone, data.website, data.location].filter(Boolean).join('  ·  ')}
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem' }}>
            <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1rem' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '1rem', color: '#000' }}>Education</h3>
                    {data.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{edu.school}</div>
                            <div style={{ fontSize: '0.85rem', color: '#718096' }}>{edu.degree}</div>
                            <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{edu.year}</div>
                        </div>
                    ))}
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '1rem', color: '#000' }}>Skills</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {data.skills.map((skill, i) => (
                            <span key={i} style={{ fontSize: '0.9rem', color: '#4a5568' }}>{skill}</span>
                        ))}
                    </div>
                </section>
            </div>

            <div>
                {data.summary && (
                    <section style={{ marginBottom: '2.5rem' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#2d3748' }}>{data.summary}</p>
                    </section>
                )}

                {data.experience.length > 0 && (
                    <section style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '1.5rem', color: '#000', letterSpacing: '0.05em' }}>Experience</h3>
                        {data.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '500' }}>{exp.position}</h4>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#718096', marginBottom: '0.75rem' }}>
                                    <span>{exp.company}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <p style={{ margin: 0, lineHeight: 1.6, color: '#4a5568' }}>{exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {data.projects.length > 0 && (
                    <section>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '1.5rem', color: '#000', letterSpacing: '0.05em' }}>Selected Projects</h3>
                        {data.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.25rem' }}>{proj.name}</h4>
                                {proj.link && <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '0.5rem' }}>{proj.link}</div>}
                                <p style={{ margin: 0, lineHeight: 1.5, color: '#4a5568' }}>{proj.description}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    </div>
);


// --- MAIN BUILDER COMPONENT ---

export default function ResumeBuilder() {
    const componentRef = useRef();
    const [selectedTemplate, setSelectedTemplate] = useState('classic');

    const [resumeData, setResumeData] = useState({
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        location: 'New York, USA',
        website: 'johndoe.com',
        linkedin: 'linkedin.com/in/john',
        summary: 'Passionate developer with expertise in building scalable web applications.',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        languages: []
    });

    useEffect(() => {
        // Fetch profile data similarly to before...
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/profile');
                const data = await res.json();
                if (data && data.name) {
                    setResumeData(prev => ({
                        ...prev,
                        name: data.name || prev.name,
                        title: data.title || prev.title,
                        email: data.email || prev.email,
                        phone: data.phone || prev.phone,
                        location: data.location || prev.location,
                        website: data.socials?.website || prev.website,
                        linkedin: data.socials?.linkedin || prev.linkedin,
                        summary: data.about || prev.summary,
                        skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
                        experience: data.experience && data.experience.length > 0 ? data.experience : prev.experience,
                        education: data.education && data.education.length > 0 ? data.education : prev.education,
                    }));
                }
            } catch (err) { }
        };
        fetchProfile();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${resumeData.name}_Resume`,
    });

    // ... (Keep existing update handlers: handleChange, handleListChange, addItem, removeItem, etc.)
    const handleChange = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };
    const handleListChange = (index, list, field, value) => {
        const updatedList = [...resumeData[list]];
        updatedList[index] = { ...updatedList[index], [field]: value };
        setResumeData(prev => ({ ...prev, [list]: updatedList }));
    };
    const addItem = (list, template) => {
        setResumeData(prev => ({ ...prev, [list]: [...prev[list], template] }));
    };
    const removeItem = (list, index) => {
        const updatedList = [...resumeData[list]];
        updatedList.splice(index, 1);
        setResumeData(prev => ({ ...prev, [list]: updatedList }));
    };
    const handleSkillChange = (e) => {
        setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
    };
    const handleLanguageChange = (e) => {
        setResumeData(prev => ({ ...prev, languages: e.target.value.split(',').map(s => s.trim()) }));
    };


    return (
        <div style={{ paddingBottom: '4rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Resume Builder</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a template and customize your resume</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="classic">Classic (ATS Friendly)</option>
                        <option value="modern">Modern (Split Column)</option>
                        <option value="minimal">Minimal (Clean & Bold)</option>
                    </select>
                    <button className="btn" onClick={handlePrint}>
                        Download PDF
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Editor (Left Column) - Same as before, just collapsed generic layout for brevity */}
                <div className="card" style={{ height: '80vh', overflowY: 'auto', paddingRight: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Edit Content</h3>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        <input type="text" value={resumeData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name" />
                        <input type="text" value={resumeData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Job Title" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input type="email" value={resumeData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email" />
                            <input type="text" value={resumeData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Phone" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input type="text" value={resumeData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Location" />
                            <input type="text" value={resumeData.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="Website" />
                        </div>
                        <textarea rows="4" value={resumeData.summary} onChange={(e) => handleChange('summary', e.target.value)} placeholder="Summary"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>

                    {/* Experience */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <label>Experience</label>
                            <button type="button" onClick={() => addItem('experience', {})} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>+ Add</button>
                        </div>
                        {resumeData.experience.map((exp, i) => (
                            <div key={i} style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                <input type="text" value={exp.company} onChange={(e) => handleListChange(i, 'experience', 'company', e.target.value)} placeholder="Company" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <input type="text" value={exp.position} onChange={(e) => handleListChange(i, 'experience', 'position', e.target.value)} placeholder="Position" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <input type="text" value={exp.duration} onChange={(e) => handleListChange(i, 'experience', 'duration', e.target.value)} placeholder="Duration" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <textarea rows="3" value={exp.description} onChange={(e) => handleListChange(i, 'experience', 'description', e.target.value)} placeholder="Description" style={{ width: '100%' }} />
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label>Skills (Comma separated)</label>
                        <input type="text" value={resumeData.skills.join(', ')} onChange={handleSkillChange} />
                    </div>

                    {/* Education */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <label>Education</label>
                            <button type="button" onClick={() => addItem('education', {})} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>+ Add</button>
                        </div>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                <input type="text" value={edu.school} onChange={(e) => handleListChange(i, 'education', 'school', e.target.value)} placeholder="School" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <input type="text" value={edu.degree} onChange={(e) => handleListChange(i, 'education', 'degree', e.target.value)} placeholder="Degree" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <input type="text" value={edu.year} onChange={(e) => handleListChange(i, 'education', 'year', e.target.value)} placeholder="Year" style={{ width: '100%' }} />
                            </div>
                        ))}
                    </div>

                    {/* Projects */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <label>Projects</label>
                            <button type="button" onClick={() => addItem('projects', {})} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>+ Add</button>
                        </div>
                        {resumeData.projects.map((proj, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                <input type="text" value={proj.name} onChange={(e) => handleListChange(i, 'projects', 'name', e.target.value)} placeholder="Project Name" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <input type="text" value={proj.link} onChange={(e) => handleListChange(i, 'projects', 'link', e.target.value)} placeholder="Link" style={{ marginBottom: '0.5rem', width: '100%' }} />
                                <textarea rows="2" value={proj.description} onChange={(e) => handleListChange(i, 'projects', 'description', e.target.value)} placeholder="Description" style={{ width: '100%' }} />
                            </div>
                        ))}
                    </div>

                </div>

                {/* Preview (Right Column) */}
                <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#525659', padding: '2rem', borderRadius: '12px', overflow: 'auto', height: '80vh' }}>
                    <div
                        ref={componentRef}
                        style={{
                            width: '210mm',
                            // minHeight: '297mm', // A4
                            backgroundColor: 'white',
                            color: 'black',
                            padding: selectedTemplate === 'modern' ? '0' : '2.5cm', // Modern template handles its own padding
                            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                            overflow: 'hidden'
                        }}
                    >
                        {selectedTemplate === 'classic' && <ClassicTemplate data={resumeData} />}
                        {selectedTemplate === 'modern' && <ModernTemplate data={resumeData} />}
                        {selectedTemplate === 'minimal' && <MinimalTemplate data={resumeData} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
