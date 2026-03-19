"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllQuestions, deleteQuestion } from '@/services/questionService';
import { ApiError } from '@/lib/api';

export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
    
    // Filters and search state
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        language: '',
        difficulty: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchQuestions();
    }, [filters.category, filters.language, filters.difficulty, filters.page]);

    // Handle search specifically with a delay or on button press
    const handleSearch = (e) => {
        e.preventDefault();
        fetchQuestions();
    };

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllQuestions(filters);
            setQuestions(response.data);
            setPagination(response.pagination || { current: 1, pages: 1, total: response.total || 0 });
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await deleteQuestion(id);
            fetchQuestions();
        } catch (err) {
            alert('Delete failed: ' + (err instanceof ApiError ? err.message : err.message));
        }
    };

    const updateFilter = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: 1 // reset to first page when changing filters
        }));
    };

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > pagination.pages) return;
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleReset = () => {
        setFilters({ search: '', category: '', language: '', difficulty: '', page: 1, limit: 10 });
        // The fetch will be triggered by useEffect for category, language, etc.
        // But for completeness and to handle search/limit changes specifically:
        setTimeout(() => fetchQuestions(), 0); 
    };

    return (
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1.5rem 2rem' }}>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Interview Questions</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your technical Q&A</p>
                </div>
                <Link href="/questions/add" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    + Add New Question
                </Link>
            </header>

            {/* Filters and Search Bar - Forced One Line Layout with No Overlap */}
            <div className="card" style={{ 
                marginBottom: '2rem', 
                padding: '1rem', 
                overflowX: 'auto', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <form 
                    onSubmit={handleSearch} 
                    style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        width: '100%',
                        paddingRight: '1rem' // Prevents last button from touching the edge when scrolling
                    }}
                >
                    <div style={{ flexGrow: 1, minWidth: '200px', flexShrink: 1 }}>
                        <input
                            name="search"
                            type="text"
                            placeholder="🔍 Search question or content..."
                            value={filters.search}
                            onChange={updateFilter}
                            style={{ 
                                width: '100%', 
                                padding: '0.5rem 0.75rem', 
                                borderRadius: '6px', 
                                border: '1px solid #cbd5e1',
                                fontSize: '0.875rem',
                                outline: 'none',
                                height: '38px',
                                boxSizing: 'border-box',
                                boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                             }}
                        />
                    </div>
                    
                    <select 
                        name="category" 
                        value={filters.category} 
                        onChange={updateFilter}
                        style={{ flexShrink: 0, padding: '0 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.875rem', width: 'auto', height: '38px', cursor: 'pointer' }}
                    >
                        <option value="">📁 Categories</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="DevOps">DevOps</option>
                        <option value="General">General</option>
                        <option value="Programming">Programming</option>
                        <option value="Other">Other</option>
                    </select>

                    <select 
                        name="language" 
                        value={filters.language} 
                        onChange={updateFilter}
                        style={{ flexShrink: 0, padding: '0 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.875rem', width: 'auto', height: '38px', cursor: 'pointer' }}
                    >
                        <option value="">💻 Languages</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="React.js">React.js</option>
                        <option value="Next.js">Next.js</option>
                        <option value="Node.js">Node.js</option>
                        <option value="MongoDB">MongoDB</option>
                    </select>

                    <select 
                        name="difficulty" 
                        value={filters.difficulty} 
                        onChange={updateFilter}
                        style={{ flexShrink: 0, padding: '0 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.875rem', width: 'auto', height: '38px', cursor: 'pointer' }}
                    >
                        <option value="">🎯 Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <button 
                        type="submit" 
                        className="btn btn-secondary" 
                        style={{ 
                            flexShrink: 0,
                            padding: '0 1.25rem', 
                            fontSize: '0.875rem', 
                            fontWeight: 700, 
                            height: '38px', 
                            whiteSpace: 'nowrap',
                            backgroundColor: 'var(--accent)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Search
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleReset}
                        className="btn"
                        style={{ 
                            flexShrink: 0,
                            padding: '0 1rem', 
                            background: '#f8fafc', 
                            color: '#64748b', 
                            border: '1px solid #e2e8f0', 
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            height: '38px',
                            whiteSpace: 'nowrap',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Reset
                    </button>
                </form>
            </div>

            {error && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Question</th>
                                <th>Category</th>
                                <th>Language</th>
                                <th>Difficulty</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr key={q._id}>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {q.question}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {(Array.isArray(q.category) ? q.category : [q.category]).map(cat => (
                                                <span key={cat} className="status active" style={{ 
                                                    fontSize: '0.7rem',
                                                    padding: '0.1rem 0.4rem', 
                                                    backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                                                    color: 'var(--accent)' 
                                                }}>
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {(Array.isArray(q.language) ? q.language : [q.language]).map(lang => (
                                                <span key={lang} className="status" style={{ 
                                                    fontSize: '0.7rem',
                                                    padding: '0.1rem 0.4rem', 
                                                    backgroundColor: '#f1f5f9', 
                                                    color: '#475569' 
                                                }}>
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ 
                                            color: q.difficulty === 'Easy' ? '#10b981' : q.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent)' }}>{q.priority}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/questions/edit/${q._id}`}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', fontWeight: 600 }}>Edit</button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(q._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontWeight: 600 }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {questions.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No questions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination UI */}
                    {pagination.pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Showing {questions.length} of {pagination.total} questions
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    className="btn" 
                                    onClick={() => changePage(pagination.current - 1)}
                                    disabled={pagination.current === 1}
                                    style={{ padding: '0.4rem 0.8rem', opacity: pagination.current === 1 ? 0.5 : 1 }}
                                >
                                    Previous
                                </button>
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => changePage(i + 1)}
                                        className={`btn ${pagination.current === i + 1 ? 'btn-primary' : ''}`}
                                        style={{ 
                                            padding: '0.4rem 0.8rem',
                                            backgroundColor: pagination.current === i + 1 ? 'var(--accent)' : 'transparent',
                                            color: pagination.current === i + 1 ? '#fff' : 'var(--text-primary)',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    className="btn" 
                                    onClick={() => changePage(pagination.current + 1)}
                                    disabled={pagination.current === pagination.pages}
                                    style={{ padding: '0.4rem 0.8rem', opacity: pagination.current === pagination.pages ? 0.5 : 1 }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
