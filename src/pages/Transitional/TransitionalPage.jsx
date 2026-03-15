import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./TransitionalPage.css";

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
            ctx.strokeStyle = `rgba(79,195,247,${(1 - dist / 190) * 0.09})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const p = 0.5 + 0.5 * Math.sin(t + i);
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,195,247,${0.12 + p * 0.16})`;
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
  const c = color || "#4fc3f7";
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
          <span className="tp-bullet-dot" style={{ background: color || "#4fc3f7" }} />
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
      {eyebrow && <div className="tp-sechead-eyebrow" style={{ color: color || "#4fc3f7" }}>{eyebrow}</div>}
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
   ALL DATA — bilingual
───────────────────────────────────────────────────── */
const DATA = {
  en: {
    // Hero
    heroEyebrow: "Iran Prosperity Project · NUFDI · Emergency Phase Booklet, March 2026",
    heroTitle: "Transitional Government Blueprint",
    heroDesc: "Comprehensive organizational structure drawn directly from the Emergency Phase Booklet (14 white papers). Stage 1 covers the Transitional Period under the Transitional System. Stage 2 shows the permanent democratic structure it is designed to produce. The plan covers the first 180 days (Emergency Phase) in detail, with the full transitional period lasting 18–24 months.",

    // ═══════ PART A ═══════
    partA_eyebrow: "Stage 1 · Part A",
    partA_title: "Political Structure — Full Transitional Period (18–24 months)",
    partA_intro: "Top-down structure. Power flows from the Leader downward across three appointed branches and a directly-commanded military. Pre-fall, the Leader operates through two advisory/executive bodies. On Day 1, a three-part decree abolishes the IRI constitution and establishes the Transitional System as the binding governing instrument.",

    prefallLabel: "PRE-FALL INSTITUTIONS (Before Regime Collapse)",

    nuc: {
      title: "National Uprising Council",
      sub: "Advisory & policy/decision arm of the Leader",
      items: [
        "Advisory & policy/decision arm of the Leader",
        "Members inside + outside Iran",
        "Identities secret until safe to reveal",
        "Works in coordination with the Temporary Executive Team",
      ],
    },
    tet: {
      title: "Temporary Executive Team",
      sub: "Implements decisions of the Leader",
      items: [
        "Implements decisions of the Leader",
        "Members inside + outside Iran",
        "Works per the 5-pronged strategy",
        "Coordinates all pre-fall operational planning",
      ],
    },
    prongs: {
      label: "5-Pronged Pre-Fall Strategy",
      items: [
        "(1) Max pressure on regime",
        "(2) Max support for people",
        "(3) Max defections from the regime",
        "(4) Max mobilization inside and outside Iran",
        "(5) Plan reconstruction → Iran Prosperity Project",
      ],
    },

    leaderTitle: "Leader of the National Uprising",
    leaderSub: "Crown Prince Reza Pahlavi · Head of State · Commander-in-Chief of Armed Forces",
    leaderNote: "Contingency: If the Leader is unable to serve → Temporary Leadership Council forms immediately (heads of all 3 branches, decisions by majority vote)",

    // Mehestan
    meh: {
      title: "Transitional Mehestan",
      sub: "Legislative branch · Head elected internally by absolute majority",
      color: "#69d98c",
      sections: [
        {
          title: "Members appointed by Leader",
          items: [
            "Represent the diversity of the unified Iranian nation",
            "Identities may remain secret until safe to reveal",
            "Head elected internally by absolute majority vote",
            "Removal of head requires absolute majority + Leader approval",
          ],
        },
        {
          title: "Reviews all existing laws — Hybrid Option",
          items: [
            "Repeal laws conflicting with UDHR 1948, national identity, or transition progress",
            "Replacement laws drawn from Pahlavi Imperial era or updated modern equivalents",
            "Full modernization deferred to the future elected Mehestan",
          ],
        },
        {
          title: "Enacts temporary new laws",
          items: [
            "Must appoint & consult a panel of 5 distinguished jurists for every law enacted",
            "Jurist panel has no other activities during their tenure",
          ],
        },
        {
          title: "Reviews & approves national annual budget",
          items: [
            "Budget proposed by the Transitional Government",
            "Divan Budget Organization presents its portion independently",
            "Government cannot alter the Divan's budget portion",
          ],
        },
        {
          title: "Confirms Supreme Court & Administrative Justice Court judges",
          items: [
            "Judges nominated by the head of the Divan",
            "Absolute majority vote required for confirmation",
            "Removal follows the same process",
          ],
        },
        {
          title: "Sets Constituent Assembly rules",
          items: [
            "Total seat count (70–310 seats)",
            "Eligibility criteria: age, education, and other requirements",
            "Rules must be finalized before the referendum takes place",
          ],
        },
        {
          title: "Post-transition: advisory body only",
          items: [
            "Legislative role ends when the elected Mehestan forms",
            "Advises the Leader until full dissolution of the transitional system",
            "Does not retain any legislative powers after the elected body forms",
          ],
        },
        {
          title: "Timeline extension rules",
          items: [
            ">6 months: requires approval of all 3 branch heads + Leader jointly",
            ">12 months: requires a national referendum to authorize the extension",
          ],
        },
      ],
    },

    // Government
    gov: {
      title: "Transitional Government",
      sub: "Executive branch · Head appointed by Leader (after consulting Mehestan)",
      color: "#4fc3f7",
      sections: [
        {
          title: "Structure set by head of Government",
          items: [
            "Number and names of ministries decided by the head of Government",
            "After consulting Transitional Mehestan + Leader approval required",
          ],
        },
        {
          title: "Appoints all ministers",
          items: [
            "All ministers approved by Mehestan (absolute majority)",
            "Removal at the head of Government's discretion",
            "★ Minister of Defense: special rule — approved by Leader directly, not Mehestan",
          ],
        },
        {
          title: "Day-1 international declarations",
          items: [
            "Remove 'Islamic Republic' from official name — notify all UN member states",
            "Restore Lion & Sun tricolor flag — notify all UN states and organizations",
            "Replace national anthem with 'Ey Iran' until official anthem is chosen",
            "Notify Swiss Government (Geneva Convention depositary) re: Red Crescent rename",
            "Assume control of all embassies; appoint interim envoys",
            "Manage Iranian assets abroad; update passports to remove IRI branding",
          ],
        },
        {
          title: "Negotiate lifting all sanctions",
          items: [
            "Financial, trade, human rights, and military sanctions",
            "Remove visa restrictions on Iranian citizens",
            "Initiate IAEA full access — immediately stop uranium enrichment",
            "Recognize Israel (Cyrus Accord framework) — Week 1",
            "MOUs on trade, non-aggression, security with US and Israel — Months 2–3",
            "Reset China/Russia ties on basis of mutual respect",
            "India/Japan/South Korea as energy and technology partners",
          ],
        },
        {
          title: "Referendum on system of government (within 4 months)",
          items: [
            "3-month public campaign period precedes the vote",
            "Ballot choice: Parliamentary Monarchy vs. Republic",
            "Both ballots include the 7 immutable principles",
            "State media treats both sides equally; political parties may campaign",
            "If monarchy approved: coronation within 2 weeks of referendum result",
            "If republic approved: presidential election held simultaneously with Mehestan election",
          ],
        },
        {
          title: "Constituent Assembly election (within 2 months of referendum)",
          items: [
            "Seat count and eligibility set by Transitional Mehestan in advance",
            "7-member jurist panel assists drafting of constitution",
            "6-month mandate to complete the draft constitution",
            "Consults expert committees across 10+ sectors",
            "May draw on 1906 Iranian Constitution as drafting basis if monarchy is chosen",
            "Publishes each article for public comment during the drafting process",
          ],
        },
        {
          title: "Constitutional referendum (within 1 month of draft completion)",
          items: [
            "National vote to approve or reject the draft constitution",
            "If rejected: 2-month revision + re-vote (up to 3 attempts)",
            "If rejected 3 times: an entirely new Constituent Assembly must be elected",
          ],
        },
        {
          title: "Mehestan election (within 3 months of constitution approval)",
          items: [
            "People directly elect the new Mehestan (parliament)",
            "If monarchy: coronation ≤2 weeks after constitution approval",
            "If republic: presidential election held simultaneously with Mehestan election",
          ],
        },
        {
          title: "Elected Government sworn in → dissolution",
          items: [
            "PM or President's cabinet sworn in",
            "Transitional Government dissolved",
            "Transitional Mehestan dissolved (becomes advisory only, then fully dissolved)",
            "Leader of the National Uprising role completely dissolved",
          ],
        },
        {
          title: "Bar Association independence + textbook reform",
          items: [
            "Government allocates budget to Bar Association for legal aid programs",
            "Bar Association independence guaranteed by law",
            "Remove ideology from all levels of education (primary, secondary, higher)",
            "Reflect values of the new democratic era in all curriculum materials",
          ],
        },
      ],
    },

    // Divan
    div: {
      title: "Transitional Divan",
      sub: "Judicial branch · Head = distinguished jurist appointed by Leader (after consulting Mehestan)",
      color: "#ffd166",
      sections: [
        {
          title: "Head appoints all judicial organization heads",
          items: [
            "Chief Justice — Supreme Court",
            "Chief Justice — Administrative Justice Court",
            "Head of National Inspectorate",
            "Head of Prisons Organization",
            "Head of Forensic Medicine",
            "Head of Deeds & Properties Registration Organization",
            "Head of Budget Organization of the Divan",
          ],
        },
        {
          title: "Attorney General → Ministry of Justice (executive branch)",
          items: [
            "Moved from the judiciary to the executive branch",
            "Eliminates conflict between adjudication and prosecution duties",
            "Appointed by the Minister of Justice",
          ],
        },
        {
          title: "Judicial Council — 5 distinguished jurists",
          items: [
            "Oversees all lower-court judge appointment rules nationwide",
            "Reviews rules for all judge appointments across the country",
            "No other activities permitted during tenure on the Council",
          ],
        },
        {
          title: "Budget Organization of the Divan — fully independent",
          items: [
            "Prepares the Divan budget independently — government cannot alter it",
            "Presents budget directly to Transitional Mehestan (bypasses government)",
            "Audited by the Supreme Audit Court",
            "Ensures complete judicial financial independence",
          ],
        },
        {
          title: "Transitional Justice Court",
          items: [
            "Exclusive criminal jurisdiction over crimes committed from Feb 1979 to the fall of the regime",
            "Universal jurisdiction — no political immunity granted to anyone",
            "No statute of limitations on crimes within scope",
            "Managers not automatically liable — requires strong direct evidence of involvement",
            "Proceedings begin on indictment issued by the Special Prosecutor",
          ],
        },
        {
          title: "Special Prosecutor",
          items: [
            "Appointed by the Attorney General after consulting the Minister of Justice",
            "Initiates all Transitional Justice Court proceedings",
            "Handles appeals — appeals decisions are final",
          ],
        },
        {
          title: "Truth Commission — 3 committees",
          items: [
            "Members appointed by the Judicial Council",
            "Head appointed by the head of the Divan",
            "Duration: maximum 5 years + 1-year extension",
            "All hearings public by default; national security exceptions allowed",
            "Scope limited to pre-fall crimes only",
          ],
        },
        {
          title: "① Investigation Committee",
          items: [
            "Collects and documents all evidence",
            "Creates a safe space for victims to testify",
            "Produces the Comprehensive Report with reparation proposals",
          ],
        },
        {
          title: "② Conditional Amnesty Committee",
          items: [
            "Individual amnesty only — no group amnesty",
            "Conditions: full disclosure + political nexus + proportionality of action",
            "Amnesty automatically revoked if applicant is proven to have lied",
            "Cannot grant amnesty for crimes against humanity",
          ],
        },
        {
          title: "③ High Committee (apex supervisor)",
          items: [
            "Hears appeals of amnesty decisions",
            "Finalizes and publishes the Comprehensive Report",
            "Head of Divan may veto any individual amnesty grant",
          ],
        },
      ],
    },

    // Military
    mil: {
      title: "Senior Military Commanders",
      sub: "Appointed & removed by the Leader directly · Commander-in-Chief role",
      color: "#ff9a42",
      sections: [
        {
          title: "Artesh (conventional forces) retained",
          items: [
            "Ground Forces, Navy, Air Force — vetted and kept operational from Day 1",
            "Vetted officers continue in command pending full vetting review",
            "Unified, centralized, apolitical national army",
          ],
        },
        {
          title: "IRGC dissolved completely",
          items: [
            "Armed wing → absorbed into National Army",
            "Intelligence wing → transferred to new NISS agency",
            "Economic/cultural assets → transferred to Transitional Government",
            "All IRGC ranks subject to 3-tier vetting protocol",
          ],
        },
        {
          title: "Basij + Quds Force dissolved",
          items: [
            "Dissolved entirely — no retention, no rebranding",
            "No parallel military or security structures permitted",
            "All personnel subject to individual 3-tier vetting",
          ],
        },
        {
          title: "NISS (National Intelligence & Security Service) established",
          items: [
            "Replaces the Ministry of Intelligence and all parallel intel agencies",
            "Under the Transitional Government (not the military chain of command)",
            "Three divisions: Internal Security, External Intelligence, Cyber Intelligence",
            "Civilian-led with parliamentary oversight",
          ],
        },
        {
          title: "3-tier vetting protocol",
          items: [
            "Category A: Retain — vetted, clean record, continue in service",
            "Category B: Retrain — retraining and de-radicalization programs",
            "Category C: Prosecute — referred to the Transitional Justice Court",
            "Individual case-by-case review — no collective punishment",
          ],
        },
        {
          title: "Civilian oversight boards",
          items: [
            "Transitional Mehestan security committees oversee all armed forces",
            "Inspector-General for each military and security unit",
            "Regular public reporting on reform progress",
          ],
        },
        {
          title: "24-month phased reconstruction",
          items: [
            "Phase 0–3 months: Stabilize and secure existing structures",
            "Phase 3–12 months: Rebuild institutions and command doctrine",
            "Phase 12–24 months: Consolidate reforms + hand over to elected government",
          ],
        },
      ],
    },

    contingencyText: "Temporary Leadership Council forms immediately: heads of Transitional Government + Transitional Mehestan + Transitional Divan · Decisions by majority vote",

    immutable: {
      label: "7 IMMUTABLE PRINCIPLES — Enshrined on both referendum ballots and in the new Constitution",
      items: [
        "Territorial integrity of Iran",
        "Human dignity + rights (Cyrus Cylinder + UDHR 1948)",
        "Democracy — 'one citizen, one vote'",
        "Rule of law",
        "Complete separation of religion and state",
        "Separation of powers",
        "Independence and impartiality of the Divan",
      ],
    },
    hybridOption: {
      title: "Legal Framework: The Hybrid Option (inspired by Brexit 2020 transition)",
      text: "Retain all IRI laws as the default rule · Repeal those conflicting with UDHR/national identity/transition · Replacement = Pahlavi era laws or updated modern equivalents · Future elected Mehestan performs full modernization. Three criteria: (1) Practical — lessens the Transitional System's workload; (2) Stabilizing — maintains continuity in daily affairs; (3) Promising — repealing repressive laws boosts public confidence. Historical precedent: Brexit 2020 — EU laws stayed in force as default; laws symbolizing EU membership repealed immediately on Day 1. Same logic applied here.",
    },

    // ═══════ PART B ═══════
    partB_eyebrow: "Stage 1 · Part B",
    partB_title: "The Leader's Day-1 Decree — 3-Part Legal Framework + 13 Structural Reforms",
    partB_intro: "The first official act abolishes the IRI constitution, retains existing laws as the default rule (Hybrid/Brexit model), and immediately repeals institutions in conflict with national identity, the UDHR, or the transition. Triggers 13 specific structural reforms listed in the decree itself.",

    decreeTitle: "Leader's Official Decree (Day 1)",
    decreeSub: "Abolishes IRI Constitution · Establishes Transitional Framework as the binding governing instrument of the State",

    decreeParts: [
      {
        label: "Part I",
        title: "Abolish IRI Constitution",
        items: [
          "Formally dissolves the regime",
          "Creates a definitive break with the old order",
          "Establishes the international legitimacy basis for the new government",
        ],
        color: "#ef5350",
      },
      {
        label: "Part II",
        title: "Hybrid Option: Retain Existing Laws",
        items: [
          "Default rule: all existing laws and institutions continue in force",
          "Prevents legal vacuum and societal disruption",
          "Inspired by the Brexit 2020 transition model",
          "Replacement laws drawn from Pahlavi Imperial era or updated modern equivalents",
        ],
        color: "#4fc3f7",
      },
      {
        label: "Part III",
        title: "Repeal Conflicting Laws & Institutions",
        items: [
          "Repeal laws conflicting with (a) Iran's historical/national identity",
          "Repeal laws conflicting with (b) UDHR 1948",
          "Repeal laws conflicting with (c) transition progress and democratic principles",
        ],
        color: "#69d98c",
      },
    ],

    reforms: {
      label: "13 Immediate Structural Reforms Triggered by the Decree",
      items: [
        "Remove 'Islamic Republic' from official name · Notify all UN states and international organizations",
        "Restore Lion & Sun tricolor flag · Notify all UN states, organizations, and treaty bodies",
        "Replace national anthem with 'Ey Iran' as interim until official anthem is chosen by elected parliament",
        "Dissolve: Supreme Leader's Office, Assembly of Experts, Expediency Council, Guardian Council",
        "Dissolve IRGC: armed wing → National Army; intelligence → NISS; economic/cultural assets → Government",
        "Establish NISS (National Intelligence and Security Service) under Transitional Government",
        "Dissolve IRI Revolutionary Court and Special Clerical Court; restore General Court system",
        "Transfer Attorney General from judiciary to Ministry of Justice (executive branch)",
        "Establish Bar Association independence mechanism; allocate legal aid budget from government",
        "Dissolve Morality Police (Gasht-e Ershad), Supreme Council of Cultural Revolution, Supreme Council of Cyberspace",
        "Dissolve IRI State Broadcasting; restore National Iranian Radio and Television",
        "Rename Red Crescent → Red Lion and Sun Society; notify Swiss Government (Geneva Convention depositary)",
        "Establish transitional justice mechanism to address gross human rights violations since Feb 1979",
      ],
    },

    hybridWhy: "Why the Hybrid Option? (1) Practical — lessens Transitional System workload · (2) Stabilizing — maintains continuity in daily affairs · (3) Promising — repealing repressive laws boosts public confidence · Historical precedent: Brexit 2020 transition model",

    // ═══════ PART C ═══════
    partC_eyebrow: "Stage 1 · Part C",
    partC_title: "Cross-Cutting Policy Tracks — First 180 Days (Emergency Phase)",
    partC_intro: "Running in parallel to the political structure, the Transitional Government operates five major policy tracks simultaneously from Day 1. Each track has a concrete action plan with specific time horizons drawn from the 14 white papers.",

    fp: {
      title: "Foreign Policy",
      sub: "Non-ideological · National-interest-based",
      color: "#69d98c",
      sections: [
        {
          title: "Week 1: Recognize Israel (Cyrus Accord framework)",
          items: [
            "Official recognition of the State of Israel",
            "Invite direct diplomatic talks",
            "Operate within the Cyrus Accord framework",
          ],
        },
        {
          title: "Week 1: Stop enrichment + full IAEA access",
          items: [
            "Full nuclear transparency declared immediately",
            "NPT + Additional Protocol compliance",
            "Invite IAEA inspectors immediately",
          ],
        },
        {
          title: "Week 1: Outreach to US, EU, UN, all neighbors",
          items: [
            "Normalize US relations (1970s model as reference)",
            "Engage EU for immediate sanctions removal",
            "Notify all 193 UN member states of leadership change",
          ],
        },
        {
          title: "Month 1: Regional stability framework",
          items: [
            "Monthly meetings with all 14 neighboring countries",
            "Joint Border Operations Rooms established",
            "End all proxy support in regional countries immediately",
            "Non-aggression framework with all neighbors",
          ],
        },
        {
          title: "Months 2–3: MOUs + preliminary agreements",
          items: [
            "MOUs on trade, non-aggression, security",
            "Sign preliminary agreements with US and Israel",
            "Reset China/Russia ties on basis of mutual respect",
            "India/Japan/South Korea as energy and tech partners",
          ],
        },
        {
          title: "MFA overhaul + Special Envoy for Diaspora",
          items: [
            "Vetting Committee for all foreign ministry staff",
            "Diplomatic Reorientation Center established",
            "Transparency Unit within MFA",
            "Neighboring States Coordination Desk",
            "Special Envoy for Iranian Diaspora appointed",
          ],
        },
        {
          title: "Economic Diplomacy Task Force",
          items: [
            "Attract foreign direct investment across all sectors",
            "IMF/World Bank engagement and lending programs",
            "Iran Economic Opportunities Booklet published in 8 languages",
            "Coordinate with energy and industry white paper teams",
          ],
        },
      ],
    },

    milTimeline: {
      title: "Military Reform Timeline",
      sub: "Days 1–180 + 24-month reconstruction plan",
      color: "#ff9a42",
      sections: [
        {
          title: "Days 1–10: Seizure & Stabilization",
          items: [
            "Artesh deployed to secure key governmental and strategic sites",
            "Cyber operations neutralized within 48–72 hours",
            "Emergency national broadcasts to the population",
            "Secure critical infrastructure: fuel, water, ports, hospitals, telecom",
            "IRGC command structure dissolved Day 1",
          ],
        },
        {
          title: "Days 11–40: Vetting & Disarmament",
          items: [
            "3-tier vetting protocol applied to all armed forces",
            "Disarm all militant groups and Basij remnants",
            "De-radicalization programs initiated",
            "Basij full dismantlement completed",
          ],
        },
        {
          title: "Days 41–100: Build New Institutions",
          items: [
            "NISS formally established and operational",
            "Police demilitarized and civilian-led",
            "Community oversight boards for each unit",
            "National Security Academy (NSA) launched",
          ],
        },
        {
          title: "Days 101–140: Global Legitimation",
          items: [
            "NSRB (National Security Review Board) civilian audit body formed",
            "International alliance building with key partners",
            "Publish vetting results for transparency and international confidence",
            "Seek international recognition of reformed armed forces",
          ],
        },
        {
          title: "Days 141–180: Stress Testing",
          items: [
            "Cyberattack war game exercises",
            "Civil unrest response drills",
            "Proxy insurgency simulation exercises",
            "Permanent oversight bodies fully operational",
          ],
        },
        {
          title: "Months 3–24: Full 3-Phase Reconstruction",
          items: [
            "0–3 months: Stabilize existing structures and prevent collapse",
            "3–12 months: Rebuild institutions, doctrine, and command culture",
            "12–24 months: Consolidate reforms + hand over to elected government",
          ],
        },
      ],
    },

    macro: {
      title: "Macroeconomics",
      sub: "Fiscal + monetary + banking stabilization",
      color: "#ffd166",
      sections: [
        {
          title: "Secure Central Bank of Iran (CBI)",
          items: [
            "CBI = fiscal agent + independent monetary authority",
            "New Governor appointed Day 1",
            "CBI tasked with dual mandate: price stability + financial stability",
            "Independent, transparent, accountable per modern central banking governance",
          ],
        },
        {
          title: "Capital controls + asset freezes",
          items: [
            "Prevent capital flight from Day 1",
            "Freeze large accounts linked to regime affiliates",
            "100% deposit insurance for retail and commercial accounts (first 100 days)",
            "Prohibit insider transfers and fire sales by regime-linked entities",
            "Domestic bond issuance to address short-term budget deficits",
          ],
        },
        {
          title: "Access $120–150B in frozen reserves",
          items: [
            "Requires formal recognition by US, EU, China, IMF",
            "IMF lending programs initiated immediately",
            "Unlock via demonstrated international legitimacy",
            "Joint Financial Task Force to prevent unregulated money flows",
          ],
        },
        {
          title: "Banking stabilization",
          items: [
            "Protect all deposits; restore uninterrupted banking services",
            "Restore SWIFT access for Iranian banks",
            "FATF compliance program initiated",
            "Consolidate multiple exchange rates into managed dual-rate system (transitional step)",
            "Suspend Tehran Stock Exchange 90–180 days for audits and governance reset",
          ],
        },
        {
          title: "Bonyad reform + de-ideologize state institutions",
          items: [
            "Downsize quasi-state foundations (Bonyads, Setad/EIKO, Astan Quds Razavi)",
            "Subject all to taxation and public accountability oversight",
            "Merge redundant ministries to reduce bureaucratic bloat",
            "Dismantle IRGC's economic holdings (Khatam al-Anbiya and subsidiaries)",
            "Appoint technocratic interim management at all state-owned enterprises",
          ],
        },
        {
          title: "Pension + subsidy continuity from Day 1",
          items: [
            "Uninterrupted pension payments from Day 1",
            "Continue existing subsidies throughout transition period",
            "Rebuild sovereign credit ratings (Fitch, Moody's, S&P)",
            "Reinstate High Council for Social Security",
          ],
        },
        {
          title: "National asset recovery (PBAD program)",
          items: [
            "Locate and secure all regime-controlled assets domestically and abroad",
            "Freeze accounts in UAE, Türkiye, Switzerland, Luxembourg, Malaysia, China, Caribbean",
            "Prevent sabotage by regime loyalists using state wealth",
            "Coordinate with FATF, Interpol, and foreign financial intelligence units",
            "Priority assets: crypto (BTC/XMR), gold reserves, offshore real estate, IRGC corporate holdings",
          ],
        },
      ],
    },

    ess: {
      title: "Essential Functions",
      sub: "Continuity of government services — 180-day plan",
      color: "#4fc3f7",
      sections: [
        {
          title: "H-Hour to H+72: Immediate seizure of critical infrastructure",
          items: [
            "Secure fuel depots and all fuel distribution networks",
            "Secure grain reserves and food supply chain",
            "Secure major ports and logistics corridors",
            "Secure hospitals and medical supply chains",
            "Secure water treatment plants and distribution systems",
            "Secure telecom hubs and internet exchange points",
          ],
        },
        {
          title: "Days 3–30: National stabilization & triage",
          items: [
            "National availability assessments for all critical goods",
            "Utilities and health service continuity posture",
            "Anti-hoarding enforcement and price-gouging controls",
            "Emergency measures for vulnerable populations",
          ],
        },
        {
          title: "Days 31–180: Operational continuity",
          items: [
            "Standardized execution across all 31 provinces",
            "Preserve institutional knowledge of key technical staff",
            "Digitize all government records and databases",
            "Provincial coordination centers operational",
          ],
        },
        {
          title: "7 protected service categories (continuous from Day 1)",
          items: [
            "Food security and supply chains",
            "Transport and logistics infrastructure",
            "Utilities (electricity, gas, water)",
            "Public health and emergency medical services",
            "Emergency response and disaster management",
            "Personnel continuity (all government employees paid from Day 1)",
            "Communications and information infrastructure",
          ],
        },
        {
          title: "Pay all government employees from Day 1",
          items: [
            "Military personnel — all ranks without exception",
            "Teachers and educators at all levels",
            "Healthcare workers: doctors, nurses, support staff",
            "All civil servants and government administrators",
            "Objective: prevent social collapse and brain drain",
          ],
        },
        {
          title: "Sector white papers (detailed plans for each)",
          items: [
            "National Assets — PBAD recovery program",
            "Energy — secure and maintain oil/gas production",
            "Industry — protect manufacturing and supply chains",
            "Cybersecurity — protect all critical digital infrastructure",
            "Environment — protect critical ecosystems",
            "Water — prevent water crisis escalation",
            "Healthcare — maintain all health systems",
          ],
        },
      ],
    },

    edu: {
      title: "Education + Social Reform",
      sub: "De-ideologize + equal access + continuity",
      color: "#ba68c8",
      sections: [
        {
          title: "Remove ideology from all textbooks",
          items: [
            "Primary, secondary, and higher education textbooks",
            "Reflect values of the new democratic era in Iran",
            "Replace religious indoctrination content with civic education",
            "Immediate audit of all curriculum materials",
          ],
        },
        {
          title: "Military education overhaul",
          items: [
            "Drone and cyber warfare training",
            "Intelligence analysis and professional ethics",
            "Human rights principles integrated into military doctrine",
            "Democratic civilian oversight principles",
          ],
        },
        {
          title: "Healthcare continuity",
          items: [
            "Essential medicine procurement maintained uninterrupted",
            "Surge capacity protocols for hospitals",
            "Emergency capacity protected from budget cuts",
            "International health partnerships established",
          ],
        },
        {
          title: "Equal citizenship for all groups",
          items: [
            "Women equal before the law — remove all gender-discriminatory laws immediately",
            "Ethnic minorities (Kurds, Arabs, Baloch, Turkmen, etc.) equal citizenship guaranteed",
            "Religious minorities fully protected under the new constitution",
            "No compulsory religious dress codes of any kind",
          ],
        },
        {
          title: "Cybersecurity + critical infrastructure protection",
          items: [
            "Transitional National Cybersecurity Task Force operational from Day 0",
            "Protect telecom, energy, water, and financial systems from sabotage",
            "Guard against sabotage by regime remnants",
            "National CERT/CSIRT with 24/7 operations",
            "Insider risk management protocols for all critical facilities",
          ],
        },
        {
          title: "National Security Academy (NSA)",
          items: [
            "Rapid induction program for all new security personnel",
            "Ethics and rule of law training",
            "Chain of command and civilian oversight principles",
            "International law and human rights obligations",
          ],
        },
      ],
    },

    whitePapersNote: "14 white papers in total — detailed plans also exist for: National Assets · Energy · Industry · Cybersecurity · Environment · Water · Healthcare. Each white paper has its own operational framework for the Emergency Phase. Full details in the Emergency Phase Booklet (March 2026).",

    // ═══════ STAGE 2 ═══════
    stage2_eyebrow: "Stage 2 of 2",
    stage2_title: "The Permanent Democratic Structure — The Final Goal",
    stage2_intro: "Bottom-up. All authority shifts from the temporary Leader to the people of Iran. A Constituent Assembly drafts the constitution; a referendum approves it and selects the system of government. All Stage 1 institutions — including the Leader's role — are then completely dissolved. The transition is designed to be 'neither rushed nor open-ended.'",

    s2_people_title: "The People of Iran",
    s2_people_sub: "Ultimate source of all sovereignty · All authority derived from free, fair, periodic elections · 'one citizen, one vote'",

    s2ca: {
      title: "Constituent Assembly",
      sub: "Elected by the people · Drafts new constitution · 6-month mandate",
      items: [
        "Rules (seat count 70–310, eligibility) set by Transitional Mehestan in advance",
        "7-member jurist panel assists the drafting process",
        "Consults expert committees on 10+ sectors",
        "If monarchy chosen: may draw on 1906 Iranian Constitution as drafting basis",
        "Publishes each article for public comment during drafting",
      ],
    },
    s2ref: {
      title: "National Referendum",
      sub: "Vote on system of government — within 4 months of transition start",
      items: [
        "Choice: Parliamentary Monarchy vs. Republic",
        "Both ballots include the 7 immutable principles",
        "3-month public campaign period",
        "State media treats both sides equally",
        "Political parties may actively campaign",
        "International democratic standards apply",
      ],
    },
    s2const: {
      title: "New Constitution",
      sub: "Permanent law of the land · Approved by constitutional referendum · Establishes all permanent institutions",
      items: [
        "Constitutional referendum held within 1 month of draft completion",
        "If rejected: 2-month revision + re-vote (up to 3 attempts)",
        "If rejected 3 times: an entirely new Constituent Assembly must be elected",
        "Must enshrine all 7 immutable principles",
      ],
    },
    s2parliament: {
      title: "Parliament (Mehestan)",
      items: [
        "Fully elected by citizens — no appointed members",
        "Passes laws and approves the national budget",
        "Approves elected government (confidence votes)",
        "Fully democratic, periodic elections",
      ],
    },
    s2govt: {
      title: "Government",
      items: [
        "PM or President per the new constitution",
        "Parliamentary monarchy / parliamentary republic / presidential republic",
        "Accountable to parliament and the constitution",
      ],
    },
    s2jud: {
      title: "Independent Judiciary",
      items: [
        "Supreme Court + lower courts",
        "Fully independent of the executive branch",
        "Operating under the new constitution",
      ],
    },

    dissolution: "At this point: the entire Stage 1 transitional system — including the Leader of the National Uprising — is completely dissolved. All power transfers to the permanent, democratically elected institutions under the new constitution. \"The Transitional System shall be deemed dissolved.\" — Emergency Phase Booklet, para. 21",

    source: "Source: Emergency Phase Booklet (March 2026) · Iran Prosperity Project / NUFDI · 14 White Papers · IranProsperityProject.org",
  },

  // ─────────────────────────────────────────────────────
  // PERSIAN (fa)
  // ─────────────────────────────────────────────────────
  fa: {
    heroEyebrow: "ایران پراسپریتی پروژه · نافدی · کتاب فاز اضطراری، مارس ۲۰۲۶",
    heroTitle: "طرح دولت موقت",
    heroDesc: "ساختار سازمانی جامع برگرفته مستقیم از کتاب فاز اضطراری (۱۴ کاغذ سفید). مرحله اول دوره موقت را تحت سیستم موقت پوشش می‌دهد. مرحله دوم ساختار دموکراتیک دائمی را که برای تولید آن طراحی شده نشان می‌دهد. این برنامه ۱۸۰ روز اول («فاز اضطراری») را به تفصیل پوشش می‌دهد، با دوره کامل گذار ۱۸–۲۴ ماهه.",

    partA_eyebrow: "مرحله ۱ · بخش الف",
    partA_title: "ساختار سیاسی — دوره کامل گذار (۱۸–۲۴ ماه)",
    partA_intro: "ساختار از بالا به پایین. قدرت از رهبر به سه قوه منصوب و ارتش تحت فرماندهی مستقیم جریان می‌یابد. پیش از سقوط، رهبر از طریق دو نهاد مشورتی/اجرایی عمل می‌کند. در روز اول، یک فرمان سه‌بخشی قانون اساسی جمهوری اسلامی را لغو کرده و سیستم موقت را به عنوان ابزار حاکمیتی الزام‌آور تأسیس می‌کند.",

    prefallLabel: "نهادهای پیش از سقوط (قبل از فروپاشی رژیم)",

    nuc: {
      title: "شورای قیام ملی",
      sub: "بازوی مشورتی و سیاستگذاری رهبر",
      items: [
        "بازوی مشورتی و سیاستگذاری رهبر",
        "اعضا داخل و خارج از ایران",
        "هویت‌ها تا زمان امنیت مخفی باقی می‌مانند",
        "در هماهنگی با تیم اجرایی موقت عمل می‌کند",
      ],
    },
    tet: {
      title: "تیم اجرایی موقت",
      sub: "مجری تصمیمات رهبر",
      items: [
        "مجری تصمیمات رهبر",
        "اعضا داخل و خارج از ایران",
        "طبق استراتژی ۵ محوری عمل می‌کند",
        "هماهنگ‌کننده تمام برنامه‌ریزی عملیاتی پیش از سقوط",
      ],
    },
    prongs: {
      label: "استراتژی ۵ محوری پیش از سقوط",
      items: [
        "(۱) حداکثر فشار بر رژیم",
        "(۲) حداکثر حمایت از مردم",
        "(۳) حداکثر فرار از رژیم",
        "(۴) حداکثر بسیج داخل و خارج از ایران",
        "(۵) برنامه‌ریزی بازسازی → ایران پراسپریتی پروژه",
      ],
    },

    leaderTitle: "رهبر قیام ملی",
    leaderSub: "ولیعهد رضا پهلوی · رئیس دولت · فرمانده کل قوا",
    leaderNote: "اضطراری: در صورت عدم توانایی رهبر برای خدمت → شورای رهبری موقت فوراً تشکیل می‌شود (سران هر سه قوه، تصمیمات با رأی اکثریت)",

    meh: {
      title: "مجلس موقت",
      sub: "قوه مقننه · رئیس توسط اکثریت مطلق داخلی انتخاب می‌شود",
      color: "#69d98c",
      sections: [
        {
          title: "اعضا توسط رهبر منصوب می‌شوند",
          items: [
            "نماینده تنوع ملت یکپارچه ایران",
            "هویت‌ها ممکن است تا زمان امنیت مخفی بمانند",
            "رئیس توسط اکثریت مطلق داخلی انتخاب می‌شود",
            "برکناری رئیس: اکثریت مطلق + تأیید رهبر",
          ],
        },
        {
          title: "بررسی همه قوانین موجود — گزینه ترکیبی",
          items: [
            "لغو قوانین مغایر با اعلامیه جهانی حقوق بشر ۱۹۴۸، هویت ملی، یا پیشرفت گذار",
            "قوانین جایگزین از دوره امپراتوری پهلوی یا معادل‌های مدرن به‌روزشده",
            "نوسازی کامل به مجلس منتخب آینده موکول می‌شود",
          ],
        },
        {
          title: "وضع قوانین موقت جدید",
          items: [
            "باید پنل ۵ حقوقدان برجسته را برای هر قانون منصوب و مشورت کند",
            "پنل حقوقدانان در دوران تصدی هیچ فعالیت دیگری ندارد",
          ],
        },
        {
          title: "بررسی و تصویب بودجه سالانه کشور",
          items: [
            "بودجه توسط دولت موقت پیشنهاد می‌شود",
            "سازمان بودجه دیوان بخش خود را مستقل ارائه می‌دهد",
            "دولت نمی‌تواند بخش بودجه دیوان را تغییر دهد",
          ],
        },
        {
          title: "تأیید قضات دیوان عالی و دادگاه عدالت اداری",
          items: [
            "قضات توسط رئیس دیوان نامزد می‌شوند",
            "نیاز به رأی اکثریت مطلق برای تأیید دارد",
            "برکناری با همان فرآیند",
          ],
        },
        {
          title: "تعیین قوانین مجلس مؤسسان",
          items: [
            "تعداد کل کرسی‌ها (۷۰–۳۱۰ کرسی)",
            "معیارهای احراز صلاحیت: سن، تحصیلات و سایر الزامات",
            "قوانین باید قبل از برگزاری رفراندوم نهایی شوند",
          ],
        },
        {
          title: "پس از گذار: فقط نهاد مشورتی",
          items: [
            "نقش قانونگذاری با تشکیل مجلس منتخب پایان می‌یابد",
            "تا انحلال کامل سیستم موقت به رهبر مشورت می‌دهد",
            "پس از تشکیل نهاد منتخب هیچ اختیار قانونگذاری ندارد",
          ],
        },
        {
          title: "قوانین تمدید زمانی",
          items: [
            "تمدید بیش از ۶ ماه: نیاز به تصویب همزمان سران هر سه قوه + رهبر",
            "تمدید بیش از ۱۲ ماه: نیاز به رفراندوم ملی برای مجوز",
          ],
        },
      ],
    },

    gov: {
      title: "دولت موقت",
      sub: "قوه مجریه · رئیس توسط رهبر (پس از مشورت با مجلس موقت) منصوب می‌شود",
      color: "#4fc3f7",
      sections: [
        {
          title: "ساختار توسط رئیس دولت تعیین می‌شود",
          items: [
            "تعداد و نام وزارتخانه‌ها توسط رئیس دولت تصمیم‌گیری می‌شود",
            "پس از مشورت با مجلس موقت + تأیید رهبر الزامی است",
          ],
        },
        {
          title: "انتصاب تمام وزرا",
          items: [
            "همه وزرا با تأیید اکثریت مطلق مجلس موقت",
            "برکناری به صلاحدید رئیس دولت",
            "★ وزیر دفاع: قانون ویژه — مستقیماً توسط رهبر تأیید می‌شود",
          ],
        },
        {
          title: "اعلامیه‌های بین‌المللی روز اول",
          items: [
            "حذف 'جمهوری اسلامی' از نام رسمی — اطلاع‌رسانی به تمام کشورهای عضو سازمان ملل",
            "بازگرداندن پرچم سه‌رنگ شیر و خورشید — اطلاع‌رسانی به تمام کشورها و سازمان‌ها",
            "جایگزینی سرود ملی با 'ای ایران' تا انتخاب سرود رسمی",
            "اطلاع‌رسانی به دولت سوئیس (امین کنوانسیون ژنو) درباره تغییر نام هلال احمر",
            "کنترل تمام سفارتخانه‌ها؛ انتصاب نمایندگان موقت",
            "مدیریت دارایی‌های ایران در خارج؛ به‌روزرسانی گذرنامه‌ها",
          ],
        },
        {
          title: "مذاکره برای لغو تمام تحریم‌ها",
          items: [
            "تحریم‌های مالی، تجاری، حقوق بشر و نظامی",
            "حذف محدودیت‌های ویزا برای شهروندان ایرانی",
            "آغاز دسترسی کامل آژانس — فوراً توقف غنی‌سازی اورانیوم",
            "شناسایی اسرائیل (چارچوب توافق کوروش) — هفته اول",
            "تفاهم‌نامه تجاری، عدم تجاوز، امنیتی با آمریکا و اسرائیل — ماه‌های ۲–۳",
            "بازتنظیم روابط با چین/روسیه بر اساس احترام متقابل",
            "هند/ژاپن/کره جنوبی به عنوان شرکای انرژی و فناوری",
          ],
        },
        {
          title: "رفراندوم نظام حکومتی (ظرف ۴ ماه)",
          items: [
            "دوره کمپین عمومی ۳ ماهه پیش از رأی‌گیری",
            "گزینه رأی: پادشاهی پارلمانی در برابر جمهوری",
            "هر دو برگه رأی شامل ۷ اصل تغییرناپذیر",
            "رسانه دولتی هر دو طرف را برابر پوشش می‌دهد؛ احزاب سیاسی می‌توانند فعالیت کنند",
            "در صورت تصویب پادشاهی: تاجگذاری ظرف ۲ هفته از نتیجه رفراندوم",
            "در صورت تصویب جمهوری: انتخابات ریاست‌جمهوری همزمان با انتخابات مجلس",
          ],
        },
        {
          title: "انتخابات مجلس مؤسسان (ظرف ۲ ماه از رفراندوم)",
          items: [
            "تعداد کرسی و شرایط احراز صلاحیت توسط مجلس موقت از پیش تعیین می‌شود",
            "پنل ۷ حقوقدان در تهیه پیش‌نویس قانون اساسی کمک می‌کند",
            "مأموریت ۶ ماهه برای تکمیل پیش‌نویس قانون اساسی",
            "با کمیته‌های متخصص در ۱۰+ بخش مشورت می‌کند",
            "در صورت انتخاب پادشاهی: ممکن است از قانون اساسی ۱۹۰۶ ایران به عنوان پایه استفاده شود",
            "هر ماده را برای نظرخواهی عمومی در طول تهیه پیش‌نویس منتشر می‌کند",
          ],
        },
        {
          title: "رفراندوم قانون اساسی (ظرف ۱ ماه از تکمیل پیش‌نویس)",
          items: [
            "رأی‌گیری ملی برای تصویب یا رد پیش‌نویس قانون اساسی",
            "در صورت رد: بازنگری ۲ ماهه + رأی‌گیری مجدد (تا ۳ بار)",
            "در صورت رد ۳ بار: مجلس مؤسسان کاملاً جدید باید انتخاب شود",
          ],
        },
        {
          title: "انتخابات مجلس (ظرف ۳ ماه از تصویب قانون اساسی)",
          items: [
            "مردم مستقیماً مجلس جدید را انتخاب می‌کنند",
            "در صورت پادشاهی: تاجگذاری ≤۲ هفته پس از تصویب قانون اساسی",
            "در صورت جمهوری: انتخابات ریاست‌جمهوری همزمان با انتخابات مجلس",
          ],
        },
        {
          title: "سوگند دولت منتخب → انحلال سیستم موقت",
          items: [
            "سوگند کابینه نخست‌وزیر یا رئیس‌جمهور",
            "انحلال دولت موقت",
            "انحلال مجلس موقت (ابتدا فقط مشورتی، سپس کاملاً منحل)",
            "نقش رهبر قیام ملی کاملاً منحل می‌شود",
          ],
        },
        {
          title: "استقلال کانون وکلا + اصلاح کتب درسی",
          items: [
            "دولت بودجه کانون وکلا را برای برنامه‌های معاضدت قضایی تأمین می‌کند",
            "استقلال کانون وکلا توسط قانون تضمین می‌شود",
            "حذف ایدئولوژی از همه سطوح آموزشی (ابتدایی، متوسطه، عالی)",
            "انعکاس ارزش‌های دوران جدید دموکراتیک در تمام مواد درسی",
          ],
        },
      ],
    },

    div: {
      title: "دیوان موقت",
      sub: "قوه قضاییه · رئیس = حقوقدان برجسته منصوب توسط رهبر (پس از مشورت با مجلس موقت)",
      color: "#ffd166",
      sections: [
        {
          title: "رئیس سران تمام سازمان‌های قضایی را منصوب می‌کند",
          items: [
            "رئیس کل دیوان عالی کشور",
            "رئیس کل دادگاه عدالت اداری",
            "رئیس سازمان بازرسی کل کشور",
            "رئیس سازمان زندان‌ها",
            "رئیس پزشکی قانونی",
            "رئیس سازمان ثبت اسناد و املاک",
            "رئیس سازمان بودجه دیوان",
          ],
        },
        {
          title: "دادستان کل → وزارت دادگستری (قوه مجریه)",
          items: [
            "انتقال از قوه قضاییه به قوه مجریه",
            "رفع تعارض بین وظایف قضایی و تعقیب",
            "توسط وزیر دادگستری منصوب می‌شود",
          ],
        },
        {
          title: "شورای قضایی — ۵ حقوقدان برجسته",
          items: [
            "نظارت بر قوانین انتصاب قضات دادگاه‌های پایین‌تر در سراسر کشور",
            "بررسی قوانین برای تمام انتصابات قضایی",
            "هیچ فعالیت دیگری در دوران تصدی مجاز نیست",
          ],
        },
        {
          title: "سازمان بودجه دیوان — کاملاً مستقل",
          items: [
            "بودجه دیوان را مستقل تهیه می‌کند — دولت نمی‌تواند تغییر دهد",
            "بودجه را مستقیماً به مجلس موقت ارائه می‌دهد (دور زدن دولت)",
            "توسط دیوان محاسبات کشور حسابرسی می‌شود",
            "تضمین استقلال مالی کامل قضایی",
          ],
        },
        {
          title: "دادگاه عدالت انتقالی",
          items: [
            "صلاحیت کیفری انحصاری بر جرایم از بهمن ۱۳۵۷ تا سقوط رژیم",
            "صلاحیت جهانی — هیچ مصونیت سیاسی اعطا نمی‌شود",
            "هیچ مرور زمانی برای جرایم در محدوده اعمال نمی‌شود",
            "مدیران به طور خودکار مسئول نیستند — نیاز به شواهد مستقیم قوی از مشارکت",
            "دادرسی با کیفرخواست دادستان ویژه آغاز می‌شود",
          ],
        },
        {
          title: "دادستان ویژه",
          items: [
            "توسط دادستان کل پس از مشورت با وزیر دادگستری منصوب می‌شود",
            "تمام دادرسی‌های دادگاه عدالت انتقالی را آغاز می‌کند",
            "درخواست‌های تجدیدنظر — تصمیمات تجدیدنظر قطعی است",
          ],
        },
        {
          title: "کمیسیون حقیقت — ۳ کمیته",
          items: [
            "اعضا توسط شورای قضایی منصوب می‌شوند",
            "رئیس توسط رئیس دیوان منصوب می‌شود",
            "مدت: حداکثر ۵ سال + تمدید ۱ ساله",
            "تمام جلسات به طور پیش‌فرض عمومی هستند؛ استثنائات امنیت ملی مجاز",
            "محدوده به جرایم پیش از سقوط محدود است",
          ],
        },
        {
          title: "① کمیته تحقیق",
          items: [
            "جمع‌آوری و مستندسازی تمام شواهد",
            "ایجاد فضای امن برای شهادت قربانیان",
            "تولید گزارش جامع با پیشنهادات جبران خسارت",
          ],
        },
        {
          title: "② کمیته عفو مشروط",
          items: [
            "فقط عفو فردی — هیچ عفو گروهی",
            "شرایط: افشای کامل + ارتباط سیاسی + تناسب اقدام",
            "عفو به طور خودکار لغو می‌شود اگر متقاضی دروغ گفته باشد",
            "نمی‌تواند برای جنایات علیه بشریت عفو صادر کند",
          ],
        },
        {
          title: "③ کمیته عالی (ناظر ارشد)",
          items: [
            "رسیدگی به درخواست‌های تجدیدنظر عفو",
            "نهایی‌سازی و انتشار گزارش جامع",
            "رئیس دیوان می‌تواند هر عفو فردی را وتو کند",
          ],
        },
      ],
    },

    mil: {
      title: "فرماندهان ارشد نظامی",
      sub: "منصوب و برکنار توسط رهبر مستقیم · نقش فرمانده کل قوا",
      color: "#ff9a42",
      sections: [
        {
          title: "ارتش (نیروهای رسمی) حفظ می‌شود",
          items: [
            "نیروی زمینی، دریایی، هوایی — غربالگری شده و از روز اول عملیاتی",
            "افسران غربالگری‌شده در فرماندهی ادامه می‌دهند",
            "ارتش ملی یکپارچه، متمرکز و غیرسیاسی",
          ],
        },
        {
          title: "سپاه پاسداران انقلاب کاملاً منحل می‌شود",
          items: [
            "بازوی نظامی → جذب در ارتش ملی",
            "بازوی اطلاعاتی → انتقال به سازمان جدید سرین",
            "دارایی‌های اقتصادی/فرهنگی → انتقال به دولت موقت",
            "تمام درجه‌داران سپاه مشمول پروتکل غربالگری سه‌مرحله‌ای",
          ],
        },
        {
          title: "بسیج + نیروی قدس منحل می‌شوند",
          items: [
            "کاملاً منحل — هیچ نگهداری یا تغییر نام",
            "هیچ ساختار نظامی یا امنیتی موازی مجاز نیست",
            "پرسنل مشمول غربالگری فردی سه‌مرحله‌ای",
          ],
        },
        {
          title: "سرین (سرویس اطلاعات و امنیت ملی) تأسیس می‌شود",
          items: [
            "جایگزین وزارت اطلاعات و تمام سازمان‌های اطلاعاتی موازی",
            "تحت دولت موقت (نه زنجیره نظامی)",
            "سه بخش: امنیت داخلی، اطلاعات خارجی، اطلاعات سایبری",
            "رهبری غیرنظامی با نظارت پارلمانی",
          ],
        },
        {
          title: "پروتکل غربالگری سه‌مرحله‌ای",
          items: [
            "دسته الف: نگه‌داری — غربالگری شده، سابقه پاک، ادامه خدمت",
            "دسته ب: آموزش مجدد — برنامه‌های آموزش مجدد و افراط‌زدایی",
            "دسته پ: پیگرد — ارجاع به دادگاه عدالت انتقالی",
            "بررسی فردی موردبه‌مورد — بدون مجازات دسته‌جمعی",
          ],
        },
        {
          title: "هیئت‌های نظارت مدنی",
          items: [
            "کمیته‌های امنیتی مجلس موقت بر تمام نیروها نظارت دارند",
            "بازرس کل برای هر واحد نظامی و امنیتی",
            "گزارش منظم عمومی از پیشرفت اصلاحات",
          ],
        },
        {
          title: "بازسازی مرحله‌ای ۲۴ ماهه",
          items: [
            "مرحله ۰–۳ ماه: تثبیت و تأمین ساختارهای موجود",
            "مرحله ۳–۱۲ ماه: بازسازی نهادها و دکترین فرماندهی",
            "مرحله ۱۲–۲۴ ماه: تثبیت اصلاحات + تحویل به دولت منتخب",
          ],
        },
      ],
    },

    contingencyText: "شورای رهبری موقت فوراً تشکیل می‌شود: سران دولت موقت + مجلس موقت + دیوان موقت · تصمیمات با رأی اکثریت",

    immutable: {
      label: "۷ اصل تغییرناپذیر — مندرج در هر دو برگه رفراندوم و در قانون اساسی جدید",
      items: [
        "تمامیت ارضی ایران",
        "کرامت و حقوق بشر (منشور کوروش + اعلامیه جهانی حقوق بشر ۱۹۴۸)",
        "دموکراسی — 'یک شهروند، یک رأی'",
        "حاکمیت قانون",
        "جدایی کامل دین از حکومت",
        "تفکیک قوا",
        "استقلال و بی‌طرفی دیوان",
      ],
    },
    hybridOption: {
      title: "چارچوب حقوقی: گزینه ترکیبی (الهام از گذار برگزیت ۲۰۲۰)",
      text: "حفظ تمام قوانین جمهوری اسلامی به عنوان پیش‌فرض · لغو آن‌هایی که با اعلامیه جهانی حقوق بشر/هویت ملی/گذار مغایرت دارند · جایگزین = قوانین دوره پهلوی یا معادل‌های مدرن · نوسازی کامل توسط مجلس منتخب آینده. سه معیار: (۱) عملی — کاهش بار کاری سیستم موقت؛ (۲) تثبیت‌کننده — حفظ تداوم در امور روزمره؛ (۳) امیدبخش — لغو قوانین سرکوبگرانه اعتماد عمومی را افزایش می‌دهد.",
    },

    partB_eyebrow: "مرحله ۱ · بخش ب",
    partB_title: "فرمان روز اول رهبر — چارچوب حقوقی ۳ بخشی + ۱۳ اصلاح ساختاری",
    partB_intro: "اولین اقدام رسمی قانون اساسی جمهوری اسلامی را لغو کرده، قوانین موجود را به عنوان قاعده پیش‌فرض حفظ می‌کند (مدل ترکیبی/برگزیت)، و نهادهای مغایر با هویت ملی، اعلامیه جهانی حقوق بشر، یا گذار را فوراً لغو می‌کند. ۱۳ اصلاح ساختاری مشخص را که در خود فرمان فهرست شده‌اند آغاز می‌کند.",

    decreeTitle: "فرمان رسمی رهبر (روز اول)",
    decreeSub: "لغو قانون اساسی جمهوری اسلامی · تأسیس چارچوب موقت به عنوان ابزار حاکمیتی الزام‌آور دولت",

    decreeParts: [
      {
        label: "بخش اول",
        title: "لغو قانون اساسی جمهوری اسلامی",
        items: [
          "انحلال رسمی رژیم",
          "ایجاد گسست قطعی از نظام قدیم",
          "پایه مشروعیت بین‌المللی برای دولت جدید",
        ],
        color: "#ef5350",
      },
      {
        label: "بخش دوم",
        title: "گزینه ترکیبی: حفظ قوانین موجود",
        items: [
          "قاعده پیش‌فرض: همه قوانین و نهادهای موجود به اجرا ادامه می‌دهند",
          "جلوگیری از خلاء قانونی و اختلال اجتماعی",
          "الهام از مدل گذار برگزیت ۲۰۲۰",
          "قوانین جایگزین از دوره پهلوی یا معادل‌های مدرن",
        ],
        color: "#4fc3f7",
      },
      {
        label: "بخش سوم",
        title: "لغو قوانین و نهادهای متعارض",
        items: [
          "لغو قوانین مغایر با (الف) هویت تاریخی/ملی ایران",
          "لغو قوانین مغایر با (ب) اعلامیه جهانی حقوق بشر ۱۹۴۸",
          "لغو قوانین مغایر با (پ) پیشرفت گذار و اصول دموکراتیک",
        ],
        color: "#69d98c",
      },
    ],

    reforms: {
      label: "۱۳ اصلاح ساختاری فوری ناشی از فرمان",
      items: [
        "حذف 'جمهوری اسلامی' از نام رسمی · اطلاع‌رسانی به تمام کشورها و سازمان‌های بین‌المللی",
        "بازگرداندن پرچم سه‌رنگ شیر و خورشید · اطلاع‌رسانی به تمام کشورها، سازمان‌ها و نهادهای معاهداتی",
        "جایگزینی سرود ملی با 'ای ایران' تا انتخاب سرود رسمی توسط پارلمان منتخب",
        "انحلال: دفتر رهبر معظم، مجلس خبرگان، مجمع تشخیص مصلحت، شورای نگهبان",
        "انحلال سپاه: بازوی نظامی → ارتش ملی؛ اطلاعات → سرین؛ دارایی‌های اقتصادی/فرهنگی → دولت",
        "تأسیس سرین (سرویس اطلاعات و امنیت ملی) تحت دولت موقت",
        "انحلال دادگاه انقلاب اسلامی و دادگاه ویژه روحانیت؛ احیای سیستم دادگاه عمومی",
        "انتقال دادستان کل از قوه قضاییه به وزارت دادگستری (قوه مجریه)",
        "ایجاد مکانیزم استقلال کانون وکلا؛ تخصیص بودجه معاضدت قضایی از دولت",
        "انحلال پلیس اخلاق (گشت ارشاد)، شورای عالی انقلاب فرهنگی، شورای عالی فضای مجازی",
        "انحلال صداوسیمای جمهوری اسلامی؛ احیای رادیو و تلویزیون ملی ایران",
        "تغییر نام هلال احمر → جمعیت شیر و خورشید سرخ؛ اطلاع‌رسانی به دولت سوئیس (امین کنوانسیون ژنو)",
        "ایجاد مکانیزم عدالت انتقالی برای رسیدگی به نقض فاحش حقوق بشر از بهمن ۱۳۵۷",
      ],
    },

    hybridWhy: "چرا گزینه ترکیبی؟ (۱) عملی — کاهش بار کاری سیستم موقت · (۲) تثبیت‌کننده — حفظ تداوم در امور روزمره · (۳) امیدبخش — لغو قوانین سرکوبگرانه اعتماد عمومی را افزایش می‌دهد · سابقه تاریخی: مدل گذار برگزیت ۲۰۲۰",

    partC_eyebrow: "مرحله ۱ · بخش پ",
    partC_title: "مسیرهای سیاستی موازی — ۱۸۰ روز اول (فاز اضطراری)",
    partC_intro: "موازی با ساختار سیاسی، دولت موقت پنج مسیر سیاستی اصلی را همزمان از روز اول اجرا می‌کند. هر مسیر یک برنامه عملیاتی مشخص با افق‌های زمانی معین از ۱۴ کاغذ سفید دارد.",

    fp: {
      title: "سیاست خارجی",
      sub: "غیرایدئولوژیک · مبتنی بر منافع ملی",
      color: "#69d98c",
      sections: [
        {
          title: "هفته اول: شناسایی اسرائیل (چارچوب توافق کوروش)",
          items: ["شناسایی رسمی دولت اسرائیل", "دعوت به مذاکرات دیپلماتیک مستقیم", "عمل در چارچوب توافق کوروش"],
        },
        {
          title: "هفته اول: توقف غنی‌سازی + دسترسی کامل آژانس",
          items: ["اعلام شفافیت هسته‌ای کامل", "رعایت پادمان‌ها + پروتکل الحاقی", "دعوت فوری از بازرسان آژانس"],
        },
        {
          title: "هفته اول: تماس با آمریکا، اتحادیه اروپا، سازمان ملل، همسایگان",
          items: ["عادی‌سازی روابط با آمریکا (مدل دهه ۷۰ به عنوان مرجع)", "تعامل با اتحادیه اروپا برای رفع تحریم‌ها", "اطلاع‌رسانی به تمام کشورهای عضو سازمان ملل"],
        },
        {
          title: "ماه اول: چارچوب ثبات منطقه‌ای",
          items: ["جلسات ماهانه با ۱۴ کشور همسایه", "اتاق‌های عملیات مشترک مرزی تأسیس می‌شوند", "پایان دادن به تمام حمایت‌های نیابتی در منطقه", "چارچوب عدم تجاوز با همه همسایگان"],
        },
        {
          title: "ماه‌های ۲–۳: تفاهم‌نامه‌ها + توافقات اولیه",
          items: ["تفاهم‌نامه تجاری، عدم تجاوز، امنیتی", "امضای توافقات اولیه با آمریکا و اسرائیل", "بازتنظیم روابط با چین/روسیه بر اساس احترام متقابل", "هند/ژاپن/کره جنوبی به عنوان شرکای انرژی و فناوری"],
        },
        {
          title: "بازسازی وزارت خارجه + نماینده ویژه دیاسپورا",
          items: ["کمیته غربالگری برای کارمندان وزارت خارجه", "مرکز جهت‌گیری مجدد دیپلماتیک", "واحد شفافیت", "میز هماهنگی با کشورهای همسایه", "نماینده ویژه دیاسپورای ایرانی"],
        },
        {
          title: "کارگروه دیپلماسی اقتصادی",
          items: ["جذب سرمایه‌گذاری مستقیم خارجی", "تعامل با صندوق بین‌المللی پول/بانک جهانی", "کتاب فرصت‌های اقتصادی ایران به ۸ زبان", "هماهنگی با تیم‌های کاغذ سفید انرژی و صنعت"],
        },
      ],
    },

    milTimeline: {
      title: "جدول زمانی اصلاح نظامی",
      sub: "روزهای ۱–۱۸۰ + برنامه بازسازی ۲۴ ماهه",
      color: "#ff9a42",
      sections: [
        { title: "روزهای ۱–۱۰: تصرف و تثبیت", items: ["استقرار ارتش برای تأمین نقاط کلیدی", "عملیات سایبری ظرف ۴۸–۷۲ ساعت خنثی می‌شوند", "پخش ملی اضطراری به مردم", "تأمین زیرساخت‌های حیاتی: سوخت، آب، بنادر، بیمارستان‌ها، مخابرات", "فرماندهی سپاه روز اول منحل می‌شود"] },
        { title: "روزهای ۱۱–۴۰: غربالگری و خلع سلاح", items: ["پروتکل غربالگری سه‌مرحله‌ای برای تمام نیروهای مسلح", "خلع سلاح گروه‌های شبه‌نظامی و بقایای بسیج", "برنامه‌های افراط‌زدایی آغاز می‌شود", "تفکیک کامل بسیج"] },
        { title: "روزهای ۴۱–۱۰۰: ساخت نهادهای جدید", items: ["سرین رسماً تأسیس و عملیاتی می‌شود", "پلیس غیرنظامی می‌شود و رهبری غیرنظامی می‌یابد", "هیئت‌های نظارت اجتماعی برای هر واحد", "آکادمی امنیت ملی (NSA) راه‌اندازی می‌شود"] },
        { title: "روزهای ۱۰۱–۱۴۰: مشروعیت جهانی", items: ["هیئت حسابرسی غیرنظامی NSRB تشکیل می‌شود", "ساخت اتحاد بین‌المللی با شرکا", "انتشار نتایج غربالگری برای شفافیت و اعتماد بین‌المللی", "کسب شناسایی بین‌المللی از نیروهای مسلح اصلاح‌شده"] },
        { title: "روزهای ۱۴۱–۱۸۰: آزمون استرس", items: ["تمرینات بازی جنگی حملات سایبری", "تمرینات پاسخ به آشوب مدنی", "شبیه‌سازی شورش‌های نیابتی", "نهادهای نظارت دائمی کاملاً عملیاتی"] },
        { title: "ماه‌های ۳–۲۴: بازسازی کامل ۳ مرحله‌ای", items: ["۰–۳ ماه: تثبیت ساختارهای موجود", "۳–۱۲ ماه: بازسازی نهادها و دکترین", "۱۲–۲۴ ماه: تثبیت اصلاحات + تحویل به دولت منتخب"] },
      ],
    },

    macro: {
      title: "اقتصاد کلان",
      sub: "تثبیت مالی + پولی + بانکی",
      color: "#ffd166",
      sections: [
        { title: "تأمین بانک مرکزی ایران", items: ["بانک مرکزی = عامل مالی + مرجع پولی مستقل", "رئیس جدید روز اول منصوب می‌شود", "مأموریت دوگانه: ثبات قیمت + ثبات مالی", "مستقل، شفاف، پاسخگو بر اساس حاکمیت مدرن بانکداری"] },
        { title: "کنترل سرمایه + انجماد دارایی‌ها", items: ["جلوگیری از فرار سرمایه از روز اول", "انجماد حساب‌های بزرگ مرتبط با وابستگان رژیم", "بیمه سپرده ۱۰۰٪ برای حساب‌های خرده و تجاری (۱۰۰ روز اول)", "ممنوعیت انتقالات خودی و فروش ضرری", "انتشار اوراق داخلی برای کسری بودجه کوتاه‌مدت"] },
        { title: "دسترسی به ۱۲۰–۱۵۰ میلیارد دلار ذخایر منجمد", items: ["نیاز به شناسایی رسمی توسط آمریکا، اتحادیه اروپا، چین، صندوق بین‌المللی پول", "برنامه‌های وام صندوق بین‌المللی پول آغاز می‌شود", "رفع انجماد از طریق مشروعیت بین‌المللی اثبات‌شده", "کارگروه مالی مشترک برای جلوگیری از جریان‌های پولی تنظیم‌نشده"] },
        { title: "تثبیت بانکی", items: ["حفظ سپرده‌ها؛ احیای خدمات بانکی بدون وقفه", "احیای دسترسی به SWIFT برای بانک‌های ایرانی", "برنامه رعایت استانداردهای FATF آغاز می‌شود", "تجمیع نرخ‌های ارز متعدد در سیستم نرخ دوگانه مدیریت‌شده", "تعلیق بورس اوراق بهادار تهران ۹۰–۱۸۰ روز برای حسابرسی"] },
        { title: "اصلاح بنیادها + زدایش ایدئولوژی", items: ["کوچک‌سازی بنیادهای شبه‌دولتی (بنیاد مستضعفان، ستاد، آستان قدس رضوی)", "مشمول مالیات و نظارت عمومی شدن", "ادغام وزارتخانه‌های موازی", "برچیدن دارایی‌های اقتصادی سپاه (قرارگاه خاتم‌الانبیا)", "انتصاب مدیریت موقت تکنوکرات در تمام شرکت‌های دولتی"] },
        { title: "تداوم بازنشستگی + یارانه از روز اول", items: ["پرداخت بازنشستگی بدون وقفه از روز اول", "ادامه یارانه‌های موجود در دوران گذار", "بازسازی رتبه‌بندی اعتبار حاکمیتی (فیچ، مودیز، اس‌اند‌پی)", "احیای شورای عالی رفاه اجتماعی"] },
        { title: "بازیابی دارایی‌های ملی (برنامه پباد)", items: ["شناسایی و تأمین تمام دارایی‌های رژیم داخل و خارج", "انجماد حساب‌ها در امارات، ترکیه، سوئیس، لوکزامبورگ، مالزی، چین", "جلوگیری از خرابکاری توسط وفاداران رژیم", "هماهنگی با FATF، اینترپل و سازمان‌های اطلاعات مالی خارجی", "اولویت: رمزارز، ذخایر طلا، املاک خارجی، دارایی‌های شرکتی سپاه"] },
      ],
    },

    ess: {
      title: "خدمات اساسی",
      sub: "تداوم خدمات دولتی — برنامه ۱۸۰ روزه",
      color: "#4fc3f7",
      sections: [
        { title: "H تا H+72: تصرف فوری زیرساخت‌های حیاتی", items: ["تأمین انبارهای سوخت و شبکه توزیع", "تأمین ذخایر غله و زنجیره تأمین غذا", "تأمین بنادر اصلی و کریدورهای لجستیک", "تأمین بیمارستان‌ها و زنجیره تأمین دارو", "تأمین تأسیسات تصفیه آب و توزیع", "تأمین مراکز مخابراتی و تبادل اینترنت"] },
        { title: "روزهای ۳–۳۰: تثبیت و تریاژ ملی", items: ["ارزیابی دسترسی ملی به تمام کالاهای ضروری", "وضعیت تداوم خدمات آب‌وبرق و بهداشت", "اجرای اقدامات ضدسودجویی و کنترل قیمت‌ها", "اقدامات اضطراری برای جمعیت‌های آسیب‌پذیر"] },
        { title: "روزهای ۳۱–۱۸۰: تداوم عملیاتی", items: ["اجرای استاندارد در تمام ۳۱ استان", "حفظ دانش سازمانی کارکنان فنی کلیدی", "دیجیتال‌سازی تمام اسناد و پایگاه‌های داده دولتی", "مراکز هماهنگی استانی عملیاتی"] },
        { title: "۷ دسته خدمات محافظت‌شده (مستمر از روز اول)", items: ["امنیت غذایی و زنجیره تأمین", "زیرساخت حمل‌ونقل و لجستیک", "خدمات عمومی (برق، گاز، آب)", "بهداشت عمومی و خدمات پزشکی اضطراری", "پاسخ اضطراری و مدیریت بحران", "تداوم پرسنل (کارکنان دولت از روز اول حقوق دریافت می‌کنند)", "زیرساخت ارتباطات و اطلاعات"] },
        { title: "پرداخت حقوق تمام کارکنان دولت از روز اول", items: ["پرسنل نظامی — تمام درجه‌ها بدون استثنا", "معلمان و مربیان در تمام سطوح", "کارکنان بهداشت: پزشکان، پرستاران، کادر پشتیبانی", "تمام کارمندان دولتی و مدیران اداری", "هدف: جلوگیری از فروپاشی اجتماعی و فرار مغزها"] },
        { title: "کاغذ سفیدهای بخشی (برنامه‌های تفصیلی برای هر بخش)", items: ["دارایی‌های ملی — برنامه بازیابی پباد", "انرژی — تأمین و حفظ تولید نفت/گاز", "صنعت — حفاظت از تولید و زنجیره تأمین", "امنیت سایبری — حفاظت از تمام زیرساخت‌های دیجیتال حیاتی", "محیط زیست — حفاظت از اکوسیستم‌های حیاتی", "آب — جلوگیری از تشدید بحران آب", "بهداشت — حفظ تمام سیستم‌های سلامت"] },
      ],
    },

    edu: {
      title: "آموزش + اصلاح اجتماعی",
      sub: "زدایش ایدئولوژی + دسترسی برابر + تداوم",
      color: "#ba68c8",
      sections: [
        { title: "حذف ایدئولوژی از تمام کتب درسی", items: ["کتب درسی ابتدایی، متوسطه و آموزش عالی", "انعکاس ارزش‌های ایران جدید دموکراتیک", "جایگزینی محتوای آموزش دینی با آموزش شهروندی", "بررسی فوری تمام مواد درسی"] },
        { title: "بازسازی آموزش نظامی", items: ["آموزش جنگ‌افزارهای پهپاد و سایبری", "تحلیل اطلاعاتی و اخلاق حرفه‌ای", "اصول حقوق بشر در دکترین نظامی", "اصول نظارت غیرنظامی دموکراتیک"] },
        { title: "تداوم بهداشت و درمان", items: ["خرید داروهای ضروری حفظ می‌شود", "پروتکل‌های ظرفیت تقویت‌شده برای بیمارستان‌ها", "ظرفیت اضطراری از کاهش بودجه محافظت می‌شود", "مشارکت‌های بهداشتی بین‌المللی برقرار می‌شود"] },
        { title: "شهروندی برابر برای همه گروه‌ها", items: ["برابری زنان در برابر قانون — حذف فوری تمام قوانین تبعیض‌آمیز جنسیتی", "شهروندی برابر برای اقلیت‌های قومی (کردها، عرب‌ها، بلوچ‌ها، ترکمن‌ها و غیره)", "اقلیت‌های دینی تحت قانون اساسی جدید محافظت می‌شوند", "بدون قوانین اجباری پوشش دینی از هر نوع"] },
        { title: "امنیت سایبری + حفاظت از زیرساخت‌های حیاتی", items: ["کارگروه ملی امنیت سایبری موقت از روز صفر", "حفاظت از سیستم‌های مخابراتی، انرژی، آب و مالی", "محافظت در برابر خرابکاری توسط بقایای رژیم", "مرکز ملی واکنش به حوادث سایبری با عملیات ۲۴ ساعته", "پروتکل‌های مدیریت تهدیدات داخلی"] },
        { title: "آکادمی امنیت ملی (NSA)", items: ["برنامه القاء سریع برای تمام پرسنل امنیتی جدید", "آموزش اخلاق و حاکمیت قانون", "اصول زنجیره فرماندهی و نظارت غیرنظامی", "تعهدات حقوق بشر و حقوق بین‌الملل"] },
      ],
    },

    whitePapersNote: "مجموع ۱۴ کاغذ سفید — برنامه‌های تفصیلی همچنین برای: دارایی‌های ملی · انرژی · صنعت · امنیت سایبری · محیط زیست · آب · بهداشت وجود دارد. هر کاغذ سفید چارچوب عملیاتی خاص خود برای فاز اضطراری دارد.",

    stage2_eyebrow: "مرحله ۲ از ۲",
    stage2_title: "ساختار دموکراتیک دائمی — هدف نهایی",
    stage2_intro: "از پایین به بالا. تمام اقتدار از رهبر موقت به مردم ایران منتقل می‌شود. مجلس مؤسسان قانون اساسی را تهیه می‌کند؛ یک رفراندوم آن را تأیید کرده و نظام حکومتی را انتخاب می‌کند. سپس تمام نهادهای مرحله اول — از جمله نقش رهبر — کاملاً منحل می‌شوند. گذار طراحی شده تا 'نه شتابزده و نه بی‌پایان' باشد.",

    s2_people_title: "مردم ایران",
    s2_people_sub: "منبع اصلی تمام حاکمیت · تمام اقتدار از انتخابات آزاد، منصفانه و دوره‌ای مشتق می‌شود · 'یک شهروند، یک رأی'",

    s2ca: {
      title: "مجلس مؤسسان",
      sub: "توسط مردم انتخاب می‌شود · پیش‌نویس قانون اساسی جدید را تهیه می‌کند · مأموریت ۶ ماهه",
      items: [
        "قوانین (تعداد کرسی ۷۰–۳۱۰، شرایط) توسط مجلس موقت از پیش تعیین می‌شود",
        "پنل ۷ حقوقدان در فرآیند تهیه پیش‌نویس کمک می‌کند",
        "با کمیته‌های متخصص در ۱۰+ بخش مشورت می‌کند",
        "در صورت انتخاب پادشاهی: ممکن است از قانون اساسی ۱۹۰۶ ایران به عنوان پایه استفاده شود",
        "هر ماده را برای نظرخواهی عمومی در طول تهیه پیش‌نویس منتشر می‌کند",
      ],
    },
    s2ref: {
      title: "رفراندوم ملی",
      sub: "رأی درباره نظام حکومتی — ظرف ۴ ماه از آغاز گذار",
      items: [
        "گزینه: پادشاهی پارلمانی در برابر جمهوری",
        "هر دو برگه رأی شامل ۷ اصل تغییرناپذیر",
        "دوره کمپین عمومی ۳ ماهه",
        "رسانه دولتی هر دو طرف را برابر پوشش می‌دهد",
        "احزاب سیاسی می‌توانند فعالانه کمپین کنند",
        "استانداردهای بین‌المللی دموکراتیک اعمال می‌شود",
      ],
    },
    s2const: {
      title: "قانون اساسی جدید",
      sub: "قانون دائمی کشور · با رفراندوم قانون اساسی تصویب می‌شود · تمام نهادهای دائمی را تأسیس می‌کند",
      items: [
        "رفراندوم قانون اساسی ظرف ۱ ماه از اتمام پیش‌نویس برگزار می‌شود",
        "در صورت رد: بازنگری ۲ ماهه + رأی‌گیری مجدد (تا ۳ بار)",
        "در صورت رد ۳ بار: مجلس مؤسسان کاملاً جدید باید انتخاب شود",
        "باید تمام ۷ اصل تغییرناپذیر را در خود جای دهد",
      ],
    },
    s2parliament: {
      title: "پارلمان (مجلس)",
      items: ["کاملاً توسط شهروندان انتخاب می‌شود — بدون عضو انتصابی", "قوانین را تصویب و بودجه ملی را تأیید می‌کند", "دولت منتخب را تأیید می‌کند (رأی اعتماد)", "کاملاً دموکراتیک، انتخابات دوره‌ای"],
    },
    s2govt: {
      title: "دولت",
      items: ["نخست‌وزیر یا رئیس‌جمهور طبق قانون اساسی جدید", "پادشاهی پارلمانی / جمهوری پارلمانی / جمهوری ریاستی", "پاسخگو در برابر پارلمان و قانون اساسی"],
    },
    s2jud: {
      title: "قوه قضاییه مستقل",
      items: ["دیوان عالی کشور + دادگاه‌های پایین‌تر", "کاملاً مستقل از قوه مجریه", "عمل می‌کند تحت قانون اساسی جدید"],
    },

    dissolution: "در این لحظه: تمام سیستم موقت مرحله اول — از جمله نقش رهبر قیام ملی — کاملاً منحل می‌شود. همه قدرت به نهادهای دائمی منتخب دموکراتیک تحت قانون اساسی جدید منتقل می‌شود. «سیستم موقت منحل تلقی خواهد شد.» — کتاب فاز اضطراری، بند ۲۱",

    source: "منبع: کتاب فاز اضطراری (مارس ۲۰۲۶) · ایران پراسپریتی پروژه / نافدی · ۱۴ کاغذ سفید · IranProsperityProject.org",
  },
};

