import React, { useState } from 'react';
import { useLang } from '../../contexts/LangContext';
import './ShadowCabinetTree.css';

function expertsBySector(experts, sectorId) {
    return (experts || []).filter(e => e.sector_id === sectorId || e.sectorId === sectorId);
}

function topExpert(experts) {
    return [...experts].sort((a, b) => (b.approve_votes || 0) - (a.approve_votes || 0))[0] || null;
}

export default function ShadowCabinetTree({ plan = {} }) {
    const { isRTL, tKey } = useLang();
    const sectors = plan.sectors || [];
    const experts  = plan.experts  || [];
    const [drawerSector, setDrawerSector] = useState(null);
    const [drawerExpert,  setDrawerExpert]  = useState(null);

    function openSector(s) { setDrawerExpert(null); setDrawerSector(s); }
    function openExpert(e)  { setDrawerSector(null); setDrawerExpert(e);  }
    function closeDrawer()  { setDrawerSector(null); setDrawerExpert(null); }

    const planName = isRTL ? plan.name?.fa : plan.name?.en;

    return (
        <div className="sct-root" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Root node — plan hexagon */}
            {planName && (
                <div className="sct-root-node">
                    <div className="sct-hex">
                        <span className="sct-hex-label">{planName}</span>
                    </div>
                    <div className="sct-root-line" />
                </div>
            )}

            {/* Sector row */}
            {sectors.length === 0 ? (
                <p className="sct-empty">{tKey('plan.noSectors')}</p>
            ) : (
                <div className="sct-sectors-row">
                    {sectors.map((s, i) => {
                        const secExperts = expertsBySector(experts, s.id);
                        const top = topExpert(secExperts);
                        const name = isRTL ? (s.name_fa || s.name?.fa) : (s.name_en || s.name?.en || s.name);
                        return (
                            <div key={s.id || i} className="sct-sector-col">
                                {/* Connector line from root */}
                                <div className="sct-branch-line" />

                                {/* Sector card (rounded rect) */}
                                <button
                                    className="sct-sector-node"
                                    onClick={() => openSector(s)}
                                    title={name}
                                >
                                    {s.icon && <span className="sct-sector-icon">{s.icon}</span>}
                                    <span className="sct-sector-name">{name}</span>
                                    {top && (
                                        <span className="sct-leading-label">
                                            {tKey('plan.leadingExpert')}: {top.full_name_en || top.display_name}
                                        </span>
                                    )}
                                </button>

                                {/* Expert circles */}
                                {secExperts.length > 0 && (
                                    <div className="sct-experts-row">
                                        <div className="sct-sector-line" />
                                        <div className="sct-expert-circles">
                                            {secExperts.slice(0, 3).map((e, ei) => {
                                                const eName = e.full_name_en || e.display_name || 'E';
                                                const initials = eName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                                                const isTop = ei === 0 && e === top;
                                                return (
                                                    <button
                                                        key={e.id || ei}
                                                        className={`sct-expert-circle ${isTop ? 'is-top' : ''}`}
                                                        onClick={() => openExpert(e)}
                                                        title={eName}
                                                    >
                                                        {e.photo_url
                                                            ? <img src={e.photo_url} alt={eName} className="sct-expert-photo" />
                                                            : <span>{initials}</span>
                                                        }
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Sector detail drawer */}
            {drawerSector && (
                <div className="sct-drawer" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="sct-drawer-inner">
                        <button className="sct-drawer-close" onClick={closeDrawer} aria-label={tKey('common.close')}>✕</button>
                        <div className="sct-drawer-icon">{drawerSector.icon || '⚙️'}</div>
                        <h3 className="sct-drawer-title">
                            {isRTL ? (drawerSector.name_fa || drawerSector.name?.fa) : (drawerSector.name_en || drawerSector.name?.en || drawerSector.name)}
                        </h3>
                        <p className="sct-drawer-desc">
                            {isRTL ? (drawerSector.desc_fa || drawerSector.description?.fa) : (drawerSector.desc_en || drawerSector.description?.en || drawerSector.description)}
                        </p>
                        <h4 className="sct-drawer-sub">{tKey('plan.experts')}</h4>
                        {expertsBySector(experts, drawerSector.id).length === 0
                            ? <p className="sct-empty">{tKey('plan.noExperts')}</p>
                            : expertsBySector(experts, drawerSector.id).map((e, i) => (
                                <div key={e.id || i} className="sct-drawer-expert" onClick={() => openExpert(e)}>
                                    <strong>{e.full_name_en || e.display_name}</strong>
                                    {e.title_en && <span className="sct-drawer-expert-title"> — {e.title_en}</span>}
                                    <div className="sct-drawer-votes">
                                        <span className="sct-yes">▲ {e.approve_votes || 0}</span>
                                        <span className="sct-no">▼ {e.reject_votes || 0}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Expert detail drawer */}
            {drawerExpert && (
                <div className="sct-drawer" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="sct-drawer-inner">
                        <button className="sct-drawer-close" onClick={closeDrawer} aria-label={tKey('common.close')}>✕</button>
                        {drawerExpert.photo_url && (
                            <img src={drawerExpert.photo_url} alt={drawerExpert.full_name_en} className="sct-drawer-photo" />
                        )}
                        <h3 className="sct-drawer-title">{drawerExpert.full_name_en || drawerExpert.display_name}</h3>
                        {drawerExpert.title_en && <p className="sct-drawer-expert-title">{drawerExpert.title_en}</p>}
                        {drawerExpert.bio_en && <p className="sct-drawer-desc">{drawerExpert.bio_en}</p>}
                        <div className="sct-drawer-votes">
                            <span className="sct-yes">▲ {tKey('plan.approve')}: {drawerExpert.approve_votes || 0}</span>
                            <span className="sct-no">▼ {tKey('plan.reject')}: {drawerExpert.reject_votes || 0}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
