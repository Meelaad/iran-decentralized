import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./JMIPage.css";

/* ─────────────────────────────────────────────────────
   Animated particle background — warm gold palette
───────────────────────────────────────────────────── */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.17, vy: (Math.random() - 0.5) * 0.17,
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
      t += 0.005;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 175) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(232,200,64,${(1 - dist / 175) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,200,64,${0.09 + p * 0.13})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="jmi-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="jmi-acc" style={{ "--c": color || "#e8c840" }}>
      <button className="jmi-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="jmi-acc-title">{title}</span>
        {subtitle && <span className="jmi-acc-subtitle">{subtitle}</span>}
        <span className="jmi-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="jmi-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="jmi-bullets">
      {items.map((it, i) => (
        <li key={i} className="jmi-bullet-item">
          <span className="jmi-bullet-dot" style={{ background: color || "#e8c840" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="jmi-sechead">
      {eyebrow && <div className="jmi-sechead-eyebrow" style={{ color }}>{eyebrow}</div>}
      {title && <h2 className="jmi-sechead-title">{title}</h2>}
      {intro && <p className="jmi-sechead-intro">{intro}</p>}
    </div>
  );
}

function IdeologyEvolution({ rows }) {
  return (
    <div className="jmi-evo-table">
      <div className="jmi-evo-head">
        <span>{rows[0] ? "" : ""}</span>
        <span>1949–1979</span>
        <span>2023–2026</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="jmi-evo-row">
          <div className="jmi-evo-component">{r.component}</div>
          <div className="jmi-evo-old">{r.old}</div>
          <div className="jmi-evo-new">{r.new}</div>
        </div>
      ))}
    </div>
  );
}

function MechanismCard({ icon, title, label, color, items }) {
  return (
    <div className="jmi-mech-card" style={{ borderColor: `${color}28` }}>
      <div className="jmi-mech-icon">{icon}</div>
      <div className="jmi-mech-label" style={{ color }}>{label}</div>
      <div className="jmi-mech-title" style={{ color }}>{title}</div>
      <Bullets items={items} color={color} />
    </div>
  );
}

function PhaseRow({ number, phase, mechanism, objective, color }) {
  return (
    <div className="jmi-phase-row" style={{ "--pr": color }}>
      <div className="jmi-phase-n">{number}</div>
      <div className="jmi-phase-info">
        <div className="jmi-phase-name">{phase}</div>
        <div className="jmi-phase-mech">{mechanism}</div>
      </div>
      <div className="jmi-phase-obj">{objective}</div>
    </div>
  );
}

function PowerNode({ icon, title, role, color, items }) {
  return (
    <div className="jmi-power-node" style={{ borderColor: `${color}28` }}>
      <div className="jmi-power-icon">{icon}</div>
      <div className="jmi-power-title" style={{ color }}>{title}</div>
      <div className="jmi-power-role">{role}</div>
      <Bullets items={items} color={color} />
    </div>
  );
}

function InstRow({ institution, policy, status, statusColor, action }) {
  return (
    <div className="jmi-inst-row">
      <div className="jmi-inst-name">{institution}</div>
      <div className="jmi-inst-policy">
        <span className="jmi-inst-status" style={{ color: statusColor, borderColor: `${statusColor}35`, background: `${statusColor}0d` }}>{status}</span>
      </div>
      <div className="jmi-inst-action">{action}</div>
    </div>
  );
}

function PolicyCard({ icon, title, color, children }) {
  return (
    <div className="jmi-pol-card" style={{ borderColor: `${color}28` }}>
      <div className="jmi-pol-icon">{icon}</div>
      <div className="jmi-pol-title" style={{ color }}>{title}</div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "National Front of Iran (Jebhe Melli · JMI) · Founded 1949 by Dr. Mohammad Mossadegh · 2015 Asasnameh + 2023 Hamgami Principles",
    heroTitle: "Mosaddeghist Democratic Republic Blueprint",
    heroDesc: "The JMI is the oldest pro-democracy political organization in the Iranian political spectrum — carrying 75 years of institutional memory. Its ideology, 'Mosaddeghism,' synthesizes civic nationalism, secular liberalism, and social democracy. It is the only Iranian opposition plan whose entire foreign policy architecture is shaped by a historical trauma: the 1953 CIA/MI6 coup that overthrew its founder. Its blueprint is designed to correct both 1953 (foreign intervention) and 1979 (authoritarian hijacking of revolution) simultaneously.",
    heroBadges: [
      { label: "Founded 1949", c: "#e8c840" },
      { label: "Mosaddeghism", c: "#ff9a42" },
      { label: "1953 Coup Doctrine", c: "#ef5350" },
      { label: "Voice + Pressure Strategy", c: "#69d98c" },
      { label: "Anti-Federalist", c: "#ba68c8" },
      { label: "Oil Nationalization Legacy", c: "#4fc3f7" },
    ],

    // ── IDEOLOGY ──
    ideolEyebrow: "Mosaddeghism — The Ideological Foundation",
    ideolTitle: "75 Years of Civic Nationalism, Secular Liberalism, and the 1953 Wound",
    ideolIntro: "JMI's ideology is inseparable from its history. 'Mosaddeghism' is not merely a name — it is a complete political philosophy anchored in three interlocking commitments that have defined the organization for three-quarters of a century.",

    mosaddeghism: {
      title: "The Three Pillars of Mosaddeghism",
      color: "#e8c840",
      items: [
        "CIVIC NATIONALISM — Iran's sovereignty belongs to its citizens, not to a dynasty, a clerical class, or a foreign power. The Iranian state is the property of the Iranian people.",
        "SECULAR LIBERALISM — Governance is a civil right. The state apparatus is structurally blind to religious affiliation. No religious institution holds any political authority.",
        "SOCIAL DEMOCRACY — Political democracy is impossible without economic equity. The state is obligated to provide universal social welfare, protect labor rights, and ensure that national resources serve the people — not a militarized elite.",
        "The 1953 CIA/MI6 coup that overthrew Mossadegh and reversed oil nationalization is the defining trauma — it shapes every foreign policy position the JMI holds",
        "JMI is the only major Iranian opposition organization that has actively opposed BOTH the Pahlavi monarchy AND the Islamic Republic — giving it a unique 'clean hands' legitimacy",
      ],
    },

    monarchyCaveat: {
      title: "The Monarchy Caveat — A Historical Note",
      color: "#ff9a42",
      items: [
        "Historically (1949–1979): JMI operated within the 1906 Constitutional framework and occasionally tolerated a strictly symbolic, non-ruling constitutional monarchy — provided the parliament held absolute supreme power",
        "The condition was explicit: the monarch reigns but does not rule — identical to the Swedish or UK model",
        "Post-1979 trauma: the experience of Khomeini's power consolidation and the clerical establishment's authoritarian capture of the revolution permanently hardened JMI's stance",
        "Contemporary position (2023–2026): the executive leadership and the Hamgami integration represent a definitive shift to a pure Secular Democratic Republic",
        "The door is not fully closed on symbolic monarchy as a theoretical option — but current manifestos strongly and explicitly favor a Republic",
        "This nuance distinguishes JMI from the URI/Hamgami partners who are more categorically anti-monarchy",
      ],
    },

    ideologyEvolution: [
      { component: "Governance Model", old: "Tolerance of symbolic constitutional monarchy; emphasis on 1906 Constitution", new: "Strict Secular Democratic Republic; absolute rejection of lifelong/hereditary rule" },
      { component: "Role of Religion", old: "Islamic liberalism tolerated; broad coalition with democratic clerics", new: "Total separation of religion and state; secular civil law" },
      { component: "National Sovereignty", old: "Anti-imperialism; nationalization of oil industry", new: "Rejection of all foreign intervention; sovereign control over all national resources" },
      { component: "Human Rights", old: "Civic nationalism; anti-feudalism", new: "Universal Declaration of Human Rights; women's rights and LGBTQ equality explicitly included" },
    ],

    coup1953: {
      title: "The 1953 Wound — How a Coup Shapes a Blueprint 70 Years Later",
      items: [
        "August 19, 1953: CIA (Operation AJAX) and MI6 (Operation Boot) engineer a coup against PM Mohammad Mossadegh — reversing the nationalization of Iran's oil industry",
        "The Shah is restored to absolute power. Mossadegh is imprisoned, then placed under house arrest until his death in 1967.",
        "JMI's entire foreign policy architecture flows from this single event:",
        "→ Strict independence from both Western AND Eastern foreign hegemony",
        "→ Absolute rejection of any transition model engineered by foreign powers",
        "→ The Iranian nation's sovereignty is non-negotiable — including from well-intentioned foreign 'helpers'",
        "→ Iran's natural resources (oil, gas, minerals) must remain under Iranian sovereign control",
        "This anti-imperialist stance coexists with the 2023 Hamgami position of normal relations with the US and Israel — the distinction: normalization based on mutual respect, not subordination",
      ],
    },

    // ── METHODOLOGY ──
    methEyebrow: "Methodology — The Path to the Goal",
    methTitle: "Social Force, The Voice, The Pressure, and Top Cracks",
    methIntro: "JMI's transition strategy is uniquely theorized under its own named concepts. Unlike plans that simply list 'civil resistance,' JMI has a precise strategic architecture: two mechanisms that create one effect (elite fractures) that produces one outcome (non-violent collapse).",

    voicePressure: [
      {
        icon: "📢",
        label: "THE VOICE",
        title: "Continuous Grassroots Mobilization",
        color: "#e8c840",
        items: [
          "Continuous street protests and civil disobedience — sustained, not episodic",
          "Mobilization of highly motivated demographic sectors: women, youth, ethnic minorities",
          "Driven primarily by the 'Woman, Life, Freedom' revolutionary movement",
          "Goal: maintain a permanent visible presence that demonstrates the regime's loss of legitimacy",
          "Non-violent positioning reduces the regime's justification for mass lethal response",
        ],
      },
      {
        icon: "⚒️",
        label: "THE PRESSURE",
        title: "Calculated Economic Attrition",
        color: "#69d98c",
        items: [
          "Nationwide labor strikes in critical sectors: oil industry (most critical), transportation, teachers, bazaar merchants",
          "Bazaar closures — the traditional merchant class closing their shops is a historically decisive signal in Iranian politics",
          "Widespread economic boycotts",
          "Goal: make the country fundamentally ungovernable — state revenues collapse, services fail, bureaucratic loyalty erodes",
          "Oil workers specifically: their strikes directly sever the regime's primary income source",
        ],
      },
    ],

    topCracks: {
      title: "The 'Top Cracks' Strategy — Fracturing the Elite from Within",
      items: [
        "The combined effect of Voice + Pressure is designed to produce a specific internal phenomenon: 'Top Cracks'",
        "Top Cracks = ideological and operational fractures within the regime's elite leadership and security apparatus",
        "When the state is sufficiently paralyzed: bureaucrats calculate that the regime cannot survive → they defect",
        "When the state is sufficiently paralyzed: the Artesh calculates that firing on civilians will destroy its own legitimacy → it refuses orders",
        "The Artesh defection is the terminal event — JMI calculates that without the conventional army, the IRGC and Basij cannot sustain mass repression",
        "JMI explicitly maintains non-violent civil resistance and rejects political retribution — this lowers the 'exit cost' for mid-level regime personnel, making defection psychologically safe",
        "The entire strategy depends on a single threshold: the moment the Artesh abstains or defects during a critical mass uprising",
      ],
    },

    rejections: {
      title: "Explicitly Prohibited Mechanisms",
      color: "#ef5350",
      items: [
        "Armed insurgency and guerrilla warfare — viewed as inherently destructive to the democratic transition",
        "Foreign military intervention and external military strikes — condemned as violations of Iranian sovereignty regardless of intent",
        "Externally engineered 'alternative-making' — the 1953 trauma makes this an absolute red line",
        "The JMI analysis: kinetic violence and foreign strikes STRENGTHEN the domestic security apparatus and invite balkanization",
        "The JMI analysis: external intervention replaces one form of dictatorship with another — historically validated by 1953",
      ],
    },

    // ── 5 PHASES ──
    phasesEyebrow: "Five-Phase Transition Timeline",
    phasesTitle: "From Civil Resistance to Constitutional Republic",
    phasesIntro: "A structured phased transition following regime collapse. Note: unlike the ITC's 6-phase plan with specific day counts, JMI does not specify the exact duration of the interim phase — reflecting the organization's preference for organic, people-driven transition over technocratic scheduling.",

    phases: [
      { number: "01", phase: "Civil Resistance (Ongoing)", mechanism: "Street protests (Voice) + Labor/bazaar strikes (Pressure)", objective: "Paralyze the state economy; fracture the elite leadership; encourage defection of the Artesh", color: "#e8c840" },
      { number: "02", phase: "Regime Collapse", mechanism: "Non-violent capitulation of the Velayat-e Faqih system", objective: "Prevent civil war and foreign intervention; secure critical national infrastructure", color: "#69d98c" },
      { number: "03", phase: "Interim Governance", mechanism: "Formation of a Temporary Transition Council of diverse secular democratic forces", objective: "Manage daily state administration; dismantle IRGC/Basij; preserve order without authoritarian consolidation", color: "#4fc3f7" },
      { number: "04", phase: "Constituent Assembly Elections", mechanism: "Free, fair, and transparent nationwide elections for a Majlis-e Moasesan", objective: "Draft a new secular democratic constitution based on universal human rights", color: "#ff9a42" },
      { number: "05", phase: "Democratic Referendum", mechanism: "National plebiscite on the drafted constitution", objective: "Ratify the constitution; officially inaugurate the Secular Democratic Republic of Iran", color: "#ba68c8" },
    ],

    transitionCouncilNote: "The Temporary Transition Council is JMI's explicit alternative to the NUFDI/Pahlavi 'Emergency Phase' model. JMI explicitly rejects any transition concentrated under a single unelected leader — the council is composed of diverse secular democratic forces with no single dominant actor.",

    // ── POWER STRUCTURE ──
    powerEyebrow: "Proposed Power Structure",
    powerTitle: "The Secular Parliamentary Republic — Three Independent Branches",
    powerIntro: "The JMI power structure is the most classically republican of all Iranian opposition plans. It maps directly onto standard Western parliamentary democratic models — by design. Mossadegh's democracy in 1951–1953 was parliamentary. The blueprint restores and modernizes that model.",

    powerNodes: [
      { icon: "🗳️", title: "The Electorate", role: "Apex Sovereign Authority", color: "#e8c840", items: ["Ultimate sovereignty rests with the citizens of Iran — exercises through universal suffrage and national referendums", "No supreme leader, no ruling monarch, no unelected guardianship councils — all abolished", "Strict Principle of Alternation of Power: term limits for both parliament and presidency", "No individual, council, or religious body sits above the elected representatives"] },
      { icon: "🏛️", title: "National Parliament (Majlis)", role: "Legislative Branch — Supreme Law-Making Authority", color: "#4fc3f7", items: ["Directly elected by the Electorate via democratic elections", "Holds supreme legislative authority and oversight over the Executive", "Oversees national budget and all government operations", "Restricted by strict term limits — Alternation of Power principle", "No parallel clerical body, guardian council, or assembly of experts exists in this architecture"] },
      { icon: "⚙️", title: "President + Cabinet", role: "Executive Branch — Daily State Operations", color: "#69d98c", items: ["President directly elected by the Electorate", "Cabinet appointed by the President and confirmed by Parliament", "Manages: daily state operations, macroeconomic policy, national defense, foreign affairs", "Governance based on meritocracy and specialization — stripped of all religious or ideological filters", "Accountable to Parliament — parliamentary oversight is absolute"] },
      { icon: "⚖️", title: "Independent Judiciary", role: "Judicial Branch — Secular Civil Law Only", color: "#ff9a42", items: ["Completely independent from both Executive and Legislative branches", "Appointments: independent legal professionals based on secular civil law meritocracy — no clergy", "Enforces civil and criminal law based on universal human rights standards", "Strictly separated from all religious jurisprudence — Sharia has no judicial role", "Total abolition of the death penalty and torture constitutionally enshrined"] },
      { icon: "🗺️", title: "Provincial/District/Village Councils", role: "Administrative Decentralization — NOT Federalism", color: "#ba68c8", items: ["Elected directly by local citizens", "Manages: local administrative affairs, regional economic development, infrastructure, cultural preservation", "Strictly subordinate to the national constitution and central parliamentary law", "This is ADMINISTRATIVE decentralization — the central parliament and executive retain ultimate sovereign authority", "Persian remains the sole official national language; regional languages (Kurdish, Balochi, Azerbaijani) protected as cultural heritage", "JMI explicitly and vehemently rejects ethno-linguistic federalism — views it as a precursor to balkanization"] },
    ],

    // ── INSTITUTIONAL TARGETS ──
    instEyebrow: "Institutional Targeting Policy",
    instTitle: "Sharp Distinctions — Eradicate vs. Reform",
    instIntro: "JMI draws a sharp architectural distinction between institutions that fulfill necessary national functions (reformed) and institutions created solely to protect and enrich the theocracy (eradicated). This is the clearest institutional targeting table of any Iranian opposition plan.",

    instRows: [
      { institution: "IRGC + Basij", status: "COMPLETE DISSOLUTION", statusColor: "#ef5350", action: "Legal and symbolic eradication. All economic assets confiscated (Khatam al-Anbiya conglomerate and all IRGC monopolies). New laws permanently banning any military/paramilitary interference in civilian politics or economy." },
      { institution: "Artesh (Regular Army)", status: "REFORMED & UTILIZED", statusColor: "#69d98c", action: "Retained as sole national defense force. Rebuilt with new recruitment protocols. Strictly subordinated to a civilian Ministry of Defense. Placed under absolute parliamentary oversight." },
      { institution: "Clerical + Revolutionary Courts", status: "COMPLETELY DISMANTLED", statusColor: "#ef5350", action: "Total eradication of the Special Clerical Court and Islamic Revolutionary Courts. Replaced by a secular, independent civil judiciary based on universal human rights." },
      { institution: "Bonyads (Religious Foundations)", status: "CONFISCATED", statusColor: "#ff9a42", action: "Dismantled as independent tax-exempt monopolies. Assets integrated into the formal, taxable national economy to fund social welfare programs and infrastructure development." },
      { institution: "Civilian Ministries", status: "PURGED & REFORMED", statusColor: "#4fc3f7", action: "Retained but purged of all ideological appointees and structural corruption. Restructured based on meritocracy, specialization, and independent media/union oversight." },
    ],

    // ── KEY POLICIES ──
    polEyebrow: "Key Policy Stances",
    polTitle: "The Four-Domain Policy Matrix",
    polIntro: "JMI's policies address what the coalition terms a 'mega-crisis' — a catastrophic convergence of economic devastation, environmental collapse, international isolation, and severe human rights abuses. Each policy domain directly addresses one of these simultaneous failures.",

    policies: [
      {
        icon: "📊",
        title: "Economy: From Rentier State to Competitive Production",
        color: "#e8c840",
        items: [
          "REJECTS the current system: corrupt, non-competitive, 'rent-seeking' economy dominated by ideological mafia bands and military conglomerates (IRGC/Bonyads)",
          "Transition to: production-based, competitive economy using modern technology, foreign investment, global market integration",
          "BUT: heavily counterbalanced by robust social welfare — universal social security, free education, universal housing access, comprehensive health insurance",
          "Explicit ban on child labor; strict implementation of international labor laws; independent trade unions empowered (teachers, oil workers, artists)",
          "Mossadegh legacy — nationalization of core natural resources: oil, gas, minerals remain under Iranian sovereign control to prevent foreign or monopolistic exploitation",
          "Environmental crisis elevated to a TOP-TIER national security and economic priority — drought, water table depletion, and extreme pollution explicitly named",
        ],
      },
      {
        icon: "🗺️",
        title: "Minorities: Administrative Decentralization vs. Federalism",
        color: "#ba68c8",
        items: [
          "JMI is fiercely patriotic — absolute, non-negotiable preservation of Iran's territorial integrity and sovereign independence",
          "EXPLICITLY AND VEHEMENTLY REJECTS ethno-linguistic federalism — views it as a dangerous precursor to balkanization (citing Yugoslavia model)",
          "INSTEAD: highly structured administrative decentralization — tiered elected councils at village, district, and provincial levels",
          "Councils manage: local budgets, infrastructure, educational initiatives — but subordinate to the central parliament",
          "Persian (Farsi) remains the sole official, educational, and common language of the state — non-negotiable",
          "ALL regional languages (Kurdish, Balochi, Azerbaijani, etc.) promoted and protected as a shared 'cultural heritage' and national treasure",
          "This position directly conflicts with the CPFIK's federalist demands — placing JMI on a potential collision course with Kurdish and other minority organizations post-transition",
        ],
      },
      {
        icon: "⚖️",
        title: "Justice: Transitional Justice Without Vengeance",
        color: "#69d98c",
        items: [
          "Explicitly rejects blanket purges, revolutionary executions, and political retribution",
          "Operates on the presumption of innocence — absolute judicial security guaranteed for all citizens",
          "Total abolition of the death penalty as a judicial punishment",
          "Strict prohibition of torture in all forms",
          "Former regime members prosecuted through fair, transparent, independent secular courts — not mob justice or summary tribunals",
          "Focus on individual accountability for specific, provable crimes — not collective guilt based on organizational membership",
          "Strategic purpose: lowering the 'exit cost' for lower-ranking military and bureaucratic personnel — making defection to the democratic movement psychologically safe by guaranteeing they won't face arbitrary prosecution",
        ],
      },
      {
        icon: "🌍",
        title: "Foreign Policy: Independence, Normalization, and Non-Proliferation",
        color: "#4fc3f7",
        items: [
          "Core immutable tenet: strict independence from foreign hegemony — BOTH Western AND Eastern",
          "The 1953 coup makes external interference an absolute red line regardless of direction or intent",
          "BUT: advocates for peaceful, normal relations with ALL UN member states based strictly on national interests and mutual respect",
          "Explicitly mentions normal relations with the United States AND Israel — a foundational departure from the Islamic Republic",
          "Adamantly opposes regional proxy wars (Lebanon, Syria, Yemen, Gaza) — argues they squander national wealth and invite foreign strikes",
          "Prohibition and destruction of weapons of mass destruction — nuclear non-proliferation as a commitment",
          "Senior JMI figure Seyed Hossein Mousavian has proposed REGIONAL NUCLEAR CONSORTIUMS for peaceful, transparent enrichment management — the most diplomatically sophisticated nuclear proposal of any Iranian opposition plan",
          "JMI strongly condemns foreign military strikes against Iran as violations of Iranian sovereignty — even when those strikes target the regime",
        ],
      },
    ],

    // ── STRATEGIC ASSESSMENT ──
    assessEyebrow: "Strategic Assessment",
    assessTitle: "The Single Greatest Vulnerability",
    assessIntro: "JMI's blueprint is the most institutionally mature and historically legitimate of all Iranian opposition plans. But it contains a single structural dependency that is simultaneously its greatest strength and greatest risk.",

    dependency: {
      title: "The Artesh Defection Threshold",
      color: "#ef5350",
      text: "The entire transition methodology — the Voice, the Pressure, the Top Cracks strategy — is ultimately contingent on one event: the Artesh's abstention or defection during a critical mass uprising. JMI strictly prohibits armed insurgency and foreign military intervention. This means if the Artesh does not defect, the transition cannot proceed through JMI's prescribed path. Every other element of the blueprint — the Temporary Transition Council, the Constituent Assembly, the Secular Democratic Republic — exists downstream of this single military threshold.",
    },

    strengths: {
      title: "Structural Strengths",
      color: "#e8c840",
      items: [
        "75 years of institutional legitimacy — the only Iranian opposition organization with a direct historical connection to a functioning democratic government (1951–1953)",
        "'Clean hands' credibility: actively opposed BOTH the Pahlavi monarchy AND the Islamic Republic — unlike every other plan, which came from within one of those systems",
        "The Hamgami coalition integration connects JMI's historical legitimacy to the URI's modern organizational infrastructure",
        "The 1953 anti-imperialist credential gives JMI unique appeal to nationalist Iranians who distrust diaspora-led Western-backed opposition",
        "The Artex retention + reform policy is strategically sophisticated: it reduces the risk of a post-collapse military power vacuum",
        "The Temporary Transition Council model avoids the single-leader concentration problem that other transition plans exhibit",
        "Nuclear consortium proposal (Mousavian) is the most internationally credible nuclear position of any Iranian opposition plan",
      ],
    },
    weaknesses: {
      title: "Structural Vulnerabilities",
      color: "#ef5350",
      items: [
        "The entire transition strategy depends on the Artesh defection threshold being met — if the military does not defect, the strategy has no kinetic fallback",
        "The strict anti-federalism position creates a post-transition collision course with the CPFIK (Kurdish coalition) and other ethnic minority organizations — this could trigger the civil war scenario the blueprint is designed to prevent",
        "The monarchy caveat creates persistent ambiguity — some JMI members and historical constituencies still tolerate symbolic monarchy, potentially fragmenting the coalition under pressure",
        "JMI's condemnation of foreign military strikes against Iran (even against the regime) puts it at odds with the geopolitical reality of 2026, where strikes have already occurred",
        "The transition timeline is unspecified — unlike the ITC's 180-day plan, the absence of a concrete timeline creates coordination and legitimacy risks during the power vacuum",
        "JMI's broad historical coalition includes ideologically heterogeneous groups (secular liberals, social democrats, pan-Iranists) — maintaining coherence under the acute pressures of a real transition requires governance structures not fully detailed in the blueprint",
      ],
    },

    conclusion: "\"The National Front of Iran blueprint offers a highly stable, institutionally resilient governance model. By immediately dissolving parallel ideological militias, secularizing the judiciary, and implementing a socially buffered competitive economy, the blueprint theoretically inoculates the future state against both a return to clerical autocracy and a relapse into dynastic dictatorship. The resulting architecture would produce an Iranian state that is internally equitable, fiercely independent, and externally normalized.\" — JMI Blueprint Systemic Conclusion",

    source: "Source: JMI Asasnameh 2015 · Hamgami Coalition Fundamental Principles 2023 · Jebhe Melli Iran · Founded 1949 by Dr. Mohammad Mossadegh · Current leadership: Seyed Hossein Mousavian (Chairperson), Mohsen Frashad (Spokesperson)",
  },

  fa: {
    heroEyebrow: "جبهه ملی ایران (جبهه‌ملی · JMI) · تأسیس ۱۹۴۹ توسط دکتر محمد مصدق · اساسنامه ۲۰۱۵ + اصول همگامی ۲۰۲۳",
    heroTitle: "طرح جمهوری دموکراتیک مصدقی",
    heroDesc: "جبهه ملی ایران کهن‌ترین سازمان سیاسی طرفدار دموکراسی در طیف سیاسی ایران است — با ۷۵ سال حافظه نهادی. ایدئولوژی آن، 'مصدقیسم'، ناسیونالیسم مدنی، لیبرالیسم سکولار و سوشیال دموکراسی را ترکیب می‌کند. تنها طرح اپوزیسیون ایرانی است که تمام معماری سیاست خارجی‌اش توسط یک تروما تاریخی شکل گرفته: کودتای ۱۹۵۳ CIA/MI6 که بنیانگذارش را سرنگون کرد.",
    heroBadges: [
      { label: "تأسیس ۱۹۴۹", c: "#e8c840" },
      { label: "مصدقیسم", c: "#ff9a42" },
      { label: "دکترین کودتای ۱۹۵۳", c: "#ef5350" },
      { label: "استراتژی صدا + فشار", c: "#69d98c" },
      { label: "ضدفدرالیست", c: "#ba68c8" },
      { label: "میراث ملی شدن نفت", c: "#4fc3f7" },
    ],

    ideolEyebrow: "مصدقیسم — بنیاد ایدئولوژیک",
    ideolTitle: "۷۵ سال ناسیونالیسم مدنی، لیبرالیسم سکولار و زخم ۱۹۵۳",
    ideolIntro: "ایدئولوژی جبهه ملی از تاریخش جدایی‌ناپذیر است. 'مصدقیسم' صرفاً یک نام نیست — یک فلسفه سیاسی کامل است که در سه تعهد به‌هم‌پیوسته لنگر انداخته است.",

    mosaddeghism: {
      title: "سه ستون مصدقیسم",
      color: "#e8c840",
      items: [
        "ناسیونالیسم مدنی — حاکمیت ایران به شهروندانش تعلق دارد، نه به یک سلسله، طبقه روحانی یا قدرت خارجی. دولت ایران ملک مردم ایران است.",
        "لیبرالیسم سکولار — حاکمیت یک حق مدنی است. دستگاه دولتی نسبت به وابستگی مذهبی کاملاً کور است. هیچ نهاد مذهبی هیچ اقتدار سیاسی ندارد.",
        "سوشیال دموکراسی — دموکراسی سیاسی بدون برابری اقتصادی غیرممکن است. دولت موظف است رفاه اجتماعی همگانی ارائه دهد، حقوق کارگری را حمایت کند و اطمینان حاصل کند که منابع ملی به مردم خدمت می‌کنند — نه یک نخبگان نظامی‌شده.",
        "کودتای CIA/MI6 در ۱۹۵۳ که مصدق را سرنگون کرد و ملی شدن نفت را معکوس کرد تروما محوری است",
        "جبهه ملی تنها سازمان اپوزیسیون ایرانی بزرگی است که فعالانه هم با سلطنت پهلوی و هم با جمهوری اسلامی مخالفت کرده است",
      ],
    },

    monarchyCaveat: {
      title: "استثنای سلطنت — یک یادداشت تاریخی",
      color: "#ff9a42",
      items: [
        "تاریخاً (۱۹۴۹–۱۹۷۹): جبهه ملی در چارچوب قانون اساسی مشروطه ۱۳۸۵ عمل می‌کرد و گاهی یک سلطنت مشروطه کاملاً نمادین و غیرحاکم را تحمل می‌کرد — مشروط بر اینکه پارلمان قدرت عالی مطلق داشته باشد",
        "شرط صریح بود: پادشاه سلطنت می‌کند اما حکومت نمی‌کند — مانند مدل سوئد یا انگلیس",
        "تروما پس از ۱۹۷۹: تجربه تمرکز قدرت خمینی و تصرف استبدادی انقلاب توسط دستگاه روحانی موضع جبهه ملی را به طور دائمی سخت‌تر کرد",
        "موضع معاصر (۲۰۲۳–۲۰۲۶): رهبری اجرایی و ادغام همگامی نشان‌دهنده یک تحول قطعی به سوی جمهوری دموکراتیک سکولار خالص است",
        "در مورد گزینه نمادین سلطنت به عنوان یک احتمال نظری درهای کاملاً بسته نیست — اما بیانیه‌های کنونی قوی‌اً و صراحتاً جمهوری را ترجیح می‌دهند",
      ],
    },

    ideologyEvolution: [
      { component: "مدل حاکمیت", old: "تحمل سلطنت مشروطه نمادین؛ تأکید بر قانون اساسی ۱۲۸۵", new: "جمهوری دموکراتیک سکولار سختگیرانه؛ رد مطلق حکومت مادام‌العمر/موروثی" },
      { component: "نقش دین", old: "لیبرالیسم اسلامی تحمل می‌شد؛ ائتلاف گسترده با روحانیان دموکرات", new: "جدایی کامل دین از دولت؛ قانون مدنی سکولار" },
      { component: "حاکمیت ملی", old: "ضدامپریالیسم؛ ملی شدن صنعت نفت", new: "رد تمام مداخلات خارجی؛ کنترل حاکمیتی بر تمام منابع ملی" },
      { component: "حقوق بشر", old: "ناسیونالیسم مدنی؛ ضدفئودالیسم", new: "اعلامیه جهانی حقوق بشر؛ حقوق زنان و برابری LGBTQ صراحتاً گنجانده شده" },
    ],

    coup1953: {
      title: "زخم ۱۹۵۳ — چگونه یک کودتا ۷۰ سال بعد یک طرح را شکل می‌دهد",
      items: [
        "۱۹ اوت ۱۹۵۳: CIA (عملیات AJAX) و MI6 (عملیات Boot) یک کودتا علیه نخست‌وزیر محمد مصدق طراحی می‌کنند — ملی شدن صنعت نفت ایران را معکوس می‌کنند",
        "شاه به قدرت مطلق بازمی‌گردد. مصدق زندانی سپس تا مرگش در ۱۳۴۶ تحت حصر خانگی قرار می‌گیرد",
        "تمام معماری سیاست خارجی جبهه ملی از این رویداد واحد جاری می‌شود:",
        "→ استقلال سختگیرانه از هژمونی خارجی — هم غربی و هم شرقی",
        "→ رد مطلق هر مدل گذاری که توسط قدرت‌های خارجی طراحی شده باشد",
        "→ حاکمیت ملت ایران غیرقابل مذاکره است — حتی از 'کمک‌رسانان' خارجی خیرخواه",
        "→ منابع طبیعی ایران باید زیر کنترل حاکمیتی ایران باقی بمانند",
        "این موضع ضدامپریالیستی با موضع همگامی ۲۰۲۳ درباره روابط عادی با آمریکا و اسرائیل همزیستی دارد — تمایز: عادی‌سازی بر اساس احترام متقابل، نه تبعیت",
      ],
    },

    methEyebrow: "روش‌شناسی — مسیر به سوی هدف",
    methTitle: "نیروی اجتماعی، صدا، فشار و ترک‌های بالا",
    methIntro: "استراتژی گذار جبهه ملی به طور منحصربه‌فردی زیر مفاهیم نام‌گذاری‌شده خود نظریه‌پردازی شده است. دو مکانیزم که یک اثر (شکاف نخبگان) ایجاد می‌کنند که یک نتیجه (فروپاشی غیرخشونت‌آمیز) تولید می‌کند.",

    voicePressure: [
      { icon: "📢", label: "صدا", title: "بسیج مداوم پایه", color: "#e8c840", items: ["اعتراضات خیابانی مداوم و نافرمانی مدنی — پیوسته، نه دوره‌ای", "بسیج بخش‌های جمعیتی با انگیزه بالا: زنان، جوانان، اقلیت‌های قومی", "در درجه اول توسط جنبش انقلابی 'زن، زندگی، آزادی' هدایت می‌شود", "هدف: حفظ یک حضور دائمی قابل مشاهده که از دست دادن مشروعیت رژیم را نشان می‌دهد"] },
      { icon: "⚒️", label: "فشار", title: "فرسایش اقتصادی محاسبه‌شده", color: "#69d98c", items: ["اعتصابات کارگری ملی در بخش‌های حیاتی: صنعت نفت (حیاتی‌ترین)، حمل‌ونقل، معلمان، بازاریان", "تعطیلی بازار — بستن مغازه‌ها توسط طبقه تاجران سنتی یک سیگنال تاریخاً قطعی در سیاست ایرانی است", "تحریم‌های اقتصادی گسترده", "هدف: غیرقابل‌اداره کردن کشور — درآمدهای دولتی فرو می‌ریزند، خدمات شکست می‌خورند، وفاداری بوروکراتیک فرسوده می‌شود"] },
    ],

    topCracks: {
      title: "استراتژی 'ترک‌های بالا' — شکستن نخبگان از درون",
      items: [
        "اثر ترکیبی صدا + فشار برای تولید یک پدیده درونی خاص طراحی شده است: 'ترک‌های بالا'",
        "ترک‌های بالا = شکاف‌های ایدئولوژیک و عملیاتی در رهبری نخبگان و دستگاه امنیتی رژیم",
        "وقتی دولت به اندازه کافی فلج شود: بوروکرات‌ها محاسبه می‌کنند که رژیم نمی‌تواند بقا داشته باشد → فرار می‌کنند",
        "وقتی دولت به اندازه کافی فلج شود: ارتش محاسبه می‌کند که شلیک به غیرنظامیان مشروعیت خود را نابود می‌کند → از دستورات امتناع می‌کند",
        "فرار ارتش رویداد نهایی است — جبهه ملی محاسبه می‌کند که بدون ارتش رسمی، سپاه و بسیج نمی‌توانند سرکوب گروهی را ادامه دهند",
        "تمام استراتژی به یک آستانه واحد بستگی دارد: لحظه‌ای که ارتش در یک قیام توده‌وار بحرانی کناره‌گیری می‌کند یا فرار می‌کند",
      ],
    },

    rejections: {
      title: "مکانیزم‌های صراحتاً ممنوع",
      color: "#ef5350",
      items: [
        "شورش مسلحانه و جنگ چریکی — ذاتاً برای گذار دموکراتیک مخرب تلقی می‌شود",
        "مداخله نظامی خارجی و حملات نظامی خارجی — صرف نظر از هدف، نقض حاکمیت ایرانی محکوم می‌شود",
        "ساخت 'جایگزین' توسط خارجی‌ها — تروما ۱۹۵۳ این را یک خط قرمز مطلق می‌کند",
        "تحلیل جبهه ملی: خشونت نظامی و حملات خارجی دستگاه امنیتی داخلی را تقویت می‌کنند و بالکانیزاسیون را دعوت می‌کنند",
        "تحلیل جبهه ملی: مداخله خارجی یک نوع دیکتاتوری را با دیکتاتوری دیگری جایگزین می‌کند — تاریخاً توسط ۱۹۵۳ تأیید شده",
      ],
    },

    phasesEyebrow: "جدول زمانی گذار پنج مرحله‌ای",
    phasesTitle: "از مقاومت مدنی به جمهوری قانون اساسی",
    phasesIntro: "یک گذار مرحله‌ای ساختارمند پس از سقوط رژیم. توجه: برخلاف طرح ۶ مرحله‌ای ITC با شمارش روزهای مشخص، جبهه ملی مدت دقیق مرحله موقت را مشخص نمی‌کند.",

    phases: [
      { number: "۰۱", phase: "مقاومت مدنی (در جریان)", mechanism: "اعتراضات خیابانی (صدا) + اعتصابات کارگری/بازار (فشار)", objective: "فلج کردن اقتصاد دولتی؛ شکستن رهبری نخبگان؛ تشویق فرار ارتش", color: "#e8c840" },
      { number: "۰۲", phase: "سقوط رژیم", mechanism: "تسلیم غیرخشونت‌آمیز سیستم ولایت فقیه", objective: "جلوگیری از جنگ داخلی و مداخله خارجی؛ تأمین زیرساخت‌های حیاتی ملی", color: "#69d98c" },
      { number: "۰۳", phase: "حاکمیت موقت", mechanism: "تشکیل شورای موقت گذار از نیروهای دموکراتیک سکولار متنوع", objective: "مدیریت اداره روزانه دولتی؛ برچیدن سپاه/بسیج؛ حفظ نظم بدون تمرکز اقتدارگرایانه", color: "#4fc3f7" },
      { number: "۰۴", phase: "انتخابات مجلس مؤسسان", mechanism: "انتخابات ملی آزاد، منصفانه و شفاف برای مجلس مؤسسان", objective: "تهیه یک قانون اساسی دموکراتیک سکولار جدید بر اساس حقوق بشر جهانی", color: "#ff9a42" },
      { number: "۰۵", phase: "همه‌پرسی دموکراتیک", mechanism: "رفراندوم ملی درباره قانون اساسی تهیه‌شده", objective: "تصویب قانون اساسی؛ راه‌اندازی رسمی جمهوری دموکراتیک سکولار ایران", color: "#ba68c8" },
    ],

    transitionCouncilNote: "شورای موقت گذار جبهه ملی جایگزین صریح مدل 'فاز اضطراری' NUFDI/پهلوی است. جبهه ملی صراحتاً هر گذاری را که تحت یک رهبر منفرد غیرمنتخب متمرکز باشد رد می‌کند.",

    powerEyebrow: "ساختار قدرت پیشنهادی",
    powerTitle: "جمهوری پارلمانی سکولار — سه قوه مستقل",
    powerIntro: "ساختار قدرت جبهه ملی کلاسیک‌ترین جمهوری از تمام طرح‌های اپوزیسیون ایرانی است. مستقیماً بر مدل‌های دموکراتیک پارلمانی غربی استاندارد منطبق است — عمداً. دموکراسی مصدق در ۱۳۳۰–۱۳۳۲ پارلمانی بود. طرح آن مدل را بازیابی و مدرنیزه می‌کند.",

    powerNodes: [
      { icon: "🗳️", title: "رأی‌دهندگان", role: "اقتدار حاکمیتی ارشد", color: "#e8c840", items: ["حاکمیت نهایی در شهروندان ایران است — از طریق رأی همگانی و رفراندوم‌های ملی اعمال می‌شود", "هیچ رهبر معظم، پادشاه حاکم یا شوراهای نظارتی غیرمنتخب وجود ندارد — همه لغو شده‌اند", "اصل تناوب قدرت سختگیرانه: محدودیت دوره برای هر دو پارلمان و ریاست‌جمهوری"] },
      { icon: "🏛️", title: "مجلس ملی", role: "قوه مقننه — اقتدار قانونگذاری عالی", color: "#4fc3f7", items: ["مستقیماً توسط رأی‌دهندگان انتخاب می‌شود", "اقتدار قانونگذاری عالی و نظارت بر قوه مجریه", "نظارت بر بودجه ملی و تمام عملیات دولتی", "هیچ نهاد روحانی موازی، شورای نگهبان یا مجلس خبرگان در این معماری وجود ندارد"] },
      { icon: "⚙️", title: "رئیس‌جمهور + هیئت دولت", role: "قوه مجریه — عملیات روزانه دولتی", color: "#69d98c", items: ["رئیس‌جمهور مستقیماً توسط رأی‌دهندگان انتخاب می‌شود", "هیئت دولت توسط رئیس‌جمهور منصوب و توسط مجلس تأیید می‌شود", "حاکمیت بر اساس شایسته‌سالاری و تخصص — از تمام فیلترهای مذهبی یا ایدئولوژیک پاک شده", "کاملاً پاسخگو در برابر مجلس"] },
      { icon: "⚖️", title: "قوه قضاییه مستقل", role: "قوه قضاییه — فقط قانون مدنی سکولار", color: "#ff9a42", items: ["کاملاً مستقل از هر دو قوه مجریه و مقننه", "انتصابات: متخصصان حقوقی مستقل بر اساس شایسته‌سالاری قانون مدنی سکولار", "الغای کامل مجازات اعدام؛ ممنوعیت قطعی شکنجه", "کاملاً از فقه مذهبی جدا شده"] },
      { icon: "🗺️", title: "شوراهای استانی/بخشی/روستایی", role: "غیرمتمرکزسازی اداری — نه فدرالیسم", color: "#ba68c8", items: ["مستقیماً توسط شهروندان محلی انتخاب می‌شوند", "مدیریت: امور اداری محلی، توسعه اقتصادی منطقه‌ای، زیرساخت، حفاظت فرهنگی", "تابع قانون اساسی ملی و قانون پارلمانی مرکزی", "این غیرمتمرکزسازی اداری است — پارلمان و مجریه مرکزی اقتدار حاکمیتی نهایی را حفظ می‌کنند", "جبهه ملی صراحتاً و شدیداً فدرالیسم قومی-زبانی را رد می‌کند — آن را پیش‌ساز خطرناک بالکانیزاسیون می‌داند"] },
    ],

    instEyebrow: "سیاست هدف‌گیری نهادی",
    instTitle: "تمایزات تیز — ریشه‌کن کردن در مقابل اصلاح",
    instIntro: "جبهه ملی یک تمایز معماری تیز بین نهادهایی که وظایف ملی لازم را انجام می‌دهند (اصلاح شده) و نهادهایی که صرفاً برای حفاظت و ثروت‌بخشی به تئوکراسی ایجاد شده‌اند (ریشه‌کن شده) قائل می‌شود.",

    instRows: [
      { institution: "سپاه + بسیج", status: "انحلال کامل", statusColor: "#ef5350", action: "ریشه‌کنی قانونی و نمادین. تمام دارایی‌های اقتصادی مصادره (قرارگاه خاتم‌الانبیا و تمام انحصارهای سپاه). قوانین جدید برای ممنوعیت دائمی هر مداخله نظامی/شبه‌نظامی در سیاست غیرنظامی یا اقتصاد." },
      { institution: "ارتش (نیروهای رسمی)", status: "اصلاح و استفاده", statusColor: "#69d98c", action: "به عنوان تنها نیروی دفاع ملی حفظ می‌شود. با پروتکل‌های جدید جذب نیرو بازسازی می‌شود. به طور سختگیرانه تابع وزارت دفاع غیرنظامی. تحت نظارت مطلق پارلمانی قرار می‌گیرد." },
      { institution: "دادگاه‌های روحانی + انقلابی", status: "کاملاً برچیده شده", statusColor: "#ef5350", action: "ریشه‌کنی کامل دادگاه ویژه روحانیت و دادگاه‌های انقلاب اسلامی. با قوه قضاییه مدنی سکولار و مستقل جایگزین می‌شود." },
      { institution: "بنیادها (بنیادهای مذهبی)", status: "مصادره شده", statusColor: "#ff9a42", action: "به عنوان انحصارهای مستقل معاف از مالیات برچیده می‌شوند. دارایی‌ها در اقتصاد ملی رسمی و مالیات‌دهنده برای برنامه‌های رفاه اجتماعی و توسعه زیرساخت ادغام می‌شوند." },
      { institution: "وزارتخانه‌های غیرنظامی", status: "پاکسازی و اصلاح", statusColor: "#4fc3f7", action: "حفظ اما پاکسازی تمام منصوبان ایدئولوژیک. بازسازی بر اساس شایسته‌سالاری، تخصص و نظارت مستقل رسانه‌ای/صنفی." },
    ],

    polEyebrow: "مواضع سیاستی کلیدی",
    polTitle: "ماتریس سیاست چهار حوزه‌ای",
    polIntro: "سیاست‌های جبهه ملی آنچه را که ائتلاف 'مگابحران' می‌نامد هدف قرار می‌دهند — یک همگرایی فاجعه‌بار ویرانی اقتصادی، فروپاشی زیست‌محیطی، انزوای بین‌المللی و نقض فاحش حقوق بشر.",

    policies: [
      { icon: "📊", title: "اقتصاد: از دولت رانتیر به تولید رقابتی", color: "#e8c840", items: ["رد سیستم موجود: اقتصاد فاسد، غیررقابتی، 'رانت‌خوار' تحت سیطره باندهای مافیایی ایدئولوژیک و کنگلومراهای نظامی", "گذار به: اقتصاد رقابتی تولیدمحور با فناوری مدرن، سرمایه‌گذاری خارجی، ادغام با بازار جهانی", "اما: توسط سیاست‌های رفاه اجتماعی قوی متوازن می‌شود — بیمه اجتماعی همگانی، آموزش رایگان، مسکن و بیمه سلامت همگانی", "میراث مصدق — ملی کردن منابع طبیعی محوری: نفت، گاز، معادن زیر کنترل حاکمیتی ایران باقی می‌مانند", "بحران زیست‌محیطی به اولویت امنیت ملی درجه اول ارتقا یافته — خشکسالی، کاهش سطح آب‌های زیرزمینی و آلودگی شدید صراحتاً نام برده شده"] },
      { icon: "🗺️", title: "اقلیت‌ها: غیرمتمرکزسازی اداری در مقابل فدرالیسم", color: "#ba68c8", items: ["جبهه ملی شدیداً میهن‌پرستانه است — حفظ مطلق و غیرقابل مذاکره تمامیت ارضی ایران", "صراحتاً و شدیداً فدرالیسم قومی-زبانی را رد می‌کند — آن را پیشاهنگ خطرناک بالکانیزاسیون می‌داند", "به جای آن: غیرمتمرکزسازی اداری ساختارمند — شوراهای منتخب در سطوح روستا، بخش و استان", "فارسی (فارسی) به عنوان تنها زبان رسمی، آموزشی و مشترک دولتی باقی می‌ماند", "همه زبان‌های منطقه‌ای (کردی، بلوچی، آذری) به عنوان 'میراث فرهنگی' ترویج و حمایت می‌شوند", "این موضع مستقیماً با خواسته‌های فدرالیستی CPFIK تعارض دارد — جبهه ملی را در مسیر تصادم بالقوه با سازمان‌های اقلیت قومی پس از گذار قرار می‌دهد"] },
      { icon: "⚖️", title: "عدالت: عدالت انتقالی بدون انتقام", color: "#69d98c", items: ["صراحتاً پاکسازی کلی، اعدام‌های انقلابی و مجازات سیاسی را رد می‌کند", "بر اساس فرض بی‌گناهی عمل می‌کند", "الغای کامل مجازات اعدام به عنوان مجازات قضایی", "ممنوعیت قطعی شکنجه", "اعضای سابق رژیم از طریق دادگاه‌های سکولار مستقل و منصفانه پیگرد می‌شوند — نه عدالت قضاوت جمعی", "تمرکز بر پاسخگویی فردی برای جرایم قابل اثبات مشخص — نه گناه جمعی بر اساس عضویت سازمانی"] },
      { icon: "🌍", title: "سیاست خارجی: استقلال، عادی‌سازی و عدم اشاعه", color: "#4fc3f7", items: ["اصل اساسی تغییرناپذیر: استقلال سختگیرانه از هژمونی خارجی — هم غربی و هم شرقی", "کودتای ۱۹۵۳ مداخله خارجی را یک خط قرمز مطلق می‌کند صرف نظر از جهت یا هدف", "اما: از روابط صلح‌آمیز و عادی با تمام کشورهای عضو سازمان ملل دفاع می‌کند", "روابط عادی با ایالات متحده و اسرائیل صراحتاً ذکر شده", "ممنوعیت و نابودی سلاح‌های کشتار جمعی — عدم اشاعه هسته‌ای", "پیشنهاد کنسرسیوم هسته‌ای منطقه‌ای (موسویان) — پیشرفته‌ترین موضع هسته‌ای از هر طرح اپوزیسیون ایرانی"] },
    ],

    assessEyebrow: "ارزیابی استراتژیک",
    assessTitle: "بزرگترین آسیب‌پذیری واحد",
    assessIntro: "طرح جبهه ملی بالغ‌ترین نهادی و مشروع‌ترین از نظر تاریخی از تمام طرح‌های اپوزیسیون ایرانی است. اما شامل یک وابستگی ساختاری واحد است که همزمان بزرگترین نقطه قوت و بزرگترین ریسک آن است.",

    dependency: {
      title: "آستانه فرار ارتش",
      color: "#ef5350",
      text: "تمام روش‌شناسی گذار — صدا، فشار، استراتژی ترک‌های بالا — نهایتاً مشروط به یک رویداد است: کناره‌گیری یا فرار ارتش در طول یک قیام توده‌وار بحرانی. جبهه ملی سختگیرانه شورش مسلحانه و مداخله نظامی خارجی را ممنوع می‌کند. این یعنی اگر ارتش فرار نکند، گذار نمی‌تواند از مسیر تجویزی جبهه ملی پیش برود.",
    },

    strengths: {
      title: "نقاط قوت ساختاری",
      color: "#e8c840",
      items: [
        "۷۵ سال مشروعیت نهادی — تنها سازمان اپوزیسیون ایرانی با ارتباط تاریخی مستقیم با یک دولت دموکراتیک در حال کار (۱۳۳۰–۱۳۳۲)",
        "اعتبار 'دست‌های پاک': فعالانه هم با سلطنت پهلوی و هم با جمهوری اسلامی مخالفت کرده است",
        "ادغام ائتلاف همگامی مشروعیت تاریخی جبهه ملی را به زیرساخت سازمانی مدرن URI متصل می‌کند",
        "مدل شورای موقت گذار از مشکل تمرکز یک رهبر که سایر طرح‌های گذار نشان می‌دهند اجتناب می‌کند",
        "پیشنهاد کنسرسیوم هسته‌ای (موسویان) معتبرترین موضع هسته‌ای بین‌المللی هر طرح اپوزیسیون ایرانی است",
      ],
    },
    weaknesses: {
      title: "آسیب‌پذیری‌های ساختاری",
      color: "#ef5350",
      items: [
        "تمام استراتژی گذار به آستانه فرار ارتش بستگی دارد — اگر ارتش فرار نکند، استراتژی بازگشتی نظامی ندارد",
        "موضع ضدفدرالیسم سختگیرانه یک مسیر تصادم پس از گذار با CPFIK (ائتلاف کردی) و سایر سازمان‌های اقلیت قومی ایجاد می‌کند",
        "استثنای سلطنت ابهام پیوسته‌ای ایجاد می‌کند — برخی اعضای جبهه ملی هنوز سلطنت نمادین را تحمل می‌کنند",
        "محکومیت جبهه ملی از حملات نظامی خارجی علیه ایران (حتی علیه رژیم) آن را با واقعیت ژئوپلیتیک ۲۰۲۶ در تضاد قرار می‌دهد",
        "جدول زمانی گذار نامشخص — برخلاف طرح ۱۸۰ روزه ITC، فقدان جدول زمانی مشخص ریسک‌های هماهنگی در طول خلاء قدرت ایجاد می‌کند",
      ],
    },

    conclusion: "«طرح جبهه ملی ایران یک مدل حاکمیتی بسیار پایدار و از نظر نهادی انعطاف‌پذیر ارائه می‌دهد. با انحلال فوری شبه‌نظامیان ایدئولوژیک موازی، سکولارسازی دستگاه قضایی و اجرای یک اقتصاد رقابتی با حمایت اجتماعی، طرح نظری آینده دولت را هم در برابر بازگشت به استبداد روحانی و هم در برابر عود دیکتاتوری سلسله‌ای واکسینه می‌کند.» — نتیجه‌گیری سیستمی طرح جبهه ملی",

    source: "منبع: اساسنامه جبهه ملی ایران ۲۰۱۵ · اصول بنیادی ائتلاف همگامی ۲۰۲۳ · جبهه ملی ایران · تأسیس ۱۹۴۹ توسط دکتر محمد مصدق · رهبری کنونی: سید حسین موسویان (رئیس شورای مرکزی)، محسن فرشاد (سخنگو)",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function JMIPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const GOLD = "#e8c840", CYAN = "#4fc3f7", GREEN = "#69d98c",
    ORANGE = "#ff9a42", RED = "#ef5350", PURPLE = "#ba68c8";

  return (
    <div className="jmi-page" dir={dir}>
      <ParticleGrid />
      <div className="jmi-scanline" />
      <div className="jmi-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="jmi-hero">
          <p className="jmi-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="jmi-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="jmi-hero-desc">{d.heroDesc}</p>
          <div className="jmi-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="jmi-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── IDEOLOGY ── */}
        <SecHead eyebrow={d.ideolEyebrow} title={d.ideolTitle} intro={d.ideolIntro} color={GOLD} />

        <div className="jmi-ideo-grid">
          <Accordion title={d.mosaddeghism.title} color={GOLD} defaultOpen>
            <Bullets items={d.mosaddeghism.items} color={GOLD} />
          </Accordion>
          <Accordion title={d.monarchyCaveat.title} color={ORANGE}>
            <Bullets items={d.monarchyCaveat.items} color={ORANGE} />
          </Accordion>
        </div>

        <IdeologyEvolution rows={d.ideologyEvolution} />

        <Accordion title={d.coup1953.title} color={RED}>
          <Bullets items={d.coup1953.items} color={RED} />
        </Accordion>

        <div className="jmi-divider" />

        {/* ── METHODOLOGY ── */}
        <SecHead eyebrow={d.methEyebrow} title={d.methTitle} intro={d.methIntro} color={GREEN} />

        <div className="jmi-mech-grid">
          {d.voicePressure.map((m, i) => (
            <MechanismCard key={i} {...m} />
          ))}
        </div>

        <Accordion title={d.topCracks.title} color={GOLD} defaultOpen>
          <Bullets items={d.topCracks.items} color={GOLD} />
        </Accordion>

        <Accordion title={d.rejections.title} color={RED}>
          <Bullets items={d.rejections.items} color={RED} />
        </Accordion>

        <div className="jmi-divider" />

        {/* ── 5 PHASES ── */}
        <SecHead eyebrow={d.phasesEyebrow} title={d.phasesTitle} intro={d.phasesIntro} color={GOLD} />

        <div className="jmi-phases">
          {d.phases.map((ph, i) => (
            <PhaseRow key={i} {...ph} />
          ))}
        </div>

        <div className="jmi-transition-note" style={{ borderColor: `${CYAN}28` }}>
          <span className="jmi-transition-tag" style={{ color: CYAN }}>{isRTL ? "یادداشت شورای گذار" : "TRANSITION COUNCIL NOTE"}</span>
          <span>{d.transitionCouncilNote}</span>
        </div>

        <div className="jmi-divider" />

        {/* ── POWER STRUCTURE ── */}
        <SecHead eyebrow={d.powerEyebrow} title={d.powerTitle} intro={d.powerIntro} color={GOLD} />

        <div className="jmi-power-grid">
          {d.powerNodes.map((node, i) => (
            <PowerNode key={i} {...node} />
          ))}
        </div>

        <div className="jmi-divider" />

        {/* ── INSTITUTIONAL TARGETS ── */}
        <SecHead eyebrow={d.instEyebrow} title={d.instTitle} intro={d.instIntro} color={ORANGE} />

        <div className="jmi-inst-table">
          <div className="jmi-inst-head">
            <span>{isRTL ? "نهاد" : "Institution"}</span>
            <span>{isRTL ? "سیاست" : "Policy"}</span>
            <span>{isRTL ? "اقدام" : "Action"}</span>
          </div>
          {d.instRows.map((r, i) => (
            <InstRow key={i} {...r} />
          ))}
        </div>

        <div className="jmi-divider" />

        {/* ── KEY POLICIES ── */}
        <SecHead eyebrow={d.polEyebrow} title={d.polTitle} intro={d.polIntro} color={CYAN} />

        <div className="jmi-pol-grid">
          {d.policies.map((p, i) => (
            <PolicyCard key={i} icon={p.icon} title={p.title} color={p.color}>
              <Bullets items={p.items} color={p.color} />
            </PolicyCard>
          ))}
        </div>

        <div className="jmi-divider" />

        {/* ── STRATEGIC ASSESSMENT ── */}
        <SecHead eyebrow={d.assessEyebrow} title={d.assessTitle} intro={d.assessIntro} color={GOLD} />

        <div className="jmi-dependency" style={{ borderColor: `${RED}30` }}>
          <div className="jmi-dependency-title" style={{ color: RED }}>{d.dependency.title}</div>
          <div className="jmi-dependency-text">{d.dependency.text}</div>
        </div>

        <div className="jmi-assess-grid">
          <div className="jmi-assess-card" style={{ borderColor: `${GOLD}25` }}>
            <div className="jmi-assess-title" style={{ color: GOLD }}>{d.strengths.title}</div>
            <Bullets items={d.strengths.items} color={GOLD} />
          </div>
          <div className="jmi-assess-card" style={{ borderColor: `${RED}25` }}>
            <div className="jmi-assess-title" style={{ color: RED }}>{d.weaknesses.title}</div>
            <Bullets items={d.weaknesses.items} color={RED} />
          </div>
        </div>

        <div className="jmi-conclusion" style={{ fontFamily: ff }}>
          <span className="jmi-conclusion-mark" style={{ color: GOLD }}>❝</span>
          <span>{d.conclusion}</span>
        </div>

        <p className="jmi-source">{d.source}</p>

        <nav className="jmi-footer-nav">
          <Link to="/plans" className="jmi-footer-nav-link">
            {isRTL ? '← همه طرح‌های انتقالی' : '← All Transitional Plans'}
          </Link>
          <Link to="/arena" className="jmi-footer-nav-link jmi-footer-nav-link--secondary">
            {isRTL ? 'آرنا — تأیید طرح‌ها ←' : 'Arena — Endorse Plans →'}
          </Link>
        </nav>

      </div>
    </div>
  );
}
