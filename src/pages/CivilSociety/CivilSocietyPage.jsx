import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./CivilSocietyPage.css";

/* ─────────────────────────────────────────────────────
   Animated particle background — amber palette
───────────────────────────────────────────────────── */
function ParticleGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;
    const nodes = Array.from({ length: 52 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
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
            ctx.strokeStyle = `rgba(255,154,66,${(1 - dist / 175) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,154,66,${0.09 + p * 0.13})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="cs-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="cs-acc" style={{ "--c": color || "#ff9a42" }}>
      <button className="cs-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="cs-acc-title">{title}</span>
        {subtitle && <span className="cs-acc-subtitle">{subtitle}</span>}
        <span className="cs-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="cs-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="cs-bullets">
      {items.map((it, i) => (
        <li key={i} className="cs-bullet-item">
          <span className="cs-bullet-dot" style={{ background: color || "#ff9a42" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="cs-sechead">
      {eyebrow && <div className="cs-sechead-eyebrow" style={{ color: color || "#ff9a42" }}>{eyebrow}</div>}
      {title && <h2 className="cs-sechead-title">{title}</h2>}
      {intro && <p className="cs-sechead-intro">{intro}</p>}
    </div>
  );
}

function Banner({ label, text, color }) {
  return (
    <div className="cs-banner" style={{ borderColor: color, background: `${color}0a` }}>
      {label && <span className="cs-banner-label" style={{ color }}>{label}</span>}
      <span className="cs-banner-text">{text}</span>
    </div>
  );
}

function PillarCard({ icon, title, sub, color, children }) {
  return (
    <div className="cs-pillar" style={{ borderColor: `${color}30` }}>
      <div className="cs-pillar-icon">{icon}</div>
      <div className="cs-pillar-title" style={{ color }}>{title}</div>
      <div className="cs-pillar-sub">{sub}</div>
      <div className="cs-pillar-body">{children}</div>
    </div>
  );
}

function OrgCard({ domain, orgs, fn, color }) {
  return (
    <div className="cs-org-card" style={{ borderColor: `${color}25` }}>
      <div className="cs-org-domain" style={{ color }}>{domain}</div>
      <div className="cs-org-orgs">{orgs}</div>
      <div className="cs-org-fn">{fn}</div>
    </div>
  );
}

function PhaseBlock({ number, label, title, color, children }) {
  return (
    <div className="cs-phase-block" style={{ "--pb": color }}>
      <div className="cs-phase-num">{number}</div>
      <div className="cs-phase-label">{label}</div>
      <div className="cs-phase-title">{title}</div>
      <div className="cs-phase-content">{children}</div>
    </div>
  );
}

function ArticleGrid({ items, color }) {
  return (
    <div className="cs-article-grid">
      {items.map((it, i) => (
        <div key={i} className="cs-article-item">
          <span className="cs-article-n" style={{ color }}>{String(i + 1).padStart(2, "0")}</span>
          <span className="cs-article-text">{it}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "20 Independent Iranian Civil Organizations · Joint Charter of Minimum Demands · February 2023",
    heroTitle: "Civil Society Transitional Charter",
    heroDesc: "A grassroots, intersectional blueprint for Iran's transition authored by independent trade unions, feminist collectives, and student organizations — published in February 2023 coinciding with the 44th anniversary of the 1979 Islamic Revolution. Unlike top-down diaspora proposals, this charter emerges entirely from within Iran's borders, reflecting the immediate material realities of the working class and marginalized communities. Its 12 foundational articles demand the total dismantling of the theocratic-capitalist state and its replacement with a decentralized, council-based direct democracy.",
    heroBadges: [
      { label: "20 Signatory Organizations", c: "#ff9a42" },
      { label: "12 Foundational Articles", c: "#ffd166" },
      { label: "Homegrown — Inside Iran", c: "#69d98c" },
      { label: "Labor + Feminist + Anti-Colonial", c: "#ba68c8" },
      { label: "Direct Democracy", c: "#8B5CF6" },
    ],

    // ── PHILOSOPHY ──
    philEyebrow: "Ideological Foundation",
    philTitle: "The Three Pillars of the Ideological Engine",
    philIntro: "The Joint Charter operates at the intersection of three interlocking ideological pillars. It defines the 'Woman, Life, Freedom' uprising as a historic rebellion aimed at ending a century of religious AND non-religious tyranny — explicitly targeting the structural economic system, not merely the theocratic form of governance.",

    pillars: [
      {
        icon: "⚒️",
        title: "Dismantling Capitalist-Authoritarianism",
        sub: "Political democracy is impossible without simultaneous economic democracy",
        color: "#ff9a42",
        items: [
          "The Islamic Republic's longevity is secured through hyper-exploitation of labor and monopolization of national wealth by a parasitic, militarized elite",
          "The IRGC and state-backed religious foundations (Bonyads) control the commanding heights of the economy — this is the engine of the state's durability",
          "Political democratization is strictly impossible without the simultaneous democratization of the economy",
          "The transition requires stripping these entities of their economic assets and returning the means of production to the public domain through democratic councils",
          "Factories, petrochemical plants, natural resources — transferred to public ownership",
          "IRGC's Khatam al-Anbiya conglomerate and EIKO (Execution of Imam Khomeini's Order) are primary confiscation targets",
        ],
      },
      {
        icon: "🗺️",
        title: "The Dynamics of Internal Colonization",
        sub: "Core-periphery extraction as a structural mechanism of state control",
        color: "#ffd166",
        items: [
          "The Iranian state engineered a systematic core-periphery dynamic — wealth, water, and raw materials extracted from border regions to enrich the central provinces",
          "Arab-majority Khuzestan: oil extracted, water diverted, population left in severe environmental and economic deprivation",
          "Kurdish-majority Kurdistan: militarized, systematically underdeveloped, mother tongue suppressed",
          "Baloch-majority Sistan and Baluchestan: marginalized economically, culturally, and linguistically",
          "Uprisings in peripheral regions are framed as a unified anti-colonial struggle — integrated with urban working class demands",
          "Internal colonization is maintained through militarization, economic underdevelopment, and violent suppression of indigenous cultural identities",
        ],
      },
      {
        icon: "✊",
        title: "The Feminist and Socialist Nexus",
        sub: "Liberation of society is contingent on the absolute liberation of women and sexual minorities",
        color: "#ba68c8",
        items: [
          "Moves beyond liberal individual rights framework — identifies state-mandated patriarchy as a structural tool to humiliate, divide, and control the entire working class",
          "Compulsory hijab laws analyzed as an extension of the state's monopoly on violence — not merely a religious imposition",
          "In an unprecedented development for a major homegrown Iranian coalition: the charter explicitly recognizes the LGBTQIA+ 'rainbow society'",
          "Demands decriminalization of ALL consensual gender and sexual relations",
          "Cements the transitional framework as a radically inclusive, intersectional socialist project",
          "Dismantles all intersecting vectors of oppression simultaneously — gender, class, ethnicity, sexuality",
        ],
      },
    ],

    // ── PRE-FALL ──
    preEyebrow: "Pre-Fall Mobilization",
    preTitle: "Civil Society Vanguard — The 20 Signatory Organizations",
    preIntro: "The charter was authored and signed by 20 independent organizations operating inside Iran's borders. They represent the vanguard of the transitional movement — bridging industrial labor, the public sector, and feminist collectives. Each organization operates in a distinct domain of pre-fall mobilization.",

    orgs: [
      {
        domain: "⚙️ Industrial & Energy Labor",
        orgs: "Syndicate of Workers of Haft Tappeh Sugar Cane · Council for Organizing Protests of Oil Contract Workers · Ahvaz National Steel Group Workers",
        fn: "Organizing wildcat strikes to cripple the regime's economic lifelines: petrochemicals and heavy industry. Advocating against privatization and third-party contracting.",
        color: "#ff9a42",
      },
      {
        domain: "📚 Public Sector & Education",
        orgs: "Coordinating Council of Iranian Teachers' Trade Associations",
        fn: "Mobilizing nationwide strikes against ideological indoctrination in schools. Demanding fair wages and the release of all imprisoned educators.",
        color: "#8B5CF6",
      },
      {
        domain: "♀️ Feminist & Human Rights",
        orgs: "Bidarzani (Awakening) · The Call of Iranian Women · Center for Human Rights Defenders · Labor Rights Defenders Center",
        fn: "Documenting state violence. Organizing underground feminist resistance. Anchoring the 'Woman, Life, Freedom' ethos within the labor movement.",
        color: "#ba68c8",
      },
      {
        domain: "🎓 Youth & Student Movements",
        orgs: "Union of Free Students · Progressive Students Organization · Council of Free-Thinking Students",
        fn: "Transforming university campuses into strongholds of resistance. Coordinating urban protests. Articulating the intersectional demands of Generation Z.",
        color: "#69d98c",
      },
      {
        domain: "🧓 Retirees & Pensioners",
        orgs: "Union of Pensioners · Council of Pensioners of Iran · Council of Retirees of the Social Security Administration",
        fn: "Expanding the demographic base by protesting the collapse of pension funds and hyperinflation. Organizing weekly rallies. Bridging older and younger generations.",
        color: "#ffd166",
      },
    ],

    repression: {
      title: "State Repression & The Coalition's Response",
      items: [
        "Ministry of Intelligence systematically targeted all charter signatories after publication",
        "Labor leaders Mohammad Habibi and Esmail Abdi: violent re-arrests, prolonged solitary confinement, employment termination",
        "Activists Reyhaneh Ansarinejad, Asal Mohammadi, Anisha Asadollahi forcibly transferred to Evin Prison",
        "Internet access severely restricted to prevent organizational coordination",
        "Judiciary classified political dissent as 'vandalism' — seized private property, bank accounts, and assets of activists under guise of compensating for 'damages to urban infrastructure'",
        "International response: ITUC and Education International submitted formal ILO complaints regarding systematic torture and execution of Iranian trade unionists",
        "18 revolutionary student/youth groups across 32 cities formally endorsed the charter, providing critical street-level mobilization support",
      ],
    },

    // ── STAGE 1 ──
    s1Eyebrow: "Stage 1 — Emergency Phase",
    s1Title: "The 180-Day Emergency Transitional Period",
    s1Intro: "Upon the structural collapse of the Islamic Republic, the transition enters its most critical phase. Power does NOT transfer to a single executive or monarch. It transfers to a 'Transitional Coordinating Council' — elected representatives from the signatory trade unions, civil society groups, and regional minority councils. Duration: 180 days.",

    s1Council: {
      title: "The Transitional Coordinating Council — Structure",
      items: [
        "Composed of elected representatives from all 20 signatory trade unions and civil society organizations",
        "Regional minority councils — Kurdish, Baloch, Arab, Turkmen, and other ethnic communities hold guaranteed representation",
        "No single executive, president, or monarch — power is distributed horizontally",
        "Decisions by democratic majority with minority protection clauses",
        "No individual member holds veto power",
        "Term: 180 days only — at which point constitutional drafting elections must have been held",
      ],
    },

    s1Judicial: {
      title: "Article 1 + 3: Judicial Restitution & Transitional Justice",
      items: [
        "Unconditional release of ALL political prisoners — Article 1, no exceptions",
        "Total decriminalization of all political, union, and civil activities",
        "Specialized 'Transitional Lustration and Justice Committee' established to vet the bureaucracy",
        "Public, transparent trials for all individuals responsible for suppressing popular protests and state violence",
        "Immediate cancellation of ALL death penalty sentences — Article 3",
        "Formal abolition of qisas (retribution in kind) — the Islamic legal concept enabling state-sanctioned vengeance",
        "Explicit prohibition of all forms of mental and physical torture — zero exceptions",
        "Victims of the Kurdish and Baloch communities specifically prioritized for restitution",
      ],
    },

    s1Security: {
      title: "Security Sector: Total Dissolution of Repressive Organs",
      items: [
        "IRGC: legally outlawed and structurally dismantled — Day 1",
        "Basij paramilitary: legally outlawed and structurally dismantled — Day 1",
        "Morality police (Gasht-e Ershad): abolished immediately with no successor body",
        "All parallel intelligence agencies dissolved",
        "To prevent a security vacuum: law enforcement localized under direct democratic oversight of municipal and regional councils",
        "New community defense structure: explicitly stripped of ALL ideological enforcement mandates",
        "Focus solely on public safety and the protection of civil liberties",
        "No single national police force — federated, community-accountable model",
      ],
    },

    s1Civil: {
      title: "Article 2 + 5: Civil Liberties & Mandatory Secularization",
      items: [
        "Unconditional freedom of opinion, expression, thought, and the press — Article 2",
        "Absolute right to form political parties, local and national trade unions, and popular organizations",
        "Right to organize gatherings, strikes, marches, and utilize all social networks — enshrined as inviolable",
        "Immediate cessation of religious interference in ALL political, economic, social, and educational laws — Article 5",
        "State officially recognizes religion as a purely PRIVATE matter",
        "Compulsory hijab laws: nullified immediately",
        "All gender-segregation mandates governing public life: abolished immediately",
        "State educational curriculum: purged of all religious indoctrination content",
      ],
    },

    // ── ECONOMY ──
    econEyebrow: "Economic Restitution",
    econTitle: "Dismantling the Shadow Economy — Article 9",
    econIntro: "The economic restructuring is arguably the most radical component of the Joint Charter. The IRGC and Supreme Leader's office control vast swathes of the national economy through opaque shadow networks. The charter mandates systematic confiscation and redistribution.",

    shadowEconomy: {
      title: "The Shadow Economy: Scale of the Target",
      items: [
        "IRGC's Khatam al-Anbiya Construction Headquarters: controls major infrastructure, construction, and industrial contracts",
        "EIKO (Execution of Imam Khomeini's Order): the Supreme Leader's economic empire — hundreds of billions in real estate, industry, and finance",
        "Bonyads (religious foundations): Bonyad Mostazafin, Astan Quds Razavi — tax-exempt, state-protected conglomerates",
        "Ghost fleet of oil tankers: sanctions circumvention networks that bypass the Central Bank — revenues fund proxies, missiles, and domestic suppression",
        "2024–2025 national budget: military/intelligence spending surged 30% while workers' wages remained below the poverty line amid 40%+ hyperinflation",
        "State assets systematically transferred to Khatam al-Anbiya to 'settle government debt' — effective privatization of public wealth into military hands",
      ],
    },

    restitution: {
      title: "Article 9: Confiscation, Nationalization & Redistribution",
      items: [
        "Specialized 'Economic Restitution Task Force' mobilized during the 180-day emergency phase",
        "Systematically freeze, confiscate, and repatriate all assets of the Bonyads, IRGC, and state-affiliated oligarchs",
        "Recovered capital injected into a new sovereign wealth fund — exclusively for public restitution",
        "Immediate priority: stabilize the national currency",
        "End ALL predatory privatization — reverse all IRGC-era asset transfers",
        "All active and retired workers receive a living wage commensurate with cost of living — Article 6",
        "Wealth redistribution mechanism prioritizes historically deprived border regions — unwinding the legacy of internal colonization",
        "All energy revenues repatriated to the Central Bank to fund emergency social welfare, infrastructure, and public healthcare",
      ],
    },

    econComparison: [
      {
        sector: "Hydrocarbon Revenue",
        regime: "Oil revenues diverted to the Armed Forces and IRGC via shadow banking and preferential exchange rates",
        charter: "All energy revenues repatriated to the Central Bank — fund emergency social welfare, infrastructure, and public healthcare",
      },
      {
        sector: "State Assets & Real Estate",
        regime: "State assets transferred to Khatam al-Anbiya and EIKO to 'settle government debt' — privatizing public wealth into military hands",
        charter: "Immediate confiscation and nationalization of all properties looted by governmental, semi-governmental, and private rent-seeking institutions",
      },
      {
        sector: "Labor Wages & Pensions",
        regime: "Wages suppressed below the poverty line; pension funds bankrupted by state mismanagement; strikes criminalized",
        charter: "Job security guaranteed; immediate salary increases via independent unions; massive liquidity injected into pension funds",
      },
      {
        sector: "Public Welfare",
        regime: "Massive budget deficits passed onto citizens; severe lack of investment in healthcare and education",
        charter: "Universal unemployment insurance; prohibition of child labor; free universal education and healthcare as fundamental rights",
      },
    ],

    ecological: {
      title: "Article 10: Ecological Restitution",
      items: [
        "Decades of IRGC-affiliated dam-building and resource extraction have pushed Iran's ecosystem to the brink of collapse",
        "Khuzestan: the most severe environmental victim — oil extraction and water diversion have devastated the province",
        "Immediate end to all environmental destruction — Article 10",
        "Policies to revive destroyed ecological infrastructure",
        "Return ALL privatized natural areas — pastures, beaches, forests, foothills — to public ownership and management",
        "Environmental restitution treated as inseparable from economic and social restitution",
      ],
    },

    // ── STAGE 2 ──
    s2Eyebrow: "Stage 2 — Permanent Structure",
    s2Title: "The Permanent Democratic Architecture",
    s2Intro: "Following the 180-day emergency phase, the framework advances to permanent structural democracy. Authoritarianism cannot regenerate if the architecture of power is structurally incapable of reconcentrating. The constitution encodes radical equality, direct democracy, and the permanent right of recall.",

    s2Democracy: {
      title: "Article 8: Direct Democracy & The Right of Recall",
      items: [
        "The charter explicitly rejects ALL models of governance that rely on centralized, unassailable executive power",
        "Permanent legislative architecture: decentralized, relying on a federated network of local, municipal, and national councils",
        "The electorate holds the fundamental, permanent right to intervene in council decisions at any time",
        "The electorate holds the permanent right to dismiss ANY government or non-government official at any time — the 'Right of Recall'",
        "This right of recall is the cornerstone mechanism preventing the formation of a new political elite separated from the material realities of the population",
        "No single executive accumulates sufficient power to reverse democratic gains",
      ],
    },

    s2Equality: {
      title: "Article 4 + 7: Radical Social Equality",
      items: [
        "Full, absolute equality of rights between women and men across ALL political, economic, social, cultural, and family spheres — Article 4",
        "All discriminatory laws regarding family, inheritance, and bodily autonomy permanently abolished",
        "Constitutional recognition of the LGBTQIA+ community — the first such recognition in Iranian constitutional history",
        "Decriminalization of all consensual gender and sexual identities",
        "Abolition of ALL laws and behaviors based on ethnic or religious discrimination — Article 7",
        "Centralized assimilationist model replaced with guaranteed fair distribution of government resources for culture and art across all regions",
        "State constitutionally mandated to provide equal facilities for teaching and learning ALL mother tongues and minority languages used in Iranian society",
        "A pluralistic, multi-ethnic federation — not a Persian-centric nation-state",
      ],
    },

    s2Welfare: {
      title: "Article 11: The Social Welfare State",
      items: [
        "Prohibition of child labor — constitutionally enshrined — Article 11",
        "Free, high-quality education guaranteed for every child regardless of family's economic or social status",
        "Free, universal healthcare enshrined as a fundamental human right — not a market commodity",
        "Robust public unemployment insurance for all citizens of legal working age",
        "Strong social security protections for all those unable to work",
        "Public welfare system maintained as a constitutional obligation of the state — not subject to austerity",
        "Housing, healthcare, and education explicitly removed from market logic",
      ],
    },

    // ── FOREIGN POLICY ──
    fpEyebrow: "Foreign Policy Realignment",
    fpTitle: "Article 12: Geopolitical Transformation",
    fpIntro: "The Islamic Republic's foreign policy of regional proxy warfare, nuclear brinkmanship, and anti-Western antagonism has isolated Iran, triggered crippling sanctions, and justified massive domestic security budgets. The transitional framework mandates a complete paradigm shift.",

    fpItems: [
      "Normalization of foreign relations with ALL countries of the world — based strictly on fair relations, non-interference, and mutual respect — Article 12",
      "Absolute ban on the acquisition, development, and proliferation of nuclear weapons",
      "Transparent dismantling of the opaque nuclear infrastructure — eliminates justification for international sanctions",
      "Immediate end to the funding of ALL regional proxy militias — Hezbollah, Houthis, PMF, and all affiliated networks",
      "Iran's reintegration into the global economy follows automatically from ending the above",
      "Foreign policy aligned with domestic principles: human rights, environmental sustainability, and economic justice",
      "Active commitment to striving for world peace as a constitutional foreign policy objective",
    ],

    // ── 12 ARTICLES ──
    articlesLabel: "THE 12 FOUNDATIONAL ARTICLES — The Joint Charter of Minimum Demands",
    articles: [
      "Article 1: Unconditional release of all political prisoners · Full decriminalization of all political, union, and civil activities",
      "Article 2: Absolute freedom of opinion, expression, thought, and press · Right to form parties, unions, and popular organizations · Right to strike, march, and use social networks",
      "Article 3: Immediate cancellation of ALL death sentences · Abolition of qisas (retribution in kind) · Explicit prohibition of all mental and physical torture",
      "Article 4: Full and absolute equality of rights between women and men across all political, economic, social, cultural, and family spheres",
      "Article 5: Strict separation of religion and state · Cessation of all religious interference in political, economic, social, and educational laws",
      "Article 6: Job security for all workers · Living wages commensurate with real cost of living negotiated by independent unions · Liquidation of pension funds",
      "Article 7: Abolition of all laws and behaviors based on ethnic or religious discrimination · Equal resources for all mother tongues, minority languages, and regional cultures",
      "Article 8: Direct democracy and the permanent right of recall · Decentralized federated councils at local, municipal, and national levels",
      "Article 9: Confiscation and nationalization of all assets looted by governmental, semi-governmental, and private rent-seeking institutions · Redistribution via sovereign wealth fund",
      "Article 10: Immediate end to all environmental destruction · Restitution of privatized natural areas to public ownership — pastures, beaches, forests, foothills",
      "Article 11: Prohibition of child labor · Free universal education and healthcare as fundamental rights · Comprehensive unemployment insurance and social security",
      "Article 12: Normalization of international relations on basis of mutual respect and non-interference · Absolute ban on nuclear weapons · End all proxy militia funding",
    ],

    // ── STRATEGIC ASSESSMENT ──
    stratLabel: "STRATEGIC ASSESSMENT — Strengths and Challenges",
    strengths: {
      title: "Strategic Strengths",
      color: "#69d98c",
      items: [
        "Entirely homegrown — authored inside Iran by organizations operating under severe repression, conferring unmatched domestic credibility",
        "Material demands: bypasses reformist illusions AND elite diaspora models — targets the structural economic machinery, not just the leadership",
        "Organized labor controls the strategic heights of the Iranian economy — oil and petrochemical workers can exert structural pressure to cripple the regime",
        "Intersectional coalition: uniquely capable of uniting the urban working class, ethnic minorities, women, LGBTQIA+ communities, and student youth",
        "The 'Right of Recall' mechanism structurally prevents the regeneration of authoritarianism",
        "Council-based direct democracy is resistant to elite capture — no single actor can accumulate decisive power",
      ],
    },
    challenges: {
      title: "Implementation Challenges",
      color: "#ef5350",
      items: [
        "Entrenched state violence: the regime has demonstrated absolute willingness to use lethal force, mass incarceration, and economic expropriation to maintain power",
        "Shadow economy unwinding risk: confiscating the IRGC's deeply embedded economic holdings without triggering economic collapse is a monumental logistical challenge",
        "Geographic decentralization vs. coordination: the horizontal council model requires sophisticated coordination infrastructure that does not yet exist at scale",
        "State repression of leadership: key signatories already imprisoned or in exile — the movement operates in conditions of extreme organizational disruption",
        "Coalition coherence: maintaining unity between industrial workers, feminist collectives, ethnic minorities, and student groups across diverse material interests requires sustained organizational work",
      ],
    },

    conclusion: "\"The 20-Point Joint Charter of Minimum Demands sets the indispensable conditions for a sustainable peace. It ensures that any future post-theocratic Iran is constructed not upon the substitution of one autocracy for another, but upon the foundational principles of radical equality, transparent economic justice, and the inviolable dignity of all its citizens.\" — Joint Charter Conclusion",

    source: "Source: Joint Charter of Minimum Demands of Independent Trade Unions and Civil Organizations of Iran (February 2023) · IranWire · International Socialist League · Jacobin · ITUC/ILO submissions",
  },

  // ─────────────────────────────────────────────────────
  // PERSIAN
  // ─────────────────────────────────────────────────────
  fa: {
    heroEyebrow: "۲۰ سازمان مستقل مدنی ایران · منشور حداقل مطالبات · فوریه ۲۰۲۳",
    heroTitle: "منشور گذار جامعه مدنی",
    heroDesc: "یک طرح گذار پایین‌به‌بالا و فراگیر برای ایران، که توسط سندیکاهای مستقل کارگری، کلکتیوهای فمینیستی و سازمان‌های دانشجویی نوشته شده است — منتشر شده در فوریه ۲۰۲۳ همزمان با چهل و چهارمین سالگرد انقلاب ۱۳۵۷. برخلاف پیشنهادهای بالا‌به‌پایین دیاسپورا، این منشور کاملاً از داخل مرزهای ایران برخاسته است. ۱۲ ماده بنیادی آن خواستار برچیدن کامل دولت تئوکراتیک-سرمایه‌دارانه و جایگزینی آن با یک دموکراسی مستقیم مبتنی بر شوراهای غیرمتمرکز است.",
    heroBadges: [
      { label: "۲۰ سازمان امضاکننده", c: "#ff9a42" },
      { label: "۱۲ ماده بنیادی", c: "#ffd166" },
      { label: "خودجوش — داخل ایران", c: "#69d98c" },
      { label: "کارگری + فمینیستی + ضداستعماری", c: "#ba68c8" },
      { label: "دموکراسی مستقیم", c: "#8B5CF6" },
    ],

    philEyebrow: "بنیاد ایدئولوژیک",
    philTitle: "سه ستون موتور ایدئولوژیک",
    philIntro: "منشور مشترک در تقاطع سه ستون ایدئولوژیک به‌هم‌پیوسته عمل می‌کند. جنبش 'زن، زندگی، آزادی' را یک شورش تاریخی برای پایان دادن به یک قرن استبداد مذهبی و غیرمذهبی تعریف می‌کند — صریحاً نظام اقتصادی ساختاری را هدف قرار می‌دهد، نه صرفاً شکل تئوکراتیک حاکمیت.",

    pillars: [
      {
        icon: "⚒️",
        title: "برچیدن سرمایه‌داری اقتدارگرا",
        sub: "دموکراسی سیاسی بدون دموکراسی اقتصادی همزمان غیرممکن است",
        color: "#ff9a42",
        items: [
          "ماندگاری جمهوری اسلامی از طریق بهره‌کشی شدید از نیروی کار و انحصار ثروت ملی توسط یک نخبگان انگلی و نظامی‌شده تضمین شده است",
          "سپاه پاسداران و بنیادهای مذهبی دولتی (بنیادها) قله‌های فرماندهی اقتصاد را کنترل می‌کنند",
          "دموکراتیزه‌سازی سیاسی بدون دموکراتیزه‌سازی همزمان اقتصاد کاملاً غیرممکن است",
          "گذار نیازمند سلب مالکیت از این نهادها و بازگرداندن ابزار تولید به حوزه عمومی از طریق شوراهای دموکراتیک است",
          "کارخانه‌ها، پتروشیمی‌ها، منابع طبیعی — انتقال به مالکیت عمومی",
          "قرارگاه خاتم‌الانبیاء سپاه و ستاد (قرارگاه اجرایی امام خمینی) اهداف اصلی مصادره هستند",
        ],
      },
      {
        icon: "🗺️",
        title: "پویایی‌های استعمار داخلی",
        sub: "استخراج مرکز-پیرامون به عنوان مکانیزم ساختاری کنترل دولتی",
        color: "#ffd166",
        items: [
          "دولت ایران یک دینامیک سیستماتیک مرکز-پیرامون طراحی کرد — ثروت، آب و مواد خام از مناطق مرزی به استان‌های مرکزی استخراج می‌شود",
          "خوزستان با اکثریت عرب: نفت استخراج می‌شود، آب تغییر مسیر می‌دهد، جمعیت در محرومیت شدید اقتصادی و زیست‌محیطی",
          "کردستان با اکثریت کرد: نظامی‌شده، عمداً توسعه‌نیافته، زبان مادری سرکوب شده",
          "سیستان و بلوچستان با اکثریت بلوچ: از نظر اقتصادی، فرهنگی و زبانی به حاشیه رانده شده",
          "قیام‌ها در مناطق پیرامونی به عنوان مبارزه ضداستعماری متحد تعریف می‌شوند",
          "استعمار داخلی از طریق نظامی‌گری، توسعه‌نیافتگی اقتصادی و سرکوب خشونت‌آمیز هویت‌های فرهنگی بومی حفظ می‌شود",
        ],
      },
      {
        icon: "✊",
        title: "پیوند فمینیستی و سوسیالیستی",
        sub: "رهایی جامعه مشروط به رهایی مطلق زنان و اقلیت‌های جنسی است",
        color: "#ba68c8",
        items: [
          "فراتر از چارچوب لیبرالی حقوق فردی حرکت می‌کند — پدرسالاری اجباری دولتی را ابزاری ساختاری برای تحقیر، تفرقه و کنترل کل طبقه کارگر معرفی می‌کند",
          "قوانین حجاب اجباری به عنوان امتداد انحصار دولت بر خشونت تحلیل می‌شود",
          "در یک اقدام بی‌سابقه برای یک ائتلاف بزرگ ایرانی: منشور صراحتاً جامعه 'رنگین‌کمان' LGBTQIA+ را به رسمیت می‌شناسد",
          "خواستار جرم‌زدایی از تمام روابط جنسیتی و جنسی توافقی است",
          "این منشور را به عنوان یک پروژه سوسیالیستی رادیکاً فراگیر و چندبعدی تثبیت می‌کند",
          "تمام بردارهای تقاطعی ستم را به صورت همزمان برمی‌چیند — جنسیت، طبقه، قومیت، گرایش جنسی",
        ],
      },
    ],

    preEyebrow: "بسیج پیش از سقوط",
    preTitle: "پیشتازان جامعه مدنی — ۲۰ سازمان امضاکننده",
    preIntro: "منشور توسط ۲۰ سازمان مستقل که در داخل مرزهای ایران فعالیت می‌کنند نوشته و امضا شد. آن‌ها نماینده پیشتازان جنبش گذار هستند — پیوند دهنده نیروی کار صنعتی، بخش دولتی و کلکتیوهای فمینیستی.",

    orgs: [
      {
        domain: "⚙️ نیروی کار صنعتی و انرژی",
        orgs: "سندیکای کارگران هفت‌تپه · شورای سازماندهی اعتراضات کارگران پیمانی نفت · کارگران فولاد ملی اهواز",
        fn: "سازماندهی اعتصابات خودجوش برای فلج کردن شریان‌های اقتصادی رژیم: پتروشیمی و صنایع سنگین. مبارزه علیه خصوصی‌سازی و قراردادهای پیمانکاری.",
        color: "#ff9a42",
      },
      {
        domain: "📚 بخش دولتی و آموزش",
        orgs: "شورای هماهنگی تشکل‌های صنفی فرهنگیان ایران",
        fn: "بسیج اعتصابات سراسری علیه القای آموزش ایدئولوژیک در مدارس. خواستار دستمزد منصفانه و آزادی تمام معلمان زندانی.",
        color: "#8B5CF6",
      },
      {
        domain: "♀️ کلکتیوهای فمینیستی و حقوق بشر",
        orgs: "بیدارزنی · صدای زنان ایران · کانون مدافعان حقوق بشر · کانون مدافعان حقوق کارگر",
        fn: "مستندسازی خشونت دولتی. سازماندهی مقاومت فمینیستی زیرزمینی. لنگر انداختن اتوس 'زن، زندگی، آزادی' در جنبش کارگری.",
        color: "#ba68c8",
      },
      {
        domain: "🎓 جنبش‌های دانشجویی و جوانان",
        orgs: "اتحادیه دانشجویان آزاد · سازمان دانشجویان پیشرو · شورای دانشجویان آزاداندیش",
        fn: "تبدیل پردیس‌های دانشگاهی به دژهای مقاومت. هماهنگی اعتراضات شهری. تدوین خواسته‌های چندبعدی نسل Z.",
        color: "#69d98c",
      },
      {
        domain: "🧓 بازنشستگان و مستمری‌بگیران",
        orgs: "کانون بازنشستگان · شورای بازنشستگان ایران · شورای بازنشستگان سازمان تأمین اجتماعی",
        fn: "گسترش پایگاه جمعیتی قیام با اعتراض به سقوط صندوق‌های بازنشستگی و تورم بی‌رویه. سازماندهی تجمعات هفتگی.",
        color: "#ffd166",
      },
    ],

    repression: {
      title: "سرکوب دولتی و پاسخ ائتلاف",
      items: [
        "وزارت اطلاعات پس از انتشار منشور به طور سیستماتیک تمام امضاکنندگان را هدف قرار داد",
        "رهبران کارگری محمد حبیبی و اسماعیل عبدی: بازداشت مجدد با خشونت، بازداشت انفرادی طولانی‌مدت، اخراج از کار",
        "فعالان ریحانه انصاری‌نژاد، آسل محمدی، آنیشا اسدالهی اجباراً به زندان اوین منتقل شدند",
        "دسترسی به اینترنت شدیداً محدود شد تا از هماهنگی سازمانی جلوگیری کند",
        "دادگاه مخالفت سیاسی را 'اخلال و ضرر به اموال عمومی' طبقه‌بندی کرد — اموال خصوصی، حساب‌های بانکی و دارایی‌های فعالان را مصادره کرد",
        "پاسخ بین‌المللی: ITUC و Education International شکایات رسمی ILO درباره شکنجه سیستماتیک و اعدام فعالان کارگری تسلیم کردند",
        "۱۸ گروه دانشجویی و جوانان در ۳۲ شهر رسماً از منشور حمایت کردند",
      ],
    },

    s1Eyebrow: "مرحله ۱ — فاز اضطراری",
    s1Title: "دوره گذار اضطراری ۱۸۰ روزه",
    s1Intro: "پس از فروپاشی ساختاری جمهوری اسلامی، گذار وارد حساس‌ترین مرحله خود می‌شود. قدرت به یک فرد، مجری یا پادشاه منتقل نمی‌شود. به 'شورای هماهنگی موقت' منتقل می‌شود — نمایندگان منتخب سندیکاهای کارگری امضاکننده، گروه‌های جامعه مدنی و شوراهای اقلیت‌های منطقه‌ای.",

    s1Council: {
      title: "شورای هماهنگی موقت — ساختار",
      items: [
        "متشکل از نمایندگان منتخب تمام ۲۰ سندیکا و سازمان جامعه مدنی امضاکننده",
        "شوراهای اقلیت منطقه‌ای — کردها، بلوچ‌ها، عرب‌ها، ترکمن‌ها و سایر جوامع قومی نمایندگی تضمین‌شده دارند",
        "هیچ فرد، رئیس‌جمهور یا پادشاهی — قدرت به صورت افقی توزیع می‌شود",
        "تصمیمات با اکثریت دموکراتیک با بندهای حمایت از اقلیت",
        "هیچ عضوی حق وتو ندارد",
        "مدت: فقط ۱۸۰ روز — پس از آن انتخابات تهیه قانون اساسی باید برگزار شده باشد",
      ],
    },

    s1Judicial: {
      title: "ماده ۱ + ۳: عدالت انتقالی و جبران قضایی",
      items: [
        "آزادی بی‌قیدوشرط تمام زندانیان سیاسی — ماده ۱، بدون استثنا",
        "جرم‌زدایی کامل از تمام فعالیت‌های سیاسی، صنفی و مدنی",
        "تأسیس 'کمیته موقت پاکسازی و عدالت انتقالی' برای بررسی بوروکراسی",
        "محاکمات علنی و شفاف برای تمام افراد مسئول سرکوب اعتراضات مردمی",
        "لغو فوری تمام حکم‌های اعدام — ماده ۳",
        "الغای رسمی قصاص و تمام اشکال شکنجه جسمی و روانی",
        "قربانیان جوامع کرد و بلوچ به طور خاص در اولویت جبران خسارت قرار می‌گیرند",
      ],
    },

    s1Security: {
      title: "بخش امنیتی: انحلال کامل ارگان‌های سرکوب",
      items: [
        "سپاه پاسداران: قانوناً منحل و ساختاری برچیده می‌شود — روز اول",
        "نیروی بسیج: قانوناً منحل و ساختاری برچیده می‌شود — روز اول",
        "پلیس اخلاق (گشت ارشاد): فوری لغو می‌شود بدون هیچ نهاد جانشین",
        "تمام سازمان‌های اطلاعاتی موازی منحل می‌شوند",
        "برای جلوگیری از خلاء امنیتی: اجرای قانون بومی و تحت نظارت دموکراتیک مستقیم شوراهای شهری و منطقه‌ای",
        "ساختار دفاع اجتماعی جدید: صراحتاً از تمام مأموریت‌های اجرای ایدئولوژیک سلب شده است",
        "تمرکز صرفاً بر ایمنی عمومی و حفاظت از آزادی‌های مدنی",
      ],
    },

    s1Civil: {
      title: "ماده ۲ + ۵: آزادی‌های مدنی و سکولاریزاسیون اجباری",
      items: [
        "آزادی بی‌قیدوشرط عقیده، بیان، اندیشه و مطبوعات — ماده ۲",
        "حق مطلق تشکیل احزاب سیاسی، سندیکاهای محلی و ملی و سازمان‌های مردمی",
        "حق تجمع، اعتصاب، راهپیمایی و استفاده از همه شبکه‌های اجتماعی — ذاتی و تضمین‌شده",
        "توقف فوری دخالت مذهبی در تمام قوانین سیاسی، اقتصادی، اجتماعی و آموزشی — ماده ۵",
        "دولت رسماً مذهب را صرفاً امری خصوصی می‌شناسد",
        "قوانین حجاب اجباری: بلافاصله لغو می‌شود",
        "تمام دستورات تفکیک جنسیتی در زندگی عمومی: فوری لغو می‌شود",
      ],
    },

    econEyebrow: "جبران اقتصادی",
    econTitle: "برچیدن اقتصاد سایه — ماده ۹",
    econIntro: "بازسازی اقتصادی مقرر شده در منشور مشترک احتمالاً رادیکال‌ترین مؤلفه آن است. سپاه و دفتر رهبر معظم از طریق شبکه‌های سایه مبهم، بخش‌های گسترده‌ای از اقتصاد ملی را کنترل می‌کنند. منشور مصادره سیستماتیک و توزیع مجدد را الزامی می‌داند.",

    shadowEconomy: {
      title: "اقتصاد سایه: مقیاس هدف",
      items: [
        "قرارگاه خاتم‌الانبیاء سپاه: قراردادهای عمده زیرساختی، ساختمانی و صنعتی را کنترل می‌کند",
        "ستاد (اجرایی امام خمینی): امپراتوری اقتصادی رهبری — صدها میلیارد دلار در املاک، صنعت و مالیه",
        "بنیادها: بنیاد مستضعفان، آستان قدس رضوی — کنگلومراهای معاف از مالیات و حمایت‌شده دولتی",
        "ناوگان شبح نفتکش: شبکه‌های دور زدن تحریم که از بانک مرکزی عبور می‌کنند — درآمدها صرف نیروهای نیابتی، موشک و سرکوب داخلی می‌شود",
        "بودجه ۱۴۰۳–۱۴۰۴: هزینه‌های نظامی/اطلاعاتی ۳۰٪ رشد کرد در حالی که دستمزد کارگران زیر خط فقر ماند",
      ],
    },

    restitution: {
      title: "ماده ۹: مصادره، ملی‌شدن و توزیع مجدد",
      items: [
        "کارگروه تخصصی 'جبران اقتصادی' در طول ۱۸۰ روز اضطراری بسیج می‌شود",
        "سیستماتیک تمام دارایی‌های بنیادها، سپاه و الیگارشی‌های وابسته به دولت را مسدود، مصادره و بازگردانی می‌کند",
        "سرمایه بازیابی‌شده در یک صندوق ثروت حاکمیتی جدید تزریق می‌شود — انحصاراً برای جبران عمومی",
        "اولویت فوری: تثبیت ارز ملی",
        "پایان تمام خصوصی‌سازی‌های غارتگرانه — معکوس کردن تمام انتقال دارایی‌های دوره سپاه",
        "تمام کارگران فعال و بازنشسته دستمزد متناسب با هزینه زندگی دریافت می‌کنند — ماده ۶",
        "مناطق مرزی محروم تاریخی در اولویت توزیع مجدد ثروت قرار می‌گیرند",
      ],
    },

    econComparison: [
      {
        sector: "درآمد هیدروکربنی",
        regime: "درآمد نفتی از طریق شبکه بانکداری سایه به نیروهای مسلح و سپاه تغییر مسیر داده می‌شود",
        charter: "تمام درآمدهای انرژی به بانک مرکزی بازگردانی می‌شود — تأمین مالی رفاه اجتماعی اضطراری، زیرساخت و بهداشت عمومی",
      },
      {
        sector: "دارایی‌های دولتی و املاک",
        regime: "دارایی‌های دولتی به قرارگاه خاتم‌الانبیاء و ستاد منتقل می‌شود تا 'بدهی دولت را تسویه کند'",
        charter: "مصادره و ملی‌شدن فوری تمام اموال غارت‌شده توسط نهادهای دولتی، شبه‌دولتی و رانت‌خوار خصوصی",
      },
      {
        sector: "دستمزد کارگری و بازنشستگی",
        regime: "دستمزدها عمداً زیر خط فقر نگه داشته می‌شوند؛ صندوق‌های بازنشستگی ورشکسته شده‌اند؛ اعتصابات جرم‌انگاری شده است",
        charter: "امنیت شغلی تضمین‌شده؛ افزایش فوری حقوق از طریق سندیکاهای مستقل؛ تزریق نقدینگی عظیم به صندوق‌های بازنشستگی",
      },
      {
        sector: "رفاه عمومی",
        regime: "کسری بودجه‌های عظیم به دوش شهروندان؛ فقدان شدید سرمایه‌گذاری در بهداشت و آموزش",
        charter: "بیمه بیکاری همگانی؛ ممنوعیت کار کودکان؛ آموزش و بهداشت رایگان و همگانی به عنوان حقوق اساسی",
      },
    ],

    ecological: {
      title: "ماده ۱۰: جبران زیست‌محیطی",
      items: [
        "دهه‌ها فساد گسترده، سدسازی‌های قرارگاه سپاه و استخراج منابع اکوسیستم ایران را به مرز فروپاشی رسانده است",
        "خوزستان: قربانی اصلی زیست‌محیطی — استخراج نفت و انحراف آب استان را نابود کرده است",
        "پایان فوری به تمام تخریب زیست‌محیطی — ماده ۱۰",
        "سیاست‌ها برای احیای زیرساخت اکولوژیکی تخریب‌شده",
        "بازگرداندن تمام مناطق طبیعی خصوصی‌شده — مراتع، سواحل، جنگل‌ها، دامنه‌ها — به مالکیت و مدیریت عمومی",
      ],
    },

    s2Eyebrow: "مرحله ۲ — ساختار دائمی",
    s2Title: "معماری دموکراتیک دائمی",
    s2Intro: "پس از فاز اضطراری ۱۸۰ روزه، چارچوب به دموکراسی ساختاری دائمی پیشرفت می‌کند. اقتدارگرایی نمی‌تواند بازتولید شود اگر معماری قدرت ساختاری از تمرکز مجدد ناتوان باشد.",

    s2Democracy: {
      title: "ماده ۸: دموکراسی مستقیم و حق عزل",
      items: [
        "منشور صراحتاً تمام مدل‌های حاکمیتی که به قدرت اجرایی متمرکز و غیرقابل دسترس متکی هستند را رد می‌کند",
        "معماری قانونگذاری دائمی: غیرمتمرکز، متکی به شبکه فدرال شوراهای محلی، شهری و ملی",
        "رأی‌دهندگان حق بنیادی و دائمی برای دخالت در تصمیمات شوراها دارند",
        "رأی‌دهندگان حق دائمی عزل هر مقام دولتی یا غیردولتی در هر زمان را دارند — 'حق عزل'",
        "این حق عزل مکانیزم اصلی جلوگیری از شکل‌گیری یک نخبه سیاسی جدید است",
        "هیچ فردی قدرت کافی برای معکوس کردن دستاوردهای دموکراتیک جمع نمی‌کند",
      ],
    },

    s2Equality: {
      title: "ماده ۴ + ۷: برابری اجتماعی رادیکال",
      items: [
        "برابری کامل و مطلق حقوق بین زن و مرد در تمام حوزه‌های سیاسی، اقتصادی، اجتماعی، فرهنگی و خانوادگی — ماده ۴",
        "تمام قوانین تبعیض‌آمیز درباره خانواده، ارث و استقلال بدنی به طور دائمی لغو می‌شوند",
        "به رسمیت شناختن قانون اساسی جامعه LGBTQIA+ — اولین بار در تاریخ قانون اساسی ایران",
        "جرم‌زدایی از تمام هویت‌های جنسیتی و جنسی توافقی",
        "الغای تمام قوانین و رفتارهای مبتنی بر تبعیض قومی یا مذهبی — ماده ۷",
        "دولت به صورت قانون اساسی موظف است امکانات برابر برای آموزش تمام زبان‌های مادری و زبان‌های اقلیت فراهم کند",
        "یک فدراسیون چندقومی و کثرت‌گرا — نه یک دولت-ملت فارس‌محور",
      ],
    },

    s2Welfare: {
      title: "ماده ۱۱: دولت رفاه اجتماعی",
      items: [
        "ممنوعیت کار کودکان — ماده ۱۱",
        "آموزش رایگان و باکیفیت برای هر کودک بدون توجه به وضعیت اقتصادی یا اجتماعی خانواده",
        "بهداشت و آموزش رایگان و همگانی به عنوان حقوق اساسی بشری — نه کالای بازار",
        "بیمه بیکاری عمومی قوی برای تمام شهروندان در سن کار",
        "حمایت قوی تأمین اجتماعی برای همه ناتوان از کار",
        "مسکن، بهداشت و آموزش صراحتاً از منطق بازار خارج شده‌اند",
      ],
    },

    fpEyebrow: "تجدیدآرایش سیاست خارجی",
    fpTitle: "ماده ۱۲: تحول ژئوپلیتیک",
    fpIntro: "سیاست خارجی جمهوری اسلامی مبتنی بر جنگ نیابتی منطقه‌ای، بازی با آتش هسته‌ای و خصومت با غرب، ایران را منزوی کرده، تحریم‌های فلج‌کننده ایجاد کرده و بودجه‌های امنیتی داخلی عظیم را توجیه کرده است.",

    fpItems: [
      "عادی‌سازی روابط خارجی با تمام کشورهای جهان — بر اساس روابط منصفانه، عدم مداخله و احترام متقابل — ماده ۱۲",
      "ممنوعیت مطلق کسب، توسعه و اشاعه سلاح‌های هسته‌ای",
      "برچیدن شفاف زیرساخت هسته‌ای مبهم — توجیه تحریم‌های بین‌المللی را از بین می‌برد",
      "پایان فوری به تأمین مالی تمام شبه‌نظامیان منطقه‌ای — حزب‌الله، حوثی‌ها، الحشد الشعبی و تمام شبکه‌های وابسته",
      "ادغام مجدد ایران در اقتصاد جهانی به طور خودکار از موارد بالا نتیجه می‌شود",
      "سیاست خارجی با اصول داخلی همسو می‌شود: حقوق بشر، پایداری زیست‌محیطی و عدالت اقتصادی",
    ],

    articlesLabel: "۱۲ ماده بنیادی — منشور حداقل مطالبات",
    articles: [
      "ماده ۱: آزادی بی‌قیدوشرط تمام زندانیان سیاسی · جرم‌زدایی کامل از فعالیت‌های سیاسی، صنفی و مدنی",
      "ماده ۲: آزادی مطلق عقیده، بیان، اندیشه و مطبوعات · حق تشکیل احزاب، سندیکاها و سازمان‌های مردمی · حق اعتصاب، راهپیمایی و شبکه‌های اجتماعی",
      "ماده ۳: لغو فوری تمام احکام اعدام · الغای قصاص · ممنوعیت صریح تمام شکنجه‌های جسمی و روانی",
      "ماده ۴: برابری کامل و مطلق حقوق بین زن و مرد در تمام حوزه‌های سیاسی، اقتصادی، اجتماعی، فرهنگی و خانوادگی",
      "ماده ۵: جدایی دقیق مذهب از دولت · توقف تمام دخالت مذهبی در قوانین سیاسی، اقتصادی، اجتماعی و آموزشی",
      "ماده ۶: امنیت شغلی برای تمام کارگران · دستمزد متناسب با هزینه زندگی واقعی از طریق سندیکاهای مستقل · تصفیه صندوق‌های بازنشستگی",
      "ماده ۷: الغای تمام قوانین و رفتارهای مبتنی بر تبعیض قومی یا مذهبی · منابع برابر برای تمام زبان‌های مادری، اقلیت‌های زبانی و فرهنگ‌های منطقه‌ای",
      "ماده ۸: دموکراسی مستقیم و حق عزل دائمی · شوراهای فدرال غیرمتمرکز در سطوح محلی، شهری و ملی",
      "ماده ۹: مصادره و ملی‌شدن تمام دارایی‌های غارت‌شده توسط نهادهای دولتی، شبه‌دولتی و رانت‌خوار · توزیع مجدد از طریق صندوق ثروت حاکمیتی",
      "ماده ۱۰: پایان فوری به تخریب زیست‌محیطی · بازگشت مناطق طبیعی خصوصی‌شده به مالکیت عمومی — مراتع، سواحل، جنگل‌ها، دامنه‌ها",
      "ماده ۱۱: ممنوعیت کار کودکان · آموزش و بهداشت رایگان و همگانی به عنوان حقوق اساسی · بیمه بیکاری همگانی و تأمین اجتماعی",
      "ماده ۱۲: عادی‌سازی روابط بین‌المللی بر اساس احترام متقابل و عدم مداخله · ممنوعیت مطلق سلاح‌های هسته‌ای · پایان به تأمین مالی تمام شبه‌نظامیان",
    ],

    stratLabel: "ارزیابی استراتژیک — نقاط قوت و چالش‌ها",
    strengths: {
      title: "نقاط قوت استراتژیک",
      color: "#69d98c",
      items: [
        "کاملاً خودجوش — توسط سازمان‌هایی که در شرایط سرکوب شدید در داخل ایران عمل می‌کنند نوشته شده است",
        "خواسته‌های مادی: توهمات اصلاح‌طلبانه و مدل‌های نخبگانی دیاسپورا را دور می‌زند",
        "نیروی کار سازمان‌یافته قله‌های استراتژیک اقتصاد ایران را کنترل می‌کند — کارگران نفت و پتروشیمی می‌توانند فشار ساختاری وارد کنند",
        "ائتلاف چندبعدی: به طور منحصربه‌فردی قادر به متحد کردن طبقه کارگر، اقلیت‌های قومی، زنان، جامعه LGBTQIA+ و دانشجویان است",
        "مکانیزم 'حق عزل' ساختاری از بازتولید اقتدارگرایی جلوگیری می‌کند",
      ],
    },
    challenges: {
      title: "چالش‌های اجرایی",
      color: "#ef5350",
      items: [
        "خشونت دولتی ریشه‌دار: رژیم تمایل مطلق خود به استفاده از زور کشنده، زندانی‌شدن گروهی و مصادره اقتصادی را نشان داده است",
        "ریسک برچیدن اقتصاد سایه: مصادره دارایی‌های عمیقاً جاسازی‌شده سپاه بدون ایجاد فروپاشی اقتصادی چالش لجستیکی هنگفتی است",
        "غیرمتمرکزسازی جغرافیایی در مقابل هماهنگی: مدل افقی شورایی به زیرساخت هماهنگی پیچیده‌ای نیاز دارد که هنوز در مقیاس وجود ندارد",
        "سرکوب دولتی رهبری: امضاکنندگان کلیدی از قبل زندانی یا در تبعید هستند",
        "انسجام ائتلاف: حفظ وحدت بین کارگران صنعتی، کلکتیوهای فمینیستی، اقلیت‌های قومی و گروه‌های دانشجویی با منافع مادی متنوع",
      ],
    },

    conclusion: "«منشور ۲۰ ماده‌ای حداقل مطالبات شرایط ناگزیر یک صلح پایدار را تعیین می‌کند. تضمین می‌کند که ایران پس از تئوکراسی نه بر اساس جایگزینی یک استبداد با استبدادی دیگر، بلکه بر اساس اصول بنیادین برابری رادیکال، عدالت اقتصادی شفاف و کرامت تغییرناپذیر تمام شهروندانش بنا شود.» — نتیجه‌گیری منشور مشترک",

    source: "منبع: منشور حداقل مطالبات سندیکاهای مستقل و سازمان‌های مدنی ایران (فوریه ۲۰۲۳) · ایران‌وایر · لیگ بین‌المللی سوسیالیستی · جاکوبین · شکایات ITUC/ILO",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function CivilSocietyPage() {
  const { lang, isRTL, headFont } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = headFont;
  const dir = isRTL ? "rtl" : "ltr";

  const ORANGE = "#ff9a42", AMBER = "#ffd166", GREEN = "#69d98c",
    CYAN = "#8B5CF6", PURPLE = "#ba68c8", RED = "#ef5350";

  return (
    <div className="cs-page" dir={dir}>
      <ParticleGrid />
      <div className="cs-scanline" />
      <div className="cs-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="cs-hero">
          <p className="cs-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="cs-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="cs-hero-desc">{d.heroDesc}</p>
          <div className="cs-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="cs-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── PHILOSOPHY ── */}
        <SecHead eyebrow={d.philEyebrow} title={d.philTitle} intro={d.philIntro} color={ORANGE} />

        <div className="cs-pillars">
          {d.pillars.map((p, i) => (
            <PillarCard key={i} icon={p.icon} title={p.title} sub={p.sub} color={p.color}>
              <Bullets items={p.items} color={p.color} />
            </PillarCard>
          ))}
        </div>

        <div className="cs-divider" />

        {/* ── PRE-FALL ── */}
        <SecHead eyebrow={d.preEyebrow} title={d.preTitle} intro={d.preIntro} color={AMBER} />

        <div className="cs-org-grid">
          {d.orgs.map((o, i) => (
            <OrgCard key={i} {...o} />
          ))}
        </div>

        <Accordion title={d.repression.title} color={RED}>
          <Bullets items={d.repression.items} color={RED} />
        </Accordion>

        <div className="cs-divider" />

        {/* ── STAGE 1 ── */}
        <SecHead eyebrow={d.s1Eyebrow} title={d.s1Title} intro={d.s1Intro} color={CYAN} />

        <div className="cs-phase-grid">
          <PhaseBlock number="01" label={isRTL ? "شورای هماهنگی" : "COORDINATING COUNCIL"} title={d.s1Council.title.replace(/.*?:/, "").trim()} color={CYAN}>
            <Bullets items={d.s1Council.items} color={CYAN} />
          </PhaseBlock>
          <PhaseBlock number="02" label={isRTL ? "عدالت انتقالی" : "TRANSITIONAL JUSTICE"} title={d.s1Judicial.title.replace(/.*?:/, "").trim()} color={AMBER}>
            <Bullets items={d.s1Judicial.items} color={AMBER} />
          </PhaseBlock>
          <PhaseBlock number="03" label={isRTL ? "اصلاح امنیتی" : "SECURITY REFORM"} title={d.s1Security.title.replace(/.*?:/, "").trim()} color={RED}>
            <Bullets items={d.s1Security.items} color={RED} />
          </PhaseBlock>
          <PhaseBlock number="04" label={isRTL ? "آزادی‌های مدنی" : "CIVIL LIBERTIES"} title={d.s1Civil.title.replace(/.*?:/, "").trim()} color={PURPLE}>
            <Bullets items={d.s1Civil.items} color={PURPLE} />
          </PhaseBlock>
        </div>

        <div className="cs-divider" />

        {/* ── ECONOMY ── */}
        <SecHead eyebrow={d.econEyebrow} title={d.econTitle} intro={d.econIntro} color={ORANGE} />

        <div className="cs-econ-grid">
          <Accordion title={d.shadowEconomy.title} color={RED} defaultOpen>
            <Bullets items={d.shadowEconomy.items} color={RED} />
          </Accordion>
          <Accordion title={d.restitution.title} color={GREEN}>
            <Bullets items={d.restitution.items} color={GREEN} />
          </Accordion>
          <Accordion title={d.ecological.title} color={CYAN}>
            <Bullets items={d.ecological.items} color={CYAN} />
          </Accordion>
        </div>

        {/* Economy comparison table */}
        <div className="cs-econ-table">
          <div className="cs-econ-table-head">
            <span>{isRTL ? "بخش" : "Sector"}</span>
            <span style={{ color: RED }}>{isRTL ? "جمهوری اسلامی" : "Islamic Republic"}</span>
            <span style={{ color: GREEN }}>{isRTL ? "منشور مشترک" : "Joint Charter"}</span>
          </div>
          {d.econComparison.map((row, i) => (
            <div key={i} className="cs-econ-table-row">
              <div className="cs-econ-sector">{row.sector}</div>
              <div className="cs-econ-regime">{row.regime}</div>
              <div className="cs-econ-charter">{row.charter}</div>
            </div>
          ))}
        </div>

        <div className="cs-divider" />

        {/* ── STAGE 2 ── */}
        <SecHead eyebrow={d.s2Eyebrow} title={d.s2Title} intro={d.s2Intro} color={GREEN} />

        <div className="cs-s2-grid">
          <Accordion title={d.s2Democracy.title} color={CYAN} defaultOpen>
            <Bullets items={d.s2Democracy.items} color={CYAN} />
          </Accordion>
          <Accordion title={d.s2Equality.title} color={PURPLE}>
            <Bullets items={d.s2Equality.items} color={PURPLE} />
          </Accordion>
          <Accordion title={d.s2Welfare.title} color={GREEN}>
            <Bullets items={d.s2Welfare.items} color={GREEN} />
          </Accordion>
        </div>

        <div className="cs-divider" />

        {/* ── FOREIGN POLICY ── */}
        <SecHead eyebrow={d.fpEyebrow} title={d.fpTitle} intro={d.fpIntro} color={CYAN} />
        <div className="cs-fp-wrap">
          <Bullets items={d.fpItems} color={CYAN} />
        </div>

        <div className="cs-divider" />

        {/* ── 12 ARTICLES ── */}
        <div className="cs-articles-wrap">
          <div className="cs-seg-label" style={{ color: ORANGE }}>{d.articlesLabel}</div>
          <ArticleGrid items={d.articles} color={ORANGE} />
        </div>

        <div className="cs-divider" />

        {/* ── STRATEGIC ASSESSMENT ── */}
        <div className="cs-strat-label" style={{ color: AMBER }}>{d.stratLabel}</div>
        <div className="cs-strat-grid">
          <div className="cs-strat-card" style={{ borderColor: `${GREEN}25` }}>
            <div className="cs-strat-title" style={{ color: GREEN }}>{d.strengths.title}</div>
            <Bullets items={d.strengths.items} color={GREEN} />
          </div>
          <div className="cs-strat-card" style={{ borderColor: `${RED}25` }}>
            <div className="cs-strat-title" style={{ color: RED }}>{d.challenges.title}</div>
            <Bullets items={d.challenges.items} color={RED} />
          </div>
        </div>

        {/* ── CONCLUSION QUOTE ── */}
        <div className="cs-conclusion" style={{ fontFamily: ff }}>
          <span className="cs-conclusion-mark">❝</span>
          <span>{d.conclusion}</span>
        </div>

        <p className="cs-source">{d.source}</p>

        <nav className="cs-footer-nav">
          <Link to="/plans" className="cs-footer-nav-link">
            {isRTL ? '← همه طرح‌های انتقالی' : '← All Transitional Plans'}
          </Link>
          <Link to="/arena" className="cs-footer-nav-link cs-footer-nav-link--secondary">
            {isRTL ? 'آرنا — تأیید طرح‌ها ←' : 'Arena — Endorse Plans →'}
          </Link>
        </nav>

      </div>
    </div>
  );
}
