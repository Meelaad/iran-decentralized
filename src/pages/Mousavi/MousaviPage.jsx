import React, { useRef, useEffect, useState } from "react";
import { useLang } from "../../contexts/LangContext";
import "./MousaviPage.css";

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
    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
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
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(105,217,140,${(1 - dist / 170) * 0.07})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(105,217,140,${0.1 + p * 0.14})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="mp-bg-canvas" />;
}

/* ─────────────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────────────── */
function Accordion({ title, subtitle, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mp-acc" style={{ "--c": color || "#69d98c" }}>
      <button className="mp-acc-btn" onClick={() => setOpen(o => !o)}>
        <span className="mp-acc-title">{title}</span>
        {subtitle && <span className="mp-acc-subtitle">{subtitle}</span>}
        <span className="mp-acc-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="mp-acc-body">{children}</div>}
    </div>
  );
}

function Bullets({ items, color }) {
  return (
    <ul className="mp-bullets">
      {items.map((it, i) => (
        <li key={i} className="mp-bullet-item">
          <span className="mp-bullet-dot" style={{ background: color || "#69d98c" }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SecHead({ eyebrow, title, intro, color }) {
  return (
    <div className="mp-sechead">
      {eyebrow && <div className="mp-sechead-eyebrow" style={{ color: color || "#69d98c" }}>{eyebrow}</div>}
      {title && <h2 className="mp-sechead-title">{title}</h2>}
      {intro && <p className="mp-sechead-intro">{intro}</p>}
    </div>
  );
}

function Banner({ label, text, color }) {
  return (
    <div className="mp-banner" style={{ borderColor: color, background: `${color}0a` }}>
      {label && <span className="mp-banner-label" style={{ color }}>{label}</span>}
      <span className="mp-banner-text">{text}</span>
    </div>
  );
}

function StageCard({ number, label, title, sub, color, children }) {
  return (
    <div className="mp-stage-card" style={{ "--sc": color }}>
      <div className="mp-stage-num">{number}</div>
      <div className="mp-stage-label">{label}</div>
      <div className="mp-stage-title">{title}</div>
      <div className="mp-stage-sub">{sub}</div>
      <div className="mp-stage-body">{children}</div>
    </div>
  );
}

function TimelineNode({ date, event, action, shift, color }) {
  return (
    <div className="mp-timeline-node">
      <div className="mp-timeline-dot" style={{ background: color }} />
      <div className="mp-timeline-line" />
      <div className="mp-timeline-content">
        <div className="mp-timeline-date" style={{ color }}>{date}</div>
        <div className="mp-timeline-event">{event}</div>
        <div className="mp-timeline-action">{action}</div>
        {shift && <div className="mp-timeline-shift">{shift}</div>}
      </div>
    </div>
  );
}

function VulnCard({ number, title, regime, opposition, verdict, color }) {
  return (
    <div className="mp-vuln-card" style={{ borderColor: `${color}30` }}>
      <div className="mp-vuln-num" style={{ color }}>{number}</div>
      <div className="mp-vuln-title">{title}</div>
      <div className="mp-vuln-row">
        <span className="mp-vuln-label mp-vuln-label--regime">Regime</span>
        <span className="mp-vuln-text">{regime}</span>
      </div>
      <div className="mp-vuln-row">
        <span className="mp-vuln-label mp-vuln-label--opp">Opposition</span>
        <span className="mp-vuln-text">{opposition}</span>
      </div>
      <div className="mp-vuln-verdict" style={{ borderColor: `${color}30`, color }}>{verdict}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Full bilingual data
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    heroEyebrow: "Mir Hossein Mousavi · Green Movement · 'To Save Iran' Manifesto, February 2023 – January 2026",
    heroTitle: "Democratic Transition Architecture",
    heroDesc: "A three-stage operational blueprint for the peaceful, non-violent dismantlement of the Islamic Republic and its replacement with a democratic state anchored in popular sovereignty. Initiated by former Prime Minister Mir Hossein Mousavi on February 4, 2023, updated through the July 2025 post-war statement, and radicalized to a direct demand for capitulation in January 2026.",
    heroBadges: [
      { label: "3-Stage Blueprint", c: "#69d98c" },
      { label: "Feb 2023 → Jan 2026", c: "#4fc3f7" },
      { label: "Non-Violent Transition", c: "#ffd166" },
      { label: "Popular Sovereignty", c: "#ba68c8" },
      { label: "Constituent Assembly", c: "#ff9a42" },
    ],

    // ── PHILOSOPHICAL CORE ──
    philEyebrow: "Ideological Foundation",
    philTitle: "The Death of Reformism — The Philosophical Core",
    philIntro: "The February 2023 manifesto represents the formal, irreversible death of intra-systemic reformism in Iran. For over a decade following the 2009 Green Movement, Mousavi's paradigm rested on the assumption that the Islamic Republic could correct itself from within. The Mahsa Amini uprising of September 2022 permanently shattered that assumption.",

    paradigmShift: {
      title: "The Paradigm Shift: Reformism → Transitional Democracy",
      items: [
        "PRE-2023: Goal = Implementation of the existing Constitution without compromise",
        "POST-2023: Goal = Drafting and ratification of an entirely new democratic Constitution",
        "PRE-2023: Sovereignty = Dual legitimacy (divine mandate via Supreme Leader + republican elections)",
        "POST-2023: Sovereignty = Absolute and singular popular sovereignty — the citizenry alone",
        "PRE-2023: System assessment = Contains errors but capable of internal self-correction",
        "POST-2023: System assessment = 'Contradictory and unsustainable structure' — irreformable",
        "PRE-2023: Method = Electoral participation, elite lobbying, incremental policy shifts",
        "POST-2023: Method = Three-stage structural transition via national referendums + Constituent Assembly",
      ],
    },

    corePhilosophy: {
      title: "Core Philosophical Principles",
      items: [
        "The Islamic Republic's structure is fundamentally 'contradictory and unsustainable' — incapable of reform, not merely in need of it",
        "State sovereignty originates exclusively from the citizenry — not from divine mandate or the Velayat-e Faqih institution",
        "The 'Woman, Life, Freedom' movement represents a systemic awakening that permanently delegitimized the theocratic state",
        "Foreign military intervention is categorically rejected — transition must be engineered entirely by the Iranian people",
        "Violent domestic revolution is rejected — the mechanism is peaceful, democratic, and legally structured",
        "The regime has demonstrated absolute unwillingness to meet even the most minimal public demands, relying entirely on suppression, corruption, and injustice",
      ],
    },

    catalyst: {
      title: "The Catalyzing Event: The 'Woman, Life, Freedom' Uprising",
      items: [
        "September 2022: Mahsa (Jina) Amini dies in morality police custody",
        "Nationwide protests erupt — the broadest civil uprising since 1979",
        "The movement exposes the regime's absolute reliance on lethal force for survival",
        "Intersectional coalition forms: women, youth, ethnic minorities, religious minorities, diaspora",
        "Mousavi explicitly aligns his manifesto with the 'pure features' of this movement",
        "The 2009 Green Movement demanded the constitution be honored — 'Woman, Life, Freedom' demanded the system itself be replaced",
      ],
    },

    // ── THREE STAGES ──
    stagesEyebrow: "The Operational Blueprint",
    stagesTitle: "The Three-Stage Transition Architecture",
    stagesIntro: "A sequential, legally structured pathway designed to dismantle the Islamic Republic and replace it with a democratic state while maintaining maximum domestic and international legitimacy at every stage. Each stage feeds the next — no stage can be skipped or reversed.",

    stage1: {
      number: "01",
      label: "DECONSTRUCTION",
      title: "The Deconstruction Referendum",
      sub: "A free and fair national referendum on whether to maintain or replace the existing political structure",
      prereqs: {
        title: "Required Prerequisites",
        items: [
          "Suspension of all systemic violence and security force operations against civilians",
          "International observation — verified, independent electoral monitors",
          "Guaranteed transparency of the electoral process",
          "Unrestricted access to information and communication for all citizens",
        ],
      },
      mechanics: {
        title: "Operational Mechanics",
        items: [
          "A single, binary question put to the entire Iranian citizenry",
          "Empirically validates — or refutes — the populace's desire to terminate the existing constitutional order",
          "Legally eliminates the regime's claim of divine or popular legitimacy if rejected",
          "Note: Supreme Leader Khamenei publicly rejected this referendum in April 2023 — acknowledging its existential threat to the regime",
          "The regime's refusal to permit Stage 1 forces the opposition into persistent civil disobedience",
        ],
      },
    },

    stage2: {
      number: "02",
      label: "RECONSTITUTION",
      title: "The Constituent Assembly",
      sub: "Free elections for an Assembly of Founders to draft an entirely new democratic constitution",
      prereqs: {
        title: "Required Prerequisites",
        items: [
          "Unconditional release of ALL political prisoners without exception",
          "Total cessation of all media and internet censorship",
          "Genuine, unhindered participation of all political factions and ideological streams",
          "Inclusion of all demographic segments — ethnic minorities, religious minorities, diaspora",
        ],
      },
      mechanics: {
        title: "Operational Mechanics",
        items: [
          "Assembly formed through entirely free, fair, and inclusive national elections",
          "Singular legal mandate: draft a new constitution based on democracy, universal human rights, and national sovereignty",
          "The Velayat-e Faqih principle is structurally excluded from the drafting parameters",
          "All political factions — from monarchists to leftists to religious democrats — permitted to participate in elections",
          "Assembly operates under a strict constitutional mandate — cannot expand its own powers",
          "Consults civil society, diaspora experts, and international democratic institutions during drafting",
        ],
      },
    },

    stage3: {
      number: "03",
      label: "LEGITIMIZATION",
      title: "The Ratification Referendum",
      sub: "A final national referendum to ratify the newly drafted constitution and select the form of government",
      prereqs: {
        title: "Required Prerequisites",
        items: [
          "Unrestricted public debate regarding the drafted constitution across ALL media platforms prior to the vote",
          "Minimum deliberation period before the referendum — no rushed ratification",
          "Independent legal review of the draft constitution by recognized international bodies",
          "Full diaspora participation guaranteed",
        ],
      },
      mechanics: {
        title: "Operational Mechanics",
        items: [
          "Ratifies the specific structure of the new government — parliamentary republic, presidential system, or other democratic formulation",
          "Provides the ultimate popular and legal authorization for the new state apparatus",
          "Legally and structurally replaces the Velayat-e Faqih system with the newly approved democratic charter",
          "If rejected: Assembly revises and a second referendum is held — no return to the old system",
          "The new state is constitutionally bound only to the ratified charter — not to any revolutionary ideology",
        ],
      },
    },

    // ── COALITION ──
    coalEyebrow: "The Endorsement Network",
    coalTitle: "Coalition Topography — The 2023 Baseline",
    coalIntro: "The 'To Save Iran' manifesto immediately generated a complex, interconnected web of endorsements from historically disparate actors — demonstrating its utility as a unifying structural framework capable of absorbing varied ideological streams across the Iranian political spectrum.",

    coalNodes: [
      {
        icon: "✍️",
        title: "Architect",
        sub: "Mir Hossein Mousavi",
        color: "#69d98c",
        items: [
          "Former Prime Minister of Iran (1981–1989) — revolutionary-era insider",
          "Leader of the 2009 Green Movement — 'Where is my vote?'",
          "Under extrajudicial house arrest since February 2011 on Akhtar Street, Tehran",
          "Co-detained with wife Zahra Rahnavard and ally Mehdi Karroubi",
          "83 years old at time of January 2026 statement — enduring 14+ years of confinement",
          "His revolutionary legitimacy makes the demand for regime change structurally unanswerable",
        ],
      },
      {
        icon: "✊",
        title: "Domestic Civil Society",
        sub: "350–400 journalists, activists, academics · February 2023",
        color: "#4fc3f7",
        items: [
          "Majority physically reside inside Iran — conferring enormous domestic credibility and personal courage",
          "Explicitly cited intractable corruption, injustice, and brutal suppression in their endorsement",
          "Key figures: Hashem Aghajari, Abdollah Momeni, Noushin Ahmadi-Khorasani, Mashallah Shamsolvaezin, Abolfazl Ghadyani",
          "All endorsers possess immense credibility from enduring decades of state persecution",
          "Signatory count expanded from ~400 in 2023 to ~800 in July 2025 — measurable acceleration of anti-regime consensus",
        ],
      },
      {
        icon: "🏛️",
        title: "Former State Establishment",
        sub: "112 reformist ex-officials · February 2023",
        color: "#ffd166",
        items: [
          "Formerly operated within the highest echelons of the Islamic Republic's state apparatus",
          "Issued statements admitting the TOTAL failure of the 1979 revolution's stated goals of justice and democracy",
          "Their institutional weight signals terminal elite defection from the Velayat-e Faqih system",
          "Demonstrates the manifesto's penetration beyond street activists into the administrative core",
          "Their defection directly degrades the regime's administrative capacity and institutional legitimacy",
        ],
      },
      {
        icon: "⛓️",
        title: "Incarcerated Leadership",
        sub: "Prominent political prisoners in active solidarity",
        color: "#ef5350",
        items: [
          "Mostafa Tajzadeh — senior reformist politician, political prisoner, co-authored the January 2026 'Black Page' statement",
          "Faezeh Hashemi — daughter of former President Rafsanjani, demands the regime 'surrender to popular self-determination'",
          "Narges Mohammadi — Nobel Peace Prize laureate 2023, active from inside Evin Prison",
          "Nasrin Sotoudeh — internationally recognized human rights lawyer",
          "Their endorsement from inside prison confers profound moral authority",
          "Highlights the unsustainability of the state's reliance on mass incarceration as a political tool",
        ],
      },
      {
        icon: "🕌",
        title: "Religious & Ethnic Periphery",
        sub: "Sunni and minority community leadership",
        color: "#ff9a42",
        items: [
          "Mowlavi Abdolhamid Esmail-Zehi — most influential Sunni Baluch cleric in Iran",
          "Became an exceptionally vocal regime critic during the lethal Zahedan crackdowns in 2022 protests",
          "Voiced public support for the three-stage structural proposals",
          "Strategically critical: actively counters the regime's reliance on sectarian and ethnic division to control peripheral provinces",
          "Bridges the opposition divide between the Persian/Shia center and the Sunni/Baluch periphery",
          "Neutralizes the regime's most reliable divide-and-conquer tactical instrument",
        ],
      },
      {
        icon: "🌍",
        title: "Diaspora Leadership",
        sub: "International exiled opposition — tactical convergence",
        color: "#ba68c8",
        items: [
          "Prince Reza Pahlavi welcomed the manifesto's secular trajectory and its rejection of the Islamic Republic",
          "Called for 'maximum participation' and unity — despite deep historical differences with Mousavi's revolutionary past",
          "Note: Mousavi was a high-ranking official of the 1979 revolution that ousted the Pahlavi dynasty — this convergence is historically extraordinary",
          "Interaction demonstrates latent potential for a tactical, objective-based coalition between domestic post-reformist network and international secular-democratic diaspora",
          "Shared structural objective: the three-stage transition — not shared ideology",
        ],
      },
    ],

    // ── DOCTRINE EVOLUTION ──
    evolEyebrow: "Temporal Evolution 2023–2026",
    evolTitle: "Doctrine Adaptation — From Referendum to Abdication",
    evolIntro: "Between 2023 and 2026, the Islamic Republic experienced extreme volatility: economic collapse, a 12-day war with Israel, and mass civilian massacres. Mousavi, operating from 14 years of house arrest, adapted his platform in real time — escalating from a peaceful three-stage proposal to a direct demand for regime capitulation.",

    timeline: [
      {
        date: "August 2022",
        event: "Pre-manifesto: Succession rumors surface regarding Mojtaba Khamenei as next Supreme Leader.",
        action: "Mousavi warns of the 'stench of tyranny' and questions whether 2,500-year dynastic rule had returned to Iran.",
        shift: "Preemptive delegitimization of the Velayat-e Faqih mechanism before the main uprising.",
        color: "#7c72e8",
      },
      {
        date: "September 2022",
        event: "Mahsa (Jina) Amini dies in morality police custody. Nationwide 'Woman, Life, Freedom' protests erupt.",
        action: "The uprising becomes the catalyst for Mousavi's ontological shift from reformism to transitional democracy.",
        shift: "Demographic base shifts from urban middle-class to an intersectional nationwide coalition.",
        color: "#ba68c8",
      },
      {
        date: "February 4, 2023",
        event: "Publication of the 'To Save Iran' manifesto — the formal death of reformism.",
        action: "Three-stage transition blueprint announced: Referendum → Constituent Assembly → Ratification Referendum.",
        shift: "Definitive rejection of the reformist paradigm. Extra-systemic democratic transition institutionalized.",
        color: "#69d98c",
      },
      {
        date: "February–March 2023",
        event: "Immediate coalition formation: 350-400 domestic activists + 112 ex-officials endorse the manifesto.",
        action: "Prince Reza Pahlavi calls for 'maximum participation' and welcomes the secular trajectory.",
        shift: "Unprecedented domestic-diaspora convergence around the three-stage framework.",
        color: "#4fc3f7",
      },
      {
        date: "April 2023",
        event: "Supreme Leader Ali Khamenei publicly and explicitly rejects all calls for a referendum.",
        action: "Opposition interprets the rejection as confirmation that the referendum poses an existential threat to the regime.",
        shift: "Regime's refusal forces the opposition into a posture of persistent civil disobedience.",
        color: "#ffd166",
      },
      {
        date: "December 2024",
        event: "Mousavi, 83, suffers a severe life-threatening allergic reaction. State physicians had prior knowledge of the contraindication.",
        action: "570+ activists issue joint statement condemning 'systematic torture' and 'gradual murder' of Akhtar Street prisoners.",
        shift: "Mousavi's physical survival becomes a potent mobilization variable — triggering rapid consensus among disparate activists.",
        color: "#ff9a42",
      },
      {
        date: "June 2025",
        event: "12-Day War between Israel and Iran. Direct kinetic strikes on Iranian military and nuclear sites.",
        action: "Regime attempts to manufacture a 'rally-around-the-flag' domestic cohesion effect.",
        shift: "Public response bifurcated — reports emerge of Iranians cheering strikes against regime targets.",
        color: "#ef5350",
      },
      {
        date: "July 11, 2025",
        event: "Post-war statement published by Mousavi in Hammihan and Kalameh.",
        action: "Warns regime: public survival instinct during bombardment must NOT be misconstrued as approval. Diagnoses the war as the 'bitter result of a series of grave errors' by an unrepresentative government. Renews demand for Constituent Assembly.",
        shift: "Signatory base expands to 700–800 activists. Counter-narrative capability demonstrated: the regime's rally-around-the-flag mechanism is neutralized.",
        color: "#ffd166",
      },
      {
        date: "January 8–9, 2026",
        event: "Nationwide mass protests. Regime deploys extreme, indiscriminate lethal force. Estimated 6,373+ civilians killed.",
        action: "The January 2026 massacres represent the ultimate manifestation of the 'contradictory and unsustainable' system operating without popular consent.",
        shift: "Total exhaustion of the regime's non-violent conflict resolution mechanisms.",
        color: "#ef5350",
      },
      {
        date: "January 29, 2026",
        event: "'Black Page' statement — authored jointly by Mousavi and Tajzadeh, published on Kalameh.",
        action: "Condemns the crackdown as a 'great betrayal' and 'black page in Iranian history.' Abandons diplomatic language. Directly addresses the leadership: 'Enough is enough. Put down your guns and step down from power so that the nation itself can lead this land to freedom and prosperity.'",
        shift: "TERMINAL ESCALATION: Total paradigm shift from proposing referendums to demanding unconditional abdication. Predicts imminent security force fracture and mass defections.",
        color: "#ef5350",
      },
    ],

    // ── VULNERABILITY VECTORS ──
    vulnEyebrow: "Predictive Intelligence Matrix",
    vulnTitle: "Three Systemic Vulnerability Vectors",
    vulnIntro: "The Mousavi blueprint functions simultaneously as a mirror reflecting the Islamic Republic's structural vulnerabilities and a wedge actively exploiting them. Three critical vectors indicate the regime is operating under an acute, multifaceted legitimacy deficit that directly threatens its existential continuity.",

    vulnerabilities: [
      {
        number: "01",
        title: "The Collapse of Ideological Defense Mechanisms",
        regime: "Claims divine mandate via Velayat-e Faqih; uses 'Axis of Resistance' doctrine and external threat (Israel war) to enforce domestic cohesion and silence dissent.",
        opposition: "Anchors demands in universally recognized human rights language and 'Woman, Life, Freedom' paradigm — reclaiming the moral high ground. July 2025 statement explicitly blocks the rally-around-the-flag mechanism by reframing the war as the regime's own 'major mistakes.'",
        verdict: "CRITICAL DAMAGE — The 1979 theological mandate has been entirely superseded by democratic paradigms among the youth demographic. The regime has no remaining ideological language to deploy.",
        color: "#ba68c8",
      },
      {
        number: "02",
        title: "The Hereditary Succession Crisis",
        regime: "Covert, systematic grooming of Mojtaba Khamenei to succeed his father as Supreme Leader — a hereditary transfer of absolute theocratic power.",
        opposition: "Preemptively condemned as early as August 2022: 'Has 2,500-year-old dynastic rule returned to Iran?' The prospect of a hereditary Supreme Leader destroys the remaining republican veneer of the 1979 constitution — empirically validating Mousavi's claim that the structure is irreformable.",
        verdict: "CRITICAL DAMAGE — Completely shatters the illusion of an Islamic 'Republic.' Alienates traditional revolutionaries and even lower-level clerics. Makes the Constituent Assembly demand infinitely more appealing.",
        color: "#ffd166",
      },
      {
        number: "03",
        title: "The Erosion of the Coercive Monopoly",
        regime: "Deploying extreme, indiscriminate lethal force against civilian populations — 6,373+ killed in January 2026 alone — as the sole remaining mechanism for maintaining political control.",
        opposition: "January 2026 'Black Page' statement explicitly targets the loyalty of security forces: 'The military and law enforcement will refuse to bear the burden of massacring citizens sooner or later, and probably sooner.' The structured three-stage plan provides a credible, non-chaotic 'day after' scenario — shifting the personal cost-benefit analysis of mid-level security personnel dramatically toward defection.",
        verdict: "ESCALATING TERMINAL RISK — Extreme violence creates unsustainable psychological strain on security forces. The existence of a legal transition pathway geometrically increases defection probability within the IRGC, Basij, and Artesh.",
        color: "#ef5350",
      },
    ],

    // ── NON-NEGOTIABLE DEMANDS ──
    demandsLabel: "NON-NEGOTIABLE MINIMUM DEMANDS (July 2025 Statement)",
    demands: [
      "Unconditional release of ALL political prisoners — including Mousavi, Rahnavard, and Karroubi themselves",
      "Total cessation of all media and internet censorship — complete freedom of press and information",
      "Fundamental overhaul of the state broadcaster IRIB — state media must treat all political viewpoints equally",
      "Immediate halt to all lethal force against civilian protesters",
      "International observation of any transition process",
      "Recognition of the 'Woman, Life, Freedom' movement's demands as legitimate national grievances",
    ],

    abdication: "\"Enough is enough. Neither do you have a solution to any of the country's crises, nor does the nation have any choice but to protest again until a result is reached. Put down your guns and step down from power so that the nation itself can lead this land to freedom and prosperity.\" — Mir Hossein Mousavi & Mostafa Tajzadeh, January 29, 2026",

    source: "Source: 'To Save Iran' Manifesto (Feb 2023) · July 2025 Post-War Statement · January 2026 'Black Page' Statement · Mousavi / Tajzadeh / Kalameh · Green Movement",
  },

  // ─────────────────────────────────────────────────────
  // PERSIAN
  // ─────────────────────────────────────────────────────
  fa: {
    heroEyebrow: "میر حسین موسوی · جنبش سبز · بیانیه 'برای نجات ایران'، فوریه ۲۰۲۳ – ژانویه ۲۰۲۶",
    heroTitle: "معماری گذار دموکراتیک",
    heroDesc: "یک طرح عملیاتی سه‌مرحله‌ای برای برچیدن مسالمت‌آمیز و بدون خشونت جمهوری اسلامی و جایگزینی آن با یک دولت دموکراتیک مبتنی بر حاکمیت مردمی. آغاز شده توسط نخست‌وزیر سابق میر حسین موسوی در ۴ فوریه ۲۰۲۳، به‌روزرسانی شده در بیانیه پس از جنگ جولای ۲۰۲۵، و تبدیل به درخواست مستقیم برای کناره‌گیری در ژانویه ۲۰۲۶.",
    heroBadges: [
      { label: "طرح ۳ مرحله‌ای", c: "#69d98c" },
      { label: "فوریه ۲۰۲۳ ← ژانویه ۲۰۲۶", c: "#4fc3f7" },
      { label: "گذار غیرخشونت‌آمیز", c: "#ffd166" },
      { label: "حاکمیت مردمی", c: "#ba68c8" },
      { label: "مجلس مؤسسان", c: "#ff9a42" },
    ],

    philEyebrow: "بنیاد ایدئولوژیک",
    philTitle: "مرگ اصلاح‌طلبی — هسته فلسفی",
    philIntro: "بیانیه فوریه ۲۰۲۳ نماینده مرگ رسمی و برگشت‌ناپذیر اصلاح‌طلبی درون‌سیستمی در ایران است. برای بیش از یک دهه پس از جنبش سبز ۲۰۰۹، پارادایم موسوی بر این فرض استوار بود که جمهوری اسلامی می‌تواند از درون خود را اصلاح کند. قیام مهسا امینی در سپتامبر ۲۰۲۲ این فرض را برای همیشه در هم شکست.",

    paradigmShift: {
      title: "تغییر پارادایم: اصلاح‌طلبی → دموکراسی انتقالی",
      items: [
        "پیش از ۲۰۲۳: هدف = اجرای قانون اساسی موجود بدون سازش",
        "پس از ۲۰۲۳: هدف = تهیه و تصویب یک قانون اساسی دموکراتیک کاملاً جدید",
        "پیش از ۲۰۲۳: حاکمیت = مشروعیت دوگانه (مأموریت الهی از طریق رهبر + انتخابات محدود جمهوری)",
        "پس از ۲۰۲۳: حاکمیت = حاکمیت مردمی مطلق و منحصربه‌فرد — فقط شهروندان",
        "پیش از ۲۰۲۳: ارزیابی سیستم = دارای خطا اما قادر به اصلاح درونی",
        "پس از ۲۰۲۳: ارزیابی سیستم = 'ساختار متناقض و ناپایدار' — غیرقابل اصلاح",
        "پیش از ۲۰۲۳: روش = مشارکت انتخاباتی، لابی‌گری نخبگان، تغییرات تدریجی سیاستی",
        "پس از ۲۰۲۳: روش = گذار ساختاری سه‌مرحله‌ای از طریق همه‌پرسی‌های ملی + مجلس مؤسسان",
      ],
    },

    corePhilosophy: {
      title: "اصول فلسفی محوری",
      items: [
        "ساختار جمهوری اسلامی اساساً 'متناقض و ناپایدار' است — نه صرفاً نیازمند اصلاح، بلکه قادر به اصلاح نیست",
        "حاکمیت دولتی منحصراً از شهروندان نشأت می‌گیرد — نه از مأموریت الهی یا نهاد ولایت فقیه",
        "جنبش 'زن، زندگی، آزادی' یک بیداری سیستمی را نشان می‌دهد که مشروعیت دولت تئوکراتیک را برای همیشه سلب کرد",
        "مداخله نظامی خارجی قاطعانه رد می‌شود — گذار باید کاملاً توسط مردم ایران طراحی شود",
        "انقلاب خشونت‌آمیز داخلی رد می‌شود — مکانیزم، صلح‌آمیز، دموکراتیک و ساختارمند قانونی است",
        "رژیم نشان داده که هیچ تمایلی به برآوردن حتی کمترین خواسته‌های عمومی ندارد و کاملاً به سرکوب، فساد و بی‌عدالتی متکی است",
      ],
    },

    catalyst: {
      title: "رویداد کاتالیزور: قیام 'زن، زندگی، آزادی'",
      items: [
        "سپتامبر ۲۰۲۲: مهسا (ژینا) امینی در بازداشت گشت ارشاد جان می‌سپارد",
        "اعتراضات سراسری شروع می‌شود — گسترده‌ترین قیام مدنی از سال ۱۳۵۸",
        "جنبش اتکای مطلق رژیم به زور کشنده برای بقا را آشکار می‌کند",
        "ائتلاف فراگیر شکل می‌گیرد: زنان، جوانان، اقلیت‌های قومی و مذهبی، دیاسپورا",
        "موسوی صراحتاً بیانیه‌اش را با 'ویژگی‌های پاک' این جنبش همسو می‌کند",
        "جنبش سبز ۲۰۰۹ خواستار احترام به قانون اساسی بود — 'زن، زندگی، آزادی' خواستار جایگزینی خود سیستم شد",
      ],
    },

    stagesEyebrow: "طرح عملیاتی",
    stagesTitle: "معماری گذار سه‌مرحله‌ای",
    stagesIntro: "یک مسیر قانونی ساختارمند و متوالی که برای برچیدن جمهوری اسلامی و جایگزینی آن با یک دولت دموکراتیک طراحی شده است، در حالی که حداکثر مشروعیت داخلی و بین‌المللی را در هر مرحله حفظ می‌کند. هر مرحله به مرحله بعدی منتهی می‌شود — هیچ مرحله‌ای را نمی‌توان نادیده گرفت یا معکوس کرد.",

    stage1: {
      number: "۰۱",
      label: "بازسازی",
      title: "همه‌پرسی فروپاشی",
      sub: "یک همه‌پرسی آزاد و منصفانه ملی درباره حفظ یا جایگزینی ساختار سیاسی موجود",
      prereqs: {
        title: "پیش‌نیازهای الزامی",
        items: [
          "تعلیق تمام خشونت سیستماتیک و عملیات نیروهای امنیتی علیه غیرنظامیان",
          "ناظران بین‌المللی — ناظران انتخاباتی مستقل و تأییدشده",
          "شفافیت تضمین‌شده فرآیند انتخاباتی",
          "دسترسی نامحدود به اطلاعات و ارتباطات برای همه شهروندان",
        ],
      },
      mechanics: {
        title: "مکانیزم‌های عملیاتی",
        items: [
          "یک سؤال باینری ساده به تمام شهروندان ایرانی",
          "به صورت تجربی اثبات یا رد می‌کند که آیا مردم می‌خواهند نظم قانون اساسی موجود پایان یابد",
          "در صورت رد، ادعای مشروعیت الهی یا مردمی رژیم را قانوناً از بین می‌برد",
          "توجه: رهبر معظم خامنه‌ای در آوریل ۲۰۲۳ این همه‌پرسی را علناً رد کرد — تهدید وجودی آن برای رژیم را تأیید کرد",
          "امتناع رژیم از اجازه مرحله اول، اپوزیسیون را به وضعیت نافرمانی مدنی پیوسته وادار می‌کند",
        ],
      },
    },

    stage2: {
      number: "۰۲",
      label: "بازسازی",
      title: "مجلس مؤسسان",
      sub: "انتخابات آزاد برای مجلس مؤسسان جهت تهیه یک قانون اساسی دموکراتیک کاملاً جدید",
      prereqs: {
        title: "پیش‌نیازهای الزامی",
        items: [
          "آزادی بی‌قیدوشرط تمام زندانیان سیاسی بدون استثنا",
          "توقف کامل تمام سانسور رسانه‌ای و اینترنتی",
          "مشارکت واقعی و بدون مانع همه جناح‌های سیاسی و جریان‌های ایدئولوژیک",
          "شامل شدن همه بخش‌های جمعیتی — اقلیت‌های قومی، مذهبی، دیاسپورا",
        ],
      },
      mechanics: {
        title: "مکانیزم‌های عملیاتی",
        items: [
          "مجلس از طریق انتخابات ملی کاملاً آزاد، منصفانه و فراگیر تشکیل می‌شود",
          "مأموریت قانونی منحصربه‌فرد: تهیه قانون اساسی جدید مبتنی بر دموکراسی، حقوق بشر جهانی و حاکمیت ملی",
          "اصل ولایت فقیه به صورت ساختاری از پارامترهای تهیه پیش‌نویس حذف شده است",
          "همه جناح‌های سیاسی — از مشروطه‌خواهان تا چپ‌گراها تا دموکرات‌های مذهبی — مجاز به مشارکت در انتخابات",
          "مجلس تحت مأموریت قانون اساسی محدود عمل می‌کند — نمی‌تواند اختیارات خود را گسترش دهد",
          "در طول تهیه پیش‌نویس با جامعه مدنی، کارشناسان دیاسپورا و نهادهای بین‌المللی دموکراتیک مشورت می‌کند",
        ],
      },
    },

    stage3: {
      number: "۰۳",
      label: "مشروعیت‌بخشی",
      title: "همه‌پرسی تصویب",
      sub: "همه‌پرسی ملی نهایی برای تصویب قانون اساسی تهیه‌شده و انتخاب شکل حکومت",
      prereqs: {
        title: "پیش‌نیازهای الزامی",
        items: [
          "بحث عمومی نامحدود درباره پیش‌نویس قانون اساسی در تمام رسانه‌ها قبل از رأی‌گیری",
          "حداقل دوره تأمل قبل از همه‌پرسی — تصویب شتابزده ممنوع",
          "بررسی حقوقی مستقل پیش‌نویس توسط نهادهای بین‌المللی معتبر",
          "مشارکت تضمین‌شده کامل دیاسپورا",
        ],
      },
      mechanics: {
        title: "مکانیزم‌های عملیاتی",
        items: [
          "ساختار خاص حکومت جدید را تصویب می‌کند — جمهوری پارلمانی، سیستم ریاستی، یا فرمول دموکراتیک دیگر",
          "نهایی‌ترین مجوز مردمی و قانونی را برای دستگاه دولتی جدید فراهم می‌کند",
          "سیستم ولایت فقیه را به صورت قانونی و ساختاری با منشور دموکراتیک تازه تصویب‌شده جایگزین می‌کند",
          "در صورت رد: مجلس اصلاح می‌کند و همه‌پرسی دوم برگزار می‌شود — بازگشت به سیستم قدیم ممکن نیست",
          "دولت جدید فقط به منشور تصویب‌شده پایبند است — نه به هیچ ایدئولوژی انقلابی",
        ],
      },
    },

    coalEyebrow: "شبکه تأیید",
    coalTitle: "توپوگرافی ائتلاف — خط پایه ۲۰۲۳",
    coalIntro: "بیانیه 'برای نجات ایران' فوری یک شبکه پیچیده و به‌هم‌پیوسته از تأییدها از بازیگران تاریخاً متفاوت ایجاد کرد — نشان‌دهنده کاربرد آن به عنوان یک چارچوب متحدکننده ساختاری قادر به جذب جریان‌های ایدئولوژیک متنوع در سراسر طیف سیاسی ایران.",

    coalNodes: [
      {
        icon: "✍️",
        title: "معمار",
        sub: "میر حسین موسوی",
        color: "#69d98c",
        items: [
          "نخست‌وزیر سابق ایران (۱۳۶۰–۱۳۶۸) — از خودی‌های دوره انقلاب",
          "رهبر جنبش سبز ۲۰۰۹ — 'رأی من کجاست؟'",
          "از فوریه ۲۰۱۱ تحت حصر خانگی غیرقضایی در خیابان اختر تهران",
          "همراه با همسرش زهرا رهنورد و متحد سیاسی‌اش مهدی کروبی محبوس است",
          "۸۳ ساله در زمان بیانیه ژانویه ۲۰۲۶ — بیش از ۱۴ سال حصر را تحمل می‌کند",
          "مشروعیت انقلابی او، خواسته تغییر رژیم را از نظر ساختاری بی‌پاسخ می‌سازد",
        ],
      },
      {
        icon: "✊",
        title: "جامعه مدنی داخلی",
        sub: "۳۵۰–۴۰۰ روزنامه‌نگار، فعال، دانشگاهی · فوریه ۲۰۲۳",
        color: "#4fc3f7",
        items: [
          "اکثریت داخل ایران زندگی می‌کنند — اعتبار داخلی و شجاعت شخصی فوق‌العاده‌ای به آن می‌بخشند",
          "صریحاً فساد لاعلاج، بی‌عدالتی و سرکوب وحشیانه را در تأییدیه خود ذکر کردند",
          "چهره‌های کلیدی: هاشم آقاجری، عبدالله مومنی، نوشین احمدی خراسانی، مشالله شمس‌الواعظین، ابوالفضل قادیانی",
          "تعداد امضاکنندگان از ~۴۰۰ نفر در ۲۰۲۳ به ~۸۰۰ نفر در جولای ۲۰۲۵ افزایش یافت",
        ],
      },
      {
        icon: "🏛️",
        title: "دولت سابق",
        sub: "۱۱۲ مقام اصلاح‌طلب سابق · فوریه ۲۰۲۳",
        color: "#ffd166",
        items: [
          "قبلاً در بالاترین سطوح دستگاه دولتی جمهوری اسلامی فعالیت می‌کردند",
          "بیانیه‌هایی صادر کردند که شکست کامل اهداف انقلاب ۱۳۵۷ را در زمینه عدالت و دموکراسی اعتراف می‌کنند",
          "وزن نهادی آن‌ها نشانه فرار نهایی نخبگان از سیستم ولایت فقیه است",
          "نشان می‌دهد که بیانیه به فراتر از فعالان خیابانی، به هسته اداری نفوذ کرده است",
        ],
      },
      {
        icon: "⛓️",
        title: "رهبری محبوس",
        sub: "زندانیان سیاسی برجسته در همبستگی فعال",
        color: "#ef5350",
        items: [
          "مصطفی تاجزاده — سیاستمدار ارشد اصلاح‌طلب، زندانی سیاسی، همراه موسوی بیانیه 'صفحه سیاه' ژانویه ۲۰۲۶ را نوشت",
          "فائزه هاشمی — دختر رئیس‌جمهور سابق رفسنجانی، خواستار 'تسلیم رژیم به حق تعیین سرنوشت مردمی' است",
          "نرگس محمدی — برنده جایزه نوبل صلح ۲۰۲۳، فعال از داخل زندان اوین",
          "نسرین ستوده — وکیل حقوق بشر با شهرت بین‌المللی",
          "تأیید آن‌ها از داخل زندان اقتدار اخلاقی عمیقی اعطا می‌کند",
        ],
      },
      {
        icon: "🕌",
        title: "پیرامون مذهبی و قومی",
        sub: "رهبری جامعه اهل سنت و اقلیت‌ها",
        color: "#ff9a42",
        items: [
          "مولوی عبدالحمید اسماعیل‌زهی — تأثیرگذارترین روحانی سنی بلوچ در ایران",
          "در دوران سرکوب‌های مرگبار زاهدان در اعتراضات ۲۰۲۲ به ناقد بسیار صریح رژیم تبدیل شد",
          "از پیشنهادهای ساختاری سه‌مرحله‌ای ابراز حمایت عمومی کرد",
          "از نظر استراتژیک حیاتی: شکاف اپوزیسیون بین مرکز فارسی/شیعه و پیرامون سنی/بلوچ را پر می‌کند",
          "رایج‌ترین ابزار تاکتیکی تفرقه‌انداز رژیم را خنثی می‌کند",
        ],
      },
      {
        icon: "🌍",
        title: "رهبری دیاسپورا",
        sub: "اپوزیسیون تبعیدی بین‌المللی — همگرایی تاکتیکی",
        color: "#ba68c8",
        items: [
          "شاهزاده رضا پهلوی از مسیر سکولار بیانیه و رد جمهوری اسلامی استقبال کرد",
          "خواستار 'حداکثر مشارکت' و وحدت شد — علی‌رغم اختلافات تاریخی عمیق با گذشته انقلابی موسوی",
          "توجه: موسوی یک مقام ارشد انقلاب ۱۳۵۷ بود که سلسله پهلوی را ساقط کرد — این همگرایی از نظر تاریخی استثنایی است",
          "هدف مشترک ساختاری: گذار سه‌مرحله‌ای — نه ایدئولوژی مشترک",
        ],
      },
    ],

    evolEyebrow: "تحول زمانی ۲۰۲۳–۲۰۲۶",
    evolTitle: "تطبیق دکترین — از همه‌پرسی تا درخواست کناره‌گیری",
    evolIntro: "بین ۲۰۲۳ و ۲۰۲۶، جمهوری اسلامی با بی‌ثباتی شدید روبرو شد: فروپاشی اقتصادی، جنگ ۱۲ روزه با اسرائیل، و کشتارهای جمعی غیرنظامیان. موسوی، در حالی که ۱۴ سال در حصر خانگی بود، پلتفرم خود را در زمان واقعی تطبیق داد.",

    timeline: [
      {
        date: "اوت ۲۰۲۲",
        event: "شایعات جانشینی مجتبی خامنه‌ای به عنوان رهبر معظم بعدی مطرح می‌شود.",
        action: "موسوی از 'بوی ظلم' هشدار می‌دهد و زیر سؤال می‌برد که آیا حکومت سلسله‌ای ۲۵۰۰ ساله به ایران بازگشته است.",
        shift: "تضعیف مشروعیت ولایت فقیه پیش از قیام اصلی.",
        color: "#7c72e8",
      },
      {
        date: "سپتامبر ۲۰۲۲",
        event: "مهسا (ژینا) امینی در بازداشت گشت ارشاد جان می‌سپارد. اعتراضات سراسری 'زن، زندگی، آزادی' شروع می‌شود.",
        action: "قیام به کاتالیزور تغییر هستی‌شناختی موسوی از اصلاح‌طلبی به دموکراسی انتقالی تبدیل می‌شود.",
        shift: "پایگاه جمعیتی از طبقه متوسط شهری به ائتلاف ملی فراگیر تغییر می‌کند.",
        color: "#ba68c8",
      },
      {
        date: "۴ فوریه ۲۰۲۳",
        event: "انتشار بیانیه 'برای نجات ایران' — مرگ رسمی اصلاح‌طلبی.",
        action: "طرح گذار سه‌مرحله‌ای اعلام می‌شود: همه‌پرسی → مجلس مؤسسان → همه‌پرسی تصویب.",
        shift: "رد قطعی پارادایم اصلاح‌طلبی. گذار دموکراتیک فراسیستمی نهادینه شد.",
        color: "#69d98c",
      },
      {
        date: "فوریه–مارس ۲۰۲۳",
        event: "ائتلاف فوری: ۳۵۰-۴۰۰ فعال داخلی + ۱۱۲ مقام سابق بیانیه را تأیید می‌کنند.",
        action: "شاهزاده رضا پهلوی خواستار 'حداکثر مشارکت' می‌شود.",
        shift: "همگرایی بی‌سابقه داخلی-دیاسپورا حول چارچوب سه‌مرحله‌ای.",
        color: "#4fc3f7",
      },
      {
        date: "آوریل ۲۰۲۳",
        event: "رهبر معظم خامنه‌ای به صورت عمومی و صریح تمام درخواست‌های همه‌پرسی را رد می‌کند.",
        action: "اپوزیسیون این رد را به عنوان تأیید اینکه همه‌پرسی تهدید وجودی برای رژیم است تفسیر می‌کند.",
        shift: "امتناع رژیم، اپوزیسیون را به وضعیت نافرمانی مدنی پیوسته وادار می‌کند.",
        color: "#ffd166",
      },
      {
        date: "دسامبر ۲۰۲۴",
        event: "موسوی ۸۳ ساله دچار واکنش آلرژیک شدید و تهدیدکننده حیات می‌شود. پزشکان دولتی از این تناقض دارویی از قبل آگاه بودند.",
        action: "۵۷۰+ فعال بیانیه مشترکی صادر می‌کنند که 'شکنجه سیستماتیک' و 'قتل تدریجی' زندانیان خیابان اختر را محکوم می‌کند.",
        shift: "بقای جسمی موسوی به یک متغیر بسیج قوی تبدیل می‌شود.",
        color: "#ff9a42",
      },
      {
        date: "ژوئن ۲۰۲۵",
        event: "جنگ ۱۲ روزه ایران و اسرائیل. حملات نظامی مستقیم به تأسیسات نظامی و هسته‌ای ایران.",
        action: "رژیم تلاش می‌کند با استفاده از تهدید خارجی، وحدت داخلی تحمیل کند.",
        shift: "واکنش عمومی دوقطبی — گزارش‌هایی از ایرانیانی که برای حملات علیه اهداف رژیم شادی می‌کنند.",
        color: "#ef5350",
      },
      {
        date: "۱۱ جولای ۲۰۲۵",
        event: "بیانیه پس از جنگ توسط موسوی در همهان و کلمه منتشر می‌شود.",
        action: "هشدار به رژیم: مقاومت عمومی در برابر بمباران نباید به عنوان 'تأیید دولت' تفسیر شود. جنگ را 'نتیجه تلخ یک سری اشتباهات فاحش' توصیف می‌کند.",
        shift: "پایگاه امضاکنندگان به ۷۰۰–۸۰۰ فعال گسترش می‌یابد.",
        color: "#ffd166",
      },
      {
        date: "۸–۹ ژانویه ۲۰۲۶",
        event: "اعتراضات سراسری عظیم. رژیم نیروی کشنده شدید و بی‌هدف اعمال می‌کند. تخمین ۶۳۷۳+ غیرنظامی کشته شدند.",
        action: "کشتارهای ژانویه ۲۰۲۶ نهایی‌ترین تجلی سیستم 'متناقض و ناپایدار' است که بدون رضایت مردم عمل می‌کند.",
        shift: "تخلیه کامل مکانیزم‌های حل‌وفصل غیرخشونت‌آمیز رژیم.",
        color: "#ef5350",
      },
      {
        date: "۲۹ ژانویه ۲۰۲۶",
        event: "بیانیه 'صفحه سیاه' — نوشته مشترک موسوی و تاجزاده، منتشر شده در کلمه.",
        action: "سرکوب را 'خیانت بزرگ' و 'صفحه سیاه تاریخ ایران' می‌نامد. زبان دیپلماتیک را کنار می‌گذارد. مستقیماً به رهبری خطاب می‌کند: 'کافی است. نه شما راه‌حلی برای هیچ‌کدام از بحران‌های کشور دارید و نه ملت چاره‌ای جز اعتراض دارد. اسلحه را زمین بگذارید و از قدرت کنار بروید.'",
        shift: "تصعید نهایی: تغییر پارادایم کامل از پیشنهاد همه‌پرسی به درخواست تسلیم بی‌قیدوشرط. پیش‌بینی شکست نیروهای امنیتی.",
        color: "#ef5350",
      },
    ],

    vulnEyebrow: "ماتریس اطلاعاتی پیش‌بینی",
    vulnTitle: "سه بردار آسیب‌پذیری سیستمی",
    vulnIntro: "طرح موسوی هم‌زمان به عنوان آینه‌ای عمل می‌کند که آسیب‌پذیری‌های ساختاری جمهوری اسلامی را منعکس می‌کند و هم به عنوان اهرمی که فعالانه آن‌ها را بهره‌برداری می‌کند.",

    vulnerabilities: [
      {
        number: "۰۱",
        title: "فروپاشی مکانیزم‌های دفاع ایدئولوژیک",
        regime: "ادعای مأموریت الهی از طریق ولایت فقیه؛ استفاده از جنگ خارجی (اسرائیل ۲۰۲۵) برای اعمال وحدت داخلی و خاموش کردن مخالفت.",
        opposition: "خواسته‌ها را در زبان جهانی حقوق بشر و پارادایم 'زن، زندگی، آزادی' لنگر می‌اندازد. بیانیه جولای ۲۰۲۵ صریحاً مکانیزم روی‌آوری به پرچم را با بازتعریف جنگ به عنوان 'اشتباهات فاحش' رژیم مسدود می‌کند.",
        verdict: "آسیب حیاتی — مأموریت الهی ۱۳۵۷ کاملاً توسط پارادایم‌های دموکراتیک در جمعیت جوان منسوخ شده است.",
        color: "#ba68c8",
      },
      {
        number: "۰۲",
        title: "بحران جانشینی موروثی",
        regime: "پرورش پنهانی و سیستماتیک مجتبی خامنه‌ای برای جانشینی پدرش — انتقال موروثی قدرت مطلق تئوکراتیک.",
        opposition: "از اوت ۲۰۲۲ پیشگیرانه محکوم شد: 'آیا حکومت سلسله‌ای ۲۵۰۰ ساله به ایران بازگشته است؟' رهبر معظم موروثی نمایش جمهوری باقیمانده از قانون اساسی ۱۳۵۷ را کاملاً از بین می‌برد.",
        verdict: "آسیب حیاتی — توهم 'جمهوری' اسلامی را کاملاً از بین می‌برد. انقلابیون سنتی و حتی روحانیون سطح پایین را بیگانه می‌کند.",
        color: "#ffd166",
      },
      {
        number: "۰۳",
        title: "فرسایش انحصار اجبار",
        regime: "اعمال نیروی کشنده شدید و بی‌هدف علیه جمعیت‌های غیرنظامی — ۶۳۷۳+ کشته در ژانویه ۲۰۲۶ — به عنوان تنها مکانیزم باقیمانده برای حفظ کنترل سیاسی.",
        opposition: "بیانیه 'صفحه سیاه' ژانویه ۲۰۲۶ صراحتاً وفاداری نیروهای امنیتی را هدف قرار می‌دهد: 'نیروهای نظامی و انتظامی دیر یا زود و احتمالاً زودتر از حمل این بار سنگین امتناع خواهند کرد.' طرح سه‌مرحله‌ای ساختارمند یک سناریوی معتبر و غیرآشوبناک 'روز پس از' فراهم می‌کند.",
        verdict: "ریسک نهایی در حال تصعید — خشونت شدید فشار روانی غیرقابل‌تحمل بر نیروهای امنیتی ایجاد می‌کند. احتمال فرار در سپاه، بسیج و ارتش به صورت هندسی افزایش می‌یابد.",
        color: "#ef5350",
      },
    ],

    demandsLabel: "حداقل خواسته‌های غیرقابل مذاکره (بیانیه جولای ۲۰۲۵)",
    demands: [
      "آزادی بی‌قیدوشرط تمام زندانیان سیاسی — از جمله خود موسوی، رهنورد و کروبی",
      "توقف کامل تمام سانسور رسانه‌ای و اینترنتی — آزادی کامل مطبوعات و اطلاعات",
      "بازسازی بنیادی صداوسیمای دولتی — رسانه دولتی باید با تمام دیدگاه‌های سیاسی برابر رفتار کند",
      "توقف فوری تمام نیروی کشنده علیه معترضان غیرنظامی",
      "ناظران بین‌المللی برای هر فرآیند گذار",
      "به رسمیت شناختن خواسته‌های جنبش 'زن، زندگی، آزادی' به عنوان مظالم ملی مشروع",
    ],

    abdication: "«کافی است. نه شما راه‌حلی برای هیچ‌کدام از بحران‌های کشور دارید و نه ملت چاره‌ای جز اعتراض تا رسیدن به نتیجه دارد. اسلحه را زمین بگذارید و از قدرت کنار بروید تا ملت خود این سرزمین را به آزادی و رفاه رهبری کند.» — میر حسین موسوی و مصطفی تاجزاده، ۲۹ ژانویه ۲۰۲۶",

    source: "منبع: بیانیه 'برای نجات ایران' (فوریه ۲۰۲۳) · بیانیه پس از جنگ جولای ۲۰۲۵ · بیانیه 'صفحه سیاه' ژانویه ۲۰۲۶ · موسوی / تاجزاده / وبسایت کلمه · جنبش سبز",
  },
};

/* ─────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────── */
export default function MousaviPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const GREEN = "#69d98c", CYAN = "#4fc3f7", AMBER = "#ffd166",
    ORANGE = "#ff9a42", RED = "#ef5350", PURPLE = "#ba68c8", VIOLET = "#7c72e8";

  return (
    <div className="mp-page" dir={dir}>
      <ParticleGrid />
      <div className="mp-scanline" />
      <div className="mp-inner" style={{ fontFamily: ff }}>

        {/* ── HERO ── */}
        <header className="mp-hero">
          <p className="mp-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="mp-hero-title" style={{ fontFamily: ff }}>{d.heroTitle}</h1>
          <p className="mp-hero-desc">{d.heroDesc}</p>
          <div className="mp-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span key={i} className="mp-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
          </div>
        </header>

        {/* ── PHILOSOPHICAL CORE ── */}
        <SecHead eyebrow={d.philEyebrow} title={d.philTitle} intro={d.philIntro} color={PURPLE} />

        <div className="mp-phil-grid">
          <Accordion title={d.paradigmShift.title} color={PURPLE} defaultOpen>
            <Bullets items={d.paradigmShift.items} color={PURPLE} />
          </Accordion>
          <div className="mp-phil-right">
            <Accordion title={d.corePhilosophy.title} color={CYAN}>
              <Bullets items={d.corePhilosophy.items} color={CYAN} />
            </Accordion>
            <Accordion title={d.catalyst.title} color={GREEN}>
              <Bullets items={d.catalyst.items} color={GREEN} />
            </Accordion>
          </div>
        </div>

        <div className="mp-divider" />

        {/* ── THREE STAGES ── */}
        <SecHead eyebrow={d.stagesEyebrow} title={d.stagesTitle} intro={d.stagesIntro} color={GREEN} />

        <div className="mp-stages-flow">
          {/* Stage 1 */}
          <StageCard number={d.stage1.number} label={d.stage1.label} title={d.stage1.title} sub={d.stage1.sub} color={CYAN}>
            <Accordion title={d.stage1.prereqs.title} color={AMBER}>
              <Bullets items={d.stage1.prereqs.items} color={AMBER} />
            </Accordion>
            <Accordion title={d.stage1.mechanics.title} color={CYAN}>
              <Bullets items={d.stage1.mechanics.items} color={CYAN} />
            </Accordion>
          </StageCard>

          <div className="mp-stage-arrow">→</div>

          {/* Stage 2 */}
          <StageCard number={d.stage2.number} label={d.stage2.label} title={d.stage2.title} sub={d.stage2.sub} color={GREEN}>
            <Accordion title={d.stage2.prereqs.title} color={AMBER}>
              <Bullets items={d.stage2.prereqs.items} color={AMBER} />
            </Accordion>
            <Accordion title={d.stage2.mechanics.title} color={GREEN}>
              <Bullets items={d.stage2.mechanics.items} color={GREEN} />
            </Accordion>
          </StageCard>

          <div className="mp-stage-arrow">→</div>

          {/* Stage 3 */}
          <StageCard number={d.stage3.number} label={d.stage3.label} title={d.stage3.title} sub={d.stage3.sub} color={VIOLET}>
            <Accordion title={d.stage3.prereqs.title} color={AMBER}>
              <Bullets items={d.stage3.prereqs.items} color={AMBER} />
            </Accordion>
            <Accordion title={d.stage3.mechanics.title} color={VIOLET}>
              <Bullets items={d.stage3.mechanics.items} color={VIOLET} />
            </Accordion>
          </StageCard>
        </div>

        <div className="mp-divider" />

        {/* ── COALITION ── */}
        <SecHead eyebrow={d.coalEyebrow} title={d.coalTitle} intro={d.coalIntro} color={AMBER} />

        <div className="mp-coal-grid">
          {d.coalNodes.map((node, i) => (
            <div key={i} className="mp-coal-card" style={{ borderColor: `${node.color}30` }}>
              <div className="mp-coal-icon">{node.icon}</div>
              <div className="mp-coal-title" style={{ color: node.color, fontFamily: ff }}>{node.title}</div>
              <div className="mp-coal-sub">{node.sub}</div>
              <Bullets items={node.items} color={node.color} />
            </div>
          ))}
        </div>

        <div className="mp-divider" />

        {/* ── DOCTRINE EVOLUTION ── */}
        <SecHead eyebrow={d.evolEyebrow} title={d.evolTitle} intro={d.evolIntro} color={ORANGE} />

        <div className="mp-timeline">
          {d.timeline.map((node, i) => (
            <TimelineNode key={i} {...node} />
          ))}
        </div>

        <div className="mp-divider" />

        {/* ── VULNERABILITIES ── */}
        <SecHead eyebrow={d.vulnEyebrow} title={d.vulnTitle} intro={d.vulnIntro} color={RED} />

        <div className="mp-vuln-grid">
          {d.vulnerabilities.map((v, i) => (
            <VulnCard key={i} {...v} />
          ))}
        </div>

        <div className="mp-divider" />

        {/* ── NON-NEGOTIABLE DEMANDS ── */}
        <div className="mp-demands-wrap">
          <div className="mp-seg-label" style={{ color: RED }}>{d.demandsLabel}</div>
          <div className="mp-demands-grid">
            {d.demands.map((dem, i) => (
              <div key={i} className="mp-demand-row" style={{ fontFamily: ff }}>
                <span className="mp-demand-n" style={{ color: RED }}>{i + 1}</span>
                <span className="mp-demand-text">{dem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ABDICATION QUOTE ── */}
        <div className="mp-abdication" style={{ fontFamily: ff }}>
          <span className="mp-abdication-flash">⚡</span>
          <span>{d.abdication}</span>
        </div>

        <p className="mp-source">{d.source}</p>

      </div>
    </div>
  );
}
