import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';

export default function StartPage() {
    const { tKey, isRTL } = useLang();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}} dir={isRTL ? 'rtl' : 'ltr'}>
            <div style={{textAlign: 'center'}}>
                <button
                    onClick={() => navigate('/choose')}
                    style={{padding: '14px 20px', fontSize: 16, letterSpacing: 1.2, cursor: 'pointer'}}
                >
                    {"Begin your political journey"}
                </button>
            </div>
        </div>
    );
}