/* ─────────────────────────────────────────────────────
   Main page component
───────────────────────────────────────────────────── */
export default function TransitionalPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const dir = isRTL ? "rtl" : "ltr";

  const GREEN = "#69d98c", CYAN = "#4fc3f7", AMBER = "#ffd166",
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
            {[
              { label: isRTL ? "۱۴ کاغذ سفید" : "14 White Papers", c: CYAN },
              { label: isRTL ? "فاز اضطراری ۱۸۰ روز" : "Emergency Phase: 180 Days", c: GREEN },
              { label: isRTL ? "۷ اصل تغییرناپذیر" : "7 Immutable Principles", c: PURPLE },
              { label: isRTL ? "۱۳ اصلاح ساختاری" : "13 Structural Reforms", c: AMBER },
              { label: isRTL ? "۱۸–۲۴ ماه" : "18–24 Month Transition", c: ORANGE },
            ].map((b, i) => (
              <span key={i} className="tp-badge" style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}>{b.label}</span>
            ))}
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
          {isRTL ? "→ سه قوه موقت (پس از سقوط رژیم)" : "→ Three Transitional Branches (established after regime fall)"}
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
          label={isRTL ? "اضطراری" : "CONTINGENCY"}
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
            <span className="tp-s2-arrow-label">{isRTL ? "انتخاب می‌کنند" : "elect"} ↙</span>
            <span className="tp-s2-arrow-label">↘ {isRTL ? "رأی می‌دهند" : "vote in"}</span>
          </div>

          {/* CA + Referendum */}
          <div className="tp-s2-dual">
            <div className="tp-s2-node" style={{ borderColor: AMBER }}>
              <div className="tp-s2-node-title" style={{ fontFamily: ff, color: AMBER }}>{d.s2ca.title}</div>
              <div className="tp-s2-node-sub">{d.s2ca.sub}</div>
              <Accordion title={isRTL ? "جزئیات" : "Details"} color={AMBER}>
                <Bullets items={d.s2ca.items} color={AMBER} />
              </Accordion>
            </div>
            <div className="tp-s2-node" style={{ borderColor: AMBER }}>
              <div className="tp-s2-node-title" style={{ fontFamily: ff, color: AMBER }}>{d.s2ref.title}</div>
              <div className="tp-s2-node-sub">{d.s2ref.sub}</div>
              <Accordion title={isRTL ? "جزئیات" : "Details"} color={AMBER}>
                <Bullets items={d.s2ref.items} color={AMBER} />
              </Accordion>
            </div>
          </div>

          <div className="tp-s2-down">↓</div>

          {/* New Constitution */}
          <div className="tp-s2-const">
            <div className="tp-s2-const-title" style={{ fontFamily: ff }}>📜 {d.s2const.title}</div>
            <div className="tp-s2-const-sub">{d.s2const.sub}</div>
            <Accordion title={isRTL ? "جزئیات" : "Details"} color={VIOLET}>
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
            {isRTL ? '← بازگشت به آرنا' : 'Enter Transition Arena →'}
          </Link>
          <Link to="/destination" className="tp-nav-btn tp-nav-btn--secondary">
            {isRTL ? '→ قانون اساسی دائمی (مرحله دوم)' : 'Phase II: Permanent Constitution →'}
          </Link>
          <Link to="/choose" className="tp-nav-btn tp-nav-btn--secondary">
            {isRTL ? '← بازگشت به انتخاب مسیر' : '← Back to Choose Your Path'}
          </Link>
        </div>

      </div>
    </div>
  );
}
