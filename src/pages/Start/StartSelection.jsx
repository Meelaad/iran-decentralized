import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import './StartSelection.css';

export default function StartSelection() {
    const { isRTL, t } = useLang();
    const navigate = useNavigate();

    const tiles = [
        { id: 'transitional', title: { en: 'Pre Transitional State', fa: 'حالت پیش انتقالی' }, target: '/pre' },
        ...Object.values(BLUEPRINTS).map(bp => ({ id: bp.id, title: bp.name, target: `/blueprint/gov/${bp.id}` })),
    ];

    return (
        <div className="start-selection" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 style={{textAlign: 'center'}}>{t({ en: 'Choose your path', fa: 'مسیر خود را انتخاب کنید' })}</h2>
            <div className="tiles">
                {tiles.map(tile => (
                    <button key={tile.id} className="tile" onClick={() => navigate(tile.target)}>
                        <div className="tile-title">{t(tile.title)}</div>
                        <div className="tile-desc">{tile.id === 'transitional' ? t({ en: 'Temporary transitional policies', fa: 'سیاست‌های موقت انتقالی' }) : ''}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
