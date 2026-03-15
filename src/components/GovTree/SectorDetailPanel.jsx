import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './GovTree.css';

export default function SectorDetailPanel({ sector, blueprintId, onClose }) {
    const { t } = useLang();

    return (
        <div className={`gov-tree-panel ${sector ? 'is-open' : ''}`}>
            <button className="gov-tree-panel-close" onClick={onClose} aria-label="Close">×</button>
            {sector && (
                <>
                    <div className="gov-tree-panel-icon">{sector.icon}</div>
                    <div className="gov-tree-panel-tier">{sector.tier}</div>
                    <h2 className="gov-tree-panel-title">{t(sector.label)}</h2>
                    <p className="gov-tree-panel-desc">{t(sector.desc)}</p>

                    {sector.contents && sector.contents.length > 0 && (
                        <>
                            <div className="gov-tree-panel-contents-label">Internal Systems</div>
                            <ul className="gov-tree-panel-contents">
                                {sector.contents.map((item, i) => (
                                    <li key={i}>{t(item)}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    <Link
                        className="gov-tree-panel-link"
                        to={`/blueprint/gov/${blueprintId}/sectors/${sector.id}`}
                    >
                        VIEW FULL SECTOR →
                    </Link>
                </>
            )}
        </div>
    );
}
