import React from 'react';
import { useLang } from '../../contexts/LangContext';

export default function PreTransPage() {
    const { tKey, isRTL } = useLang();
    return (
        <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}} dir={isRTL ? 'rtl' : 'ltr'}>
            <div style={{textAlign: 'center'}}>
                <h2>{"Pre-Transitional Experience (placeholder)"}</h2>
            </div>
        </div>
    );
}

