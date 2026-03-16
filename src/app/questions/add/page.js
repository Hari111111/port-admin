"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import { createQuestion } from '@/services/questionService';
import { ApiError } from '@/lib/api';

export default function AddQuestionPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        language: 'JavaScript',
        type: 'Long',
        difficulty: 'Medium',
        priority: 0,
        options: ['', '', '', ''],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData((prev) => ({ ...prev, options: newOptions }));
    };

    const handleAnswerChange = (value) => {
        setFormData((prev) => ({ ...prev, answer: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dataToSubmit = { ...formData };
            if (formData.type !== 'MCQ') {
                delete dataToSubmit.options;
            } else {
                dataToSubmit.options = dataToSubmit.options.filter(opt => opt.trim() !== '');
            }

            await createQuestion(dataToSubmit);
            router.push('/questions');
        } catch (err) {
            alert('Error: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Add New Question</h2>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Question</label>
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Enter the interview question"
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Database">Database</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Programming">Programming</option>
                                <option value="General">General</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Language</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            >
                                <option value="JavaScript">JavaScript</option>
                                <option value="TypeScript">TypeScript</option>
                                <option value="React.js">React.js</option>
                                <option value="Next.js">Next.js</option>
                                <option value="Node.js">Node.js</option>
                                <option value="NestJS">NestJS</option>
                                <option value="MongoDB">MongoDB</option>
                                <option value="PostgreSQL">PostgreSQL</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="C++">C++</option>
                                <option value="PHP">PHP</option>
                                <option value="HTML/CSS">HTML/CSS</option>
                                <option value="SQL">SQL</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            >
                                <option value="Short">Short Answer</option>
                                <option value="Long">Long Answer / Descriptive</option>
                                <option value="MCQ">Multiple Choice (MCQ)</option>
                            </select>
                        </div>
                        <div>
                            <label>Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label>Priority (Lower = Higher Periority)</label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                placeholder="e.g. 1"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            />
                        </div>
                    </div>

                    {formData.type === 'MCQ' && (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                            <label style={{ marginBottom: '1rem', display: 'block' }}>Options (For MCQ)</label>
                            {formData.options.map((opt, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{idx + 1}.</span>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label>Answer / Correct Option</label>
                        <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                            <Editor
                                value={formData.answer}
                                onChange={handleAnswerChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
