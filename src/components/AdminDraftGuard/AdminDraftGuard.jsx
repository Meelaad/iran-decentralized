import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AdminDraftGuard.css';

export default function AdminDraftGuard({ children, slug }) {
    const { isAdmin, authLoading } = useAuth();

    if (authLoading) return null;
    if (!isAdmin) return <Navigate to="/plans" replace />;

    return (
        <>
            {children}
            <div className="draft-badge">
                <span className="draft-badge-dot" />
                DRAFT PREVIEW
                {slug && <span className="draft-badge-slug">/{slug}</span>}
            </div>
        </>
    );
}