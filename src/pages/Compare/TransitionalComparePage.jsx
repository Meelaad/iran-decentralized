import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/transitional-compare.json';
import './TransitionalComparePage.css';

function HexGrid() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function draw() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width  = canvas.offsetWidth  * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            const r = 26;
            const colDx = r * 1.5;
            const rowDy = r * Math.sqrt(3);

            ctx.strokeStyle = 'rgba(124,114,232,0.03)';
            ctx.lineWidth = 1;

            const cols = Math.ceil(w / colDx) + 3;
            const rows = Math.ceil(h / rowDy) + 3;

            for (let col = -1; col < cols; col++) {
                for (let row = -1; row < rows; row++) {
                    const cx = col * colDx;
                    const cy = row * rowDy + (col % 2 !== 0 ? rowDy / 2 : 0);
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const a = (Math.PI / 3) * i;
                        const x = cx + r * Math.cos(a);
                        const y = cy + r * Math.sin(a);
                        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, []);
    return <canvas ref={canvasRef} className="tc-hex-canvas" />;
}

const { plans: PLANS, rows: ROWS } = CONTENT;

export default function TransitionalComparePage() {
    const { isRTL, t, headFont } = useLang();
    const [selected, setSelected] = useState(['nufdi', 'mahsa']);

    const planA = PLANS.find(p => p.id === selected[0]);
    const planB = PLANS.find(p => p.id === selected[1]);

    return (
        <div className="tc-root" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: headFont }}>
            <HexGrid />

            <div className="tc-inner">
                <div className="tc-header">
                    <Link to="/choose" className="tc-back">← {t(CONTENT.backLink)}</Link>
                    <div className="tc-eyebrow">{t(CONTENT.eyebrow)}</div>
                    <h1 className="tc-title">{t(CONTENT.title)}</h1>
                    <p className="tc-sub">{t(CONTENT.subtitle)}</p>
                </div>

                {/* Plan selectors */}
                <div className="tc-selectors">
                    {[0, 1].map(idx => (
                        <div key={idx} className="tc-selector">
                            <div className="tc-selector-label">{`${t(CONTENT.selectorLabel)} ${idx + 1}`}</div>
                            <div className="tc-selector-btns">
                                {PLANS.map(p => (
                                    <button
                                        key={p.id}
                                        className={`tc-selector-btn${selected[idx] === p.id ? ' is-active' : ''}`}
                                        style={selected[idx] === p.id ? { borderColor: p.color, color: p.color } : {}}
                                        onClick={() => setSelected(s => s.map((v, i) => i === idx ? p.id : v))}
                                    >
                                        {t(p.name)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison table */}
                {planA && planB && (
                    <div className="tc-table-wrap">
                        {/* Header row */}
                        <div className="tc-grid">
                            <div className="tc-cell tc-cell--label" />
                            <div className="tc-cell tc-cell--head" style={{ borderTopColor: planA.color }}>
                                <div className="tc-plan-name" style={{ color: planA.color }}>{t(planA.name)}</div>
                                {planA.link && <Link to={planA.link} className="tc-view-link" style={{ color: planA.color }}>{t(CONTENT.viewPlanLink)}</Link>}
                            </div>
                            <div className="tc-cell tc-cell--head" style={{ borderTopColor: planB.color }}>
                                <div className="tc-plan-name" style={{ color: planB.color }}>{t(planB.name)}</div>
                                {planB.link && <Link to={planB.link} className="tc-view-link" style={{ color: planB.color }}>{t(CONTENT.viewPlanLink)}</Link>}
                            </div>
                        </div>

                        {/* Data rows */}
                        {ROWS.map(row => (
                            <div key={row.key} className="tc-grid tc-grid--row">
                                <div className="tc-cell tc-cell--label">{t(row.label)}</div>
                                <div className="tc-cell">{t(planA[row.key])}</div>
                                <div className="tc-cell">{t(planB[row.key])}</div>
                            </div>
                        ))}

                        {/* Key points */}
                        <div className="tc-grid tc-grid--row tc-grid--top">
                            <div className="tc-cell tc-cell--label">{t(CONTENT.keyPointsLabel)}</div>
                            {[planA, planB].map(plan => (
                                <div key={plan.id} className="tc-cell">
                                    <ul className="tc-points">
                                        {plan.keyPoints.map((pt, i) => (
                                            <li key={i}>{t(pt)}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="tc-footer">
                    <Link to="/arena" className="tc-cta">{t(CONTENT.footerCTA1)}</Link>
                    <Link to="/compare" className="tc-cta tc-cta--secondary">{t(CONTENT.footerCTA2)}</Link>
                </div>
            </div>
        </div>
    );
}
