import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import CONTENT from "../../locales/pages/transitional.json";
import "./TransitionalPage.css";

function resolveContent(node, lang) {
  if (node === null || node === undefined) return node;
  if (typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(item => resolveContent(item, lang));
  if ("en" in node && "fa" in node && Object.keys(node).length === 2) {
    return node[lang] ?? node.en;
  }
  const out = {};
  for (const key of Object.keys(node)) {
    out[key] = resolveContent(node[key], lang);
  }
  return out;
}

/* ─────────────────────────────────────────────────────
   Animated particle-graph background
───────────────────────────────────────────────────── */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;
    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    }));
    function resize() {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.007;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 190) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 190) * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${0.12 + p * 0.16})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="tp-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable: Accordion dropdown
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = color || "#8B5CF6";
  return (
    <div className="tp-acc" style={{ "--c": c }}>
      <button className="tp-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="tp-acc-title">{title}</span>
        {subtitle && <span className="tp-acc-subtitle">{subtitle}</span>}
        <span className="tp-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="tp-acc-body">{children}</div>}
    </div>
  );
}

/* Reusable: bullet list */
function Bullets({ items, color }) {
  return (
    <ul className="tp-bullets">
      {items.map((it, i) => (
        <li key={i} className="tp-bullet-item">
          <span className="tp-bullet-dot" style={{ background: color || "#8B5CF6" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* Reusable: section header */
function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="tp-sechead">
      {eyebrow && <div className="tp-sechead-eyebrow" style={{ color: color || "#8B5CF6" }}>{eyebrow}</div>}
      {title && <h2 className="tp-sechead-title">{title}</h2>}
      {intro && <p className="tp-sechead-intro">{intro}</p>}
    </div>
  );
}

/* Reusable: branch header block */
function BranchBlock({ icon, title, sub, color }) {
  return (
    <div className="tp-branch-block" style={{ borderColor: color }}>
      <span className="tp-branch-icon">{icon}</span>
      <div>
        <div className="tp-branch-title" style={{ color }}>{title}</div>
        <div className="tp-branch-sub">{sub}</div>
      </div>
    </div>
  );
}

/* Reusable: numbered grid */
function NumGrid({ items, color }) {
  return (
    <div className="tp-numgrid">
      {items.map((it, i) => (
        <div key={i} className="tp-numgrid-item">
          <span className="tp-numgrid-n" style={{ color }}>{String(i + 1).padStart(2, "0")}</span>
          <span className="tp-numgrid-text">{it}</span>
        </div>
      ))}
    </div>
  );
}

/* Reusable: highlight banner */
function Banner({ label, text, color, bg }) {
  return (
    <div className="tp-banner" style={{ borderColor: color, background: bg || `${color}0a` }}>
      {label && <span className="tp-banner-label" style={{ color }}>{label}</span>}
      <span className="tp-banner-text">{text}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main page component
───────────────────────────────────────────────────── */
export default function TransitionalPage() {
  const { lang, isRTL, headFont } = useLang();
  const d = resolveContent(CONTENT, lang);
  const ff = headFont;
  const dir = isRTL ? "rtl" : "ltr";

  const GREEN = "#69d98c", CYAN = "#8B5CF6", AMBER = "#ffd166",
    ORANGE = "#ff9a42", RED = "#ef5350", PURPLE = "#ba68c8", VIOLET = "#7c72e8";

  return (
    <div className="tp-page" dir={dir}>
      <ParticleGrid />
      <div className="tp-scanline" />
      <div className="tp-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <header className="tp-hero">
          <p className="tp-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="tp-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="tp-hero-desc">{d.heroDesc}</p>
          <div className="tp-hero-badges">
            {d.heroBadges.map((label, i) => {
              const colors = [CYAN, GREEN, PURPLE, AMBER, ORANGE];
              const c = colors[i] || CYAN;
              return (
                <span key={i} className="tp-badge" style={{ color: c, borderColor: `${c}35`, background: `${c}0e` }}>{label}</span>
              );
            })}
          </div>
        </header>

        {/* ══════════════════════════════════════════════════
            PART A
        ══════════════════════════════════════════════════ */}
        <SecHead eyebrow={d.partA_eyebrow} title={d.partA_title} intro={d.partA_intro} color={VIOLET} />

        {/* Pre-fall institutions */}
        <div className="tp-segment">
          <div className="tp-seg-label" style={{ color: VIOLET }}>{d.prefallLabel}</div>
          <div className="tp-prefail-wrap">
            <div className="tp-prefail-card" style={{ borderColor: `${VIOLET}40` }}>
              <Accordion title={d.nuc.title} subtitle={d.nuc.sub} color={VIOLET}>
                <Bullets items={d.nuc.items} color={VIOLET} />
              </Accordion>
            </div>
            <div className="tp-prefail-leader">
              <div className="tp-leader-box" style={{ fontFamily: ff }}>
                <div className="tp-leader-title">{d.leaderTitle}</div>
                <div className="tp-leader-sub">{d.leaderSub}</div>
                <div className="tp-leader-note">⚡ {d.leaderNote}</div>
              </div>
            </div>
            <div className="tp-prefail-card" style={{ borderColor: `${VIOLET}40` }}>
              <Accordion title={d.tet.title} subtitle={d.tet.sub} color={VIOLET}>
                <Bullets items={d.tet.items} color={VIOLET} />
              </Accordion>
            </div>
          </div>
          <Accordion title={d.prongs.label} color={VIOLET}>
            <Bullets items={d.prongs.items} color={VIOLET} />
          </Accordion>
        </div>

        {/* Three branches */}
        <div className="tp-branches-label">
          {d.threeBranchesLabel}
        </div>
        <div className="tp-branches">

          {/* Mehestan */}
          <div className="tp-branch-col">
            <BranchBlock icon="⚖️" title={d.meh.title} sub={d.meh.sub} color={GREEN} />
            {d.meh.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={GREEN}>
                <Bullets items={s.items} color={GREEN} />
              </Accordion>
            ))}
          </div>

          {/* Government */}
          <div className="tp-branch-col">
            <BranchBlock icon="🏛️" title={d.gov.title} sub={d.gov.sub} color={CYAN} />
            {d.gov.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={CYAN}>
                <Bullets items={s.items} color={CYAN} />
              </Accordion>
            ))}
          </div>

          {/* Divan */}
          <div className="tp-branch-col">
            <BranchBlock icon="🔏" title={d.div.title} sub={d.div.sub} color={AMBER} />
            {d.div.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={AMBER}>
                <Bullets items={s.items} color={AMBER} />
              </Accordion>
            ))}
          </div>

        </div>

        {/* Military */}
        <div className="tp-mil-wrap">
          <BranchBlock icon="🎖️" title={d.mil.title} sub={d.mil.sub} color={ORANGE} />
          <div className="tp-mil-grid">
            {d.mil.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={ORANGE}>
                <Bullets items={s.items} color={ORANGE} />
              </Accordion>
            ))}
          </div>
        </div>

        <Banner
          label={d.contingencyLabel}
          text={d.contingencyText}
          color={ORANGE}
        />

        {/* 7 Immutable Principles */}
        <div className="tp-principles-wrap">
          <div className="tp-seg-label" style={{ color: VIOLET }}>{d.immutable.label}</div>
          <div className="tp-principles-list">
            {d.immutable.items.map((p, i) => (
              <div key={i} className="tp-principle-row" style={{ fontFamily: ff }}>
                <span className="tp-principle-n" style={{ color: VIOLET }}>{i + 1}</span>
                <span className="tp-principle-text">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <Accordion title={d.hybridOption.title} color={CYAN}>
          <p className="tp-prose">{d.hybridOption.text}</p>
        </Accordion>

        <div className="tp-divider" />

        {/* ══════════════════════════════════════════════════
            PART B
        ══════════════════════════════════════════════════ */}
        <SecHead eyebrow={d.partB_eyebrow} title={d.partB_title} intro={d.partB_intro} color={RED} />

        <div className="tp-decree-header">
          <div className="tp-decree-title" style={{ fontFamily: ff }}>{d.decreeTitle}</div>
          <div className="tp-decree-sub">{d.decreeSub}</div>
        </div>

        <div className="tp-decree-parts">
          {d.decreeParts.map((p, i) => (
            <div key={i} className="tp-decree-card" style={{ "--dp": p.color }}>
              <div className="tp-decree-card-label">{p.label}</div>
              <div className="tp-decree-card-title" style={{ fontFamily: ff }}>{p.title}</div>
              <Bullets items={p.items} color={p.color} />
            </div>
          ))}
        </div>

        <div className="tp-segment tp-mt20">
          <div className="tp-seg-label" style={{ color: AMBER }}>{d.reforms.label}</div>
          <NumGrid items={d.reforms.items} color={AMBER} />
        </div>

        <Banner text={d.hybridWhy} color={CYAN} />

        <div className="tp-divider" />

        {/* ══════════════════════════════════════════════════
            PART C
        ══════════════════════════════════════════════════ */}
        <SecHead eyebrow={d.partC_eyebrow} title={d.partC_title} intro={d.partC_intro} color={GREEN} />

        <div className="tp-tracks">

          {/* Foreign Policy */}
          <div className="tp-track">
            <div className="tp-track-head" style={{ borderColor: GREEN }}>
              <span>🌐</span>
              <div>
                <div className="tp-track-title" style={{ color: GREEN, fontFamily: ff }}>{d.fp.title}</div>
                <div className="tp-track-sub">{d.fp.sub}</div>
              </div>
            </div>
            {d.fp.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={GREEN}>
                <Bullets items={s.items} color={GREEN} />
              </Accordion>
            ))}
          </div>

          {/* Military Timeline */}
          <div className="tp-track">
            <div className="tp-track-head" style={{ borderColor: ORANGE }}>
              <span>🎯</span>
              <div>
                <div className="tp-track-title" style={{ color: ORANGE, fontFamily: ff }}>{d.milTimeline.title}</div>
                <div className="tp-track-sub">{d.milTimeline.sub}</div>
              </div>
            </div>
            {d.milTimeline.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={ORANGE}>
                <Bullets items={s.items} color={ORANGE} />
              </Accordion>
            ))}
          </div>

          {/* Macroeconomics */}
          <div className="tp-track">
            <div className="tp-track-head" style={{ borderColor: AMBER }}>
              <span>📈</span>
              <div>
                <div className="tp-track-title" style={{ color: AMBER, fontFamily: ff }}>{d.macro.title}</div>
                <div className="tp-track-sub">{d.macro.sub}</div>
              </div>
            </div>
            {d.macro.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={AMBER}>
                <Bullets items={s.items} color={AMBER} />
              </Accordion>
            ))}
          </div>

          {/* Essential Functions */}
          <div className="tp-track">
            <div className="tp-track-head" style={{ borderColor: CYAN }}>
              <span>⚙️</span>
              <div>
                <div className="tp-track-title" style={{ color: CYAN, fontFamily: ff }}>{d.ess.title}</div>
                <div className="tp-track-sub">{d.ess.sub}</div>
              </div>
            </div>
            {d.ess.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={CYAN}>
                <Bullets items={s.items} color={CYAN} />
              </Accordion>
            ))}
          </div>

          {/* Education */}
          <div className="tp-track">
            <div className="tp-track-head" style={{ borderColor: PURPLE }}>
              <span>📚</span>
              <div>
                <div className="tp-track-title" style={{ color: PURPLE, fontFamily: ff }}>{d.edu.title}</div>
                <div className="tp-track-sub">{d.edu.sub}</div>
              </div>
            </div>
            {d.edu.sections.map((s, i) => (
              <Accordion key={i} title={s.title} color={PURPLE}>
                <Bullets items={s.items} color={PURPLE} />
              </Accordion>
            ))}
          </div>

        </div>

        <Banner text={d.whitePapersNote} color={CYAN} />

        <div className="tp-divider" />

        {/* ══════════════════════════════════════════════════
            STAGE 2
        ══════════════════════════════════════════════════ */}
        <SecHead eyebrow={d.stage2_eyebrow} title={d.stage2_title} intro={d.stage2_intro} color={GREEN} />

        <div className="tp-s2">

          {/* People */}
          <div className="tp-s2-source">
            <div className="tp-s2-source-title" style={{ fontFamily: ff }}>👥 {d.s2_people_title}</div>
            <div className="tp-s2-source-sub">{d.s2_people_sub}</div>
          </div>

          <div className="tp-s2-arrows-row">
            <span className="tp-s2-arrow-label">{d.s2ElectLabel} ↙</span>
            <span className="tp-s2-arrow-label">↘ {d.s2VoteInLabel}</span>
          </div>

          {/* CA + Referendum */}
          <div className="tp-s2-dual">
            <div className="tp-s2-node" style={{ borderColor: AMBER }}>
              <div className="tp-s2-node-title" style={{ fontFamily: ff, color: AMBER }}>{d.s2ca.title}</div>
              <div className="tp-s2-node-sub">{d.s2ca.sub}</div>
              <Accordion title={d.s2DetailsLabel} color={AMBER}>
                <Bullets items={d.s2ca.items} color={AMBER} />
              </Accordion>
            </div>
            <div className="tp-s2-node" style={{ borderColor: AMBER }}>
              <div className="tp-s2-node-title" style={{ fontFamily: ff, color: AMBER }}>{d.s2ref.title}</div>
              <div className="tp-s2-node-sub">{d.s2ref.sub}</div>
              <Accordion title={d.s2DetailsLabel} color={AMBER}>
                <Bullets items={d.s2ref.items} color={AMBER} />
              </Accordion>
            </div>
          </div>

          <div className="tp-s2-down">↓</div>

          {/* New Constitution */}
          <div className="tp-s2-const">
            <div className="tp-s2-const-title" style={{ fontFamily: ff }}>📜 {d.s2const.title}</div>
            <div className="tp-s2-const-sub">{d.s2const.sub}</div>
            <Accordion title={d.s2DetailsLabel} color={VIOLET}>
              <Bullets items={d.s2const.items} color={VIOLET} />
            </Accordion>
          </div>

          <div className="tp-s2-down">↓</div>

          {/* 3 permanent branches */}
          <div className="tp-s2-branches">
            {[
              { icon: "📜", data: d.s2parliament, color: GREEN },
              { icon: "🏛️", data: d.s2govt, color: CYAN },
              { icon: "⚖️", data: d.s2jud, color: AMBER },
            ].map((b, i) => (
              <div key={i} className="tp-s2-branch" style={{ borderColor: b.color }}>
                <div className="tp-s2-branch-icon">{b.icon}</div>
                <div className="tp-s2-branch-title" style={{ fontFamily: ff, color: b.color }}>{b.data.title}</div>
                <Bullets items={b.data.items} color={b.color} />
              </div>
            ))}
          </div>

        </div>

        {/* Dissolution */}
        <div className="tp-dissolution">
          <span className="tp-dissolution-flash">⚡</span>
          <span style={{ fontFamily: ff }}>{d.dissolution}</span>
        </div>

        <p className="tp-source">{d.source}</p>

        {/* ── Navigation CTA ─────────────────────────────────── */}
        <div className="tp-nav-cta" dir={dir} style={{ fontFamily: ff }}>
          <Link to="/arena" className="tp-nav-btn tp-nav-btn--primary">
            {d.navEnterArena}
          </Link>
          <Link to="/destination" className="tp-nav-btn tp-nav-btn--secondary">
            {d.navPermanentConst}
          </Link>
          <Link to="/choose" className="tp-nav-btn tp-nav-btn--secondary">
            {d.navBackToChoose}
          </Link>
        </div>

      </div>
    </div>
  );
}
