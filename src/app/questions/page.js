"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllQuestions, deleteQuestion } from '@/services/questionService';
import { ApiError } from '@/lib/api';

export default function QuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllQuestions();
            setQuestions(data);
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

    return (
        <div>
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Interview Questions</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your technical Q&A</p>
                </div>
                <Link href="/questions/add" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Add New Question
                </Link>
            </header>

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
                                <th>Question</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Difficulty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr key={q._id}>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {q.question}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="status active" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
                                            {q.category}
                                        </span>
                                    </td>
                                    <td>{q.type}</td>
                                    <td>
                                        <span style={{ 
                                            color: q.difficulty === 'Easy' ? '#10b981' : q.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                                            fontWeight: 600
                                        }}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link href={`/questions/edit/${q._id}`}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}>Edit</button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(q._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {questions.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No questions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
