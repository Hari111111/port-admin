"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '@/components/Editor';
import { getQuestionById, updateQuestion } from '@/services/questionService';
import { ApiError } from '@/lib/api';

export default function EditQuestionPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: [],
        language: [],
        type: 'Long',
        difficulty: 'Medium',
        priority: 0,
        options: ['', '', '', ''],
    });

    const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Programming', 'General', 'Other'];
    const languages = ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Node.js', 'NestJS', 'MongoDB', 'PostgreSQL', 'Python', 'Java', 'C++', 'PHP', 'HTML/CSS', 'SQL', 'Other'];

    useEffect(() => {
        if (params.id) {
            fetchQuestion();
        }
    }, [params.id]);

    const fetchQuestion = async () => {
        try {
            const data = await getQuestionById(params.id);
            setFormData({
                ...data,
                category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []),
                language: Array.isArray(data.language) ? data.language : (data.language ? [data.language] : []),
                options: data.options && data.options.length > 0 ? [...data.options, '', '', '', ''].slice(0, 4) : ['', '', '', '']
            });
        } catch (err) {
            alert('Failed to load question');
            router.push('/questions');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => {
            const current = prev[name] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [name]: updated };
        });
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
        
        if (formData.category.length === 0) {
            alert('Please select at least one category');
            return;
        }

        setSubmitting(true);
        try {
            const dataToSubmit = { ...formData };
            if (formData.type !== 'MCQ') {
                delete dataToSubmit.options;
            } else {
                dataToSubmit.options = dataToSubmit.options.filter(opt => opt.trim() !== '');
            }

            await updateQuestion(params.id, dataToSubmit);
            router.push('/questions');
        } catch (err) {
            alert('Error: ' + (err instanceof ApiError ? err.message : err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem' }}>Edit Question</h2>

            <div className="card" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Question Content</label>
                        <textarea
                            name="question"
                            value={formData.question}
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
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Categories (Select one or more)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            {categories.map(cat => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.category.includes(cat)} 
                                        onChange={() => handleCheckboxChange('category', cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Languages / Technologies</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            {languages.map(lang => (
                                <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.language.includes(lang)} 
                                        onChange={() => handleCheckboxChange('language', lang)}
                                    />
                                    {lang}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Question Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            >
                                <option value="Short">Short Answer</option>
                                <option value="Long">Long Answer / Descriptive</option>
                                <option value="MCQ">Multiple Choice (MCQ)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Difficulty Level</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Priority Number</label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                placeholder="0"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
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
                            {submitting ? 'Updating...' : 'Update Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
