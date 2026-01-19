"use client";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
    () => import('react-quill-new'),
    { ssr: false, loading: () => <p>Loading Editor...</p> }
);

export default function Editor({ value, onChange }) {
    return (
        <div className="bg-white text-black" style={{ backgroundColor: 'white', color: 'black' }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                style={{ height: '300px', marginBottom: '50px' }}
            />
        </div>
    );
}
