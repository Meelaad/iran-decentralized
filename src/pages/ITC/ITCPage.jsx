import React, { useRef, useEffect, useState } from "react";
import { useLang } from "../../contexts/LangContext";
import "./ITCPage.css";

/* ─────────────────────────────────────────────────────
   Animated particle background — violet palette
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
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124,114,232,${(1 - dist / 180) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,114,232,${0.1 + p * 0.15})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="itc-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="itc-acc" style={{ "--c": color || "#7c72e8" }}>
      <button className="itc-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="itc-acc-title">{title}</span>
        {subtitle && <span className="itc-acc-subtitle">{subtitle}</span>}
        <span className="itc-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="itc-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="itc-bullets">
      {items.map((it, i) => (
        <li key={i} className="itc-bullet-item">
          <span className="itc-bullet-dot" style={{ background: color || "#7c72e8" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="itc-sechead">
      {eyebrow && <div className="itc-sechead-eyebrow" style={{ color }}>{eyebrow}</div>}
      {title && <h2 className="itc-sechead-title">{title}</h2>}
      {intro && <p className="itc-sechead-intro">{intro}</p>}
    </div>
  );
}

function LeaderCard({ name, role, domain, value, color, note }) {
  return (
    <div className="itc-leader-card" style={{ borderColor: `${color}28` }}>
      <div className="itc-leader-name" style={{ color }}>{name}</div>
      <div className="itc-leader-role">{role}</div>
      <div className="itc-leader-domain">{domain}</div>
      <div className="itc-leader-value">{value}</div>
      {note && <div className="itc-leader-note">{note}</div>}
    </div>
  );
}

function PhaseRow({ number, phase, priority, authority, color, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="itc-phase-row" style={{ "--pr": color }}>
      <div className="itc-phase-row-head" onClick={() => setOpen(o => !o)}>
        <span className="itc-phase-n">{number}</span>
        <div className="itc-phase-info">
          <span className="itc-phase-name">{phase}</span>
          <span className="itc-phase-auth">{authority}</span>
        </div>
        <span className="itc-phase-priority">{priority}</span>
        <span className="itc-phase-caret">{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="itc-phase-row-body">{children}</div>}
    </div>
  );
}

function InstitutionCard({ icon, title, sub, policy, implication, color, note }) {
  return (
    <div className="itc-inst-card" style={{ borderColor: `${color}28` }}>
      <div className="itc-inst-icon">{icon}</div>
      <div className="itc-inst-title" style={{ color }}>{title}</div>
      <div className="itc-inst-sub">{sub}</div>
      <div className="itc-inst-section-label">{policy.label}</div>
      <div className="itc-inst-text">{policy.text}</div>
      <div className="itc-inst-section-label itc-inst-imp-label">{implication.label}</div>
      <div className="itc-inst-text">{implication.text}</div>
      {note && (
        <div className="itc-inst-note">
          <span className="itc-inst-note-tag">ANALYTICAL NOTE</span>
          {note}
        </div>
      )}
    </div>
  );
}

function PolicyCard({ icon, title, color, children }) {
  return (
    <div className="itc-pol-card" style={{ borderColor: `${color}28` }}>
      <div className="itc-pol-icon">{icon}</div>
      <div className="itc-pol-title" style={{ color }}>{title}</div>
      <div className="itc-pol-body">{children}</div>
    </div>
  );
}

function SynthCard({ number, title, body, color }) {
  return (
    <div className="itc-synth-card" style={{ borderColor: `${color}28` }}>
      <div className="itc-synth-n" style={{ color }}>{number}</div>
      <div className="itc-synth-title">{title}</div>
      <div className="itc-synth-body">{body}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "Iran Transition Council (ITC) · Launched September 2019 · Secular Democratic Federalist Blueprint",
    heroTitle: "Systems Architecture for State Transition",
    heroDesc: "The ITC is not an ideological opposition group — it is a meticulously engineered shadow government and logistical planning unit. Launched in September 2019, its architecture is designed to absorb the shock of regime collapse and manage the power vacuum that follows. This is not a utopian manifesto but a cold, calculated schematic for safely decommissioning a hostile theocratic state apparatus while simultaneously standing up a decentralized democratic replacement.",
    heroBadges: [
      { label: "Founded Sept 2019", c: "#7c72e8" },
      { label: "6-Phase Timeline", c: "#4fc3f7" },
      { label: "Ethno-Federalist", c: "#69d98c" },
      { label: "Technocratic Pragmatism", c: "#ffd166" },
      { label: "Shadow Government Design", c: "#ba68c8" },
      { label: "No Monarchy / No Theocracy", c: "#ef5350" },
    ],

    // ── END STATE + IDEOLOGY ──
    ideolEyebrow: "Absolute End State & Core Ideology",
    ideolTitle: "The Three Non-Negotiable Structural Commitments",
    ideolIntro: "The ITC's end state is precisely defined and explicitly bounded. It is not a monarchy, not a theocracy, not a socialist redistribution project, and not a secessionist movement. It is one specific thing: a secular, representative parliamentary democracy with a decentralized, ethno-federalist administrative architecture.",

    endState: [
      {
        icon: "🏛️",
        title: "Secular Parliamentary Democracy",
        color: "#7c72e8",
        items: [
          "Complete structural dismantling of the Islamic Republic's theocratic apparatus",
          "A secular state: strict neutrality toward all religious beliefs — no official state religion",
          "No national law may rely on religious decrees — religion is strictly a private matter",
          "Governance defined as a universal civil right, wholly independent of divine mandate or hereditary claims",
          "Three fully independent branches: legislative, executive, judicial",
          "Ultimate sovereignty resides exclusively with the electorate",
        ],
      },
      {
        icon: "🗺️",
        title: "Ethno-Federalist Decentralization",
        color: "#69d98c",
        items: [
          "Iran is not a homogeneous Persian nation — it is a diverse multi-ethnic state: Kurds, Baluch, Ahwazi Arabs, Turkmen, Azerbaijanis",
          "The ITC is identified as the ONLY major opposition organization that explicitly addresses an ethno-federal system",
          "Over-centralization and Persian-centric cultural assimilation are identified as root causes of systemic inequality",
          "True democracy is only achievable through a highly decentralized, federalist structure",
          "Equitable distribution of wealth, resources, and administrative power among all regional populations",
          "Right to mother-tongue education alongside official Persian — legally enshrined",
          "Locally elected provincial councils manage regional development budgets and cultural policy",
        ],
      },
      {
        icon: "⚖️",
        title: "UDHR-Anchored Legal Framework",
        color: "#ffd166",
        items: [
          "The Universal Declaration of Human Rights is the non-negotiable legal anchor of the entire framework",
          "Explicitly rejects: monarchy (absolute or constitutional), theocracy, socialist vanguardism, armed insurgency",
          "Explicitly rejects: regional separatism — territorial integrity of Iran is non-negotiable",
          "Governance is an inalienable civil right — not inherited, not divinely appointed, not awarded by military rank",
          "The new constitution must be ratified by popular national referendum — no provisional body can permanently alter the state's fundamental fabric",
          "Post-transition: all principal authorities installed via free, fair, and competitive democratic elections only",
        ],
      },
    ],

    // ── LEADERSHIP ──
    leaderEyebrow: "Leadership Architecture",
    leaderTitle: "The Seven-Node Coalition Command",
    leaderIntro: "To prevent the monopolization of the transition by a single faction — a flaw that reproduces authoritarian centralization — the ITC is architected as a broad, pluralistic umbrella coalition. Each leadership node covers a distinct operational domain, and the combination is specifically designed to bridge the Persian center with ethnic peripheries, domestic resistance with diaspora diplomacy, and civil society with insider intelligence.",

    leaders: [
      {
        name: "Hassan Shariatmadari",
        role: "Secretary-General · Apex Coordinator",
        domain: "Executive Oversight",
        color: "#7c72e8",
        value: "Son of Grand Ayatollah Mohammad Kazem Shariatmadari — the most prominent Ayatollah in Iran and a historic opponent of Khomeini's monopolization of power. His heritage provides the ITC with unassailable legitimacy against the clerical establishment, while he personally advocates for a secular republic.",
        note: "This combination — anti-Khomeinist clerical legitimacy + secular advocacy — is architecturally unique and addresses a core ITC challenge: credibility within Iran's religious culture.",
      },
      {
        name: "Abdullah Mohtadi",
        role: "Top Advisor · Regional Affairs Director",
        domain: "Kurdish & Ethnic Networks",
        color: "#69d98c",
        value: "Secretary General of the Komala Party of Iranian Kurdistan. His integration bridges the gap between the Persian-majority center and organized, historically armed Kurdish political factions — preempting ethnic fracturing during the transition. Converts a potential separatist actor into an invested stakeholder.",
        note: "Critical coalition-building masterstroke. Without Kurdish buy-in, the federalist architecture cannot function.",
      },
      {
        name: "Mohsen Sazegara",
        role: "Director for Civil Resistance",
        domain: "Security Intelligence",
        color: "#ef5350",
        value: "Original founding member of the Islamic Revolutionary Guard Corps (IRGC) — turned defector and opponent of the regime. Provides the ITC with unparalleled internal intelligence regarding the IRGC's operational mechanics, psychological vulnerabilities, and command structures.",
        note: "His presence implies the ITC possesses targeted intelligence operations aimed at fracturing the IRGC's command structure from within — even though IRGC dismantlement is 'not specified in official text.'",
      },
      {
        name: "Mehran Barati",
        role: "Vice Secretary-General",
        domain: "European Diplomacy",
        color: "#4fc3f7",
        value: "Prominent Iranian diaspora figure and former student leader operating out of Germany. Acts as a critical diplomatic bridge to European social democratic institutions — the EU is a key target for sanctions removal and international recognition.",
        note: null,
      },
      {
        name: "Shahriar Ahy",
        role: "Spokesperson & Board Member",
        domain: "Global Media & Psychological Operations",
        color: "#ba68c8",
        value: "Seasoned media executive — former CEO of AGI, managing assets including UPI and MBC. Responsible for shaping the ITC's global communications strategy and psychological operations targeting regime security forces.",
        note: null,
      },
      {
        name: "Kamal Azari",
        role: "Director of US Operations",
        domain: "Washington D.C. Lobbying",
        color: "#ffd166",
        value: "Directs geopolitical lobbying, diplomatic relations, and strategic communications in Washington D.C. Interfaces directly with US policymakers to build the international isolation framework around the regime. Operates via AF International LLC (registered under FARA).",
        note: null,
      },
      {
        name: "Yazdan Shohadaei",
        role: "Secretariat of Organizations & Communications",
        domain: "Civic Organization",
        color: "#ff9a42",
        value: "Manages internal coordination, civic resistance networks, civil society outreach, and the organizational infrastructure that connects ITC leadership to labor movements and grassroots resistance nodes inside Iran.",
        note: null,
      },
    ],

    // ── METHODOLOGY ──
    methEyebrow: "Pre-Collapse Methodology",
    methTitle: "The Three-Track Pressure Matrix",
    methIntro: "The ITC explicitly rejects foreign military intervention and internal armed insurgency. Its calculation: armed conflict would instantly trigger a Syrian-style civil war, destroying infrastructure and rendering democratic transition mathematically impossible. Instead, three parallel tracks apply simultaneous pressure.",

    tracks: [
      {
        icon: "⚒️",
        title: "Internal Civil Resistance",
        color: "#7c72e8",
        items: [
          "Non-violent civil disobedience as the primary operational mode",
          "Organized labor strikes targeting the petrochemical and oil sectors — crippling the regime's economic lifelines",
          "Grassroots network coordination via Yazdan Shohadaei's civic organization infrastructure",
          "Strategic paralysis of the state via coordinated sector-by-sector work stoppages",
          "Mohsen Sazegara disseminates strategic directives to internal resistance nodes",
        ],
      },
      {
        icon: "🌐",
        title: "External Diplomatic Isolation",
        color: "#4fc3f7",
        items: [
          "ITC is registered as a foreign principal via AF International LLC (FARA-registered)",
          "Active petitioning of UN Secretary General, WHO, EU High Representative",
          "Kamal Azari's Washington operation: lobbying US policymakers for targeted regime isolation",
          "Mehran Barati's European operation: engaging EU social democratic institutions",
          "Building a pre-legitimized diplomatic network ready to recognize the ITC as a provisional government upon collapse",
        ],
      },
      {
        icon: "🔓",
        title: "Security Force Defection Campaign",
        color: "#69d98c",
        items: [
          "Blanket amnesty offers broadcast to middle and lower ranks of the Artesh (conventional armed forces)",
          "Guaranteed integration into the new state's security architecture — offered in exchange for standing down",
          "The strategic logic: by drawing a line between the ideological apex (Supreme Leader, senior IRGC commanders) and the operational base (conscripts, mid-level officers), the ITC deprivates the regime of kinetic suppression capability",
          "Directly informed by the Iraq post-mortem: de-Baathification destroyed the Iraqi army and birthed insurgency — the ITC explicitly inverts this mistake",
          "Mohsen Sazegara's insider IRGC knowledge is applied here to identify the psychological fracture points",
        ],
      },
    ],

    // ── 6 PHASES ──
    phasesEyebrow: "The 6-Phase Transition Timeline",
    phasesTitle: "A Strictly Chronological, Managed Transition",
    phasesIntro: "The transition is not designed as an immediate, chaotic overthrow. The ITC blueprint dictates a strictly chronological sequence to manage the power vacuum and prevent societal collapse. The most critical design principle: during the emergency phase, contentious debates about the future state's exact structure are PROHIBITED — deferred to the Constituent Assembly to preserve coalition unity.",

    phases: [
      {
        number: "01",
        phase: "Pre-Collapse",
        priority: "Coalition building · Civil disobedience · Diplomatic isolation",
        authority: "Islamic Republic (Target)",
        color: "#7c72e8",
        items: [
          "Broad coalition building across all opposition factions",
          "Civil society strengthening and grassroots organizing inside Iran",
          "Intelligence gathering to fracture regime cohesion from within",
          "Diplomatic lobbying to align international actors against the Islamic Republic",
          "Pre-positioning of key ITC assets and contacts for rapid activation upon collapse",
        ],
      },
      {
        number: "02",
        phase: "Collapse & Power Vacuum",
        priority: "Technical administration · Utility maintenance · Military amnesty",
        authority: "ITC Provisional Government",
        color: "#ef5350",
        items: [
          "As the regime loses its monopoly on violence, the ITC immediately activates as a pre-planned shadow government",
          "Operational priority ABRUPTLY SHIFTS from political opposition to technical administration",
          "First 72 hours: secure continuity of water, electricity, and municipal services — this is the #1 priority",
          "Blanket amnesty offers to Artesh lower and middle ranks activated simultaneously",
          "Secure national borders to prevent opportunistic external interference",
          "The Mathematics of the Power Vacuum: if civilians have water and electricity, they do not turn to warlords",
        ],
      },
      {
        number: "03",
        phase: "Emergency Interim Period",
        priority: "Macro-stabilization · Sanctions removal · Deferred decisions",
        authority: "ITC Provisional Government",
        color: "#ff9a42",
        items: [
          "Duration: 100–180 days",
          "The Provisional Government (drawn from ITC + allied opposition coalitions) acts as a temporary, technocratic caretaker ONLY",
          "CRITICAL: The policy of DEFERRED FUNDAMENTAL DECISIONS — debates over the exact nature of the future state (federal vs. unitary, republic vs. constitutional monarchy) are STRICTLY PROHIBITED by the interim government",
          "This deferral is not ideological uncertainty — it is a calculated mechanism to preserve coalition unity during the most volatile window",
          "Economic triage: secure emergency international financial aid, stabilize the national currency, ensure food and medicine logistics",
          "International community lifts sanctions upon regime collapse — this is the economic lifeline the entire stabilization depends on",
          "Technical ministries (Water, Power, Municipal Services) continue operating seamlessly under Provisional Government caretakers",
        ],
      },
      {
        number: "04",
        phase: "Constituent Assembly Elections",
        priority: "Free, fair, competitive elections · Legal framework drafting",
        authority: "Constituent Assembly",
        color: "#ffd166",
        items: [
          "Once basic stability is achieved, the interim authority facilitates free, fair, and competitive national elections",
          "The Assembly is tasked SOLELY with drafting the new democratic constitution — no executive authority",
          "Composition determined by competitive national elections — all political factions may participate",
          "The DEFERRED FUNDAMENTAL DECISIONS from Phase 3 are now resolved here: federal structure, exact form of democratic government",
          "The Constituent Assembly cannot expand its own powers — strictly a drafting body",
          "Consults ethnic minority representatives, regional councils, civil society, and international democratic institutions",
        ],
      },
      {
        number: "05",
        phase: "Constitutional Referendum",
        priority: "Final popular ratification of the new constitution",
        authority: "National Electorate",
        color: "#69d98c",
        items: [
          "The drafted constitution is presented to the entire Iranian populace for a final, binding national vote",
          "No provisional body can permanently alter the fundamental fabric of the state — this referendum is the only legitimate source of constitutional authority",
          "Unrestricted public debate preceding the referendum across all media platforms",
          "International observation of the referendum process",
          "If rejected: Constituent Assembly revises and re-submits — no return to the old system",
        ],
      },
      {
        number: "06",
        phase: "Final Transfer of Power",
        priority: "Dissolution of all interim bodies · Full democratic handover",
        authority: "Elected National Parliament",
        color: "#4fc3f7",
        items: [
          "Upon ratification of the new constitution, the Provisional Government DISSOLVES ITSELF",
          "All executive and legislative authority transferred to the newly elected, permanent constitutional government",
          "The ITC ceases to exist as a governing entity — it was always designed as a temporary instrument",
          "Elected National Parliament and local provincial councils assume their permanent mandates",
          "The transition is complete: a secular, representative parliamentary democracy with decentralized ethno-federalist administration is operational",
        ],
      },
    ],

    // ── INSTITUTIONAL TARGETS ──
    instEyebrow: "Institutional Targeting Policy",
    instTitle: "Continuity Over Destruction — Learning from MENA Failures",
    instIntro: "The ITC explicitly studied the catastrophic consequences of total state dismantling in the MENA region. The ITC's institutional policy is built on the principle of INSTITUTIONAL CONTINUITY — not tabula rasa destruction. This distinguishes it sharply from both the Mousavi three-stage model and the Civil Society Charter's dissolution demands.",

    institutions: [
      {
        icon: "⚔️",
        title: "Artesh (Conventional Armed Forces)",
        sub: "Policy: Co-optation and Integration",
        color: "#69d98c",
        policy: {
          label: "POLICY STANCE",
          text: "Active targeting of lower and middle ranks with blanket amnesty offers + guaranteed integration into the new state's security architecture, provided they abandon the Supreme Leader and stand down during the popular uprising.",
        },
        implication: {
          label: "GEOPOLITICAL LOGIC",
          text: "Securing conventional military loyalty retains a trained institutional force to secure national borders against external opportunistic threats and maintain public order against internal reactionary violence.",
        },
        note: "This directly inverts the catastrophic US de-Baathification policy in Iraq (2003) that disbanded the Iraqi army, creating a mass of armed, disenfranchised Sunni insurgents — the exact conditions that birthed ISIS. The ITC learned this lesson explicitly.",
      },
      {
        icon: "🔱",
        title: "IRGC (Islamic Revolutionary Guard Corps)",
        sub: "Policy: Not specified in official text — analytical inference required",
        color: "#ef5350",
        policy: {
          label: "POLICY STANCE",
          text: "Not explicitly specified in ITC official documents. However, the presence of Mohsen Sazegara — an original IRGC founding member — as Director for Civil Resistance strongly implies the ITC possesses targeted intelligence operations aimed at fracturing the IRGC command structure from within.",
        },
        implication: {
          label: "ANALYTICAL INFERENCE",
          text: "The ITC's strict UDHR adherence and secular state mandate structurally require that the IRGC's ideological enforcement functions are permanently terminated. The absence of explicit dismantlement language likely reflects strategic ambiguity — leaving the IRGC's fate as a negotiating instrument for defection incentivization.",
        },
        note: null,
      },
      {
        icon: "🏛️",
        title: "Technical Ministries (Water, Power, Municipal)",
        sub: "Policy: Immediate Preservation and Utilization",
        color: "#ffd166",
        policy: {
          label: "POLICY STANCE",
          text: "The Provisional Government focuses HEAVILY on the technical administration of the state during the power vacuum. The objective is to ensure the Ministries of Water, Power, and Municipal Services continue operating seamlessly while political factions debate the constitution.",
        },
        implication: {
          label: "THE MATHEMATICS OF THE POWER VACUUM",
          text: "Historical data from MENA transitions indicates the actual kinetic collapse of an authoritarian regime is rarely the terminal threat — the subsequent administrative vacuum is where state failure occurs. If municipal services remain online, the civilian population is drastically less likely to turn to localized warlords or reactionary regime remnants for basic survival resources.",
        },
        note: null,
      },
      {
        icon: "⚖️",
        title: "Clerical Courts (Special Clerical Courts)",
        sub: "Policy: Structurally implied eradication — not explicitly specified",
        color: "#ba68c8",
        policy: {
          label: "POLICY STANCE",
          text: "Not specified in official text. However, the ITC's core requirements of 'Independent Judiciary free from political or security coercion' and absolute 'Separation of Religion and State' structurally guarantee that the parallel theocratic justice system and Special Clerical Courts will be entirely eradicated.",
        },
        implication: {
          label: "ANALYTICAL INFERENCE",
          text: "The new secular constitution nullifies religious decrees as a basis for national law — which mathematically eliminates the jurisdiction of all clerical courts. The exact mechanical dismantling process is left unspecified, likely to avoid alienating moderate religious actors during coalition formation.",
        },
        note: null,
      },
    ],

    // ── KEY POLICIES ──
    polEyebrow: "Key Policy Stances",
    polTitle: "Four Core Policy Frameworks",
    polIntro: "The ITC's policy positions are calibrated to be internally consistent: each position enables the others. Sanctions relief depends on foreign policy normalization, which depends on abandoning proxies, which depends on the federalist structure reducing internal ethnic unrest.",

    policies: [
      {
        icon: "💹",
        title: "Economy: Triage Then Regulated Free Market",
        color: "#ffd166",
        items: [
          "REJECTS both Marxist wealth confiscation AND IRGC-crony predatory capitalism",
          "Phase 1 — Crisis Triage: immediate lifting of international sanctions upon collapse · emergency international financial aid · stabilize the national currency · ensure food and medicine logistics",
          "Phase 2 — Long-term: tethered to UN Sustainable Development Goals · social justice guarantees: food, clothing, housing, comprehensive healthcare, social security for all citizens",
          "Promotes honorable employment as a state mandate",
          "International financial institutions (IMF, World Bank) are the primary stabilization mechanism — this is structurally transactional: democratic compliance is traded for economic lifelines",
          "No explicit nationalization of IRGC economic assets in official text — strategic omission",
        ],
      },
      {
        icon: "🗺️",
        title: "Minorities & Geography: Ethno-Federalism",
        color: "#69d98c",
        items: [
          "The ITC is the ONLY major opposition organization to explicitly propose an ethno-federal system",
          "Decentralizes power, wealth, and administrative control to the provinces",
          "Legally recognizes the political, social, and cultural rights of all ethnic groups",
          "Mother-tongue education alongside Persian: a constitutional right — not a cultural accommodation",
          "Devolves regional development budgets entirely to locally elected bodies",
          "The federalism functions as a conflict mitigation protocol: by structurally incentivizing ethno-nationalist groups (Komala) to participate in the central democratic framework rather than pursuing violent secession",
          "Provincial borders may be redrawn to better reflect ethnic and regional realities — implied by the federalist mandate",
        ],
      },
      {
        icon: "⚖️",
        title: "Justice & Retribution: Amnesty as Geopolitics",
        color: "#ba68c8",
        items: [
          "Lower and middle ranks of Artesh/security forces: BLANKET AMNESTY — in exchange for defection and standing down",
          "High-level regime members: not specified in official text",
          "The ITC's strict UDHR adherence mathematically precludes arbitrary revolutionary executions",
          "Framework heavily implies reliance on formalized transitional justice courts meeting international legal standards — likely The Hague-compatible mechanisms",
          "The amnesty strategy is a calculated geopolitical maneuver: it functions as a wedge, separating the ideological apex from the operational base of the coercive apparatus",
          "Iraq post-mortem informs this stance explicitly: blanket de-Baathification created the conditions for ISIS — the ITC inverts this",
        ],
      },
      {
        icon: "🌍",
        title: "Foreign Policy: Geopolitical Compliance for Economic Lifelines",
        color: "#4fc3f7",
        items: [
          "Total reversal of the Islamic Republic's geopolitical posture",
          "Foreign policy formulated purely on national interests, international law, and mutual respect",
          "Peaceful and friendly relations with ALL MENA neighbors, the United States, and Europe",
          "The Abraham Accords (Israel-UAE peace treaty) validated as 'a positive and constructive step' — signals willingness to integrate into the emerging MENA security architecture",
          "Immediate termination of proxy warfare: Hezbollah, Houthis, PMF, and all affiliated networks",
          "Environmental policy: climate change designated a 'number one global emergency' — legally commits the future state to all international environmental protection agreements",
          "Nuclear weapons: not specified in official text — but sanctions relief logically requires abandoning all nuclear weapons activities (mathematical necessity for economic survival)",
          "The ITC is structurally trading geopolitical compliance for the economic lifelines required to survive the 180-day transition window",
        ],
      },
    ],

    // ── SYNTHESIS ──
    synthEyebrow: "Architectural Synthesis",
    synthTitle: "Four Second-Order Geopolitical Implications",
    synthIntro: "The ITC blueprint produces second and third-order systemic effects that distinguish it from all other Iranian opposition proposals. These are not ideological claims — they are engineering observations derived from the blueprint's structural design.",

    synthesis: [
      {
        number: "01",
        title: "The Mathematics of the Power Vacuum",
        body: "Historical MENA data: the actual kinetic collapse of an authoritarian regime is rarely the terminal threat. The subsequent administrative vacuum is where state failure occurs. The ITC's obsessive focus on the Emergency Phase — specifically the technocratic continuity of water, electricity, and municipal services — mathematically reduces the variables that lead to civic panic and warlordism. This is the single most architecturally distinctive feature of the ITC blueprint.",
        color: "#7c72e8",
      },
      {
        number: "02",
        title: "The Co-optation of the Coercive Apparatus",
        body: "The blanket amnesty offer to Artesh lower/middle ranks is a wedge strategy. It separates the ideological apex (Supreme Leader, senior IRGC commanders) from the operational base (conscripts, mid-level officers), depriving the regime of kinetic suppression force. Simultaneously, integrating these forces preempts the formation of heavily armed, disenfranchised insurgencies — the exact systemic failure that birthed insurgent groups following the de-Baathification of the Iraqi military.",
        color: "#ef5350",
      },
      {
        number: "03",
        title: "Ethno-Federalism as a Conflict Mitigation Protocol",
        body: "Iran is effectively a multi-ethnic empire masquerading as a homogeneous nation-state. The ITC's federalist commitment — specifically mother-tongue education rights — acts as a systemic pressure release valve. By devolving wealth and administrative power to locally elected provincial councils, the ITC structurally incentivizes ethno-nationalist groups (Komala, Baluch organizations) to participate in the central democratic framework rather than pursuing violent secession — converting centrifugal forces into centripetal stakeholders.",
        color: "#69d98c",
      },
      {
        number: "04",
        title: "Geopolitical Compliance as Economic Triage",
        body: "The ITC's foreign policy is not merely ideological — it is transactional. Upon collapse, the state treasury will be depleted and the national currency will face hyperinflationary pressure. The transition can only survive an injection of emergency international financial aid. Therefore, the ITC's entire foreign policy posture — MENA peace accords, abandoning proxies, US/EU normalization — is structurally trading geopolitical compliance for the economic lifelines required to survive the critical 180-day transition window.",
        color: "#ffd166",
      },
    ],

    conclusion: "\"The Iran Transition Council's blueprint is not a utopian manifesto, but rather a cold, calculated schematic designed to safely decommission a hostile, theocratic state apparatus while simultaneously standing up a decentralized, democratic replacement within a highly volatile geopolitical theater.\" — ITC Blueprint Analytical Summary",

    source: "Source: ITC Official Policy Documents · FARA Registration (AF International LLC) · ITC White Papers (iran-tc.com) · Middle East Forum · Foundation for Defense of Democracies · Launched September 2019",
  },

  // ─────────────────────────────────────────────────────
  // PERSIAN
  // ─────────────────────────────────────────────────────
  fa: {
    heroEyebrow: "شورای مدیریت گذار ایران · تأسیس سپتامبر ۲۰۱۹ · طرح دموکراتیک سکولار فدرالیستی",
    heroTitle: "معماری سیستم‌ها برای گذار دولتی",
    heroDesc: "شورای مدیریت گذار یک گروه اپوزیسیون ایدئولوژیک نیست — یک دولت سایه و واحد برنامه‌ریزی لجستیکی به دقت طراحی‌شده است. معماری آن برای جذب شوک فروپاشی رژیم و مدیریت خلاء قدرتی طراحی شده که به دنبال می‌آید. این یک بیانیه آرمانی نیست بلکه یک طرح سرد و محاسبه‌شده برای خاموش کردن ایمن یک دستگاه دولتی تئوکراتیک خصمانه است.",
    heroBadges: [
      { label: "تأسیس سپتامبر ۲۰۱۹", c: "#7c72e8" },
      { label: "جدول زمانی ۶ مرحله‌ای", c: "#4fc3f7" },
      { label: "فدرالیسم قومی", c: "#69d98c" },
      { label: "عمل‌گرایی تکنوکراتیک", c: "#ffd166" },
      { label: "طراحی دولت سایه", c: "#ba68c8" },
      { label: "نه سلطنت / نه تئوکراسی", c: "#ef5350" },
    ],

    ideolEyebrow: "وضعیت نهایی مطلق و ایدئولوژی محوری",
    ideolTitle: "سه تعهد ساختاری غیرقابل مذاکره",
    ideolIntro: "وضعیت نهایی شورا دقیقاً تعریف شده و محدود است. نه سلطنت، نه تئوکراسی، نه پروژه توزیع مجدد سوسیالیستی، و نه جنبش جدایی‌طلبانه. دقیقاً یک چیز است: یک دموکراسی پارلمانی سکولار و نمایندگی با یک معماری اداری غیرمتمرکز و فدرالیستی قومی.",

    endState: [
      {
        icon: "🏛️",
        title: "دموکراسی پارلمانی سکولار",
        color: "#7c72e8",
        items: [
          "برچیدن کامل ساختاری دستگاه تئوکراتیک جمهوری اسلامی",
          "دولت سکولار: بی‌طرفی کامل نسبت به تمام باورهای دینی — بدون مذهب رسمی دولتی",
          "هیچ قانون ملی‌ای نمی‌تواند بر احکام مذهبی متکی باشد — مذهب صرفاً امری خصوصی است",
          "حاکمیت به عنوان حق مدنی جهانی تعریف می‌شود، کاملاً مستقل از مأموریت الهی یا ادعاهای موروثی",
          "سه قوه کاملاً مستقل: قانونگذاری، مجریه، قضاییه",
          "حاکمیت نهایی منحصراً در رأی‌دهندگان است",
        ],
      },
      {
        icon: "🗺️",
        title: "غیرمتمرکزسازی فدرالیستی قومی",
        color: "#69d98c",
        items: [
          "ایران یک ملت فارسی همگن نیست — یک دولت چندقومی متنوع است: کردها، بلوچ‌ها، عرب‌های اهوازی، ترکمن‌ها، آذربایجانی‌ها",
          "شورای مدیریت گذار تنها سازمان اپوزیسیون بزرگی است که صراحتاً یک سیستم فدرال قومی را مطرح می‌کند",
          "تمرکزگرایی افراطی و استحاله فرهنگی فارس‌محور به عنوان علل ریشه‌ای نابرابری سیستمی شناسایی شده‌اند",
          "توزیع عادلانه ثروت، منابع و قدرت اداری در میان تمام جمعیت‌های منطقه‌ای",
          "حق آموزش به زبان مادری در کنار فارسی رسمی — تضمین‌شده قانون اساسی",
          "شوراهای استانی منتخب محلی بودجه‌های توسعه منطقه‌ای و سیاست فرهنگی را مدیریت می‌کنند",
        ],
      },
      {
        icon: "⚖️",
        title: "چارچوب حقوقی مبتنی بر اعلامیه جهانی حقوق بشر",
        color: "#ffd166",
        items: [
          "اعلامیه جهانی حقوق بشر لنگر حقوقی تغییرناپذیر کل چارچوب است",
          "صراحتاً رد می‌کند: سلطنت (مطلق یا مشروطه)، تئوکراسی، پیشاهنگی سوسیالیستی، شورش مسلحانه",
          "صراحتاً رد می‌کند: تجزیه‌طلبی منطقه‌ای — تمامیت ارضی ایران غیرقابل مذاکره است",
          "حاکمیت یک حق مدنی ذاتی است — به ارث نمی‌رسد، با مأموریت الهی تعیین نمی‌شود، با رتبه نظامی اعطا نمی‌شود",
          "قانون اساسی جدید باید در یک همه‌پرسی ملی مردمی تصویب شود",
          "پس از گذار: تمام مقامات اصلی تنها از طریق انتخابات دموکراتیک آزاد، منصفانه و رقابتی منصوب می‌شوند",
        ],
      },
    ],

    leaderEyebrow: "معماری رهبری",
    leaderTitle: "فرماندهی ائتلافی هفت‌گره‌ای",
    leaderIntro: "برای جلوگیری از انحصاری شدن گذار توسط یک جناح، شورا به عنوان یک ائتلاف چتری وسیع و کثرت‌گرا طراحی شده است. هر گره رهبری یک حوزه عملیاتی متمایز را پوشش می‌دهد و این ترکیب به طور خاص برای پل زدن بین مرکز فارسی و حاشیه‌های قومی، مقاومت داخلی با دیپلماسی دیاسپورا، و جامعه مدنی با اطلاعات درونی طراحی شده است.",

    leaders: [
      {
        name: "حسن شریعتمداری",
        role: "دبیر کل · هماهنگ‌کننده ارشد",
        domain: "نظارت اجرایی",
        color: "#7c72e8",
        value: "پسر آیت‌الله العظمی سیدمحمدکاظم شریعتمداری — برجسته‌ترین آیت‌الله ایران و مخالف صریح انحصارطلبی آیت‌الله خمینی. میراث او مشروعیت غیرقابل تردید در برابر دستگاه روحانی رژیم را برای شورا فراهم می‌کند، در حالی که شخصاً از یک جمهوری سکولار دفاع می‌کند.",
        note: "این ترکیب — مشروعیت روحانی ضدخمینیستی + دفاع از سکولاریسم — از نظر معماری منحصربه‌فرد است.",
      },
      {
        name: "عبدالله مهتدی",
        role: "مشاور ارشد · مدیر امور منطقه‌ای",
        domain: "شبکه‌های کردی و قومی",
        color: "#69d98c",
        value: "دبیر کل حزب کومله کردستان ایران. ادغام او شکاف بین مرکز با اکثریت فارس و جناح‌های سیاسی کردی سازمان‌یافته و تاریخاً مسلح را پر می‌کند — از تکه‌شدن قومی در طول گذار پیشگیری می‌کند.",
        note: "بدون خرید کردها، معماری فدرالیستی نمی‌تواند کار کند.",
      },
      {
        name: "محسن سازگارا",
        role: "مدیر مقاومت مدنی",
        domain: "اطلاعات امنیتی",
        color: "#ef5350",
        value: "یکی از اعضای بنیانگذار اصلی سپاه پاسداران انقلاب اسلامی — تبدیل به مخالف رژیم شده است. اطلاعات درونی بی‌نظیر در مورد مکانیزم‌های عملیاتی سپاه، آسیب‌پذیری‌های روانی و ساختارهای فرماندهی ارائه می‌دهد.",
        note: "حضور او نشان می‌دهد شورا احتمالاً عملیات اطلاعاتی هدفمند برای شکستن ساختار فرماندهی سپاه از درون دارد.",
      },
      {
        name: "مهران براتی",
        role: "معاون دبیر کل",
        domain: "دیپلماسی اروپایی",
        color: "#4fc3f7",
        value: "چهره برجسته دیاسپورای ایرانی و رهبر سابق دانشجویی مستقر در آلمان. به عنوان یک پل دیپلماتیک حیاتی با نهادهای دموکرات اجتماعی اروپایی عمل می‌کند.",
        note: null,
      },
      {
        name: "شهریار آهی",
        role: "سخنگو و عضو هیئت مدیره",
        domain: "رسانه‌های جهانی و عملیات روانی",
        color: "#ba68c8",
        value: "مدیر رسانه‌ای با تجربه — مدیر عامل سابق AGI، مدیریت دارایی‌هایی از جمله UPI و MBC. مسئول شکل‌دهی استراتژی ارتباطات جهانی شورا و عملیات روانی هدفمند نیروهای امنیتی رژیم.",
        note: null,
      },
      {
        name: "کمال آذری",
        role: "مدیر عملیات آمریکا",
        domain: "لابی‌گری واشنگتن",
        color: "#ffd166",
        value: "لابی‌گری ژئوپلیتیک، روابط دیپلماتیک و ارتباطات استراتژیک را در واشنگتن دی‌سی هدایت می‌کند. از طریق AF International LLC (ثبت‌شده تحت FARA) فعالیت می‌کند.",
        note: null,
      },
      {
        name: "یزدان شهدایی",
        role: "دبیرخانه سازمان‌ها و ارتباطات",
        domain: "سازمان مدنی",
        color: "#ff9a42",
        value: "هماهنگی داخلی، شبکه‌های مقاومت مدنی و زیرساخت سازمانی که رهبری شورا را به جنبش‌های کارگری و گره‌های مقاومت پایه‌ای در داخل ایران متصل می‌کند را مدیریت می‌کند.",
        note: null,
      },
    ],

    methEyebrow: "روش‌شناسی پیش از سقوط",
    methTitle: "ماتریس فشار سه‌مسیری",
    methIntro: "شورا صراحتاً مداخله نظامی خارجی و شورش مسلحانه داخلی را رد می‌کند. محاسبه: درگیری مسلحانه فوری یک جنگ داخلی به سبک سوریه ایجاد می‌کند که زیرساخت را نابود کرده و گذار دموکراتیک را ریاضیاتاً غیرممکن می‌سازد. در عوض، سه مسیر موازی به طور همزمان فشار وارد می‌کنند.",

    tracks: [
      {
        icon: "⚒️",
        title: "مقاومت مدنی داخلی",
        color: "#7c72e8",
        items: [
          "نافرمانی مدنی غیرخشونت‌آمیز به عنوان حالت عملیاتی اصلی",
          "اعتصابات کارگری سازمان‌یافته با هدف بخش‌های پتروشیمی و نفت — فلج کردن شریان‌های اقتصادی رژیم",
          "هماهنگی شبکه پایه از طریق زیرساخت سازمان مدنی یزدان شهدایی",
          "محسن سازگارا دستورالعمل‌های استراتژیک را به گره‌های مقاومت داخلی منتشر می‌کند",
        ],
      },
      {
        icon: "🌐",
        title: "انزوای دیپلماتیک خارجی",
        color: "#4fc3f7",
        items: [
          "شورا به عنوان یک اصل خارجی از طریق AF International LLC ثبت شده است (ثبت FARA)",
          "ارتباط فعال با دبیر کل سازمان ملل، سازمان بهداشت جهانی، نماینده عالی اتحادیه اروپا",
          "عملیات واشنگتن کمال آذری: لابی نزد سیاستگذاران آمریکایی برای انزوای هدفمند رژیم",
          "ساخت یک شبکه دیپلماتیک از پیش مشروعیت‌یافته آماده برای شناسایی شورا به عنوان دولت موقت پس از سقوط",
        ],
      },
      {
        icon: "🔓",
        title: "کمپین فرار نیروهای امنیتی",
        color: "#69d98c",
        items: [
          "پیشنهادات عفو کلی به رتبه‌های پایین و میانی ارتش (نیروهای مسلح رسمی)",
          "ادغام تضمین‌شده در معماری امنیتی دولت جدید — در ازای کنار کشیدن",
          "منطق استراتژیک: با رسم مرزی بین قله ایدئولوژیک و پایه عملیاتی، شورا از قدرت سرکوبگری رژیم می‌کاهد",
          "مستقیماً از درس‌های عراق پس از ۲۰۰۳ آموخته شده: ارتش‌زدایی از بعثیسم ارتش عراق را نابود کرد و خشم سنی ایجاد کرد که داعش را متولد کرد",
        ],
      },
    ],

    phasesEyebrow: "جدول زمانی گذار ۶ مرحله‌ای",
    phasesTitle: "یک گذار مدیریت‌شده و کاملاً متوالی",
    phasesIntro: "گذار به عنوان یک سرنگونی آنی و آشوبناک طراحی نشده است. مهم‌ترین اصل طراحی: در طول فاز اضطراری، بحث‌های بحث‌برانگیز درباره ساختار دقیق دولت آینده ممنوع است — برای حفظ انسجام ائتلاف به مجلس مؤسسان موکول می‌شود.",

    phases: [
      { number: "۰۱", phase: "پیش از سقوط", priority: "ائتلاف‌سازی · نافرمانی مدنی · انزوای دیپلماتیک", authority: "جمهوری اسلامی (هدف)", color: "#7c72e8",
        items: ["ائتلاف‌سازی گسترده در تمام جناح‌های اپوزیسیون", "تقویت جامعه مدنی و سازماندهی پایه داخل ایران", "اطلاعات‌گیری برای شکستن انسجام رژیم از درون", "لابی دیپلماتیک برای همسوسازی بازیگران بین‌المللی علیه جمهوری اسلامی"] },
      { number: "۰۲", phase: "سقوط و خلاء قدرت", priority: "مدیریت فنی · تداوم خدمات · عفو نظامی", authority: "دولت موقت شورا", color: "#ef5350",
        items: ["با از دست دادن انحصار خشونت توسط رژیم، شورا فوری به عنوان یک دولت سایه از پیش برنامه‌ریزی‌شده فعال می‌شود", "اولویت عملیاتی ناگهانی تغییر می‌کند از مخالفت سیاسی به مدیریت فنی", "۷۲ ساعت اول: تضمین تداوم آب، برق و خدمات شهری — اولویت شماره ۱", "اگر شهروندان آب و برق داشته باشند، به سمت جنگ‌سالاران نمی‌روند"] },
      { number: "۰۳", phase: "دوره موقت اضطراری", priority: "تثبیت کلان · رفع تحریم‌ها · تصمیمات موکول‌شده", authority: "دولت موقت شورا", color: "#ff9a42",
        items: ["مدت: ۱۰۰–۱۸۰ روز", "دولت موقت فقط به عنوان یک سرپرست موقت و تکنوکراتیک عمل می‌کند", "سیاست تصمیمات بنیادی موکول‌شده: بحث‌ها درباره ماهیت دقیق دولت آینده توسط دولت موقت ممنوع است", "این تعویق عدم قطعیت ایدئولوژیک نیست — یک مکانیزم محاسبه‌شده برای حفظ انسجام ائتلاف در بحرانی‌ترین بازه است", "جامعه بین‌المللی تحریم‌ها را پس از سقوط رژیم برمی‌دارد — این خط حیاتی اقتصادی است که کل تثبیت به آن بستگی دارد"] },
      { number: "۰۴", phase: "انتخابات مجلس مؤسسان", priority: "انتخابات آزاد، منصفانه، رقابتی · تهیه پیش‌نویس چارچوب قانونی", authority: "مجلس مؤسسان", color: "#ffd166",
        items: ["پس از دستیابی به ثبات پایه، دولت موقت انتخابات ملی آزاد، منصفانه و رقابتی را تسهیل می‌کند", "مجلس فقط برای تهیه پیش‌نویس قانون اساسی دموکراتیک جدید مأموریت دارد — بدون اختیار اجرایی", "تصمیمات بنیادی موکول‌شده از مرحله سوم در اینجا حل‌وفصل می‌شوند: ساختار فدرال، شکل دقیق حکومت دموکراتیک"] },
      { number: "۰۵", phase: "همه‌پرسی قانون اساسی", priority: "تصویب نهایی مردمی قانون اساسی جدید", authority: "رأی‌دهندگان ملی", color: "#69d98c",
        items: ["قانون اساسی تهیه‌شده برای یک رأی ملی نهایی و الزام‌آور به تمام مردم ایران ارائه می‌شود", "هیچ نهاد موقتی نمی‌تواند پارچه بنیادی دولت را به طور دائم تغییر دهد", "بحث عمومی نامحدود قبل از همه‌پرسی در تمام رسانه‌ها", "ناظران بین‌المللی"] },
      { number: "۰۶", phase: "انتقال نهایی قدرت", priority: "انحلال تمام نهادهای موقت · تحویل کامل دموکراتیک", authority: "پارلمان ملی منتخب", color: "#4fc3f7",
        items: ["پس از تصویب قانون اساسی جدید، دولت موقت خود را منحل می‌کند", "تمام اختیارات اجرایی و قانونگذاری به دولت دائمی جدید منتقل می‌شود", "شورا به عنوان یک نهاد حاکم وجود ندارد — همیشه به عنوان ابزاری موقت طراحی شده بود", "گذار کامل است: یک دموکراسی پارلمانی سکولار با اداره فدرالیستی قومی غیرمتمرکز عملیاتی است"] },
    ],

    instEyebrow: "سیاست هدف‌گیری نهادی",
    instTitle: "تداوم به جای تخریب — آموختن از شکست‌های منا",
    instIntro: "شورا به طور صریح از پیامدهای فاجعه‌بار برچیدن کامل دولت در منطقه خاورمیانه و شمال آفریقا مطالعه کرده است. سیاست نهادی شورا بر اصل تداوم نهادی بنا شده است — نه تخریب کامل.",

    institutions: [
      { icon: "⚔️", title: "ارتش (نیروهای مسلح رسمی)", sub: "سیاست: جذب و ادغام", color: "#69d98c",
        policy: { label: "موضع سیاستی", text: "هدف‌گیری فعال رتبه‌های پایین و میانی با پیشنهادات عفو کلی + ادغام تضمین‌شده در معماری امنیتی دولت جدید، مشروط به ترک رهبری و کنار کشیدن در طول قیام مردمی." },
        implication: { label: "منطق ژئوپلیتیک", text: "تضمین وفاداری نیروی نظامی رسمی یک نیروی نهادی آموزش‌دیده را برای تأمین امنیت مرزهای ملی در برابر تهدیدات خارجی و حفظ نظم عمومی در برابر خشونت ضدانقلابی داخلی حفظ می‌کند." },
        note: "این مستقیماً سیاست فاجعه‌بار بعثی‌زدایی آمریکا در عراق ۲۰۰۳ را معکوس می‌کند که ارتش عراق را منحل کرد و شرایطی ایجاد کرد که داعش را متولد کرد." },
      { icon: "🔱", title: "سپاه پاسداران انقلاب اسلامی", sub: "سیاست: در متن رسمی مشخص نشده — استنتاج تحلیلی لازم است", color: "#ef5350",
        policy: { label: "موضع سیاستی", text: "در اسناد رسمی شورا به صراحت مشخص نشده. با این حال، حضور محسن سازگارا — یکی از اعضای بنیانگذار اصلی سپاه — به عنوان مدیر مقاومت مدنی به شدت نشان می‌دهد شورا عملیات اطلاعاتی هدفمند برای شکستن ساختار فرماندهی سپاه از درون دارد." },
        implication: { label: "استنتاج تحلیلی", text: "رعایت دقیق شورا از اعلامیه جهانی حقوق بشر و مأموریت دولت سکولار ساختاری مستلزم پایان دائمی کارکردهای اجرای ایدئولوژیک سپاه است. غیاب زبان برچیدن صریح احتمالاً ابهام استراتژیک را منعکس می‌کند." },
        note: null },
      { icon: "🏛️", title: "وزارتخانه‌های فنی (آب، برق، خدمات شهری)", sub: "سیاست: حفظ فوری و بهره‌برداری", color: "#ffd166",
        policy: { label: "موضع سیاستی", text: "دولت موقت توجه ویژه‌ای به مدیریت فنی دولت در طول خلاء قدرت دارد. هدف این است که وزارتخانه‌های آب، برق و خدمات شهری در حالی که جناح‌های سیاسی قانون اساسی را بحث می‌کنند بدون وقفه به کار خود ادامه دهند." },
        implication: { label: "ریاضیات خلاء قدرت", text: "داده‌های تاریخی از گذارهای منطقه نشان می‌دهد فروپاشی واقعی یک رژیم اقتدارگرا به ندرت تهدید نهایی است — خلاء اداری پس از آن جایی است که شکست دولتی رخ می‌دهد." },
        note: null },
      { icon: "⚖️", title: "دادگاه‌های روحانی (دادگاه ویژه روحانیت)", sub: "سیاست: ریشه‌کنی ضمنی ساختاری — در متن رسمی مشخص نشده", color: "#ba68c8",
        policy: { label: "موضع سیاستی", text: "در متن رسمی مشخص نشده. با این حال، الزامات محوری شورا مبنی بر 'قوه قضاییه مستقل آزاد از اجبار سیاسی یا امنیتی' و 'جدایی مطلق دین از دولت' ساختاری تضمین می‌کند که سیستم عدالت تئوکراتیک موازی کاملاً ریشه‌کن خواهد شد." },
        implication: { label: "استنتاج تحلیلی", text: "قانون اساسی سکولار جدید احکام مذهبی را به عنوان مبنای قانون ملی باطل می‌کند — که ریاضیاتاً صلاحیت تمام دادگاه‌های روحانی را از بین می‌برد." },
        note: null },
    ],

    polEyebrow: "مواضع سیاستی کلیدی",
    polTitle: "چهار چارچوب سیاستی محوری",
    polIntro: "مواضع سیاستی شورا به گونه‌ای کالیبره شده‌اند که از نظر داخلی منسجم باشند: هر موضع موضع دیگری را امکان‌پذیر می‌سازد.",

    policies: [
      { icon: "💹", title: "اقتصاد: تریاژ سپس بازار آزاد تنظیم‌شده", color: "#ffd166",
        items: ["هم مصادره ثروت مارکسیستی و هم سرمایه‌داری غارتگر وابسته به سپاه را رد می‌کند", "مرحله ۱ — تریاژ بحران: رفع فوری تحریم‌های بین‌المللی · کمک مالی اضطراری بین‌المللی · تثبیت ارز ملی", "مرحله ۲ — بلندمدت: گره خورده به اهداف توسعه پایدار سازمان ملل · تضمین‌های عدالت اجتماعی", "شورا ساختاری رعایت ژئوپلیتیک را با خطوط حیاتی اقتصادی مبادله می‌کند"] },
      { icon: "🗺️", title: "اقلیت‌ها و جغرافیا: فدرالیسم قومی", color: "#69d98c",
        items: ["شورا تنها سازمان اپوزیسیون بزرگی است که صراحتاً یک سیستم فدرال قومی پیشنهاد می‌دهد", "قدرت، ثروت و کنترل اداری را به استان‌ها تفویض می‌کند", "حقوق سیاسی، اجتماعی و فرهنگی تمام گروه‌های قومی را به رسمیت می‌شناسد", "آموزش زبان مادری در کنار فارسی رسمی: یک حق قانون اساسی — نه تطبیق فرهنگی"] },
      { icon: "⚖️", title: "عدالت و مجازات: عفو به عنوان ژئوپلیتیک", color: "#ba68c8",
        items: ["رتبه‌های پایین و میانی ارتش/نیروهای امنیتی: عفو کلی — در ازای فرار و کنار کشیدن", "اعضای ارشد رژیم: در متن رسمی مشخص نشده", "رعایت دقیق UDHR شورا اعدام‌های انقلابی خودسرانه را ریاضیاتاً منتفی می‌کند", "درس عراق: بعثی‌زدایی کامل شرایطی ایجاد کرد که داعش را متولد کرد — شورا این را صریحاً معکوس می‌کند"] },
      { icon: "🌍", title: "سیاست خارجی: رعایت ژئوپلیتیک به عنوان تریاژ اقتصادی", color: "#4fc3f7",
        items: ["چرخش کامل موضع ژئوپلیتیک جمهوری اسلامی", "روابط صلح‌آمیز و دوستانه با تمام همسایگان منطقه، ایالات متحده و اروپا", "توافق صلح اسرائیل و امارات 'یک گام مثبت و سازنده' ارزیابی شده — اشتیاق برای ادغام در معماری امنیتی در حال ظهور خاورمیانه", "پایان فوری به تمام جنگ نیابتی: حزب‌الله، حوثی‌ها، الحشد الشعبی", "سلاح‌های هسته‌ای: در متن رسمی مشخص نشده — اما رفع تحریم‌ها منطقاً رها کردن برنامه هسته‌ای را ضروری می‌کند"] },
    ],

    synthEyebrow: "سنتز معماری",
    synthTitle: "چهار پیامد ژئوپلیتیک مرتبه دوم",
    synthIntro: "طرح شورا پیامدهای سیستمی مرتبه دوم و سوم تولید می‌کند که آن را از تمام پیشنهادات دیگر اپوزیسیون ایرانی متمایز می‌کند.",

    synthesis: [
      { number: "۰۱", title: "ریاضیات خلاء قدرت", body: "داده‌های تاریخی منطقه: فروپاشی واقعی یک رژیم اقتدارگرا به ندرت تهدید نهایی است. خلاء اداری پس از آن جایی است که شکست دولتی رخ می‌دهد. تمرکز وسواس‌گونه شورا بر فاز اضطراری — به ویژه تداوم تکنوکراتیک آب، برق و خدمات شهری — متغیرهایی را که به هراس شهروندی و جنگ‌سالاری منجر می‌شوند ریاضیاتاً کاهش می‌دهد.", color: "#7c72e8" },
      { number: "۰۲", title: "جذب دستگاه اجبار", body: "پیشنهاد عفو کلی به رتبه‌های پایین/میانی ارتش یک استراتژی اهرمی است. قله ایدئولوژیک را از پایه عملیاتی جدا می‌کند و رژیم را از توان سرکوبگری محروم می‌کند. به طور همزمان، ادغام این نیروها از شکل‌گیری شورش‌های مسلح و بی‌سرمایه‌گذاری جلوگیری می‌کند — شکست سیستمی دقیقی که گروه‌های شورشی را پس از بعثی‌زدایی ارتش عراق به وجود آورد.", color: "#ef5350" },
      { number: "۰۳", title: "فدرالیسم قومی به عنوان پروتکل کاهش تعارض", body: "ایران به طور مؤثر یک امپراتوری چندقومی است که خود را به عنوان یک دولت-ملت همگن نشان می‌دهد. تعهد فدرالیستی شورا — به ویژه حقوق آموزش زبان مادری — به عنوان یک سوپاپ فشار سیستمی عمل می‌کند. با تفویض ثروت و قدرت اداری به شوراهای استانی منتخب محلی، شورا گروه‌های ملی‌گرای قومی را ساختاری تشویق می‌کند که در چارچوب مرکزی دموکراتیک مشارکت کنند نه جدایی مسلحانه را دنبال کنند.", color: "#69d98c" },
      { number: "۰۴", title: "رعایت ژئوپلیتیک به عنوان تریاژ اقتصادی", body: "سیاست خارجی شورا صرفاً ایدئولوژیک نیست — معاملاتی است. پس از سقوط، خزانه دولتی احتمالاً تخلیه شده و ارز ملی با فشار ابرتورمی مواجه است. گذار تنها با تزریق کمک‌های مالی اضطراری بین‌المللی می‌تواند بقا یابد. بنابراین، تمام موضع سیاست خارجی شورا ساختاری رعایت ژئوپلیتیک را با خطوط حیاتی اقتصادی مورد نیاز برای بقا در پنجره بحرانی ۱۸۰ روزه مبادله می‌کند.", color: "#ffd166" },
    ],

    conclusion: "«طرح شورای مدیریت گذار ایران یک بیانیه آرمانی نیست، بلکه یک طرح سرد و محاسبه‌شده است که برای خاموش کردن ایمن یک دستگاه دولتی تئوکراتیک خصمانه و در عین حال راه‌اندازی همزمان یک جایگزین دموکراتیک غیرمتمرکز در یک تئاتر ژئوپلیتیک بسیار پرتلاطم طراحی شده است.» — خلاصه تحلیلی طرح شورا",

    source: "منبع: اسناد سیاستی رسمی شورا · ثبت FARA (AF International LLC) · کتاب‌های سفید شورا (iran-tc.com) · Middle East Forum · بنیاد دفاع از دموکراسی‌ها · تأسیس سپتامبر ۲۰۱۹",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function ITCPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const VIOLET = "#7c72e8", CYAN = "#4fc3f7", GREEN = "#69d98c",
    AMBER = "#ffd166", ORANGE = "#ff9a42", RED = "#ef5350", PURPLE = "#ba68c8";

  return (
    <div className="itc-page" dir={dir}>
      <ParticleGrid />
      <div className="itc-scanline" />
      <div className="itc-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="itc-hero">
          <p className="itc-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="itc-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="itc-hero-desc">{d.heroDesc}</p>
          <div className="itc-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="itc-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── END STATE + IDEOLOGY ── */}
        <SecHead eyebrow={d.ideolEyebrow} title={d.ideolTitle} intro={d.ideolIntro} color={VIOLET} />
        <div className="itc-endstate-grid">
          {d.endState.map((es, i) => (
            <div key={i} className="itc-endstate-card" style={{ borderColor: `${es.color}28` }}>
              <div className="itc-endstate-icon">{es.icon}</div>
              <div className="itc-endstate-title" style={{ color: es.color, fontFamily: ff }}>{es.title}</div>
              <Bullets items={es.items} color={es.color} />
            </div>
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── LEADERSHIP ── */}
        <SecHead eyebrow={d.leaderEyebrow} title={d.leaderTitle} intro={d.leaderIntro} color={AMBER} />
        <div className="itc-leader-grid">
          {d.leaders.map((l, i) => (
            <LeaderCard key={i} {...l} />
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── METHODOLOGY ── */}
        <SecHead eyebrow={d.methEyebrow} title={d.methTitle} intro={d.methIntro} color={GREEN} />
        <div className="itc-tracks-grid">
          {d.tracks.map((tr, i) => (
            <div key={i} className="itc-track-card" style={{ borderColor: `${tr.color}28` }}>
              <div className="itc-track-icon">{tr.icon}</div>
              <div className="itc-track-title" style={{ color: tr.color, fontFamily: ff }}>{tr.title}</div>
              <Bullets items={tr.items} color={tr.color} />
            </div>
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── 6 PHASES ── */}
        <SecHead eyebrow={d.phasesEyebrow} title={d.phasesTitle} intro={d.phasesIntro} color={VIOLET} />
        <div className="itc-phases">
          {d.phases.map((ph, i) => (
            <PhaseRow key={i} number={ph.number} phase={ph.phase} priority={ph.priority} authority={ph.authority} color={ph.color}>
              <Bullets items={ph.items} color={ph.color} />
            </PhaseRow>
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── INSTITUTIONAL TARGETS ── */}
        <SecHead eyebrow={d.instEyebrow} title={d.instTitle} intro={d.instIntro} color={ORANGE} />
        <div className="itc-inst-grid">
          {d.institutions.map((inst, i) => (
            <InstitutionCard key={i} {...inst} />
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── KEY POLICIES ── */}
        <SecHead eyebrow={d.polEyebrow} title={d.polTitle} intro={d.polIntro} color={CYAN} />
        <div className="itc-policies-grid">
          {d.policies.map((p, i) => (
            <PolicyCard key={i} icon={p.icon} title={p.title} color={p.color}>
              <Bullets items={p.items} color={p.color} />
            </PolicyCard>
          ))}
        </div>

        <div className="itc-divider" />

        {/* ── SYNTHESIS ── */}
        <SecHead eyebrow={d.synthEyebrow} title={d.synthTitle} intro={d.synthIntro} color={VIOLET} />
        <div className="itc-synth-grid">
          {d.synthesis.map((s, i) => (
            <SynthCard key={i} {...s} />
          ))}
        </div>

        {/* ── CONCLUSION ── */}
        <div className="itc-conclusion" style={{ fontFamily: ff }}>
          <span className="itc-conclusion-mark" style={{ color: VIOLET }}>❝</span>
          <span>{d.conclusion}</span>
        </div>

        <p className="itc-source">{d.source}</p>

      </div>
    </div>
  );
}
