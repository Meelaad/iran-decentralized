import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./URIPage.css";

/* ─────────────────────────────────────────────────────
   Animated particle background — rose-red palette
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
      vx: (Math.random() - 0.5) * 0.19, vy: (Math.random() - 0.5) * 0.19,
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
      t += 0.006;
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
            ctx.strokeStyle = `rgba(232,80,122,${(1 - dist / 175) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,80,122,${0.09 + p * 0.14})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="uri-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="uri-acc" style={{ "--c": color || "#e8507a" }}>
      <button className="uri-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="uri-acc-title">{title}</span>
        {subtitle && <span className="uri-acc-subtitle">{subtitle}</span>}
        <span className="uri-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="uri-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="uri-bullets">
      {items.map((it, i) => (
        <li key={i} className="uri-bullet-item">
          <span className="uri-bullet-dot" style={{ background: color || "#e8507a" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="uri-sechead">
      {eyebrow && <div className="uri-sechead-eyebrow" style={{ color }}>{eyebrow}</div>}
      {title && <h2 className="uri-sechead-title">{title}</h2>}
      {intro && <p className="uri-sechead-intro">{intro}</p>}
    </div>
  );
}

function RejectionPill({ label, color }) {
  return (
    <span className="uri-rejection" style={{ color, borderColor: `${color}40`, background: `${color}0d` }}>
      ✗ {label}
    </span>
  );
}

function CoalitionRow({ org, ideology, contribution, color }) {
  return (
    <div className="uri-coalition-row" style={{ borderColor: `${color}22` }}>
      <div className="uri-coalition-org" style={{ color }}>{org}</div>
      <div className="uri-coalition-ideology">{ideology}</div>
      <div className="uri-coalition-contrib">{contribution}</div>
    </div>
  );
}

function PhaseBlock({ number, label, trigger, title, color, analysis, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="uri-phase-block" style={{ "--pb": color }}>
      <div className="uri-phase-block-head" onClick={() => setOpen(o => !o)}>
        <span className="uri-phase-block-n">{number}</span>
        <div className="uri-phase-block-info">
          <span className="uri-phase-block-label">{label}</span>
          <span className="uri-phase-block-title">{title}</span>
          {trigger && <span className="uri-phase-block-trigger">{trigger}</span>}
        </div>
        <span className="uri-phase-block-caret">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="uri-phase-block-body">
          <Bullets items={children} color={color} />
          {analysis && (
            <div className="uri-phase-analysis">
              <span className="uri-phase-analysis-tag">CAUSAL LOGIC</span>
              {analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PowerNode({ icon, title, sub, color, role, items }) {
  return (
    <div className="uri-power-node" style={{ borderColor: `${color}28` }}>
      <div className="uri-power-icon">{icon}</div>
      <div className="uri-power-title" style={{ color }}>{title}</div>
      <div className="uri-power-role">{role}</div>
      <div className="uri-power-sub">{sub}</div>
      <Bullets items={items} color={color} />
    </div>
  );
}

function InstCard({ icon, title, status, statusColor, policy, causal, note }) {
  return (
    <div className="uri-inst-card" style={{ borderColor: `${statusColor}25` }}>
      <div className="uri-inst-head">
        <span className="uri-inst-icon">{icon}</span>
        <div>
          <div className="uri-inst-title">{title}</div>
          <span className="uri-inst-status" style={{ color: statusColor, borderColor: `${statusColor}35`, background: `${statusColor}0d` }}>{status}</span>
        </div>
      </div>
      <div className="uri-inst-label">POLICY</div>
      <div className="uri-inst-text">{policy}</div>
      <div className="uri-inst-label uri-inst-causal-label">CAUSAL LOGIC</div>
      <div className="uri-inst-text">{causal}</div>
      {note && (
        <div className="uri-inst-note">
          <span className="uri-inst-note-tag">ANALYTICAL NOTE</span>
          {note}
        </div>
      )}
    </div>
  );
}

function PolicyCard({ icon, title, color, children }) {
  return (
    <div className="uri-pol-card" style={{ borderColor: `${color}28` }}>
      <div className="uri-pol-icon">{icon}</div>
      <div className="uri-pol-title" style={{ color }}>{title}</div>
      {children}
    </div>
  );
}

function GeoCard({ number, title, body, color }) {
  return (
    <div className="uri-geo-card" style={{ borderColor: `${color}28` }}>
      <div className="uri-geo-n" style={{ color }}>{number}</div>
      <div className="uri-geo-title">{title}</div>
      <div className="uri-geo-body">{body}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "United Republicans of Iran (URI) · Hamgami Coalition · Founded 2004 / Consolidated 2023",
    heroTitle: "Secular Democratic Republic Blueprint",
    heroDesc: "The URI and Hamgami (Solidarity for a Secular Democratic Republic in Iran) coalition represents the most comprehensively institutionalized secular alternative to both the current theocracy and any return of autocracy. Rooted in strict Laïcité, progressive liberalism, and the UN Declaration of Human Rights, it uniquely rejects three end-states simultaneously: theocracy, monarchy, and vanguardist sectarianism. Its two-phase transition logic is the most realistic — anticipating an IRGC power grab before the genuine democratic opening.",
    heroBadges: [
      { label: "Strict Laïcité", c: "#e8507a" },
      { label: "5-Organization Coalition", c: "#4fc3f7" },
      { label: "Two-Phase Logic", c: "#ffd166" },
      { label: "Anti-Monarchy + Anti-Theocracy", c: "#ef5350" },
      { label: "Mixed Economy", c: "#69d98c" },
      { label: "State-Nation Model", c: "#ba68c8" },
    ],

    // ── IDEOLOGY ──
    ideolEyebrow: "Core Ideology — The Triple Rejection",
    ideolTitle: "Laïcité, Pluralism, and the Permanent End of Autocracy",
    ideolIntro: "The ideological architecture of the Hamgami coalition is defined as much by what it rejects as by what it proposes. It is the only major Iranian opposition bloc that simultaneously and explicitly rejects all three paths to renewed autocracy — making it structurally unique in the Iranian opposition landscape.",

    rejections: [
      { label: "Divine Rights / Velayat-e Faqih / Theocracy", color: "#ef5350" },
      { label: "Hereditary Rights / Pahlavi Monarchy / Restoration", color: "#ff9a42" },
      { label: "Vanguardist Sectarianism / MEK / Ideological Militia", color: "#ba68c8" },
    ],

    laiteciteNote: "The coalition's doctrine of secularism is specifically the French model of Laïcité — not merely the separation of church and state, but the total institutional blindness of the state apparatus to the religious, ethnic, and ideological affiliations of its citizens. The state apparatus is rendered structurally incapable of being captured by any religious or ideological faction.",

    coreCommitments: {
      title: "Five Core Ideological Commitments",
      color: "#e8507a",
      items: [
        "Strict Laïcité — the total institutional separation of religion from state governance; no official state religion; no law may rely on religious decree",
        "Republicanism as a non-negotiable end-state — not merely a transitional format, but a permanent structural cure for Iran's historical vulnerability to autocracy",
        "Political pluralism — total elimination of institutionalized discrimination; absolute equality for women, LGBTQ individuals, and ethnic minorities",
        "Universal Declaration of Human Rights as the foundational legal anchor of every institution, law, and constitutional article",
        "The 'Principle of Alternation of Power' — periodic, mandatory turnover; total abolition of lifelong, hereditary, or divinely appointed positions",
      ],
    },

    stateNation: {
      title: "The 'State-Nation' Model — Why 'Republic' Is Non-Negotiable",
      items: [
        "The coalition views republicanism not as one governance option among many, but as the only structural solution to Iran's recurring autocracy cycle",
        "A 'nation-state' centralizes identity around an ethnic core — Persia — and historically enables assimilation pressure on minorities",
        "A 'state-nation' builds civic identity around shared institutions and rights, not ethnicity — enabling Iran's multi-ethnic population to have genuine equal standing",
        "The distinction matters: it explains why the coalition simultaneously preserves Persian as the common language AND protects all minority languages with equal constitutional force",
        "Historical grounding: the URI founders include Hassan Shariatmadari (son of the Ayatollah who opposed Khomeini's monopolization) and Farrokh Negahdar — both from the generation that saw the 1979 revolution fail to deliver on its republican promises",
      ],
    },

    // ── COALITION ──
    coalEyebrow: "The Hamgami Coalition — Five Organizations",
    coalTitle: "A Structured Pluralistic Umbrella",
    coalIntro: "Consolidated in 2023 following the momentum of the 'Woman, Life, Freedom' protests, the Hamgami coalition brings together five major political organizations spanning secular republicanism, democratic socialism, liberal democracy, and human rights advocacy. Each covers a distinct strategic function.",

    coalition: [
      {
        org: "United Republicans of Iran (URI)",
        ideology: "Secular republicanism · post-leftist progressivism",
        contribution: "Coalition architecture · secular blueprinting · anti-monarchist advocacy · diaspora organizing. Founded 2004 by Shariatmadari and Negahdar.",
        color: "#e8507a",
      },
      {
        org: "Left Party of Iran (LPI)",
        ideology: "Democratic socialism · secular left",
        contribution: "Dominant leftist faction — ensures the economic model prioritizes labor rights, social safety nets, and economic egalitarianism alongside market reform.",
        color: "#4fc3f7",
      },
      {
        org: "National Front of Iran (Europe)",
        ideology: "Liberal democracy · social democracy",
        contribution: "Historical continuity to the 1949 Mossadegh era — provides the coalition with deep national sovereignty legitimacy and a mixed-economy economic framework.",
        color: "#ffd166",
      },
      {
        org: "Iran National Front Organizations Abroad",
        ideology: "Liberal democracy · secular nationalism",
        contribution: "Administrative alignment · historical legitimacy · international diplomatic outreach across the Iranian diaspora.",
        color: "#69d98c",
      },
      {
        org: "Union for Secular Republic & Human Rights in Iran (USRHR)",
        ideology: "Human rights advocacy · strict secularism",
        contribution: "Detailed internal governance frameworks, constitutional charters, anti-discrimination policies, and the UDHR-aligned legal architecture. Their internal Article of Association serves as a micro-blueprint for the national state structure.",
        color: "#ba68c8",
      },
    ],

    // ── TWO-PHASE TRANSITION ──
    transEyebrow: "Methodology — Two-Phase Transition Logic",
    transTitle: "The Most Realistic Path: Accounting for the IRGC",
    transIntro: "Unlike plans that assume a single moment of regime collapse, the URI/Hamgami blueprint is built on a sober, two-phase transition logic derived from rigorous analysis of the Islamic Republic's institutional resilience — specifically 'The Day After Khamenei' strategic assessments published by USRHR-affiliated platforms.",

    triggerNote: "The two-phase logic explicitly rejects the notion of an immediate, romanticized overthrow. It is designed around the survival instincts of the current security state — specifically the IRGC's economic interests and its determination to avoid prosecution.",

    phases: [
      {
        number: "PHASE 1",
        label: "IRGC-Managed Insider Succession",
        trigger: "Trigger: Death or incapacitation of Supreme Leader Khamenei",
        title: "The Militarized Stabilization Government",
        color: "#ef5350",
        analysis: "The IRGC controls the security apparatus, intelligence networks, and a sprawling economic empire. Upon the Supreme Leader's death, the IRGC will violently manage the immediate transition to protect its assets and personnel from prosecution — not to enable democracy.",
        items: [
          "The death/incapacitation of the Supreme Leader does NOT result in immediate democratic liberation",
          "The IRGC executes an insider succession to establish a militarized stabilization government",
          "Possible forms: weak clerical successor installed as a puppet; an unconstitutional collective council; or a militarized 'national salvation' government",
          "The IRGC's primary motivation: protect its economic empire (Khatam al-Anbiya, Bonyads) and shield its command echelon from prosecution",
          "URI methodology during this phase: maintain civil pressure and prevent the international community from legitimizing the militarized restoration as genuine 'reform'",
          "International recognition of a successor IRGC-controlled government would reset the transition clock — blocking this is a core URI strategic objective",
        ],
      },
      {
        number: "PHASE 2",
        label: "The Genuine Opening",
        trigger: "Trigger: Administrative failure of the IRGC successor government",
        title: "Elite Fragmentation + Systemic Rupture",
        color: "#e8507a",
        analysis: "The IRGC's militarized successor regime is fundamentally incapable of delivering economic relief, resolving the environmental crisis, or restoring social dignity. This administrative failure triggers elite fragmentation — deep divisions between the IRGC, the civilian bureaucracy, and the marginalized traditional clergy.",
        items: [
          "The successor regime fails to stabilize the economy, resolve the water crisis, or restore social dignity — this failure is structurally predetermined",
          "Administrative failure triggers elite fragmentation: deep divisions between IRGC, civilian bureaucracy, and traditional clergy",
          "It is at THIS juncture that the URI's full operational strategy deploys",
          "Coordinated nationwide strikes across critical sectors: teachers, oil workers, transport workers, and merchants operating simultaneously",
          "Mass sustained civil resistance paralyzes the state's economic and security apparatus",
          "The objective: force the weakened, divided security elite into a fundamental renegotiation of the social contract",
          "State paralysis collapses the IRGC's command structure — culminating in a democratically elected Constituent Assembly",
          "The Constituent Assembly drafts a new secular constitution and oversees the transfer of power to civilian authorities",
        ],
      },
    ],

    // ── POWER STRUCTURE ──
    powerEyebrow: "Proposed Power Structure",
    powerTitle: "The USRHR Internal Model as a National Blueprint",
    powerIntro: "The URI's proposed national power structure is most clearly understood by examining the internal governance model of the Union for Secular Republic and Human Rights in Iran (USRHR). Their internal Article of Association serves as a micro-blueprint for their macro-state aspirations: power is heavily distributed, no single entity holds ultimate authority, and oversight is structural.",

    usrhrModel: {
      title: "The USRHR Internal Model → National Translation",
      items: [
        "Internal: the Congress (representing all chapters) = National: elected Parliament as the apex representative body",
        "Internal: Political-Executive Committee (daily operations) = National: elected President + Executive Cabinet",
        "Internal: High Council (oversight + power of removal) = National: Parliament checking and balancing the Executive",
        "This is not theoretical — the coalition has already been living the governance model they propose for the nation",
      ],
    },

    powerNodes: [
      {
        icon: "🏛️",
        title: "National Parliament",
        role: "Apex Authority · Legislative Supremacy",
        sub: "Directly elected by universal suffrage · holds ultimate legislative authority · oversees, checks, and balances the President/Executive · possesses the power of removal",
        color: "#e8507a",
        items: [
          "Ultimate sovereignty rests with the electorate, exercised through Parliament",
          "No divine, hereditary, or ideological mandate — seats filled by competitive elections only",
          "Principle of Alternation of Power: mandatory periodic turnover, no lifelong tenures",
          "Parliament checks the President and has power of removal",
        ],
      },
      {
        icon: "⚙️",
        title: "President + Executive Cabinet",
        role: "Execution of daily state operations",
        sub: "Elected President manages day-to-day state operations · constantly overseen by Parliament · Cabinet appointed and removable",
        color: "#4fc3f7",
        items: [
          "Manages national defense, foreign affairs, and macroeconomic policy",
          "Constantly overseen by Parliament — not a dominant presidential system",
          "All cabinet appointments subject to parliamentary confirmation",
          "Ministries purged of ideological overseers — replaced by technocrats",
        ],
      },
      {
        icon: "⚖️",
        title: "Independent Judiciary",
        role: "Legal authority — fully secular",
        sub: "Completely independent of both Executive and Legislative branches · stripped of all clerical oversight · bound strictly by secular legal procedures",
        color: "#ffd166",
        items: [
          "Enforces the secular constitution and UDHR independently of political pressure",
          "Total abolition of capital punishment and torture — constitutionally enshrined",
          "Presumption of innocence and international legal standards — no revolutionary tribunals",
          "Completely replaces the parallel theocratic justice system and Special Clerical Courts",
        ],
      },
      {
        icon: "🗺️",
        title: "Provincial + City + Village Councils",
        role: "Decentralized local administration",
        sub: "Central government legally delegates local administrative, cultural, and economic affairs to locally elected bodies",
        color: "#69d98c",
        items: [
          "Decentralization without formal federalism — a carefully calibrated middle path",
          "Designed to erase severe economic disparities between Tehran center and rural peripheries",
          "Ethnic language promotion and cultural protection managed at the local level",
          "Empowers ethnic minorities and rural populations without fracturing the state",
        ],
      },
      {
        icon: "📰",
        title: "Independent Mass Media",
        role: "Fourth estate — structural oversight pillar",
        sub: "Mandatory media independence as a constitutional structural fail-safe — not merely a press freedom guarantee",
        color: "#ba68c8",
        items: [
          "Mass media independence is treated as a structural fourth-estate oversight pillar — not just a civil liberty",
          "Serves as a buffer against state overreach alongside civil society organizations",
          "Formal integration of labor unions, trade syndicates, and NGOs into governance dialogue",
          "These non-governmental fail-safes are the most distinctive architectural feature of the URI blueprint — no other Iranian opposition plan treats media independence as a constitutional structural element",
        ],
      },
    ],

    // ── INSTITUTIONAL TARGETS ──
    instEyebrow: "Institutional Targeting Policy",
    instTitle: "Surgical Distinctions — Annihilate vs. Reform",
    instIntro: "The URI draws clear surgical distinctions between institutions that must be annihilated (due to inherent ideological or coercive nature) and those that must be heavily reformed to maintain national stability. This is informed by careful analysis of failed transitions.",

    institutions: [
      {
        icon: "🔱",
        title: "IRGC + Basij",
        status: "FULL DISMANTLEMENT",
        statusColor: "#ef5350",
        policy: "The paramount adversary and absolute center of gravity of the deep state. Not viewed merely as a military force, but as a sprawling economic empire, unaccountable intelligence apparatus, and mafia-like syndicate. Must be entirely dismantled, its economic monopolies broken, and its command structure thoroughly purged to prevent any possibility of militarized restoration.",
        causal: "Transitional Authority strips the IRGC of its economic empire and security mandate to neutralize its capacity as an arbiter of power. The IRGC's institutional survival would permanently block democratic transition — it has both the motive and capability to stage a counter-revolution.",
        note: null,
      },
      {
        icon: "⚔️",
        title: "Artesh (Regular Army)",
        status: "NOT SPECIFIED — LIKELY PRESERVED",
        statusColor: "#ffd166",
        policy: "Not specified in official URI/Hamgami texts. However, unlike the ideologically driven IRGC, secular republican factions traditionally view the Artesh as a conventional, salvageable national defense force.",
        causal: "The absence of aggressive rhetoric toward the Artesh in URI charters implies an operational intent to decouple the regular army from the theocracy and retain it for territorial defense, pending structural reforms. The IRGC is explicitly targeted for destruction — the Artesh is not.",
        note: "This mirrors the ITC's approach — strategic ambiguity on the Artesh likely reflects coalition building with potential military defectors, whose cooperation is essential for preventing civil war during the transition.",
      },
      {
        icon: "🏛️",
        title: "Clerical Courts (Dadgah-e Vizheh-ye Ruhaniyyat)",
        status: "TOTAL ANNIHILATION",
        statusColor: "#ef5350",
        policy: "Faces total annihilation. The parallel religious justice system is viewed as an instrument of ideological terror — its entire apparatus to be replaced by an independent, secular judiciary operating strictly on international legal procedures.",
        causal: "The secular constitution nullifies religious decrees as a basis for law, which mathematically eliminates clerical court jurisdiction. The Independent Judiciary enforces the UDHR and guarantees presumption of innocence — structurally incompatible with the theocratic justice parallel system.",
        note: null,
      },
      {
        icon: "🏢",
        title: "Civilian Ministries + Bureaucracy",
        status: "AGGRESSIVE REFORM",
        statusColor: "#69d98c",
        policy: "Targeted for aggressive reform rather than wholesale destruction. Currently paralyzed by structural corruption, ideological nepotism, and inefficiency. The transition blueprint requires purging ideological overseers and replacing them with qualified technocrats, prioritizing scientific specialization and meritocracy over religious loyalty.",
        causal: "Wholesale destruction of the civilian bureaucracy would create a total administrative vacuum — the exact failure the blueprint seeks to avoid. Technocratic reform allows continuity of essential services while fundamentally reorienting institutional culture.",
        note: null,
      },
      {
        icon: "💰",
        title: "Bonyads (Islamic Charitable Foundations)",
        status: "DISMANTLED AS CARTELS",
        statusColor: "#ff9a42",
        policy: "Dismantled as independent entities. Described as 'mafia bands' that distort the market and fund regime survival. Assets will be absorbed into the transparent, taxable national economy or repurposed to fund the proposed universal social safety nets.",
        causal: "The Bonyads (Bonyad Mostazafin, Astan Quds Razavi, EIKO) control vast untaxed swathes of the non-oil economy. Their dismantlement is required both to establish a fair competitive market and to sever a primary financial lifeline of the theocratic apparatus.",
        note: null,
      },
    ],

    // ── KEY POLICIES ──
    polEyebrow: "Key Policy Stances",
    polTitle: "Four Structural Policy Frameworks",
    polIntro: "The policy architecture reflects a sophisticated synthesis of liberal democratic governance, social democratic economics, and fiercely progressive human rights standards — designed to rectify the Islamic Republic's systemic failures while avoiding both radical Marxist redistribution and unregulated hyper-capitalism.",

    policies: [
      {
        icon: "📊",
        title: "Economy: The Mixed Model",
        color: "#ffd166",
        items: [
          "REJECTS both radical Marxist wealth confiscation AND the IRGC/Bonyad predatory state-monopoly capitalism",
          "Transition from the current consumption-based, non-competitive, rent-seeking economy to a production-based, competitive market",
          "Private enterprise actively encouraged — foreign investment, modern technology, global economic reintegration",
          "BUT the state retains strategic control over critical national infrastructure: oil, steel, railways",
          "Universal social safety nets mandated by law: universal health insurance, unemployment benefits, disability support, total ban on child labor",
          "Aggressive macroeconomic policies to reduce the wealth and class gap",
          "Environmental protection intrinsically tied to economic development — specifically targets the drying of Lake Urmia and water resource mismanagement",
          "The Left Party of Iran (LPI) and National Front within the coalition ensure the social democratic guardrails remain intact against pure market liberalism",
        ],
      },
      {
        icon: "🗺️",
        title: "Minorities: Decentralized Integrity",
        color: "#69d98c",
        items: [
          "REJECTS separatism and autonomous border breakup — full preservation of Iran's territorial integrity",
          "REJECTS hyper-centralization — the model of both the Islamic Republic and the Pahlavi monarchy",
          "Mandates a decentralized state — but explicitly stops short of declaring a formal federal system",
          "Local affairs aggressively delegated to provincial and village councils",
          "Designed to erase severe economic and infrastructural disparities between Tehran and the peripheries",
          "Persian (Farsi) maintained as the common national language",
          "ALL ethnic languages (Kurdish, Balochi, Azeri, Arabic, Turkmen) mandated for promotion, protection, and flourishing as vital components of shared cultural heritage",
          "The high-risk tension: weakening the central security apparatus during the transition could be exploited by armed separatist factions — success depends on rapidly delivering economic relief before peripheral fractures widen",
        ],
      },
      {
        icon: "⚖️",
        title: "Justice: No Bloodshed, No Blanket Amnesty",
        color: "#ba68c8",
        items: [
          "Absolute rejection of 'blind revenge-seeking' and political retribution",
          "No revolutionary executions — no summary tribunals",
          "Total abolition of capital punishment and torture — constitutionally enshrined",
          "Former regime members, IRGC commanders, and corrupt officials: NOT given blanket amnesty",
          "Handled exclusively through independent, secular courts — bound by just legal procedures and the presumption of innocence",
          "International legal standards throughout — no extrajudicial violence of any form",
          "This position navigates the tension between accountability (no blanket amnesty) and rule of law (no revolutionary executions) — the most legally sophisticated transitional justice stance of any Iranian opposition plan",
        ],
      },
      {
        icon: "🌍",
        title: "Foreign Policy: Total Normalization",
        color: "#4fc3f7",
        items: [
          "Radical, systemic realignment of Iran's geopolitical posture — predicated on peace, non-interference, and national interest",
          "Complete normalization of diplomatic and economic relations with ALL countries — explicitly including the United States AND Israel",
          "Immediate withdrawal from all regional proxy conflicts — end funding, arming, and deployment of Hezbollah, Hamas, Houthis, and all affiliated networks",
          "Commitment to the DESTRUCTION and prohibition of weapons of mass destruction — terminating the nuclear weapons program",
          "Iran's reintegration into the international community as a non-threatening, compliant actor",
          "International sanctions lifted upon demonstrated compliance with human rights and nuclear non-proliferation commitments",
          "The geopolitical logic: cessation of proxy sponsorship would force rapid de-escalation in regional hotspots — groups like Hezbollah face either integration into domestic political structures or collapse from financial starvation",
        ],
      },
    ],

    // ── GEOPOLITICAL IMPLICATIONS ──
    geoEyebrow: "Second-Order Geopolitical Implications",
    geoTitle: "What a Secular Iranian Republic Does to the Middle East",
    geoIntro: "The successful implementation of the URI/Hamgami blueprint would trigger profound second and third-order effects on Middle Eastern security, global energy markets, and international security architectures — making the geopolitical stakes of this transition far larger than Iran alone.",

    geoCards: [
      {
        number: "01",
        title: "Collapse of the Axis of Resistance",
        body: "The cessation of funding and logistical support to Hezbollah, Hamas, and militant factions in Iraq and Yemen would significantly degrade their operational capabilities. Proxy groups would face either forced integration into domestic political structures or systemic collapse from financial and logistical starvation. This sudden vacuum would likely trigger rapid, forced de-escalation in regional hotspots and fundamentally alter the strategic calculus of Saudi Arabia and the UAE — potentially ushering in an era of unprecedented regional economic integration.",
        color: "#e8507a",
      },
      {
        number: "02",
        title: "Global Energy Market Disruption",
        body: "Dismantling the IRGC's 'sanctioned economy' and the Bonyads, coupled with the transition to a competitive market open to foreign investment, would violently reorient global energy and trade vectors. The rapid influx of Iranian hydrocarbons would exert downward pressure on global oil and gas prices — straining rentier state fiscal calculations across the GCC. Simultaneously, a market of 85+ million consumers would open to Western and Asian foreign direct investment — though within a socially democratic regulatory framework, not a radically privatized free-for-all.",
        color: "#ffd166",
      },
      {
        number: "03",
        title: "The Peripheral Fracture Risk",
        body: "The strict policy of decentralization without formal federalism is a high-risk socio-political experiment. While intended to defuse Kurdish, Arab, and Baloch grievances, weakening the central security apparatus during the transitional phase could be violently exploited by armed separatist factions. The success of this blueprint hinges entirely on the new republic's ability to swiftly deliver economic relief, environmental stabilization (particularly the Lake Urmia water crisis), and social dignity — the 'Genuine Opening' — before peripheral fractures can widen into geographic collapse.",
        color: "#69d98c",
      },
    ],

    conclusion: "\"The URI and Hamgami blueprint represents the most comprehensively institutionalized alternative to both the current theocracy and the return of autocracy. If the secular democratic republic can successfully navigate the perilous transition phases, it possesses the structural architecture required to emerge as a pluralistic, economically potent, and stabilizing anchor in a chronically volatile region.\" — URI/Hamgami Blueprint Strategic Assessment",

    source: "Source: Hamgami Coalition Fundamental Principles (hamgami.org) · USRHR Article of Association (iranian-republic.org) · URI founding documents · Left Party of Iran manifestos · Founded 2004 / Consolidated under Hamgami 2023",
  },

  fa: {
    heroEyebrow: "جمهوری‌خواهان متحد ایران (URI) · ائتلاف همگامی · تأسیس ۲۰۰۴ / تجمیع ۲۰۲۳",
    heroTitle: "طرح جمهوری دموکراتیک سکولار",
    heroDesc: "ائتلاف URI و همگامی (همبستگی برای استقرار جمهوری دموکراتیک سکولار در ایران) نهادینه‌ترین جایگزین سکولار هم برای تئوکراسی کنونی و هم برای هر بازگشت استبداد را نمایندگی می‌کند. ریشه در لائیسیته سختگیرانه، لیبرالیسم پیشرو و اعلامیه جهانی حقوق بشر سازمان ملل دارد و به طور منحصربه‌فردی سه وضعیت نهایی را همزمان رد می‌کند: تئوکراسی، سلطنت و فرقه‌گرایی پیشاهنگی.",
    heroBadges: [
      { label: "لائیسیته سختگیرانه", c: "#e8507a" },
      { label: "ائتلاف ۵ سازمانی", c: "#4fc3f7" },
      { label: "منطق دو مرحله‌ای", c: "#ffd166" },
      { label: "ضدسلطنت + ضدتئوکراسی", c: "#ef5350" },
      { label: "اقتصاد مختلط", c: "#69d98c" },
      { label: "مدل دولت-ملت", c: "#ba68c8" },
    ],

    ideolEyebrow: "ایدئولوژی محوری — سه‌گانه رد",
    ideolTitle: "لائیسیته، کثرت‌گرایی و پایان دائمی استبداد",
    ideolIntro: "معماری ایدئولوژیک ائتلاف همگامی به همان اندازه که با آنچه پیشنهاد می‌دهد تعریف می‌شود، با آنچه رد می‌کند نیز مشخص می‌شود. تنها جبهه بزرگ اپوزیسیون ایرانی است که همزمان و صراحتاً هر سه مسیر استبداد تجدید شده را رد می‌کند.",

    rejections: [
      { label: "حقوق الهی / ولایت فقیه / تئوکراسی", color: "#ef5350" },
      { label: "حقوق موروثی / سلطنت پهلوی / احیا", color: "#ff9a42" },
      { label: "فرقه‌گرایی پیشاهنگانه / مجاهدین خلق / میلیشیا ایدئولوژیک", color: "#ba68c8" },
    ],

    laiteciteNote: "دکترین سکولاریسم ائتلاف مشخصاً مدل فرانسوی لائیسیته است — نه صرفاً جدایی کلیسا از دولت، بلکه کوری نهادی کامل دستگاه دولتی نسبت به وابستگی‌های مذهبی، قومی و ایدئولوژیک شهروندانش. دستگاه دولتی ساختاری از هرگونه تسخیر توسط هر جناح مذهبی یا ایدئولوژیک ناتوان می‌شود.",

    coreCommitments: {
      title: "پنج تعهد ایدئولوژیک محوری",
      color: "#e8507a",
      items: [
        "لائیسیته سختگیرانه — جدایی نهادی کامل دین از حکومت؛ بدون مذهب رسمی دولتی؛ هیچ قانونی نمی‌تواند بر احکام مذهبی متکی باشد",
        "جمهوری‌خواهی به عنوان وضعیت نهایی غیرقابل مذاکره — نه صرفاً یک قالب موقت، بلکه درمان ساختاری دائمی برای آسیب‌پذیری تاریخی ایران در برابر استبداد",
        "کثرت‌گرایی سیاسی — حذف کامل تبعیض نهادینه؛ برابری مطلق برای زنان، افراد LGBTQ و اقلیت‌های قومی",
        "اعلامیه جهانی حقوق بشر به عنوان لنگر حقوقی بنیادین هر نهاد، قانون و ماده قانون اساسی",
        "'اصل تناوب قدرت' — گردش دوره‌ای اجباری؛ الغای کامل مناصب مادام‌العمر، موروثی یا منصوب‌شده توسط خدا",
      ],
    },

    stateNation: {
      title: "مدل 'دولت-ملت' — چرا 'جمهوری' غیرقابل مذاکره است",
      items: [
        "ائتلاف جمهوری‌خواهی را نه به عنوان یکی از گزینه‌های حاکمیتی، بلکه به عنوان تنها راه‌حل ساختاری برای چرخه مکرر استبداد ایران می‌بیند",
        "یک 'ملت-دولت' هویت را حول یک هسته قومی — فارس — متمرکز می‌کند و از نظر تاریخی فشار استحاله بر اقلیت‌ها را ممکن می‌سازد",
        "یک 'دولت-ملت' هویت مدنی را حول نهادها و حقوق مشترک می‌سازد، نه قومیت — به جمعیت چندقومی ایران جایگاه برابر واقعی می‌دهد",
        "این تمایز مهم است: توضیح می‌دهد چرا ائتلاف همزمان فارسی را به عنوان زبان مشترک حفظ می‌کند و تمام زبان‌های اقلیت را با نیروی قانون اساسی برابر محافظت می‌کند",
      ],
    },

    coalEyebrow: "ائتلاف همگامی — پنج سازمان",
    coalTitle: "یک چتر کثرت‌گرای ساختارمند",
    coalIntro: "در سال ۲۰۲۳ پس از جنبش 'زن، زندگی، آزادی' تجمیع شد و پنج سازمان سیاسی بزرگ را در طیف جمهوری‌خواهی سکولار، سوسیالیسم دموکراتیک، دموکراسی لیبرال و دفاع از حقوق بشر گرد هم آورد.",

    coalition: [
      { org: "جمهوری‌خواهان متحد ایران (URI)", ideology: "جمهوری‌خواهی سکولار · پیشروگرایی پست‌چپ", contribution: "معماری ائتلاف · طرح سکولار · دفاع از ضدسلطنت · سازماندهی دیاسپورا. تأسیس ۲۰۰۴ توسط شریعتمداری و نگهدار.", color: "#e8507a" },
      { org: "حزب چپ ایران (LPI)", ideology: "سوسیالیسم دموکراتیک · چپ سکولار", contribution: "جناح چپگرای غالب — تضمین می‌کند مدل اقتصادی حقوق کارگری، شبکه‌های ایمنی اجتماعی و برابری اقتصادی را در کنار اصلاح بازار اولویت‌بندی کند.", color: "#4fc3f7" },
      { org: "جبهه ملی ایران (اروپا)", ideology: "دموکراسی لیبرال · سوشیال دموکراسی", contribution: "تداوم تاریخی به دوره مصدق ۱۹۴۹ — مشروعیت عمیق حاکمیت ملی و چارچوب اقتصادی مختلط به ائتلاف ارائه می‌دهد.", color: "#ffd166" },
      { org: "سازمان‌های جبهه ملی ایران خارج از کشور", ideology: "دموکراسی لیبرال · ناسیونالیسم سکولار", contribution: "همسویی اداری · مشروعیت تاریخی · دسترسی دیپلماتیک بین‌المللی.", color: "#69d98c" },
      { org: "اتحاد برای جمهوری سکولار و حقوق بشر در ایران (USRHR)", ideology: "دفاع از حقوق بشر · سکولاریسم سختگیرانه", contribution: "چارچوب‌های حاکمیت داخلی تفصیلی، منشورها، سیاست‌های ضدتبعیض و معماری حقوقی UDHR. اساسنامه داخلی آن به عنوان میکروطرح برای ساختار ملی دولت عمل می‌کند.", color: "#ba68c8" },
    ],

    transEyebrow: "روش‌شناسی — منطق گذار دو مرحله‌ای",
    transTitle: "واقع‌بینانه‌ترین مسیر: محاسبه سپاه",
    transIntro: "برخلاف طرح‌هایی که یک لحظه واحد فروپاشی رژیم را فرض می‌گیرند، طرح URI/همگامی بر یک منطق گذار دو مرحله‌ای هوشمندانه بنا شده که از تحلیل دقیق انعطاف‌پذیری نهادی جمهوری اسلامی مشتق شده است.",

    triggerNote: "منطق دو مرحله‌ای صراحتاً تصور یک سرنگونی آنی و رمانتیک را رد می‌کند. حول غریزه بقای دولت امنیتی کنونی — به ویژه منافع اقتصادی سپاه و تصمیم آن برای اجتناب از پیگرد — طراحی شده است.",

    phases: [
      {
        number: "مرحله ۱",
        label: "جانشینی داخلی مدیریت‌شده توسط سپاه",
        trigger: "محرک: مرگ یا از کار افتادگی رهبر معظم",
        title: "دولت تثبیت نظامی‌شده",
        color: "#ef5350",
        analysis: "سپاه دستگاه امنیتی، شبکه‌های اطلاعاتی و یک امپراتوری اقتصادی گسترده را کنترل می‌کند. پس از مرگ رهبر، سپاه برای حفاظت از دارایی‌ها و کادر فرماندهی از پیگرد، گذار فوری را به خشونت مدیریت می‌کند — نه برای فعال‌سازی دموکراسی.",
        items: [
          "مرگ/از کار افتادگی رهبر منجر به آزادسازی دموکراتیک فوری نمی‌شود",
          "سپاه یک جانشینی داخلی برای استقرار دولت تثبیت نظامی‌شده اجرا می‌کند",
          "اشکال احتمالی: جانشین روحانی ضعیف؛ یک شورای غیرقانون اساسی جمعی؛ یا یک دولت 'نجات ملی' نظامی‌شده",
          "انگیزه اصلی سپاه: حفاظت از امپراتوری اقتصادی و سپر کادر فرماندهی از پیگرد",
          "روش URI در این مرحله: حفظ فشار مدنی و جلوگیری از مشروعیت‌بخشی جامعه بین‌المللی به احیای نظامی‌شده",
        ],
      },
      {
        number: "مرحله ۲",
        label: "گشایش واقعی",
        trigger: "محرک: شکست اداری دولت جانشین سپاه",
        title: "تجزیه نخبگان + گسستگی سیستمی",
        color: "#e8507a",
        analysis: "رژیم جانشین نظامی‌شده سپاه اساساً ناتوان از ارائه تسکین اقتصادی، حل بحران زیست‌محیطی یا احیای کرامت اجتماعی است. این شکست اداری تجزیه نخبگان را تحریک می‌کند: شکاف‌های عمیق بین سپاه، بوروکراسی غیرنظامی و روحانیت سنتی حاشیه‌رانده‌شده.",
        items: [
          "رژیم جانشین در تثبیت اقتصاد، حل بحران آب یا احیای کرامت اجتماعی شکست می‌خورد — این شکست از نظر ساختاری از پیش تعیین شده است",
          "شکست اداری تجزیه نخبگان را تحریک می‌کند: شکاف‌های عمیق بین سپاه، بوروکراسی و روحانیت",
          "دقیقاً در این نقطه استراتژی عملیاتی کامل URI مستقر می‌شود",
          "اعتصابات ملی هماهنگ در بخش‌های حیاتی: معلمان، کارگران نفت، کارگران حمل‌ونقل و بازرگانان به طور همزمان",
          "مقاومت مدنی پایدار دستگاه اقتصادی و امنیتی دولت را فلج می‌کند",
          "هدف: مجبور کردن نخبگان امنیتی ضعیف و تجزیه‌شده به مذاکره بنیادی درباره قرارداد اجتماعی",
          "فلج دولتی ساختار فرماندهی سپاه را فرو می‌پاشد — منجر به مجلس مؤسسان می‌شود",
        ],
      },
    ],

    powerEyebrow: "ساختار قدرت پیشنهادی",
    powerTitle: "مدل داخلی USRHR به عنوان طرح ملی",
    powerIntro: "ساختار قدرت ملی پیشنهادی URI با بررسی مدل حاکمیت داخلی USRHR بهترین درک را دارد. اساسنامه داخلی آن به عنوان میکروطرح برای آرزوهای کلان‌دولتی آن‌ها عمل می‌کند.",

    usrhrModel: {
      title: "مدل داخلی USRHR → ترجمه ملی",
      items: [
        "داخلی: کنگره (نماینده تمام شعبه‌ها) = ملی: پارلمان منتخب به عنوان نهاد نمایندگی ارشد",
        "داخلی: کمیته سیاسی-اجرایی (عملیات روزانه) = ملی: رئیس‌جمهور + هیئت دولت",
        "داخلی: شورای عالی (نظارت + قدرت برکناری) = ملی: پارلمان بررسی و تعادل قوه مجریه",
        "این نظری نیست — ائتلاف از قبل مدل حاکمیتی که برای کشور پیشنهاد می‌دهد را زندگی کرده است",
      ],
    },

    powerNodes: [
      { icon: "🏛️", title: "پارلمان ملی", role: "اقتدار ارشد · برتری قانونگذاری", sub: "مستقیماً توسط رأی همگانی انتخاب می‌شود · اختیار قانونگذاری نهایی دارد · رئیس‌جمهور/قوه مجریه را نظارت و کنترل می‌کند", color: "#e8507a", items: ["حاکمیت نهایی در رأی‌دهندگان است، از طریق پارلمان اعمال می‌شود", "بدون مأموریت الهی، موروثی یا ایدئولوژیک", "اصل تناوب قدرت: گردش دوره‌ای اجباری", "پارلمان رئیس‌جمهور را کنترل می‌کند و قدرت برکناری دارد"] },
      { icon: "⚙️", title: "رئیس‌جمهور + هیئت دولت", role: "اجرای عملیات روزانه دولتی", sub: "رئیس‌جمهور منتخب عملیات روزانه را مدیریت می‌کند · دائماً توسط پارلمان نظارت می‌شود", color: "#4fc3f7", items: ["دفاع ملی، امور خارجه و سیاست کلان اقتصادی را مدیریت می‌کند", "دائماً توسط پارلمان نظارت می‌شود — نه یک سیستم ریاستی غالب", "وزارتخانه‌ها از ناظران ایدئولوژیک پاکسازی شده — جایگزین با تکنوکرات‌ها"] },
      { icon: "⚖️", title: "قوه قضاییه مستقل", role: "اقتدار حقوقی — کاملاً سکولار", sub: "کاملاً مستقل از هر دو قوه مجریه و مقننه · از تمام نظارت روحانی سلب شده", color: "#ffd166", items: ["قانون اساسی سکولار و UDHR را به طور مستقل از فشار سیاسی اجرا می‌کند", "الغای کامل مجازات اعدام و شکنجه", "فرض بی‌گناهی و استانداردهای حقوقی بین‌المللی — بدون دادگاه‌های انقلابی"] },
      { icon: "🗺️", title: "شوراهای استانی + شهری + روستایی", role: "اداره محلی غیرمتمرکز", sub: "دولت مرکزی امور اداری، فرهنگی و اقتصادی محلی را به نهادهای منتخب محلی تفویض می‌کند", color: "#69d98c", items: ["غیرمتمرکزسازی بدون فدرالیسم رسمی", "برای محو تفاوت‌های اقتصادی شدید بین مرکز و حاشیه طراحی شده", "ترویج زبان قومی و حمایت فرهنگی در سطح محلی مدیریت می‌شود"] },
      { icon: "📰", title: "رسانه مستقل", role: "رکن چهارم — ستون نظارت ساختاری", sub: "استقلال رسانه‌ای اجباری به عنوان یک ضامن ساختاری قانون اساسی — نه صرفاً یک تضمین آزادی مطبوعات", color: "#ba68c8", items: ["استقلال رسانه به عنوان رکن چهارم نظارتی ساختاری تلقی می‌شود — نه صرفاً یک آزادی مدنی", "به عنوان سپری در برابر تجاوز دولتی در کنار سازمان‌های جامعه مدنی عمل می‌کند", "ادغام رسمی سندیکاهای کارگری، اتحادیه‌های صنفی و NGOها در گفتگوی حاکمیتی", "این ویژگی منحصربه‌فردترین معماری URI است — هیچ طرح دیگری استقلال رسانه را به عنوان عنصر ساختاری قانون اساسی نمی‌بیند"] },
    ],

    instEyebrow: "سیاست هدف‌گیری نهادی",
    instTitle: "تمایزات جراحی — نابودی در مقابل اصلاح",
    instIntro: "URI تمایزات جراحی واضحی بین نهادهایی که باید نابود شوند و آن‌هایی که باید به شدت اصلاح شوند تا ثبات ملی حفظ شود قائل می‌شود.",

    institutions: [
      { icon: "🔱", title: "سپاه + بسیج", status: "برچیدن کامل", statusColor: "#ef5350", policy: "دشمن اصلی و مرکز ثقل مطلق دولت پنهان. نه صرفاً یک نیروی نظامی بلکه یک امپراتوری اقتصادی گسترده، دستگاه اطلاعاتی غیرپاسخگو و یک سیندیکای مافیایی. باید کاملاً برچیده شود، انحصارهای اقتصادی‌اش شکسته شود و ساختار فرماندهی‌اش کاملاً پاکسازی شود.", causal: "قدرت نهادی سپاه بقای دموکراتیک را به طور دائمی مسدود می‌کند — هم انگیزه و هم توانایی یک ضدانقلاب را دارد.", note: null },
      { icon: "⚔️", title: "ارتش (نیروهای رسمی)", status: "مشخص نشده — احتمالاً حفظ می‌شود", statusColor: "#ffd166", policy: "در متون رسمی URI/همگامی مشخص نشده. با این حال، برخلاف سپاه که ایدئولوژیک و فراقانون اساسی است، جناح‌های جمهوری‌خواه سکولار به طور سنتی ارتش را یک نیروی دفاع ملی قابل بازیابی می‌بینند.", causal: "غیاب لفاظی تهاجمی علیه ارتش در منشورهای URI نشان‌دهنده یک قصد عملیاتی برای جدا کردن ارتش رسمی از تئوکراسی و حفظ آن برای دفاع سرزمینی است.", note: "این موضع ITC را منعکس می‌کند — ابهام استراتژیک در مورد ارتش احتمالاً منعکس‌کننده ساختن ائتلاف با فراریان احتمالی نظامی است." },
      { icon: "🏛️", title: "دادگاه‌های روحانی", status: "نابودی کامل", statusColor: "#ef5350", policy: "با کامل‌ترین نابودی روبرو می‌شوند. سیستم موازی عدالت مذهبی به عنوان ابزار وحشت ایدئولوژیک تلقی می‌شود — کل دستگاه با یک قوه قضاییه مستقل و سکولار جایگزین می‌شود.", causal: "قانون اساسی سکولار احکام مذهبی را به عنوان مبنای قانون باطل می‌کند که صلاحیت دادگاه‌های روحانی را ریاضیاتاً از بین می‌برد.", note: null },
      { icon: "🏢", title: "وزارتخانه‌ها + بوروکراسی", status: "اصلاح قاطعانه", statusColor: "#69d98c", policy: "برای اصلاح قاطعانه هدف قرار گرفته نه تخریب کامل. در حال حاضر توسط فساد ساختاری، نپوتیسم ایدئولوژیک و ناکارآمدی فلج شده. طرح گذار پاکسازی ناظران ایدئولوژیک و جایگزینی با تکنوکرات‌های واجد شرایط را الزامی می‌کند.", causal: "تخریب کامل بوروکراسی غیرنظامی یک خلاء اداری کامل ایجاد می‌کند — دقیقاً همان شکستی که طرح می‌خواهد از آن اجتناب کند.", note: null },
      { icon: "💰", title: "بنیادها (بنیادهای خیریه اسلامی)", status: "برچیدن به عنوان کارتل", statusColor: "#ff9a42", policy: "به عنوان نهادهای مستقل برچیده می‌شوند. به عنوان 'باندهای مافیایی' توصیف می‌شوند که بازار را اعوجاج می‌دهند و بقای رژیم را تأمین مالی می‌کنند. دارایی‌ها در اقتصاد ملی شفاف و مالیات‌دهنده جذب یا برای شبکه‌های ایمنی اجتماعی صرف می‌شوند.", causal: "بنیادها (بنیاد مستضعفان، آستان قدس رضوی، ستاد) بخش‌های گسترده اقتصاد غیرنفتی معاف از مالیات را کنترل می‌کنند. برچیدن آن‌ها هم برای ایجاد بازار رقابتی منصفانه و هم برای قطع یک خط مالی اصلی دستگاه تئوکراتیک لازم است.", note: null },
    ],

    polEyebrow: "مواضع سیاستی کلیدی",
    polTitle: "چهار چارچوب سیاستی ساختاری",
    polIntro: "معماری سیاستی ترکیب پیچیده‌ای از حاکمیت دموکراتیک لیبرال، اقتصاد سوشیال‌دموکراتیک و استانداردهای فوق‌العاده پیشرو حقوق بشری را منعکس می‌کند.",

    policies: [
      { icon: "📊", title: "اقتصاد: مدل مختلط", color: "#ffd166", items: ["هم مصادره ثروت رادیکال مارکسیستی و هم سرمایه‌داری دولت-انحصاری غارتگر سپاه/بنیاد را رد می‌کند", "گذار از اقتصاد مصرفی غیررقابتی رانت‌خوار به بازار رقابتی تولیدمحور", "بنگاه خصوصی به شدت تشویق می‌شود — سرمایه‌گذاری خارجی، فناوری مدرن", "اما دولت کنترل استراتژیک بر زیرساخت‌های حیاتی حفظ می‌کند: نفت، فولاد، راه‌آهن", "شبکه‌های ایمنی اجتماعی همگانی: بیمه بهداشت همگانی، بیمه بیکاری، حمایت از معلولان، ممنوعیت کامل کار کودکان", "حفاظت از محیط زیست ذاتاً به توسعه اقتصادی گره خورده است — به ویژه بحران دریاچه ارومیه را هدف می‌گیرد"] },
      { icon: "🗺️", title: "اقلیت‌ها: یکپارچگی غیرمتمرکز", color: "#69d98c", items: ["تجزیه‌طلبی و تجزیه خودمختار مرزها را رد می‌کند — حفظ کامل تمامیت ارضی ایران", "تمرکزگرایی افراطی را رد می‌کند — مدل هم جمهوری اسلامی و هم سلطنت پهلوی", "دولت غیرمتمرکز اما صراحتاً کمتر از اعلام یک سیستم فدرال رسمی است", "فارسی (فارسی) به عنوان زبان ملی مشترک حفظ می‌شود", "همه زبان‌های قومی (کردی، بلوچی، آذری، عربی) برای ترویج، حمایت و شکوفایی الزامی می‌شوند", "ریسک بالا: تضعیف دستگاه امنیتی مرکزی در طول گذار می‌تواند توسط جناح‌های تجزیه‌طلب مسلح بهره‌برداری شود"] },
      { icon: "⚖️", title: "عدالت: نه خونریزی، نه عفو کلی", color: "#ba68c8", items: ["رد مطلق 'انتقام‌جویی کور' و مجازات سیاسی", "بدون اعدام انقلابی — بدون دادگاه‌های اختصاری", "الغای کامل مجازات اعدام و شکنجه", "اعضای سابق رژیم: عفو کلی داده نمی‌شود", "منحصراً از طریق دادگاه‌های مستقل و سکولار رسیدگی می‌شود — مقید به روش‌های قانونی عادلانه", "این موضع تنش بین پاسخگویی (بدون عفو کلی) و حاکمیت قانون (بدون اعدام انقلابی) را هدایت می‌کند"] },
      { icon: "🌍", title: "سیاست خارجی: عادی‌سازی کامل", color: "#4fc3f7", items: ["تجدیدآرایش رادیکال و سیستمی موضع ژئوپلیتیک ایران", "عادی‌سازی کامل روابط دیپلماتیک و اقتصادی با همه کشورها — از جمله صراحتاً آمریکا و اسرائیل", "خروج فوری از تمام درگیری‌های نیابتی منطقه‌ای — پایان تأمین مالی حزب‌الله، حماس، حوثی‌ها", "تعهد به نابودی و ممنوعیت سلاح‌های کشتار جمعی", "ادغام مجدد ایران در جامعه بین‌المللی به عنوان یک بازیگر غیرتهدیدکننده و تطبیق‌یافته"] },
    ],

    geoEyebrow: "پیامدهای ژئوپلیتیک مرتبه دوم",
    geoTitle: "یک جمهوری سکولار ایرانی به خاورمیانه چه می‌کند",
    geoIntro: "اجرای موفق طرح URI/همگامی پیامدهای مرتبه دوم و سوم عمیقی بر امنیت خاورمیانه، بازارهای انرژی جهانی و معماری‌های امنیت بین‌المللی ایجاد می‌کند.",

    geoCards: [
      { number: "۰۱", title: "فروپاشی محور مقاومت", body: "توقف تأمین مالی و حمایت لجستیکی از حزب‌الله، حماس و جناح‌های شبه‌نظامی در عراق و یمن توانایی عملیاتی آن‌ها را به طور قابل توجهی کاهش می‌دهد. گروه‌های نیابتی با ادغام اجباری در ساختارهای سیاسی داخلی یا فروپاشی سیستمی از گرسنگی مالی و لجستیکی روبرو خواهند شد. این خلاء در حمایت از نیابتیان احتمالاً منجر به کاهش تنش سریع و اجباری در نقاط داغ منطقه‌ای می‌شود.", color: "#e8507a" },
      { number: "۰۲", title: "اختلال بازار انرژی جهانی", body: "برچیدن 'اقتصاد تحریم‌شده' سپاه و بنیادها، همراه با گذار به بازار رقابتی باز برای سرمایه‌گذاری خارجی، بردارهای انرژی و تجاری جهانی را به شدت تغییر می‌دهد. ورود سریع هیدروکربن‌های ایرانی فشار نزولی بر قیمت‌های جهانی نفت و گاز وارد می‌کند. در عین حال، یک بازار ۸۵+ میلیونی برای سرمایه‌گذاری مستقیم خارجی غربی و آسیایی باز می‌شود.", color: "#ffd166" },
      { number: "۰۳", title: "ریسک شکست حاشیه‌ای", body: "سیاست غیرمتمرکزسازی سختگیرانه بدون فدرالیسم رسمی یک آزمایش اجتماعی-سیاسی پرخطر است. تضعیف دستگاه امنیتی مرکزی در طول مرحله گذار می‌تواند توسط جناح‌های تجزیه‌طلب مسلح بهره‌برداری شود. موفقیت این طرح کاملاً به توانایی جمهوری جدید برای ارائه سریع تسکین اقتصادی و کرامت اجتماعی بستگی دارد — 'گشایش واقعی' — قبل از اینکه شکاف‌های حاشیه‌ای بتوانند به فروپاشی جغرافیایی گسترش یابند.", color: "#69d98c" },
    ],

    conclusion: "«طرح URI و همگامی نهادینه‌ترین جایگزین جامع هم برای تئوکراسی کنونی و هم برای بازگشت استبداد را نمایندگی می‌کند. اگر جمهوری دموکراتیک سکولار بتواند با موفقیت از مراحل خطرناک گذار عبور کند، معماری ساختاری مورد نیاز برای ظهور به عنوان یک لنگر کثرت‌گرا، اقتصادی قدرتمند و تثبیت‌کننده در یک منطقه مزمناً ناپایدار را دارد.» — ارزیابی استراتژیک طرح URI/همگامی",

    source: "منبع: اصول بنیادی ائتلاف همگامی (hamgami.org) · اساسنامه USRHR (iranian-republic.org) · اسناد بنیانگذاری URI · بیانیه‌های حزب چپ ایران · تأسیس ۲۰۰۴ / تجمیع تحت همگامی ۲۰۲۳",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function URIPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const ROSE = "#e8507a", CYAN = "#4fc3f7", AMBER = "#ffd166",
    GREEN = "#69d98c", PURPLE = "#ba68c8", RED = "#ef5350", ORANGE = "#ff9a42";

  return (
    <div className="uri-page" dir={dir}>
      <ParticleGrid />
      <div className="uri-scanline" />
      <div className="uri-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="uri-hero">
          <p className="uri-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="uri-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="uri-hero-desc">{d.heroDesc}</p>
          <div className="uri-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="uri-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── IDEOLOGY ── */}
        <SecHead eyebrow={d.ideolEyebrow} title={d.ideolTitle} intro={d.ideolIntro} color={ROSE} />

        <div className="uri-rejections">
          {d.rejections.map((r, i) => (
            <RejectionPill key={i} label={r.label} color={r.color} />
          ))}
        </div>

        <div className="uri-laitecite-note" style={{ borderColor: `${ROSE}30` }}>
          <span className="uri-laitecite-tag" style={{ color: ROSE }}>LAÏCITÉ</span>
          <span>{d.laiteciteNote}</span>
        </div>

        <div className="uri-ideo-grid">
          <Accordion title={d.coreCommitments.title} color={ROSE} defaultOpen>
            <Bullets items={d.coreCommitments.items} color={ROSE} />
          </Accordion>
          <Accordion title={d.stateNation.title} color={PURPLE}>
            <Bullets items={d.stateNation.items} color={PURPLE} />
          </Accordion>
        </div>

        <div className="uri-divider" />

        {/* ── COALITION ── */}
        <SecHead eyebrow={d.coalEyebrow} title={d.coalTitle} intro={d.coalIntro} color={AMBER} />

        <div className="uri-coalition-table">
          <div className="uri-coalition-head">
            <span>{isRTL ? "سازمان" : "Organization"}</span>
            <span>{isRTL ? "ایدئولوژی" : "Ideology"}</span>
            <span>{isRTL ? "مشارکت استراتژیک" : "Strategic Contribution"}</span>
          </div>
          {d.coalition.map((c, i) => (
            <CoalitionRow key={i} {...c} />
          ))}
        </div>

        <div className="uri-divider" />

        {/* ── TWO-PHASE TRANSITION ── */}
        <SecHead eyebrow={d.transEyebrow} title={d.transTitle} intro={d.transIntro} color={RED} />

        <div className="uri-trigger-note" style={{ borderColor: `${AMBER}30` }}>
          <span className="uri-trigger-tag" style={{ color: AMBER }}>{isRTL ? "اصل طراحی" : "DESIGN PRINCIPLE"}</span>
          <span>{d.triggerNote}</span>
        </div>

        <div className="uri-phases">
          {d.phases.map((ph, i) => (
            <PhaseBlock key={i} {...ph}>
              {ph.items}
            </PhaseBlock>
          ))}
        </div>

        <div className="uri-divider" />

        {/* ── POWER STRUCTURE ── */}
        <SecHead eyebrow={d.powerEyebrow} title={d.powerTitle} intro={d.powerIntro} color={ROSE} />

        <Accordion title={d.usrhrModel.title} color={PURPLE} defaultOpen>
          <Bullets items={d.usrhrModel.items} color={PURPLE} />
        </Accordion>

        <div className="uri-power-grid">
          {d.powerNodes.map((node, i) => (
            <PowerNode key={i} {...node} />
          ))}
        </div>

        <div className="uri-divider" />

        {/* ── INSTITUTIONAL TARGETS ── */}
        <SecHead eyebrow={d.instEyebrow} title={d.instTitle} intro={d.instIntro} color={ORANGE} />

        <div className="uri-inst-grid">
          {d.institutions.map((inst, i) => (
            <InstCard key={i} {...inst} />
          ))}
        </div>

        <div className="uri-divider" />

        {/* ── KEY POLICIES ── */}
        <SecHead eyebrow={d.polEyebrow} title={d.polTitle} intro={d.polIntro} color={CYAN} />

        <div className="uri-pol-grid">
          {d.policies.map((p, i) => (
            <PolicyCard key={i} icon={p.icon} title={p.title} color={p.color}>
              <Bullets items={p.items} color={p.color} />
            </PolicyCard>
          ))}
        </div>

        <div className="uri-divider" />

        {/* ── GEOPOLITICAL IMPLICATIONS ── */}
        <SecHead eyebrow={d.geoEyebrow} title={d.geoTitle} intro={d.geoIntro} color={ROSE} />

        <div className="uri-geo-grid">
          {d.geoCards.map((g, i) => (
            <GeoCard key={i} {...g} />
          ))}
        </div>

        {/* ── CONCLUSION ── */}
        <div className="uri-conclusion" style={{ fontFamily: ff }}>
          <span className="uri-conclusion-mark" style={{ color: ROSE }}>❝</span>
          <span>{d.conclusion}</span>
        </div>

        <p className="uri-source">{d.source}</p>

        <nav className="uri-footer-nav">
          <Link to="/plans" className="uri-footer-nav-link">
            {isRTL ? '← همه طرح‌های انتقالی' : '← All Transitional Plans'}
          </Link>
          <Link to="/arena" className="uri-footer-nav-link uri-footer-nav-link--secondary">
            {isRTL ? 'آرنا — تأیید طرح‌ها ←' : 'Arena — Endorse Plans →'}
          </Link>
        </nav>

      </div>
    </div>
  );
}
