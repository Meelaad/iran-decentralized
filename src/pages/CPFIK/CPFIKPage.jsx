import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./CPFIKPage.css";

/* ─────────────────────────────────────────────────────
   Animated particle background — teal/jade palette
───────────────────────────────────────────────────── */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    const nodes = Array.from({ length: 54 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
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
            ctx.strokeStyle = `rgba(38,217,178,${(1 - dist / 180) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(38,217,178,${0.09 + p * 0.13})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="cpfik-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cpfik-acc" style={{ "--c": color || "#26d9b2" }}>
      <button className="cpfik-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="cpfik-acc-title">{title}</span>
        {subtitle && <span className="cpfik-acc-subtitle">{subtitle}</span>}
        <span className="cpfik-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="cpfik-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="cpfik-bullets">
      {items.map((it, i) => (
        <li key={i} className="cpfik-bullet-item">
          <span className="cpfik-bullet-dot" style={{ background: color || "#26d9b2" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="cpfik-sechead">
      {eyebrow && <div className="cpfik-sechead-eyebrow" style={{ color }}>{eyebrow}</div>}
      {title && <h2 className="cpfik-sechead-title">{title}</h2>}
      {intro && <p className="cpfik-sechead-intro">{intro}</p>}
    </div>
  );
}

function HistoryNode({ date, event, significance, color }) {
  return (
    <div className="cpfik-hist-node">
      <div className="cpfik-hist-dot" style={{ background: color }} />
      <div className="cpfik-hist-line" />
      <div className="cpfik-hist-content">
        <div className="cpfik-hist-date" style={{ color }}>{date}</div>
        <div className="cpfik-hist-event">{event}</div>
        <div className="cpfik-hist-sig">{significance}</div>
      </div>
    </div>
  );
}

function FactionCard({ name, acronym, ideology, method, affiliation, milType, color }) {
  return (
    <div className="cpfik-faction-card" style={{ borderColor: `${color}30` }}>
      <div className="cpfik-faction-acronym" style={{ color }}>{acronym}</div>
      <div className="cpfik-faction-name">{name}</div>
      <div className="cpfik-faction-row">
        <span className="cpfik-faction-label">Ideology</span>
        <span className="cpfik-faction-val">{ideology}</span>
      </div>
      <div className="cpfik-faction-row">
        <span className="cpfik-faction-label">Method</span>
        <span className="cpfik-faction-val">{method}</span>
      </div>
      <div className="cpfik-faction-row">
        <span className="cpfik-faction-label">Military</span>
        <span className="cpfik-faction-miltype" style={{ color }}>{milType}</span>
      </div>
      <div className="cpfik-faction-affil">{affiliation}</div>
    </div>
  );
}

function ArticleCluster({ articles, fn, directives, color }) {
  return (
    <div className="cpfik-article-cluster" style={{ borderColor: `${color}28` }}>
      <div className="cpfik-article-nums" style={{ color }}>{articles}</div>
      <div className="cpfik-article-fn">{fn}</div>
      <div className="cpfik-article-dir">{directives}</div>
    </div>
  );
}

function PhaseCard({ number, label, title, color, children }) {
  return (
    <div className="cpfik-phase-card" style={{ "--pc": color }}>
      <div className="cpfik-phase-num">{number}</div>
      <div className="cpfik-phase-label">{label}</div>
      <div className="cpfik-phase-title">{title}</div>
      <div className="cpfik-phase-body">{children}</div>
    </div>
  );
}

function CascadeCard({ number, title, subtitle, body, color, risk }) {
  return (
    <div className="cpfik-cascade-card" style={{ borderColor: `${color}28` }}>
      <div className="cpfik-cascade-num" style={{ color }}>{number}</div>
      <div className="cpfik-cascade-title">{title}</div>
      <div className="cpfik-cascade-subtitle">{subtitle}</div>
      <div className="cpfik-cascade-body">{body}</div>
      <div className="cpfik-cascade-risk" style={{ borderColor: `${color}30`, color }}>
        <span className="cpfik-cascade-risk-tag">RISK LEVEL</span>
        {risk}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "Coalition of Political Forces of Iranian Kurdistan (CPFIK) · Charter Ratified February 22, 2026 · Active Military Operations March 2026",
    heroTitle: "Kurdish Federal Liberation Blueprint",
    heroDesc: "The CPFIK is not a diaspora discussion group — it is an active politico-military apparatus formalized during the outbreak of the 2026 Iran War. Eight months of negotiations produced a 15-Article Charter of Cooperation synthesizing the most historically fragmented Kurdish opposition factions into a unified command structure. Its blueprint is the only Iranian opposition plan that combines an armed territorial liberation phase with a democratic administrative transition — and the only one currently engaged in kinetic conflict.",
    heroBadges: [
      { label: "Formalized Feb 22 2026", c: "#26d9b2" },
      { label: "15-Article Charter", c: "#ffd166" },
      { label: "Active Military Operations", c: "#ef5350" },
      { label: "Federalism + Confederalism", c: "#ba68c8" },
      { label: "5 Constituent Factions", c: "#4fc3f7" },
      { label: "Nationalities Question", c: "#ff9a42" },
    ],

    // ── HISTORICAL CONTEXT ──
    histEyebrow: "Historical Architecture",
    histTitle: "From the Republic of Mahabad (1946) to the CPFIK (2026)",
    histIntro: "The Kurdish opposition in Iran carries the deepest institutional memory of any opposition bloc — an 80-year continuum of state-building, suppression, fragmentation, and reconsolidation. Understanding the CPFIK requires understanding this structural memory.",

    history: [
      { date: "1946", event: "Republic of Mahabad — the first Kurdish state in modern history. Soviet-backed, lasted 11 months before the Imperial Iranian Army crushed it.", significance: "Proved Kurdish self-rule was not theoretical. Hardcoded the federalist aspiration into the PDKI's founding DNA.", color: "#26d9b2" },
      { date: "1945", event: "Democratic Party of Iranian Kurdistan (PDKI) founded — the oldest surviving Iranian opposition party still in operation.", significance: "The institutional anchor of Kurdish nationalism. Its Socialist International membership legitimizes the federalist model internationally.", color: "#4fc3f7" },
      { date: "1979", event: "Post-revolution negotiations between Kurdish representatives and Khomeini's government over secular local autonomy collapsed. Khomeini issued a fatwa ordering the armed forces to crush Kurdish resistance.", significance: "Institutionalized permanent insurgency. Ayatollah Khalkhali's 'hanging courts' executed vast numbers of Kurdish civilians — creating generational trauma that drives the movement today.", color: "#ef5350" },
      { date: "1980s–90s", event: "PDKI and Komala engaged in a debilitating intra-Kurdish armed conflict, fracturing the united front for over a decade.", significance: "The civil war between Kurdish factions became the defining lesson — the 15-Article Charter's Article 14 (all factions accept election results) directly addresses this wound.", color: "#ff9a42" },
      { date: "2004", event: "PJAK founded — ideologically linked to Abdullah Öcalan and the PKK. Introduced democratic confederalism as a competing framework to traditional Kurdish nationalism.", significance: "Created the PDKI vs. PJAK ideological tension that the CPFIK charter deliberately bridges without resolving.", color: "#ba68c8" },
      { date: "2017–2018", event: "Cooperation Center of Iranian Kurdistan Political Parties (CCIKP) established during the protest waves — a passive political forum.", significance: "The precursor to the CPFIK. Coordination without unified command.", color: "#ffd166" },
      { date: "Sep 2022", event: "Mahsa (Jina) Amini killed by morality police. She was Kurdish. The 'Woman, Life, Freedom' uprising began — partially rooted in Rojhelat.", significance: "The IRGC responded by launching ballistic missile strikes against PDKI and Komala bases in the KRG. Shared trauma from these strikes forced historic ideological compromises.", color: "#26d9b2" },
      { date: "Feb 22, 2026", event: "After 8 months of negotiations in the 'Dialogue Center for Cooperation,' the CPFIK is formally ratified. The 15-Article Charter of Cooperation is adopted.", significance: "Transformation from passive forum (CCIKP) to active unified military command structure. Timed to exploit the 2026 regional war and the IRGC command degradation from IDF airstrikes.", color: "#4fc3f7" },
      { date: "Feb–Mar 2026", event: "Feb 25: Reza Pahlavi explicitly condemns CPFIK as 'separatist,' calls it an absolute red line, urges the Artesh to neutralize Kurdish groups. Feb 28: Direct US-Israel-Iran war erupts. Mar 4: IDF strikes IRGC HQ in Tehran. Mohtadi's Komala faction tactically joins coalition.", significance: "The CPFIK activates its military architecture precisely as the IRGC's command structure is degraded — the timing is operationally optimal.", color: "#ef5350" },
    ],

    // ── FIVE FACTIONS ──
    factEyebrow: "The Five Constituent Factions",
    factTitle: "A Composite of Distinct Political Machines",
    factIntro: "The ideological distance between CPFIK member parties is significantly greater than the divides separating Iran's mainstream Persian opposition blocs. Their functional integration is a geopolitical anomaly — made possible only by the shared existential pressure of the 2026 war and the strategic decision to defer all contested economic and governance details to post-liberation councils.",

    factions: [
      { name: "Democratic Party of Iranian Kurdistan", acronym: "PDKI", ideology: "Democratic Socialism · Traditional Kurdish Nationalism · Federalism", method: "Peshmerga insurgency · Diplomacy · Federal state-building", affiliation: "Founded 1945 · Republic of Mahabad · Socialist International member", milType: "PESHMERGA (Conventional)", color: "#26d9b2" },
      { name: "Kurdistan Free Life Party", acronym: "PJAK", ideology: "Democratic Confederalism · Radical Localism · Anti-nation-state · Öcalan ideology", method: "Guerrilla warfare · Anti-industrial ecological stewardship · Communal councils", affiliation: "Formed 2004 · Ideologically linked to Abdullah Öcalan and the PKK · Rojava model", milType: "GUERRILLA (Asymmetric)", color: "#ba68c8" },
      { name: "Komala of the Toilers of Kurdistan", acronym: "Komala-KTP", ideology: "Social Democracy · Left-wing Nationalism · Labor Syndicalism", method: "Class struggle · Progressive labor laws · Universal health service · Peshmerga", affiliation: "Split from broader Komala movement · Marxist-Leninist roots → modern social democracy", milType: "PESHMERGA (Conventional)", color: "#4fc3f7" },
      { name: "Kurdistan Freedom Party", acronym: "PAK", ideology: "Kurdish Nationalism · Explicit statehood goals · Hardline independence", method: "Militant action · Territorial seizure · Most explicitly separatist of the coalition", affiliation: "Highly active militarily in recent decades · explicit full independence position", milType: "PESHMERGA (Conventional)", color: "#ff9a42" },
      { name: "Organization of Iranian Kurdistan Struggle", acronym: "Khabat", ideology: "Islamic / Nationalist synthesis · Traditionalist", method: "Peshmerga insurgency · Traditionalist command structures", affiliation: "Smaller faction · Religious conservative roots within Kurdish nationalism", milType: "PESHMERGA (Conventional)", color: "#ffd166" },
    ],

    boycottNote: "BOYCOTT NOTE: The Komala Party of Iranian Kurdistan (led by Abdullah Mohtadi) and Komala-CPI initially boycotted the charter — Mohtadi citing 'ambiguities in transitional administration.' Komala-CPI refused partially over the coalition's refusal to adopt the international communist anthem alongside the Kurdish national anthem. Both tactically aligned by March 4, 2026 due to the outbreak of regional war — highlighting the fragility of the coalition's synthesis.",

    // ── IDEOLOGICAL SYNTHESIS ──
    synthEyebrow: "The Core Ideological Tension",
    synthTitle: "Federalism vs. Democratic Confederalism — The Charter's Deliberate Ambiguity",
    synthIntro: "The most complex architectural compromise within the CPFIK is the synthesis of two fundamentally incompatible visions of governance. Rather than resolving this tension, the charter deliberately avoids it — using strategic vagueness to preserve unity.",

    fedModel: {
      title: "PDKI's Federal State Model",
      color: "#26d9b2",
      items: [
        "Structuralist and institutional — seeks to replace the unitary theocracy with a decentralized, multi-nation federal republic",
        "The nation-state still exists, but power is geographically devolved to regional parliaments along ethnic boundaries",
        "PDKI operationalized this by co-founding the Congress of Nationalities for a Federal Iran (CNFI) — coalition with Azeri, Baloch, Turkmen, Ahwazi Arab organizations",
        "Central government retains: national defense, currency, macro-foreign policy",
        "Regional parliaments manage: local police, regional resource management, education in the mother tongue",
        "This is the model endorsed by Abdullah Mohtadi's Komala — the closest to what other Iranian opposition blocs (ITC, URI) can accept",
      ],
    },
    confModel: {
      title: "PJAK's Democratic Confederalism",
      color: "#ba68c8",
      items: [
        "Derived from Abdullah Öcalan's interpretation of Murray Bookchin's eco-communitarian theories",
        "Rejects the very concept of the nation-state as inherently oppressive — a tool of capitalist hegemony",
        "Advocates for radical devolution of ALL power to local democratic councils — authority flows upward from communal representative bodies",
        "Anti-capitalist AND anti-state socialist — rejects both market economies and centralized planned economies",
        "Implemented practically by the PYD in Rojava (Autonomous Administration of North and East Syria)",
        "Incompatible with currency management, central banking, or any macro-resource extraction policy",
      ],
    },
    bridgeNote: "The charter bridges this chasm by remaining deliberately vague on the ultimate nature of the state. The 'Central Alliance Management Body' is designed to simultaneously function as a provisional federal government (satisfying PDKI) AND as a supra-council coordinating local communes (satisfying PJAK). The economic policy vacuum is not an oversight — it is a structural requirement for coalition survival.",

    // ── 15-ARTICLE CHARTER ──
    charterEyebrow: "The 15-Article Charter of Cooperation",
    charterTitle: "Ratified February 22, 2026 — The Functional Code of the CPFIK",
    charterIntro: "The charter is the constitutional framework of the coalition, establishing rules of engagement, organizational hierarchy, and the operational timeline. It explicitly rejects a spontaneous democratic transition in favor of a tightly controlled two-phase process.",

    articleClusters: [
      { articles: "Articles 1, 3, 11", fn: "Strategic Objectives — The End State", directives: "Mandates the struggle for self-determination. Defines the two-phase process: Liberation of Rojhelat (Phase 1) → establishment of a democratic administrative system guaranteeing the rights of all ethnic and religious groups (Phase 2).", color: "#26d9b2" },
      { articles: "Articles 2, 7", fn: "Macro-Strategy — National Alliances", directives: "Establishes the strategy of aligning with other oppressed Iranian nations (Baloch, Ahwazi Arabs, Azerbaijani Turks, Turkmen). Recognizes self-determination as the mandatory prerequisite for cooperating with any nationwide Iranian opposition forces.", color: "#4fc3f7" },
      { articles: "Articles 4, 5, 6", fn: "Internal Conduct — Societal Engineering", directives: "Demands full gender equality and justice. Strictly prohibits internal violence between Kurdish factions. Mandates democratic collective decision-making. Provides absolute support for civil movements inside Iran.", color: "#ffd166" },
      { articles: "Articles 8, 9", fn: "Execution Mechanisms — The Military Organs", directives: "Decrees the formation of the Joint Command Center to unify Peshmerga and guerrilla forces under a single command. Decrees the formation of the Joint Diplomatic Committee for all external relations.", color: "#ff9a42" },
      { articles: "Articles 12, 13, 14", fn: "Governance Handover — The Transition", directives: "Creates the Central Alliance Management Body to administer liberated zones. Mandates this body to organize free and democratic elections. Binds ALL armed factions by Article 14 to honor the democratic ballot results — preventing a return to the 1980s intra-Kurdish civil wars.", color: "#ef5350" },
      { articles: "Articles 10, 15", fn: "Legal Framework — Compliance", directives: "Makes adherence to the charter mandatory for continued coalition membership. Allows for future legislative annexes as the situation evolves.", color: "#ba68c8" },
    ],

    // ── TWO PHASES ──
    phasesEyebrow: "Two-Phase Transition Strategy",
    phasesTitle: "Kinetic Liberation → Democratic Administration",
    phasesIntro: "Unlike every other Iranian opposition plan, the CPFIK does not wait for Tehran's collapse or permission. Phase 1 is active territorial seizure. Phase 2 begins the moment Kurdish territory is secured — independently of whatever government emerges in Tehran.",

    phases: [
      {
        number: "01",
        label: "PHASE 1",
        title: "Liberation of Eastern Kurdistan (Rojhelat)",
        color: "#ef5350",
        items: [
          "Kinetic expulsion of the IRGC, Artesh, and all central government administrative apparatuses from Kurdish provinces",
          "Joint Command Center coordinates both Peshmerga (PDKI, PAK, Khabat, Komala) and Guerrilla forces (PJAK) under unified command",
          "PJAK asymmetric cells deployed for: IRGC logistics sabotage, supply line disruption, neutralizing command nodes deep in Iranian territory",
          "Peshmerga conventional forces deployed for: securing, holding, and administering liberated urban centers",
          "Launch bases: KRG territory — Koya, Zargwez sub-district, Qandil Mountains (cross-border incursions into West Azerbaijan, Kurdistan Province, Kermanshah)",
          "Civil disobedience and general strikes in Kurdish cities run simultaneously with kinetic operations",
          "CIA intelligence sharing and small arms supply: overstretch IRGC into a two-front war",
          "Transitional justice during this phase: MARTIAL LAW — no written tribunal framework; implicit total destruction of regime security forces from Kurdish territory",
        ],
      },
      {
        number: "02",
        label: "PHASE 2",
        title: "Democratic Administrative Transition",
        color: "#26d9b2",
        items: [
          "Initiates THE MOMENT Kurdish territory is secured — does NOT wait for a new Tehran government",
          "Central Alliance Management Body immediately assumes executive control as the interim government of liberated zones",
          "Tasks: maintaining order, preventing anarchy, securing borders, organizing local democratic councils",
          "The Central Alliance Management Body operates as simultaneously a provisional federal government (PDKI framework) AND a supra-council of communes (PJAK framework)",
          "Article 13: free and democratic elections organized in Eastern Kurdistan",
          "Article 14: ALL member factions legally bound to accept election results — the anti-civil-war clause",
          "Economic policy: deferred entirely to post-liberation local democratic councils and regional parliaments — no unified economic policy during this phase",
          "Ultimate endpoint: a national, democratic administrative system in Eastern Kurdistan integrated within a decentralized, federal Iranian state",
        ],
      },
    ],

    // ── MILITARY ARCHITECTURE ──
    milEyebrow: "Military Architecture",
    milTitle: "The Joint Command Center — Hybrid Force Integration",
    milIntro: "Prior to the 2026 agreement, Iranian Kurdish forces operated in two entirely different military cultures with opposing doctrines. The Joint Command Center achieves an unprecedented integration of these capabilities into a hybrid force.",

    milComparison: [
      {
        type: "PESHMERGA",
        parties: "PDKI · PAK · Khabat · Komala-KTP",
        color: "#26d9b2",
        doctrine: "Conventional light infantry",
        command: "Hierarchical, conventional command structures",
        purpose: "Hold territory · defend geographic strongholds · standing army linked to political patronage networks",
        advantage: "Secure and administer liberated urban centers during Phase 2 transition",
        deployment: "Operate from KRG rear bases (Koya, Zargwez)",
      },
      {
        type: "GUERRILLA",
        parties: "PJAK",
        color: "#ba68c8",
        doctrine: "Asymmetric insurgency",
        command: "Highly decentralized, ideologically rigid cells",
        purpose: "Deep infiltration · sabotage · survival in the Zagros Mountains",
        advantage: "Disrupt IRGC logistics, supply lines, and command nodes deep within Iranian territory",
        deployment: "Qandil Mountains base network — PKK-linked tactical doctrine",
      },
    ],

    jointCommandNote: "The Joint Command Center theoretically deploys PJAK's asymmetric infiltration cells to sabotage IRGC logistics while Peshmerga conventional forces secure and administer liberated urban centers. This hybrid architecture was activated precisely when IDF airstrikes degraded IRGC command and control on March 4, 2026 — creating the operational window the coalition was designed for.",

    // ── POWER STRUCTURE ──
    powerEyebrow: "Command Structure",
    powerTitle: "The Three-Organ Central Alliance Management Body",
    powerIntro: "The CPFIK's command architecture distributes power across three specialized organs, all answering to the Central Alliance Management Body — which itself is populated by unanimous consensus of the constituent parties' leadership committees.",

    organs: [
      { icon: "🎯", title: "Joint Command Center", color: "#ef5350", items: ["Unifies Peshmerga and Guerrilla forces under a single operational command", "Executes all kinetic and defensive operations", "Coordinates PJAK asymmetric infiltration with Peshmerga territorial control", "Reports to the Central Alliance Management Body"] },
      { icon: "🌐", title: "Joint Diplomatic Committee", color: "#4fc3f7", items: ["Executes all foreign policy and international engagement", "Coordinates diaspora resources and funding", "Interfaces with CIA, Western democratic institutions, and human rights bodies", "Seeks recognition of CPFIK as a legitimate political authority"] },
      { icon: "📡", title: "Joint Political & Media Coordination", color: "#ffd166", items: ["Executes psychological operations and public relations", "Manages internal messaging between factions", "Coordinates external communications with Iranian civil society", "Amplifies the Kurdish cause in international media"] },
    ],

    // ── GEOPOLITICAL CASCADES ──
    cascadeEyebrow: "Second & Third-Order Geopolitical Cascades",
    cascadeTitle: "Three Critical Systemic Friction Points",
    cascadeIntro: "The activation of the CPFIK in the context of the 2026 Iran War created immediate second and third-order systemic effects across the region. These are not theoretical risks — they are active geopolitical dynamics as of March 2026.",

    cascades: [
      {
        number: "01",
        title: "The Turkish Calculus",
        subtitle: "Secessionist Contagion Risk",
        body: "For Ankara, the ascendance of a heavily armed, autonomous Kurdish political entity on the Iranian border is an existential threat. PJAK shares ideological, logistical, and historical ties with the PKK — which has waged a decades-long insurgency against the Turkish state. Turkey views the CPFIK not as a democratic liberation movement but as a heavily armed terrorist sanctuary. The empowerment of the CPFIK forces Turkey to reassess its posture, generating a high probability of unilateral cross-border interventions into Iranian or Iraqi airspace to suppress PJAK elements. This threatens to fracture NATO cohesion during the anti-Iran coalition effort.",
        risk: "HIGH — Turkey's national security doctrine makes unilateral military action against PJAK-linked forces near-certain if the CPFIK consolidates territorial control.",
        color: "#ef5350",
      },
      {
        number: "02",
        title: "The KRG Paradox",
        subtitle: "Launchpad vs. Diplomatic Liability",
        body: "The Kurdistan Regional Government in northern Iraq serves as the CPFIK's de facto launchpad, logistical sanctuary, and diplomatic base. Yet the KRG is highly vulnerable to Iranian retaliation — the IRGC has previously struck Erbil and Koya with ballistic missiles. KRG officials are forced to maintain strict public neutrality while privately hosting CPFIK operations. If the CPFIK's offensive falters, the KRG faces the wrath of a surviving Iranian regime. If the CPFIK succeeds, the KRG faces pressure from Turkey and Baghdad to suppress the newly empowered Iranian Kurdish factions.",
        risk: "SEVERE — The KRG has zero good outcomes. Every scenario generates existential pressure from at least two directions simultaneously.",
        color: "#ff9a42",
      },
      {
        number: "03",
        title: "The Pahlavi Factor",
        subtitle: "The Multi-Polar Civil War Scenario",
        body: "On February 25, 2026, Crown Prince Reza Pahlavi explicitly condemned the CPFIK as 'separatist,' declared Iran's territorial integrity an absolute 'red line,' and urged the Artesh to confront and neutralize Kurdish groups upon regime collapse. If the CPFIK achieves Phase 1 (territorial liberation) and a Persian nationalist government aligned with Pahlavi assumes control of the surviving state apparatus, it will deploy the Artesh to reclaim the Kurdish provinces. This creates a direct military confrontation between the CPFIK's Joint Command Center and the Iranian regular army — the 'Nationalities Question' transitions from political debate into the primary driver of post-regime kinetic conflict.",
        risk: "CRITICAL — The most severe systemic risk. The near-certainty of a multi-polar civil war is the single greatest vulnerability of the entire transition scenario for Iran.",
        color: "#ba68c8",
      },
    ],

    // ── STRATEGIC ASSESSMENT ──
    assessEyebrow: "Strategic Assessment",
    assessTitle: "Organizational Capacity vs. Critical Unresolved Variables",

    strengths: {
      title: "Structural Strengths",
      color: "#26d9b2",
      items: [
        "The only Iranian opposition plan currently engaged in active kinetic operations — the CPFIK does not depend on Tehran's collapse, it accelerates it",
        "Hybrid military force (Peshmerga + Guerrilla) under unified command is architecturally unique — capable of both asymmetric deep-infiltration and territorial administration",
        "Article 14 (all factions accept election results) directly addresses the 1980s civil war wound — prevents factional relapse",
        "The 15-Article Charter successfully synthesizes PDKI, PJAK, PAK, Khabat, and Komala-KTP — the most ideologically diverse Kurdish coalition in history",
        "CIA coordination provides intelligence and logistical support — international recognition pathway is more advanced than any other opposition plan",
        "In the event of IRGC command collapse, the CPFIK has the organizational capacity to rapidly secure Iranian Kurdistan — it is the only opposition bloc with pre-positioned territorial control",
        "Alliance with Baloch, Ahwazi Arab, Azerbaijani Turk, and Turkmen organizations (via CNFI) builds a coalition of oppressed nations — making the federalist case harder to dismiss as separatism",
      ],
    },
    weaknesses: {
      title: "Critical Unresolved Variables",
      color: "#ef5350",
      items: [
        "Deliberate omission of macroeconomic policy, resource management, and transitional justice frameworks — exposes ideological fragility when coalition transitions from wartime to governance",
        "The PDKI-PJAK synthesis is architecturally unstable — the charter's deliberate vagueness on the nature of the state will fracture into open conflict during Phase 2 when real governance decisions require resolution",
        "The Turkish cross-border intervention risk threatens to transform a liberation campaign into a multi-front war against both the Islamic Republic AND NATO member Turkey simultaneously",
        "The Pahlavi Factor generates near-certain post-collapse civil war between the CPFIK and a Persian nationalist government — making Iranian Kurdistan's long-term autonomous status dependent on military outcomes, not political agreements",
        "The KRG launchpad is vulnerable to IRGC retaliation — a series of ballistic missile strikes on Koya and Zargwez could eliminate the coalition's rear base infrastructure",
        "Mohtadi's initial boycott and the Komala-CPI anthem dispute reveal the coalition's internal fault lines — unity is contingent on the continuation of external existential pressure",
        "The charter's silence on IRGC, Artesh, clerical courts, and civilian ministries means Phase 2 governance begins with zero institutional framework for handling captured state infrastructure",
      ],
    },

    conclusion: "\"The CPFIK possesses the organizational capacity to rapidly secure Iranian Kurdistan in the event of systemic regime failure in Tehran. Yet translating this tactical occupation into recognized, sustainable federal autonomy will depend entirely on their ability to navigate the subsequent multi-polar power vacuum — balancing their military leverage against the deeply entrenched unitarian forces of the Iranian center.\" — Atlantic Council, March 2026",

    source: "Source: 15-Article Charter of Cooperation (Feb 22, 2026) · JINSA Analysis · Atlantic Council · Chatham House · Kurdish Peace Institute · Washington Kurdish Institute · ISW Iran Update Mar 4, 2026",
  },

  fa: {
    heroEyebrow: "ائتلاف نیروهای سیاسی کردستان ایران (CPFIK) · منشور تأیید شده ۲۲ فوریه ۲۰۲۶ · عملیات نظامی فعال مارس ۲۰۲۶",
    heroTitle: "طرح رهایی فدرال کردستان",
    heroDesc: "CPFIK یک گروه بحث دیاسپورا نیست — یک دستگاه سیاسی-نظامی فعال است که در اوج جنگ ایران در سال ۲۰۲۶ رسمیت یافت. هشت ماه مذاکره یک منشور همکاری ۱۵ ماده‌ای تولید کرد که پراکنده‌ترین جناح‌های اپوزیسیون کردی را در یک ساختار فرماندهی یکپارچه ترکیب کرد. طرح آن تنها طرح اپوزیسیون ایرانی است که یک مرحله آزادسازی سرزمینی مسلحانه را با یک گذار اداری دموکراتیک ترکیب می‌کند.",
    heroBadges: [
      { label: "تأسیس ۲۲ فوریه ۲۰۲۶", c: "#26d9b2" },
      { label: "منشور ۱۵ ماده‌ای", c: "#ffd166" },
      { label: "عملیات نظامی فعال", c: "#ef5350" },
      { label: "فدرالیسم + کنفدرالیسم", c: "#ba68c8" },
      { label: "۵ جناح عضو", c: "#4fc3f7" },
      { label: "مسئله ملیت‌ها", c: "#ff9a42" },
    ],

    histEyebrow: "معماری تاریخی",
    histTitle: "از جمهوری مهاباد (۱۹۴۶) تا CPFIK (۲۰۲۶)",
    histIntro: "اپوزیسیون کردستان در ایران عمیق‌ترین حافظه نهادی هر جبهه اپوزیسیون را حمل می‌کند — یک تداوم ۸۰ ساله دولت‌سازی، سرکوب، تجزیه و تجمیع مجدد.",

    history: [
      { date: "۱۹۴۶", event: "جمهوری مهاباد — اولین دولت کردی در تاریخ مدرن. با پشتیبانی شوروی، ۱۱ ماه دوام آورد قبل از اینکه ارتش شاهنشاهی آن را سرکوب کند.", significance: "ثابت کرد که خودمدیریتی کردی نظری نیست. آرزوی فدرالیستی را در DNA بنیادگذاری PDKI رمزگذاری کرد.", color: "#26d9b2" },
      { date: "۱۹۴۵", event: "حزب دموکرات کردستان ایران (PDKI) تأسیس شد — کهن‌ترین حزب اپوزیسیون ایرانی که هنوز فعال است.", significance: "لنگر نهادی ناسیونالیسم کردی. عضویت در سوسیالیست اینترناسیونال مدل فدرالیستی را در سطح بین‌المللی مشروعیت می‌بخشد.", color: "#4fc3f7" },
      { date: "۱۹۷۹", event: "مذاکرات پس از انقلاب بین نمایندگان کردی و دولت خمینی درباره خودمختاری محلی سکولار شکست خورد. خمینی فتوایی برای سرکوب مقاومت کردی صادر کرد.", significance: "شورش دائمی را نهادینه کرد. دادگاه‌های آیت‌الله خلخالی — 'قاضی دار' — تعداد زیادی از غیرنظامیان کرد را اعدام کردند.", color: "#ef5350" },
      { date: "دهه ۶۰–۷۰", event: "PDKI و کومله در یک درگیری مسلحانه داخلی کردی فلج‌کننده درگیر شدند.", significance: "جنگ داخلی بین جناح‌های کردی به درس محوری تبدیل شد — ماده ۱۴ منشور مستقیماً این زخم را هدف می‌گیرد.", color: "#ff9a42" },
      { date: "۲۰۰۴", event: "PJAK تأسیس شد — ایدئولوژیک با عبدالله اوجالان و PKK مرتبط. کنفدرالیسم دموکراتیک را به عنوان یک چارچوب رقیب معرفی کرد.", significance: "تنش ایدئولوژیک PDKI در مقابل PJAK را ایجاد کرد که منشور CPFIK عمداً بدون حل آن را پل می‌زند.", color: "#ba68c8" },
      { date: "سپتامبر ۲۰۲۲", event: "مهسا (ژینا) امینی توسط گشت ارشاد کشته شد. او کرد بود. قیام 'زن، زندگی، آزادی' آغاز شد.", significance: "سپاه با حملات موشکی بالستیک به پایگاه‌های PDKI و کومله در KRG پاسخ داد. این تروما تاریخی به اجبار سازش‌های تاریخی را ممکن ساخت.", color: "#26d9b2" },
      { date: "۲۲ فوریه ۲۰۲۶", event: "پس از ۸ ماه مذاکره، CPFIK رسماً تصویب شد. منشور همکاری ۱۵ ماده‌ای اتخاذ شد.", significance: "تحول از انجمن همکاری منفعل (CCIKP) به ساختار فرماندهی نظامی یکپارچه فعال.", color: "#4fc3f7" },
      { date: "فوریه–مارس ۲۰۲۶", event: "۲۵ فوریه: رضا پهلوی صراحتاً CPFIK را 'تجزیه‌طلب' می‌نامد. ۲۸ فوریه: جنگ مستقیم ایران-آمریکا-اسرائیل شروع می‌شود. ۴ مارس: IDF مقر سپاه در تهران را بمباران می‌کند. جناح کومله موتادی به ائتلاف می‌پیوندد.", significance: "CPFIK معماری نظامی خود را دقیقاً زمانی فعال می‌کند که ساختار فرماندهی سپاه تضعیف شده — از نظر عملیاتی بهینه.", color: "#ef5350" },
    ],

    factEyebrow: "پنج جناح عضو",
    factTitle: "یک ترکیب از ماشین‌های سیاسی متمایز",
    factIntro: "فاصله ایدئولوژیک بین احزاب عضو CPFIK به طور قابل توجهی بیشتر از شکاف‌های جدا کننده جبهه‌های اصلی اپوزیسیون فارس است. ادغام کارکردی آن‌ها یک استثنای ژئوپلیتیک است.",

    factions: [
      { name: "حزب دموکرات کردستان ایران", acronym: "PDKI", ideology: "سوسیالیسم دموکراتیک · ناسیونالیسم کردی سنتی · فدرالیسم", method: "پیشمرگه · دیپلماسی · ساختارسازی دولت فدرال", affiliation: "تأسیس ۱۹۴۵ · جمهوری مهاباد · عضو سوسیالیست اینترناسیونال", milType: "پیشمرگه (متعارف)", color: "#26d9b2" },
      { name: "حزب آزادی کردستان ایران", acronym: "PJAK", ideology: "کنفدرالیسم دموکراتیک · محلی‌گرایی رادیکال · ضد دولت-ملت · ایدئولوژی اوجالان", method: "جنگ چریکی · مراقبت محیط‌زیستی ضدصنعتی · شوراهای اجتماعی", affiliation: "تأسیس ۲۰۰۴ · ایدئولوژیک با اوجالان و PKK · مدل روژاوا", milType: "چریکی (نامتقارن)", color: "#ba68c8" },
      { name: "کومله کارگران کردستان", acronym: "Komala-KTP", ideology: "سوشیال دموکراسی · ناسیونالیسم چپگرایانه · سندیکالیسم کارگری", method: "مبارزه طبقاتی · قوانین کار پیشرو · خدمات بهداشتی همگانی · پیشمرگه", affiliation: "انشعاب از جنبش گسترده‌تر کومله · ریشه‌های مارکسیستی-لنینیستی → سوشیال دموکراسی مدرن", milType: "پیشمرگه (متعارف)", color: "#4fc3f7" },
      { name: "حزب آزادی کردستان", acronym: "PAK", ideology: "ناسیونالیسم کردی · اهداف صریح استقلال · جدایی‌طلبی سختگیرانه", method: "اقدام نظامی · تصرف سرزمینی · صریح‌ترین موضع استقلال در ائتلاف", affiliation: "از نظر نظامی در دهه‌های اخیر بسیار فعال · موضع استقلال کامل صریح", milType: "پیشمرگه (متعارف)", color: "#ff9a42" },
      { name: "سازمان مبارزه کردستان ایران", acronym: "Khabat", ideology: "ترکیب اسلامی/ناسیونالیستی · سنت‌گرا", method: "پیشمرگه · ساختارهای فرماندهی سنتی", affiliation: "جناح کوچکتر · ریشه‌های محافظه‌کارانه مذهبی در ناسیونالیسم کردی", milType: "پیشمرگه (متعارف)", color: "#ffd166" },
    ],

    boycottNote: "یادداشت تحریم: حزب کومله کردستان ایران (به رهبری عبدالله مهتدی) و کومله-CPI در ابتدا منشور را تحریم کردند — مهتدی با استناد به 'ابهامات در اداره موقت'. کومله-CPI تا حدی به خاطر اختلاف نمادین بر سر امتناع ائتلاف از اتخاذ سرود بین‌المللی کمونیستی در کنار سرود ملی کردی شرکت نکرد. هر دو به دلیل شروع جنگ منطقه‌ای در ۴ مارس ۲۰۲۶ به صورت تاکتیکی به ائتلاف پیوستند.",

    synthEyebrow: "تنش ایدئولوژیک محوری",
    synthTitle: "فدرالیسم در مقابل کنفدرالیسم دموکراتیک — ابهام عمدی منشور",
    synthIntro: "پیچیده‌ترین سازش معماری در CPFIK ترکیب دو دیدگاه حاکمیتی اساساً ناسازگار است. منشور به جای حل این تنش، عمداً از آن اجتناب می‌کند.",

    fedModel: {
      title: "مدل دولت فدرال PDKI",
      color: "#26d9b2",
      items: [
        "ساختارگرایانه و نهادی — به دنبال جایگزینی تئوکراسی یکپارچه با یک جمهوری فدرال چندملتی غیرمتمرکز",
        "دولت-ملت هنوز وجود دارد اما قدرت جغرافیایی به پارلمان‌های منطقه‌ای در مرزهای قومی تفویض می‌شود",
        "PDKI با تأسیس کنگره ملیت‌ها برای ایران فدرال (CNFI) با سازمان‌های آذری، بلوچ، ترکمن، عرب اهوازی ائتلاف ساخت",
        "دولت مرکزی حفظ می‌کند: دفاع ملی، ارز، سیاست خارجی کلان",
        "پارلمان‌های منطقه‌ای مدیریت می‌کنند: پلیس محلی، مدیریت منابع منطقه‌ای، آموزش زبان مادری",
      ],
    },
    confModel: {
      title: "کنفدرالیسم دموکراتیک PJAK",
      color: "#ba68c8",
      items: [
        "مشتق از تفسیر اوجالان از نظریات اکو-اجتماعی موری بوکچین",
        "مفهوم دولت-ملت را ذاتاً سرکوبگر رد می‌کند — ابزار هژمونی سرمایه‌داری",
        "از تفویض رادیکال تمام قدرت به شوراهای دموکراتیک محلی دفاع می‌کند — قدرت از نهادهای نمایندگی اجتماعی به بالا جریان می‌یابد",
        "ضد سرمایه‌داری و ضد سوسیالیسم دولتی متمرکز — هر دو را رد می‌کند",
        "در عمل توسط PYD در روژاوا (اداره خودمختار شمال و شرق سوریه) اجرا شد",
        "با مدیریت ارز، بانکداری مرکزی یا هرگونه سیاست استخراج منابع کلان ناسازگار است",
      ],
    },
    bridgeNote: "منشور با ابهام عمدی درباره ماهیت نهایی دولت، این تضاد را پل می‌زند. 'هیئت مدیریت مرکزی ائتلاف' طراحی شده است که همزمان به عنوان یک دولت فدرال موقت (ارضای PDKI) و به عنوان یک شورای عالی هماهنگ‌کننده کمون‌های محلی (ارضای PJAK) عمل کند. خلاء سیاست اقتصادی یک غفلت نیست — یک ضرورت ساختاری برای بقای ائتلاف است.",

    charterEyebrow: "منشور همکاری ۱۵ ماده‌ای",
    charterTitle: "تصویب شده ۲۲ فوریه ۲۰۲۶ — کد کارکردی CPFIK",
    charterIntro: "منشور چارچوب قانون اساسی ائتلاف است که قوانین درگیری، سلسله‌مراتب سازمانی و جدول زمانی عملیاتی را تعیین می‌کند. صراحتاً گذار دموکراتیک خودجوش را رد کرده و یک فرآیند دو مرحله‌ای کاملاً کنترل‌شده را می‌طلبد.",

    articleClusters: [
      { articles: "مواد ۱، ۳، ۱۱", fn: "اهداف استراتژیک — وضعیت نهایی", directives: "مبارزه برای حق تعیین سرنوشت را الزامی می‌کند. فرآیند دو مرحله‌ای را تعریف می‌کند: آزادسازی روژهلات (مرحله ۱) → برقراری نظام اداری دموکراتیک (مرحله ۲).", color: "#26d9b2" },
      { articles: "مواد ۲، ۷", fn: "استراتژی کلان — اتحادهای ملی", directives: "استراتژی همسویی با دیگر ملل ستمدیده ایران (بلوچ، عرب اهوازی، آذربایجانی، ترکمن) را تعیین می‌کند. حق تعیین سرنوشت را پیش‌شرط اجباری همکاری با هر نیروی مخالف سراسری ایران می‌داند.", color: "#4fc3f7" },
      { articles: "مواد ۴، ۵، ۶", fn: "رفتار داخلی — مهندسی اجتماعی", directives: "برابری کامل جنسیتی را الزامی می‌کند. خشونت داخلی بین جناح‌های کردی را سختگیرانه ممنوع می‌کند. تصمیم‌گیری دموکراتیک جمعی را الزامی می‌کند.", color: "#ffd166" },
      { articles: "مواد ۸، ۹", fn: "مکانیزم‌های اجرا — ارگان‌های نظامی", directives: "تشکیل مرکز فرماندهی مشترک برای یکپارچه‌سازی پیشمرگه و نیروهای چریکی. تشکیل کمیته دیپلماتیک مشترک برای روابط خارجی.", color: "#ff9a42" },
      { articles: "مواد ۱۲، ۱۳، ۱۴", fn: "تحویل حاکمیت — گذار", directives: "هیئت مدیریت مرکزی ائتلاف را برای اداره مناطق آزادشده ایجاد می‌کند. این هیئت را ملزم به برگزاری انتخابات آزاد و دموکراتیک می‌کند. تمام جناح‌های مسلح را از طریق ماده ۱۴ قانوناً ملزم به پذیرش نتایج رأی‌گیری می‌کند.", color: "#ef5350" },
      { articles: "مواد ۱۰، ۱۵", fn: "چارچوب حقوقی — رعایت", directives: "پایبندی به منشور را برای ادامه عضویت در ائتلاف اجباری می‌کند. امکان ضمائم قانونگذاری آینده را فراهم می‌کند.", color: "#ba68c8" },
    ],

    phasesEyebrow: "استراتژی گذار دو مرحله‌ای",
    phasesTitle: "آزادسازی مسلحانه → اداره دموکراتیک",
    phasesIntro: "برخلاف هر طرح دیگر اپوزیسیون ایرانی، CPFIK منتظر سقوط تهران یا اجازه آن نمی‌ماند. مرحله ۱ تصرف سرزمینی فعال است. مرحله ۲ همان لحظه‌ای آغاز می‌شود که سرزمین کردی تأمین می‌شود.",

    phases: [
      {
        number: "۰۱",
        label: "مرحله ۱",
        title: "آزادسازی کردستان شرقی (روژهلات)",
        color: "#ef5350",
        items: [
          "اخراج مسلحانه سپاه، ارتش و تمام دستگاه‌های اداری دولت مرکزی از استان‌های کردی",
          "مرکز فرماندهی مشترک هر دو نیروی پیشمرگه (PDKI، PAK، Khabat، Komala) و چریکی (PJAK) را زیر فرماندهی یکپارچه هماهنگ می‌کند",
          "سلول‌های نامتقارن PJAK برای: خرابکاری لجستیک سپاه، اختلال در خطوط تدارکاتی، خنثی‌سازی گره‌های فرماندهی عمیق در خاک ایران",
          "نیروهای متعارف پیشمرگه برای: تأمین، نگهداری و اداره مراکز شهری آزادشده",
          "پایگاه‌های پرتاب: قلمروی KRG — کویه، خرخوره، کوه‌های قندیل",
          "نافرمانی مدنی و اعتصابات عمومی در شهرهای کردی همزمان با عملیات نظامی",
          "هماهنگی CIA: اطلاعات و تسلیح برای کشاندن سپاه به جنگ دو جبهه",
        ],
      },
      {
        number: "۰۲",
        label: "مرحله ۲",
        title: "گذار اداری دموکراتیک",
        color: "#26d9b2",
        items: [
          "همان لحظه‌ای که سرزمین کردی تأمین می‌شود آغاز می‌شود — منتظر دولت جدید تهران نمی‌ماند",
          "هیئت مدیریت مرکزی ائتلاف فوری کنترل اجرایی را به عنوان دولت موقت مناطق آزادشده به دست می‌گیرد",
          "وظایف: حفظ نظم، جلوگیری از آنارشی، تأمین مرزها، سازماندهی شوراهای دموکراتیک محلی",
          "ماده ۱۳: انتخابات آزاد و دموکراتیک در کردستان شرقی",
          "ماده ۱۴: تمام جناح‌های مسلح قانوناً ملزم به پذیرش نتایج انتخابات — بند ضدجنگ داخلی",
          "سیاست اقتصادی: کاملاً به شوراهای دموکراتیک محلی پس از آزادسازی موکول می‌شود — هیچ سیاست اقتصادی یکپارچه در این مرحله وجود ندارد",
          "هدف نهایی: یک نظام اداری دموکراتیک ملی در کردستان شرقی ادغام‌شده در یک دولت ایران فدرال غیرمتمرکز",
        ],
      },
    ],

    milEyebrow: "معماری نظامی",
    milTitle: "مرکز فرماندهی مشترک — ادغام نیروهای ترکیبی",
    milIntro: "پیش از توافق ۲۰۲۶، نیروهای کردی ایرانی در دو فرهنگ نظامی کاملاً متفاوت با دکترین‌های متضاد عمل می‌کردند. مرکز فرماندهی مشترک یک ادغام بی‌سابقه از این توانایی‌ها را در یک نیروی ترکیبی به دست می‌آورد.",

    milComparison: [
      { type: "پیشمرگه", parties: "PDKI · PAK · Khabat · Komala-KTP", color: "#26d9b2", doctrine: "پیاده‌نظام سبک متعارف", command: "ساختارهای فرماندهی سلسله‌مراتبی و متعارف", purpose: "نگهداری سرزمین · دفاع از جایگاه‌های جغرافیایی · ارتش ایستای مرتبط با شبکه‌های حمایت سیاسی", advantage: "تأمین و اداره مراکز شهری آزادشده در طول گذار مرحله ۲", deployment: "پایگاه‌های عقبی KRG — کویه، خرخوره" },
      { type: "چریکی", parties: "PJAK", color: "#ba68c8", doctrine: "شورش نامتقارن", command: "سلول‌های کاملاً غیرمتمرکز و ایدئولوژیک", purpose: "نفوذ عمیق · خرابکاری · بقا در کوه‌های زاگرس", advantage: "اختلال در لجستیک سپاه، خطوط تدارکاتی و گره‌های فرماندهی عمیق در خاک ایران", deployment: "شبکه پایگاه کوه‌های قندیل — دکترین تاکتیکی مرتبط با PKK" },
    ],

    jointCommandNote: "مرکز فرماندهی مشترک نظری سلول‌های نفوذ نامتقارن PJAK را برای خرابکاری لجستیک سپاه مستقر می‌کند در حالی که نیروهای متعارف پیشمرگه مراکز شهری آزادشده را تأمین و اداره می‌کنند. این معماری ترکیبی دقیقاً زمانی فعال شد که حملات IDF کنترل و فرماندهی سپاه را در ۴ مارس ۲۰۲۶ تضعیف کرد.",

    powerEyebrow: "ساختار فرماندهی",
    powerTitle: "هیئت مدیریت مرکزی ائتلاف — سه ارگان",
    powerIntro: "معماری فرماندهی CPFIK قدرت را در سه ارگان تخصصی توزیع می‌کند که همگی به هیئت مدیریت مرکزی ائتلاف پاسخ می‌دهند.",

    organs: [
      { icon: "🎯", title: "مرکز فرماندهی مشترک", color: "#ef5350", items: ["پیشمرگه و نیروهای چریکی را زیر یک فرماندهی عملیاتی یکپارچه می‌کند", "تمام عملیات نظامی و دفاعی را اجرا می‌کند", "نفوذ نامتقارن PJAK را با کنترل سرزمینی پیشمرگه هماهنگ می‌کند", "به هیئت مدیریت مرکزی ائتلاف گزارش می‌دهد"] },
      { icon: "🌐", title: "کمیته دیپلماتیک مشترک", color: "#4fc3f7", items: ["تمام سیاست خارجی و تعامل بین‌المللی را اجرا می‌کند", "منابع و بودجه دیاسپورا را هماهنگ می‌کند", "با CIA، نهادهای دموکراتیک غربی و سازمان‌های حقوق بشر ارتباط برقرار می‌کند", "به دنبال شناسایی CPFIK به عنوان یک مرجع سیاسی مشروع است"] },
      { icon: "📡", title: "هماهنگی سیاسی و رسانه‌ای مشترک", color: "#ffd166", items: ["عملیات روانی و روابط عمومی را اجرا می‌کند", "پیام‌رسانی داخلی بین جناح‌ها را مدیریت می‌کند", "با جامعه مدنی ایرانی هماهنگی خارجی دارد", "پرونده کردی را در رسانه‌های بین‌المللی تقویت می‌کند"] },
    ],

    cascadeEyebrow: "آبشارهای ژئوپلیتیک مرتبه دوم و سوم",
    cascadeTitle: "سه نقطه اصطکاک سیستمی حیاتی",
    cascadeIntro: "فعال‌سازی CPFIK در زمینه جنگ ایران ۲۰۲۶ اثرات سیستمی مرتبه دوم و سوم فوری در سراسر منطقه ایجاد کرد.",

    cascades: [
      { number: "۰۱", title: "محاسبه ترکیه", subtitle: "ریسک سرایت تجزیه‌طلبی", body: "برای آنکارا، ظهور یک نهاد سیاسی کردی مسلح و خودمختار در مرز ایران یک تهدید وجودی است. PJAK پیوندهای ایدئولوژیک، لجستیکی و تاریخی با PKK دارد. ترکیه CPFIK را نه به عنوان یک جنبش آزادی‌بخش دموکراتیک بلکه به عنوان یک پناهگاه تروریستی مسلح می‌بیند. توانمندسازی CPFIK ترکیه را مجبور می‌کند موضع خود را بازارزیابی کند و احتمال بالایی از مداخلات یک‌جانبه فرامرزی ایجاد می‌کند.", risk: "بالا — دکترین امنیت ملی ترکیه اقدام نظامی یک‌جانبه علیه نیروهای مرتبط با PJAK را تقریباً قطعی می‌کند.", color: "#ef5350" },
      { number: "۰۲", title: "پارادوکس KRG", subtitle: "سکوی پرتاب در مقابل بدهی دیپلماتیک", body: "دولت منطقه‌ای کردستان در شمال عراق به عنوان سکوی پرتاب واقعی، پناهگاه لجستیکی و پایگاه دیپلماتیک CPFIK عمل می‌کند. با این حال، KRG در برابر تلافی ایران بسیار آسیب‌پذیر است. مقامات KRG مجبورند سیاست بی‌طرفی عمومی سختگیرانه‌ای را در حالی که مخفیانه عملیات CPFIK را میزبانی می‌کنند حفظ کنند.", risk: "شدید — KRG هیچ نتیجه خوبی ندارد. هر سناریو فشار وجودی از حداقل دو جهت همزمان ایجاد می‌کند.", color: "#ff9a42" },
      { number: "۰۳", title: "عامل پهلوی", subtitle: "سناریوی جنگ داخلی چندقطبی", body: "در ۲۵ فوریه ۲۰۲۶، ولیعهد رضا پهلوی صراحتاً CPFIK را 'تجزیه‌طلب' نامید و از ارتش خواست گروه‌های کردی را پس از سقوط رژیم خنثی کند. اگر CPFIK مرحله ۱ را به دست آورد و یک دولت ناسیونالیست فارس با پهلوی همسو کنترل دستگاه دولتی باقیمانده را به دست گیرد، ارتش را برای بازپس‌گیری استان‌های کردی مستقر خواهد کرد.", risk: "بحرانی — شدیدترین ریسک سیستمی. احتمال قریب‌به‌یقین جنگ داخلی چندقطبی بزرگترین آسیب‌پذیری کل سناریوی گذار ایران است.", color: "#ba68c8" },
    ],

    assessEyebrow: "ارزیابی استراتژیک",
    assessTitle: "ظرفیت سازمانی در مقابل متغیرهای حل‌نشده حیاتی",

    strengths: {
      title: "نقاط قوت ساختاری",
      color: "#26d9b2",
      items: [
        "تنها طرح اپوزیسیون ایرانی که در حال حاضر درگیر عملیات نظامی فعال است — CPFIK به سقوط تهران بستگی ندارد، آن را تسریع می‌کند",
        "نیروی نظامی ترکیبی (پیشمرگه + چریکی) زیر فرماندهی یکپارچه از نظر معماری منحصربه‌فرد است",
        "ماده ۱۴ مستقیماً زخم جنگ داخلی دهه ۶۰ را هدف می‌گیرد — از بازگشت جناحی جلوگیری می‌کند",
        "هماهنگی CIA کانال شناسایی بین‌المللی پیشرفته‌تر از هر طرح اپوزیسیون دیگری فراهم می‌کند",
        "ائتلاف با سازمان‌های بلوچ، عرب اهوازی، آذربایجانی ترک و ترکمن (از طریق CNFI) استدلال فدرالیستی را تقویت می‌کند",
      ],
    },
    weaknesses: {
      title: "متغیرهای حل‌نشده حیاتی",
      color: "#ef5350",
      items: [
        "حذف عمدی سیاست کلان اقتصادی، مدیریت منابع و چارچوب‌های عدالت انتقالی — شکنندگی ایدئولوژیک را هنگام گذار ائتلاف از جنگ به حاکمیت نشان می‌دهد",
        "ترکیب PDKI-PJAK از نظر معماری ناپایدار است — وقتی تصمیمات حاکمیتی واقعی نیاز به حل دارند به درگیری آشکار می‌شکند",
        "ریسک مداخله ترمرزی ترکیه تهدید می‌کند یک کمپین رهایی‌بخش را به جنگ چندجبهه‌ای تبدیل کند",
        "عامل پهلوی جنگ داخلی پس از سقوط را تقریباً قطعی می‌سازد",
        "سکوت منشور درباره سپاه، ارتش، دادگاه‌های روحانی و وزارتخانه‌ها یعنی حاکمیت مرحله ۲ بدون هیچ چارچوب نهادی برای مدیریت زیرساخت دولتی تصرف‌شده آغاز می‌شود",
      ],
    },

    conclusion: "«CPFIK ظرفیت سازمانی برای تأمین سریع کردستان ایران در صورت شکست سیستمی رژیم را دارد. با این حال، تبدیل این تصرف تاکتیکی به خودمختاری فدرال پایدار و به رسمیت شناخته‌شده کاملاً به توانایی آن‌ها در هدایت خلاء قدرت چندقطبی بستگی خواهد داشت.» — شورای آتلانتیک، مارس ۲۰۲۶",

    source: "منبع: منشور همکاری ۱۵ ماده‌ای (۲۲ فوریه ۲۰۲۶) · JINSA · شورای آتلانتیک · Chatham House · موسسه صلح کردی · موسسه واشنگتن کردی · ISW ایران آپدیت ۴ مارس ۲۰۲۶",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function CPFIKPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const TEAL = "#26d9b2", CYAN = "#4fc3f7", AMBER = "#ffd166",
    ORANGE = "#ff9a42", RED = "#ef5350", PURPLE = "#ba68c8";

  return (
    <div className="cpfik-page" dir={dir}>
      <ParticleGrid />
      <div className="cpfik-scanline" />
      <div className="cpfik-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="cpfik-hero">
          <p className="cpfik-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="cpfik-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="cpfik-hero-desc">{d.heroDesc}</p>
          <div className="cpfik-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="cpfik-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── HISTORICAL CONTEXT ── */}
        <SecHead eyebrow={d.histEyebrow} title={d.histTitle} intro={d.histIntro} color={TEAL} />
        <div className="cpfik-history">
          {d.history.map((n, i) => (
            <HistoryNode key={i} {...n} />
          ))}
        </div>

        <div className="cpfik-divider" />

        {/* ── FIVE FACTIONS ── */}
        <SecHead eyebrow={d.factEyebrow} title={d.factTitle} intro={d.factIntro} color={AMBER} />
        <div className="cpfik-faction-grid">
          {d.factions.map((f, i) => (
            <FactionCard key={i} {...f} />
          ))}
        </div>
        <div className="cpfik-boycott-note">
          <span className="cpfik-boycott-tag" style={{ color: ORANGE }}>⚠ {isRTL ? "یادداشت تحریم" : "BOYCOTT NOTE"}</span>
          <span>{d.boycottNote}</span>
        </div>

        <div className="cpfik-divider" />

        {/* ── IDEOLOGICAL SYNTHESIS ── */}
        <SecHead eyebrow={d.synthEyebrow} title={d.synthTitle} intro={d.synthIntro} color={PURPLE} />
        <div className="cpfik-synth-grid">
          <Accordion title={d.fedModel.title} color={TEAL} defaultOpen>
            <Bullets items={d.fedModel.items} color={TEAL} />
          </Accordion>
          <Accordion title={d.confModel.title} color={PURPLE} defaultOpen>
            <Bullets items={d.confModel.items} color={PURPLE} />
          </Accordion>
        </div>
        <div className="cpfik-bridge-note" style={{ borderColor: `${AMBER}30` }}>
          <span className="cpfik-bridge-tag" style={{ color: AMBER }}>{isRTL ? "پل معماری" : "ARCHITECTURAL BRIDGE"}</span>
          <span>{d.bridgeNote}</span>
        </div>

        <div className="cpfik-divider" />

        {/* ── 15-ARTICLE CHARTER ── */}
        <SecHead eyebrow={d.charterEyebrow} title={d.charterTitle} intro={d.charterIntro} color={TEAL} />
        <div className="cpfik-charter-grid">
          {d.articleClusters.map((ac, i) => (
            <ArticleCluster key={i} {...ac} />
          ))}
        </div>

        <div className="cpfik-divider" />

        {/* ── TWO PHASES ── */}
        <SecHead eyebrow={d.phasesEyebrow} title={d.phasesTitle} intro={d.phasesIntro} color={RED} />
        <div className="cpfik-phases-grid">
          {d.phases.map((ph, i) => (
            <PhaseCard key={i} number={ph.number} label={ph.label} title={ph.title} color={ph.color}>
              <Bullets items={ph.items} color={ph.color} />
            </PhaseCard>
          ))}
        </div>

        <div className="cpfik-divider" />

        {/* ── MILITARY ARCHITECTURE ── */}
        <SecHead eyebrow={d.milEyebrow} title={d.milTitle} intro={d.milIntro} color={RED} />
        <div className="cpfik-mil-grid">
          {d.milComparison.map((m, i) => (
            <div key={i} className="cpfik-mil-card" style={{ borderColor: `${m.color}30` }}>
              <div className="cpfik-mil-type" style={{ color: m.color }}>{m.type}</div>
              <div className="cpfik-mil-parties">{m.parties}</div>
              <div className="cpfik-mil-row"><span className="cpfik-mil-label">{isRTL ? "دکترین" : "Doctrine"}</span><span>{m.doctrine}</span></div>
              <div className="cpfik-mil-row"><span className="cpfik-mil-label">{isRTL ? "فرماندهی" : "Command"}</span><span>{m.command}</span></div>
              <div className="cpfik-mil-row"><span className="cpfik-mil-label">{isRTL ? "هدف" : "Purpose"}</span><span>{m.purpose}</span></div>
              <div className="cpfik-mil-row"><span className="cpfik-mil-label">{isRTL ? "مزیت ترکیبی" : "Hybrid Advantage"}</span><span style={{ color: m.color }}>{m.advantage}</span></div>
            </div>
          ))}
        </div>
        <div className="cpfik-joint-note" style={{ borderColor: `${RED}28` }}>
          <span className="cpfik-joint-tag" style={{ color: RED }}>{isRTL ? "نکته عملیاتی" : "OPERATIONAL NOTE"}</span>
          <span>{d.jointCommandNote}</span>
        </div>

        <div className="cpfik-divider" />

        {/* ── COMMAND STRUCTURE ── */}
        <SecHead eyebrow={d.powerEyebrow} title={d.powerTitle} intro={d.powerIntro} color={CYAN} />
        <div className="cpfik-organs-grid">
          {d.organs.map((o, i) => (
            <div key={i} className="cpfik-organ-card" style={{ borderColor: `${o.color}28` }}>
              <div className="cpfik-organ-icon">{o.icon}</div>
              <div className="cpfik-organ-title" style={{ color: o.color, fontFamily: ff }}>{o.title}</div>
              <Bullets items={o.items} color={o.color} />
            </div>
          ))}
        </div>

        <div className="cpfik-divider" />

        {/* ── GEOPOLITICAL CASCADES ── */}
        <SecHead eyebrow={d.cascadeEyebrow} title={d.cascadeTitle} intro={d.cascadeIntro} color={RED} />
        <div className="cpfik-cascade-grid">
          {d.cascades.map((c, i) => (
            <CascadeCard key={i} {...c} />
          ))}
        </div>

        <div className="cpfik-divider" />

        {/* ── STRATEGIC ASSESSMENT ── */}
        <SecHead eyebrow={d.assessEyebrow} title={d.assessTitle} intro="" color={TEAL} />
        <div className="cpfik-assess-grid">
          <div className="cpfik-assess-card" style={{ borderColor: `${TEAL}25` }}>
            <div className="cpfik-assess-title" style={{ color: TEAL }}>{d.strengths.title}</div>
            <Bullets items={d.strengths.items} color={TEAL} />
          </div>
          <div className="cpfik-assess-card" style={{ borderColor: `${RED}25` }}>
            <div className="cpfik-assess-title" style={{ color: RED }}>{d.weaknesses.title}</div>
            <Bullets items={d.weaknesses.items} color={RED} />
          </div>
        </div>

        {/* ── CONCLUSION ── */}
        <div className="cpfik-conclusion" style={{ fontFamily: ff }}>
          <span className="cpfik-conclusion-mark" style={{ color: TEAL }}>❝</span>
          <span>{d.conclusion}</span>
        </div>

        <p className="cpfik-source">{d.source}</p>

        <nav className="cpfik-footer-nav">
          <Link to="/plans" className="cpfik-footer-nav-link">
            {isRTL ? '← همه طرح‌های انتقالی' : '← All Transitional Plans'}
          </Link>
          <Link to="/arena" className="cpfik-footer-nav-link cpfik-footer-nav-link--secondary">
            {isRTL ? 'آرنا — تأیید طرح‌ها ←' : 'Arena — Endorse Plans →'}
          </Link>
        </nav>

      </div>
    </div>
  );
}
