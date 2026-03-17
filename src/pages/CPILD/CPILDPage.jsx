import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./CPILDPage.css";

// ── Accent ──────────────────────────────────────────────────────────────────
const ACCENT = "#d97706";

// ── Particle Grid ────────────────────────────────────────────────────────────
function ParticleGrid({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 60;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(217,119,6,0.5)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(217,119,6,${0.1 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
  return null;
}

// ── Section Header ───────────────────────────────────────────────────────────
function SecHead({ label, title, accent = ACCENT }) {
  return (
    <div className="cpild-sechead">
      <span
        className="cpild-sechead-label"
        style={{ color: accent, borderColor: `${accent}40` }}
      >
        {label}
      </span>
      <h2 className="cpild-sechead-title">{title}</h2>
      <div
        className="cpild-sechead-line"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items, accent = ACCENT }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="cpild-accordion">
      {items.map((item, i) => (
        <div
          key={i}
          className={`cpild-acc-item${open === i ? " cpild-acc-open" : ""}`}
          style={{ "--c": accent }}
        >
          <button
            className="cpild-acc-head"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="cpild-acc-icon">{item.icon}</span>
            <span className="cpild-acc-label">{item.title}</span>
            <span className="cpild-acc-chevron">{open === i ? "▲" : "▼"}</span>
          </button>
          {open === i && (
            <div className="cpild-acc-body">
              {item.items.map((pt, k) => (
                <div key={k} className="cpild-acc-point">
                  <span className="cpild-acc-point-head" style={{ color: accent }}>
                    {pt.head}
                  </span>{" "}
                  {pt.body}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const DATA = {
  en: {
    heroEyebrow: "Transitional Plan · Constitutionalist Party of Iran (Liberal Democrat)",
    heroTitle: "CPI-LD",
    heroSubtitle: "Constitutionalist Party of Iran (Liberal Democrat) · Est. 1994",
    heroDesc:
      "Founded in 1994 by exiled supporters of the former Pahlavi dynasty—most notably former Minister of Information Dariush Homayoon—the CPI-LD is a sophisticated political architecture in exile. It couples the historic legitimacy of the Persian constitutional monarchy with the technocratic rigor of the Iran Prosperity Project's 180-day Emergency Phase blueprint, engineered as a complete state operating system waiting to be installed the moment the Islamic Republic collapses.",
    heroBadges: [
      { label: "Constitutional Monarchy", c: ACCENT },
      { label: "Liberal Democracy", c: "#f59e0b" },
      { label: "Iran Prosperity Project", c: "#60a5fa" },
      { label: "Secular State", c: "#34d399" },
      { label: "Free Market", c: "#f472b6" },
      { label: "Centralized Nationalism", c: "#a78bfa" },
    ],

    // ── Ideology ──
    ideologyLabel: "IDEOLOGICAL FOUNDATION",
    ideologyTitle: "Constitutional Monarchism, Secular Liberalism & the 1906 Restoration",
    ideologyBody:
      "The CPI-LD operates on a strict teleological imperative: the absolute dismantling of the Islamic Republic and its replacement with a modernized iteration of the 1906 Persian Constitutional Revolution framework, updated with contemporary liberal democratic institutionalism. The ideological engine is a synthesis of Iranian civic nationalism, Pahlavi royalism, and secular liberalism—designed not merely to overthrow a government, but to fundamentally reverse the 1979 Islamic Revolution, which the party views as a catastrophic deviation from Iran's natural historical trajectory of modernization. Rooted in the philosophies of founder Dariush Homayoon, the CPI-LD argues that while the autocratic excesses of the Pahlavi era warranted critique, the baseline trajectory of Pahlavi modernization was historically correct and necessary.",
    ideologyEvolution:
      "The monarchy envisioned by the CPI-LD is explicitly non-executive. Crown Prince Reza Pahlavi is positioned as the unifying node of the state—a neutral arbiter and vessel of historical continuity designed to mitigate extreme partisan factionalism and preserve territorial integrity across a highly diverse nation. The causal logic is precise: by installing a non-partisan head of state, the legislative and executive branches are insulated from ideological extremism. Drawing explicit parallels to South Africa's apartheid transition, the CPI-LD views political secularism as the essential mechanism required to dismantle the Islamically sanctioned gender and religious apartheid of the Vilayat-e Faqih. This liberal institutionalism extends to equal rights for men and women, economic freedom, and the absolute protection of individual human personality against state coercion.",
    ideologyPillars: [
      {
        icon: "👑",
        head: "Constitutional Monarchism",
        body: "The sovereign acts as ceremonial head of state with no unilateral executive vetoes and no direction of government policy. Functions as a unifying national symbol, diplomatic figurehead, and neutral arbiter above partisan politics—akin to Western European constitutional monarchies.",
      },
      {
        icon: "⚖",
        head: "Secular Liberal Institutionalism",
        body: "Complete separation of religious institutions from legislative and executive functions. In a religiously and ethnically diverse society, secular constitution is the only viable method to guarantee the Universal Declaration of Human Rights, ensure political pluralism, and mandate equality before the law.",
      },
      {
        icon: "🏴",
        head: "Centralized Civic Nationalism",
        body: "A unified Iranian civic nationalism that prioritizes the cohesion of the nation-state over ethnic, linguistic, or sectarian sub-identities. Centralized state authority and the Persian language are viewed as the primary bulwark against the Balkanization of the Iranian plateau.",
      },
      {
        icon: "📈",
        head: "Free-Market Liberal Economics",
        body: "Informed by classical liberal economic theory (with Chicago School influence). Systematic dismantling of IRGC and bonyad monopolies. Transparent privatization, central bank independence, FATF compliance, and SWIFT re-entry to attract massive Foreign Direct Investment.",
      },
    ],

    // ── Methodology ──
    methodLabel: "TRANSITION METHODOLOGY",
    methodTitle: "The Emergency Phase: A 180-Day State Operating System",
    methodBody:
      "The CPI-LD's methodology is highly procedural, aligning tightly with the Iran Prosperity Project (IPP)—championed by Reza Pahlavi and developed by NUFDI. Rather than relying on unstructured revolutionary fervor, the party deploys a phased blueprint intended to manage the immediate aftermath of regime collapse, preventing the state failure and power vacuums that typically destroy post-revolutionary environments. The displacement strategy targets the regime's security apparatus by driving a psychological and political wedge between the ideological IRGC and the traditional Artesh—while internationally lobbying for the IRGC's proscription as a terrorist organization to sever its financial networks.",
    phases: [
      {
        phase: "Phase 1",
        name: "Displacement & Destabilization",
        desc: "Widespread civilian protests and economic paralysis via strikes erode domestic control. Simultaneously: aggressive diplomatic lobbying to proscribe the IRGC as a foreign terrorist organization, severing financial networks. Strategic co-optation of the Artesh by offering amnesty and professional respect, inducing defection.",
        color: ACCENT,
      },
      {
        phase: "Phase 2",
        name: "Regime Collapse",
        desc: "The Artesh refuses to fire on protesters and protects the public from IRGC reprisals, accelerating regime collapse. The IRGC's economic empire is starved of capital. The transitional governance architecture activates immediately.",
        color: "#f59e0b",
      },
      {
        phase: "Phase 3",
        name: "Emergency Phase (Days 1–180)",
        desc: "Activation of the 15-chapter IPP blueprint. Tripartite transitional governance: Transitional Mehestan (legislature) + Transitional Government (technocratic cabinet) + Transitional Divan (secular judiciary). Priority: secure borders, maintain utilities, stabilize macroeconomy, disarm rogue paramilitary factions.",
        color: "#60a5fa",
      },
      {
        phase: "Phase 4",
        name: "System Referendum",
        desc: "A national referendum explicitly offering the choice between a secular republic or a parliamentary constitutional monarchy. Democratic consent is established before any permanent institutions are created. Mathematical thresholds for referendum validation are not specified in official texts.",
        color: "#34d399",
      },
      {
        phase: "Phase 5",
        name: "Constituent Assembly",
        desc: "The populace elects a Constituent Assembly tasked exclusively with drafting a new, secular constitution reflecting the chosen system of government. Prioritizes legal scholars and representatives across Iran's ideological and geographic diversity.",
        color: "#a78bfa",
      },
      {
        phase: "Phase 6",
        name: "Ratification & Permanent Elections",
        desc: "The new constitution is submitted to the public for ratification via a second national referendum. Nationwide elections under the new constitution populate the permanent parliament. Transitional bodies dissolve immediately. The Emergency Phase formally ends.",
        color: "#f472b6",
      },
    ],

    // ── Power Structure ──
    powerLabel: "PROPOSED POWER ARCHITECTURE",
    powerTitle: "Dual-Phase: Transitional Tripartite → Constitutional Monarchy",
    powerBody:
      "The CPI-LD org chart is bifurcated into two distinct chronological eras—the Transitional System (the 180-day Emergency Phase) and the Permanent System (post-constitutional ratification). This dual architecture ensures the separation of powers is maintained even during periods of extreme national vulnerability, actively preventing the emergence of a transitional dictatorship.",

    transitionalNodes: [
      {
        icon: "🏛",
        title: "Transitional Mehestan",
        sub: "Emergency Legislature",
        body: "Represents a diverse coalition adhering to four non-negotiable principles: territorial integrity, secular democracy, individual human rights, and the right to freely choose the system of government. Provides legislative oversight over the executive and drafts emergency stabilization laws.",
      },
      {
        icon: "🎯",
        title: "Transitional Government",
        sub: "Technocratic Cabinet",
        body: "Populated by technical experts tasked with executing IPP crisis management protocols. Manages the state bureaucracy, ensures essential service continuity, implements monetary stabilization, and assumes command over armed forces to disarm rogue paramilitary factions.",
      },
      {
        icon: "⚡",
        title: "Transitional Divan",
        sub: "Emergency Judiciary",
        body: "An independent, secular judicial body maintaining rule of law during the emergency phase. Initiates preliminary transitional justice protocols based on international legal norms, replacing the deeply compromised Islamic Republic court system.",
      },
    ],

    permanentNodes: [
      {
        icon: "👑",
        title: "Sovereign (Constitutional Monarch)",
        sub: "Head of State",
        body: "Ceremonial, strictly constrained by the constitution. No unilateral executive vetoes. No direction of policy. Functions as a unifying national symbol, diplomatic figurehead, and neutral arbiter. Monarch's emergency powers over parliament dissolution are not specified in official texts.",
      },
      {
        icon: "🏛",
        title: "National Mehestan",
        sub: "Supreme Legislature",
        body: "Populated through free, multi-party elections representing ideological and geographic diversity. Responsible for all permanent legislation, budget approval, and ratification of international treaties. Whether unicameral or bicameral is not specified in official texts.",
      },
      {
        icon: "🎯",
        title: "Prime Minister & Cabinet",
        sub: "Head of Government",
        body: "Selected based on ability to command a parliamentary majority. Subject to rigorous oversight including votes of no confidence. Represents the Head of Government; state administration, macroeconomic execution, and defense are vested here.",
      },
      {
        icon: "⚡",
        title: "Independent Supreme Court",
        sub: "Permanent Judiciary",
        body: "Secular legal arbitration, constitutional review, and oversight of the justice system. Fully independent from both executive and legislative branches. Stripped entirely of Sharia law and clerical jurisdiction.",
      },
    ],

    // ── Targets ──
    targetsLabel: "INSTITUTIONAL TARGETS",
    targetsTitle: "Proscription, Co-optation, and Dismantlement",
    targetsBody:
      "The CPI-LD treats the Islamic Republic's bifurcated military with diametrically opposed strategies. The IRGC and its ideological apparatus are slated for total eradication—beginning with international financial proscription before collapse, and ending with judicial prosecution of the command tier after it. The Artesh is the inverse: actively courted, offered amnesty, and positioned to become the indispensable institution of the new state.",
    targets: [
      {
        name: "IRGC Command & Quds Force",
        policy: "COMPLETE DISMANTLING",
        detail:
          "Primary institutional vector of regime survival. Pre-collapse: international lobbying to proscribe as a foreign terrorist organization, asphyxiating the Khatam al-Anbiya economic empire. Post-collapse: judicial prosecution of upper command under international transitional justice mechanisms. Unit cohesion shattered to prevent a post-collapse insurgency.",
        color: "#ef4444",
        tag: "ERADICATE",
      },
      {
        name: "Artesh (Regular Military)",
        policy: "STRATEGIC CO-OPTATION",
        detail:
          "Historically marginalized by the clerical establishment. CPI-LD exploits the institutional IRGC–Artesh rivalry by offering amnesty, professional respect, and elevated post-transition status to induce defections. Post-transition: reconstituted as the sole, unified, apolitical national defense force under strict civilian democratic control.",
        color: "#34d399",
        tag: "CO-OPT & RETAIN",
      },
      {
        name: "Basij Militia",
        policy: "DISBANDMENT",
        detail:
          "Leadership tier targeted for prosecution and decapitation to shatter organizational cohesion. Lower-level conscripts—recognized as having been forced into service—are reintegrated into civilian life to prevent widespread disenfranchisement and counter-revolutionary insurgency. The exact logistical framework for safely discharging ~90,000 Basij personnel is not specified in official texts.",
        color: "#f59e0b",
        tag: "DISBAND",
      },
      {
        name: "Bonyads (Religious Foundations)",
        policy: "DISMANTLED & PRIVATIZED",
        detail:
          "Critiqued as pseudo-privatization enterprises that transferred public assets to regime elites and IRGC holding companies. Orderly and legally transparent transfer to the genuine private sector. Fosters competitive markets and attracts Foreign Direct Investment.",
        color: "#f59e0b",
        tag: "PRIVATIZE",
      },
      {
        name: "Islamic Republic Judiciary",
        policy: "COMPLETELY REPLACED",
        detail:
          "Deeply compromised by ideological Sharia law and political corruption. Replaced immediately by the Transitional Divan during the Emergency Phase, transitioning to an Independent Supreme Court in the permanent architecture. All clerical jurisdiction and revolutionary courts eradicated.",
        color: "#ef4444",
        tag: "ERADICATE",
      },
      {
        name: "Civilian Ministries & Bureaucracy",
        policy: "PURGED & RETAINED",
        detail:
          "Retained for functional continuity during the Emergency Phase—collapsing state capacity would be catastrophic. Purged of ideological appointees. Restructured around technical competence and meritocracy. The exact lustration law criteria for vetting the civil service without collapsing its capacity are not specified in official texts.",
        color: "#60a5fa",
        tag: "REFORM",
      },
    ],

    // ── Policies ──
    policyLabel: "KEY POLICY STANCES",
    policyTitle: "The Post-Theocratic Policy Matrix",
    policies: [
      {
        icon: "📈",
        title: "Economy: From IRGC State-Capitalism to Free-Market Liberalism",
        items: [
          {
            head: "Immediate Stabilization:",
            body: "Rapid restructuring of the banking sector with highly transparent fiscal policies. Restoration of absolute central bank independence to halt hyperinflation and currency devaluation that has decimated the Iranian middle class.",
          },
          {
            head: "Transparent Privatization:",
            body: "Orderly legal transfer of state-owned enterprises to the genuine private sector—explicitly critiquing prior \"pseudo-privatization\" under Rafsanjani and Khatami as mere asset-transfers to regime-affiliated elites and IRGC holding companies.",
          },
          {
            head: "Global Market Reintegration:",
            body: "Rapid harmonization with international regulatory standards: full FATF compliance and re-entry into the global SWIFT system. Designed to attract massive Foreign Direct Investment and end decades of crippling economic isolation.",
          },
          {
            head: "Environmental Reclamation:",
            body: "Urgent policy interventions for environmental recovery and water management, addressing severe ecological degradation—drought, water-table depletion, and extreme pollution—caused by decades of regime mismanagement.",
          },
        ],
      },
      {
        icon: "🗺",
        title: "Minorities & Geography: Centralized Civic Equality vs. Ethno-Federalism",
        items: [
          {
            head: "Resolute Anti-Federalism:",
            body: "An uncompromising stance against ethno-federalism, viewing devolution of sovereign power along ethnic lines as a direct precursor to the Balkanization and eventual collapse of the Iranian nation-state—placing the CPI-LD in direct structural opposition to Kurdish parties like PDKI and Komala.",
          },
          {
            head: "Centralized Civic Nationalism:",
            body: "Minority integration relies entirely on centralized civic nationalism—equal civil and human rights for all individuals regardless of ethnicity, rather than group-based territorial rights. No ethnic group receives sovereign administrative autonomy.",
          },
          {
            head: "Language Policy:",
            body: "Persian strictly maintained as the sole official and unifying national language for administrative, educational, and cultural cohesion. Mother-tongue instruction for non-Persian populations is permitted as a supplementary cultural right—not a substitute for national integration.",
          },
          {
            head: "Decentralization Limits:",
            body: "The exact degree of administrative decentralization permitted beneath central government authority (specific taxation or zoning powers for local councils) is not specified in official texts.",
          },
        ],
      },
      {
        icon: "⚖",
        title: "Transitional Justice: Legalism Over Retribution",
        items: [
          {
            head: "No Political Vengeance:",
            body: "Secretary-General Fouad Pashaei explicitly mandates the transition must not turn into bloodshed or political revenge. Justice must be based strictly on global legal norms, breaking the historical cycle of violent retribution that characterized 1979.",
          },
          {
            head: "Strategic Amnesty Logic:",
            body: "Granting amnesty to lower-level state employees and non-violent actors prevents a desperate, counter-revolutionary insurgency driven by existential fear. It also establishes the supremacy of the rule of law and legitimizes the new state internationally.",
          },
          {
            head: "International Prosecution:",
            body: "Top-tier regime officials responsible for crimes against humanity, gross human rights violations, and systemic corruption are to be prosecuted utilizing international legal standards, potentially in collaboration with international tribunals.",
          },
          {
            head: "Lustration Gap:",
            body: "The exact mechanism for vetting and purging the vast civil service without collapsing its bureaucratic capacity—so-called lustration laws—are not specified in official texts.",
          },
        ],
      },
      {
        icon: "🌐",
        title: "Foreign Policy: Total Pro-Western Realignment",
        items: [
          {
            head: "Eradication of the Axis of Resistance:",
            body: "Immediate and absolute cessation of all financial, military, and logistical support to proxy militias across the Middle East—Hezbollah, Hamas, the Houthis, and Iraqi militias. Vast state capital redirected back into the domestic economy.",
          },
          {
            head: "Normalization with Israel:",
            body: "Restoration of full diplomatic relations with the State of Israel is a paramount strategic priority, explicitly abandoning the Islamic Republic's ideological anti-Zionism to foster regional economic and security integration.",
          },
          {
            head: "Western Strategic Partnership:",
            body: "Active re-establishment of robust strategic partnerships with the United States and European allies. Iran positioned as a stabilizing anchor in the Middle East—a cooperative, status-quo power firmly aligned with the global liberal democratic order.",
          },
          {
            head: "Hard Break from \"Look East\":",
            body: "Complete reversal of the Islamic Republic's strategic pivot toward Russia and China. The CPI-LD's architecture orients Iran toward the transatlantic liberal order as its primary strategic, economic, and security framework.",
          },
        ],
      },
    ],

    // ── Geopolitics ──
    geoLabel: "GEOPOLITICAL IMPLICATIONS",
    geoTitle: "From Revisionist Hegemon to Liberal-Order Anchor",
    geoBody:
      "A CPI-LD-governed Iran would constitute the most dramatic single-nation realignment in the post-Cold War Middle East. The simultaneous collapse of the Axis of Resistance proxy infrastructure and the normalization of relations with both the United States and Israel would immediately restructure the region's security architecture—eliminating the primary driver of the Israeli–Palestinian conflict's regional escalation, defunding Hezbollah's state-within-a-state in Lebanon, and collapsing Houthi military logistics in Yemen. The reintegration of Iran's economy into global capital markets via SWIFT and FATF compliance would unleash one of the world's most resource-rich and educated nations as a new engine of regional investment and trade. However, the CPI-LD's centralized nationalism model will create sustained structural friction with Kurdish, Baloch, and Azerbaijani minority factions, whose federalist demands are irreconcilable with the party's civic-unity framework—a domestic fault line that foreign adversaries could exploit to destabilize the transition.",

    // ── Conclusion ──
    conclusionLabel: "STRATEGIC ASSESSMENT",
    conclusionQuote:
      '"The CPI-LD functions not as a traditional political party, but as a fully articulated state operating system in exile—a complete governmental architecture explicitly engineered to be downloaded into the Iranian state apparatus the moment the Islamic Republic experiences catastrophic systemic failure, at the cost of a structurally unresolved tension between its centralized civic nationalism and the federalist aspirations of Iran\'s deeply heterogeneous periphery."',
  },

  fa: {
    heroEyebrow: "طرح انتقالی · حزب مشروطه ایران (لیبرال دموکرات)",
    heroTitle: "حزب مشروطه ایران (ل.د)",
    heroSubtitle: "حزب مشروطه ایران (لیبرال دموکرات) · بنیان‌گذاری ۱۳۷۳",
    heroDesc:
      "حزب مشروطه ایران (لیبرال دموکرات) در سال ۱۳۷۳ توسط حامیان تبعیدی سلسله پهلوی—به‌ویژه داریوش همایون، وزیر اطلاعات پیشین—بنیانگذاری شد. این حزب یک معماری سیاسی پیچیده در تبعید است که مشروعیت تاریخی مشروطه‌خواهی پارسی را با دقت تکنوکراتیک طرح ۱۸۰ روزه «مرحله اضطراری» پروژه رونق ایران (IPP) پیوند می‌زند—سیستمی عملیاتی کامل در انتظار نصب در لحظه‌ای که جمهوری اسلامی از هم می‌پاشد.",
    heroBadges: [
      { label: "پادشاهی مشروطه", c: ACCENT },
      { label: "لیبرال دموکراسی", c: "#f59e0b" },
      { label: "پروژه رونق ایران", c: "#60a5fa" },
      { label: "دولت سکولار", c: "#34d399" },
      { label: "اقتصاد بازار آزاد", c: "#f472b6" },
      { label: "ناسیونالیسم متمرکز", c: "#a78bfa" },
    ],

    // ── Ideology ──
    ideologyLabel: "پایه‌های ایدئولوژیک",
    ideologyTitle: "مشروطه‌خواهی، لیبرالیسم سکولار و بازگشت به ۱۲۸۵",
    ideologyBody:
      "حزب مشروطه ایران (ل.د) بر یک امر مطلق‌گرایانه عمل می‌کند: انحلال کامل جمهوری اسلامی ایران و جایگزینی آن با نسخه‌ای نوسازی‌شده از چارچوب انقلاب مشروطه ۱۲۸۵، به‌روزرسانی‌شده با نهادگرایی دموکراتیک لیبرال معاصر. موتور ایدئولوژیک این حزب ترکیبی از ناسیونالیسم مدنی ایرانی، پهلوی‌گرایی سلطنتی و لیبرالیسم سکولار است—طراحی‌شده نه‌تنها برای سرنگونی یک دولت، بلکه برای معکوس کردن بنیادی انقلاب اسلامی ۱۳۵۷، که حزب آن را یک انحراف فاجعه‌بار از مسیر طبیعی تاریخی مدرن‌سازی ایران می‌داند.",
    ideologyEvolution:
      "سلطنت مورد نظر حزب مشروطه (ل.د) صریحاً غیراجرایی است. ولیعهد رضا پهلوی به‌عنوان گره‌ای وحدت‌بخش در دولت قرار می‌گیرد—یک داور بی‌طرف و ظرف تداوم تاریخی طراحی‌شده برای کاهش فصل‌بندی حزبی افراطی و حفظ تمامیت ارضی یک کشور بسیار متنوع. این ساختار موازی‌هایی با گذار آفریقای جنوبی از آپارتاید دارد: سکولاریسم سیاسی به‌عنوان مکانیسم اساسی مورد نیاز برای انحلال آپارتاید جنسیتی و دینی مبتنی بر اسلام دیده می‌شود که توسط نظام ولایت فقیه اجرا می‌شود.",
    ideologyPillars: [
      {
        icon: "👑",
        head: "پادشاهی مشروطه",
        body: "پادشاه به‌عنوان رئیس کشور تشریفاتی بدون هیچ حق وتوی اجرایی یک‌جانبه و بدون هدایت سیاست دولتی عمل می‌کند. یک نماد ملی وحدت‌بخش، نماینده دیپلماتیک و داور بی‌طرف فراتر از سیاست حزبی—مشابه پادشاهی‌های مشروطه اروپای غربی.",
      },
      {
        icon: "⚖",
        head: "نهادگرایی لیبرال سکولار",
        body: "جدایی کامل نهادهای دینی از وظایف قانونگذاری و اجرایی. در جامعه‌ای متنوع از نظر دینی و قومی، قانون اساسی سکولار تنها روش عملی برای تضمین اعلامیه جهانی حقوق بشر، تضمین پلورالیسم سیاسی و الزام برابری در برابر قانون است.",
      },
      {
        icon: "🏴",
        head: "ناسیونالیسم مدنی متمرکز",
        body: "ناسیونالیسم مدنی ایرانی یکپارچه‌ای که اولویت را به انسجام دولت-ملت می‌دهد به جای هویت‌های فرعی قومی، زبانی یا فرقه‌ای. اقتدار دولتی متمرکز و زبان فارسی به‌عنوان اصلی‌ترین سد دفاعی در برابر تجزیه فلات ایران دیده می‌شوند.",
      },
      {
        icon: "📈",
        head: "اقتصاد لیبرال بازار آزاد",
        body: "متأثر از نظریه اقتصادی کلاسیک لیبرال (با تأثیر مکتب شیکاگو). انحلال سیستماتیک انحصارات سپاه و بنیادها. خصوصی‌سازی شفاف، استقلال بانک مرکزی، رعایت FATF و بازگشت به SWIFT برای جذب سرمایه‌گذاری مستقیم خارجی عظیم.",
      },
    ],

    // ── Methodology ──
    methodLabel: "روش‌شناسی انتقال",
    methodTitle: "مرحله اضطراری: یک سیستم عملیاتی دولتی ۱۸۰ روزه",
    methodBody:
      "روش‌شناسی حزب مشروطه (ل.د) بسیار رویه‌محور است و با پروژه رونق ایران (IPP)—که رضا پهلوی آن را حمایت می‌کند و NUFDI توسعه داده—همسویی تنگاتنگی دارد. به جای اتکا به شور انقلابی بی‌ساختار، حزب یک طرح مرحله‌ای را برای مدیریت پیامدهای فوری فروپاشی رژیم مستقر می‌کند و از شکست دولت و خلاء قدرتی که معمولاً محیط‌های پس از انقلاب را ویران می‌کند جلوگیری می‌نماید.",
    phases: [
      {
        phase: "مرحله ۱",
        name: "بی‌ثبات‌سازی و جابجایی",
        desc: "اعتراضات گسترده غیرنظامی و فلج اقتصادی از طریق اعتصابات، کنترل داخلی را فرسایش می‌دهد. همزمان: لابیگری دیپلماتیک برای ممنوعیت سپاه به‌عنوان سازمان تروریستی خارجی. جذب استراتژیک ارتش با ارائه عفو و احترام حرفه‌ای.",
        color: ACCENT,
      },
      {
        phase: "مرحله ۲",
        name: "فروپاشی رژیم",
        desc: "ارتش از تیراندازی به معترضان خودداری می‌کند و آنها را از انتقام‌جویی سپاه محافظت می‌نماید. امپراتوری اقتصادی سپاه از سرمایه محروم می‌شود. معماری حاکمیت انتقالی بلافاصله فعال می‌شود.",
        color: "#f59e0b",
      },
      {
        phase: "مرحله ۳",
        name: "مرحله اضطراری (روز ۱ تا ۱۸۰)",
        desc: "فعال‌سازی طرح ۱۵ فصلی IPP. حاکمیت انتقالی سه‌گانه: مهستان انتقالی (قوه مقننه) + دولت انتقالی (کابینه تکنوکراتیک) + دیوان انتقالی (دادگستری سکولار). اولویت: ایمن‌سازی مرزها، حفظ خدمات ضروری، تثبیت اقتصاد کلان، خلع سلاح گروه‌های شبه‌نظامی سرکش.",
        color: "#60a5fa",
      },
      {
        phase: "مرحله ۴",
        name: "همه‌پرسی نظام",
        desc: "یک همه‌پرسی ملی که انتخاب صریحی بین جمهوری سکولار یا پادشاهی مشروطه پارلمانی ارائه می‌دهد. رضایت دموکراتیک قبل از ایجاد هرگونه نهاد دائمی احراز می‌شود.",
        color: "#34d399",
      },
      {
        phase: "مرحله ۵",
        name: "مجلس مؤسسان",
        desc: "مردم یک مجلس مؤسسان انتخاب می‌کنند که منحصراً مسئول تدوین قانون اساسی سکولار جدیدی است که نظام حکومتی انتخاب‌شده را منعکس کند.",
        color: "#a78bfa",
      },
      {
        phase: "مرحله ۶",
        name: "تصویب و انتخابات دائمی",
        desc: "قانون اساسی جدید از طریق یک همه‌پرسی ملی دوم به تصویب می‌رسد. انتخابات سراسری تحت قانون اساسی جدید مجلس دائمی را شکل می‌دهد. نهادهای انتقالی بلافاصله منحل می‌شوند.",
        color: "#f472b6",
      },
    ],

    // ── Power Structure ──
    powerLabel: "معماری قدرت پیشنهادی",
    powerTitle: "دو مرحله: سه‌گانه انتقالی ← پادشاهی مشروطه دائمی",
    powerBody:
      "نمودار سازمانی حزب مشروطه (ل.د) به دو دوره زمانی متمایز تقسیم می‌شود: سیستم انتقالی (مرحله اضطراری ۱۸۰ روزه) و سیستم دائمی (پس از تصویب قانون اساسی). این معماری دوگانه به‌طور خاص طراحی شده تا از پیدایش یک دیکتاتوری انتقالی جدید جلوگیری کند.",

    transitionalNodes: [
      {
        icon: "🏛",
        title: "مهستان انتقالی",
        sub: "مجلس اضطراری",
        body: "نماینده ائتلافی متنوع است که به چهار اصل غیرقابل مذاکره پایبند است: تمامیت ارضی، دموکراسی سکولار، حقوق فردی بشر، و حق انتخاب آزادانه نظام حکومتی. نظارت قانونگذاری بر قوه مجریه و تهیه قوانین تثبیت اضطراری.",
      },
      {
        icon: "🎯",
        title: "دولت انتقالی",
        sub: "کابینه تکنوکراتیک",
        body: "از کارشناسان فنی تشکیل شده که مأمور اجرای پروتکل‌های مدیریت بحران IPP هستند. بوروکراسی دولتی را مدیریت می‌کند، تداوم خدمات ضروری را تضمین می‌کند، تثبیت پولی را اجرا می‌کند و فرماندهی نیروهای مسلح را برای خلع سلاح گروه‌های شبه‌نظامی سرکش به عهده می‌گیرد.",
      },
      {
        icon: "⚡",
        title: "دیوان انتقالی",
        sub: "دادگستری اضطراری",
        body: "یک نهاد قضایی مستقل و سکولار که حاکمیت قانون را در مرحله اضطراری حفظ می‌کند. پروتکل‌های اولیه عدالت انتقالی مبتنی بر هنجارهای حقوقی بین‌المللی را آغاز می‌کند و جایگزین دستگاه قضایی به‌شدت مصون جمهوری اسلامی می‌شود.",
      },
    ],

    permanentNodes: [
      {
        icon: "👑",
        title: "پادشاه (مشروطه)",
        sub: "رئیس کشور",
        body: "تشریفاتی، محدود کاملاً توسط قانون اساسی. هیچ حق وتوی اجرایی یک‌جانبه. هیچ هدایت سیاستی. نماد ملی وحدت، نماینده دیپلماتیک و داور بی‌طرف. اختیارات اضطراری پادشاه برای انحلال مجلس در متون رسمی مشخص نشده است.",
      },
      {
        icon: "🏛",
        title: "مجلس ملی (مهستان)",
        sub: "مجلس عالی",
        body: "از طریق انتخابات آزاد چندحزبی تشکیل می‌شود که تنوع ایدئولوژیک و جغرافیایی را نمایندگی می‌کند. مسئول تمام قانونگذاری دائمی، تصویب بودجه و تصویب معاهدات بین‌المللی. یک‌اتاقی یا دواتاقی بودن در متون رسمی مشخص نشده است.",
      },
      {
        icon: "🎯",
        title: "نخست‌وزیر و کابینه",
        sub: "رئیس دولت",
        body: "بر اساس توانایی فرماندهی اکثریت پارلمانی انتخاب می‌شود. مشمول نظارت دقیق از جمله رأی عدم اعتماد. اداره دولت، اجرای اقتصاد کلان و دفاع در اینجا متمرکز است.",
      },
      {
        icon: "⚡",
        title: "دیوان عالی مستقل",
        sub: "قوه قضائیه دائمی",
        body: "داوری حقوقی سکولار، بررسی قانون اساسی و نظارت بر دستگاه قضایی. کاملاً مستقل از هر دو شاخه اجرایی و قانونگذاری. فقه اسلامی و صلاحیت روحانی کاملاً ریشه‌کن می‌شوند.",
      },
    ],

    // ── Targets ──
    targetsLabel: "اهداف نهادی",
    targetsTitle: "ممنوعیت، جذب و انحلال",
    targetsBody:
      "حزب مشروطه (ل.د) نیروهای نظامی دوگانه جمهوری اسلامی را با استراتژی‌های کاملاً متضاد می‌نگرد. سپاه و دستگاه ایدئولوژیک آن برای ریشه‌کنی کامل در نظر گرفته شده‌اند—از ممنوعیت مالی بین‌المللی قبل از فروپاشی شروع می‌شود و با پیگرد قضایی فرماندهی پس از آن تمام می‌شود. ارتش عکس این است: فعالانه جذب می‌شود، عفو داده می‌شود و برای تبدیل شدن به نهاد ناگزیر دولت جدید قرار می‌گیرد.",
    targets: [
      {
        name: "فرماندهی سپاه و نیروی قدس",
        policy: "انحلال کامل",
        detail:
          "اصلی‌ترین بردار نهادی بقای رژیم. قبل از فروپاشی: لابیگری بین‌المللی برای ممنوعیت به‌عنوان سازمان تروریستی خارجی و خفه کردن امپراتوری اقتصادی خاتم‌الانبیاء. پس از فروپاشی: پیگرد قضایی فرماندهی عالی در چارچوب مکانیسم‌های عدالت انتقالی بین‌المللی.",
        color: "#ef4444",
        tag: "ریشه‌کنی",
      },
      {
        name: "ارتش (نیروهای نظامی رسمی)",
        policy: "جذب استراتژیک",
        detail:
          "به‌طور تاریخی توسط روحانیون حاشیه‌نشین شده. حزب مشروطه رقابت نهادی سپاه-ارتش را با ارائه عفو، احترام حرفه‌ای و منزلت ارتقاءیافته پس از انتقال استثمار می‌کند تا فرار گسترده را القا کند. پس از انتقال: به‌عنوان تنها نیروی دفاع ملی متحد و کاملاً غیرسیاسی زیر کنترل دموکراتیک غیرنظامی بازسازی می‌شود.",
        color: "#34d399",
        tag: "جذب و نگه‌داری",
      },
      {
        name: "بسیج",
        policy: "انحلال",
        detail:
          "ردیف رهبری برای پیگرد قضایی هدف قرار می‌گیرد. سربازان رده‌پایین—که به خدمت اجباری گرفته شده‌اند—به زندگی مدنی بازادغام می‌شوند تا از ناخشنودی گسترده و شورش ضدانقلابی جلوگیری شود. چارچوب دقیق لجستیکی برای تسریح ایمن حدود ۹۰٫۰۰۰ پرسنل بسیج در متون رسمی مشخص نشده است.",
        color: "#f59e0b",
        tag: "انحلال",
      },
      {
        name: "بنیادها (بنیادهای اقتصادی مذهبی)",
        policy: "انحلال و خصوصی‌سازی",
        detail:
          "به‌عنوان بنگاه‌های خصوصی‌سازی کاذب نقد می‌شوند که دارایی‌های عمومی را صرفاً به نخبگان وابسته به رژیم و شرکت‌های هلدینگ سپاه منتقل کردند. انتقال مرتب و شفاف از نظر حقوقی به بخش خصوصی واقعی.",
        color: "#f59e0b",
        tag: "خصوصی‌سازی",
      },
      {
        name: "دادگستری جمهوری اسلامی",
        policy: "کاملاً جایگزین می‌شود",
        detail:
          "عمیقاً آلوده به شریعت ایدئولوژیک و فساد سیاسی. بلافاصله توسط دیوان انتقالی در مرحله اضطراری جایگزین می‌شود و به دیوان عالی مستقل در معماری دائمی منتقل می‌شود. تمام صلاحیت روحانی و دادگاه‌های انقلابی ریشه‌کن می‌شوند.",
        color: "#ef4444",
        tag: "ریشه‌کنی",
      },
      {
        name: "وزارتخانه‌ها و بوروکراسی غیرنظامی",
        policy: "پاکسازی و نگه‌داری",
        detail:
          "برای تداوم عملکردی در مرحله اضطراری نگه‌داری می‌شوند—فروپاشی ظرفیت دولتی فاجعه‌بار خواهد بود. از منصوبان ایدئولوژیک پاکسازی می‌شوند. پیرامون شایستگی فنی و شایسته‌سالاری بازسازی می‌شوند. معیارهای قانون تصفیه برای بررسی کارمندان دولت بدون فروپاشی ظرفیت آن در متون رسمی مشخص نشده است.",
        color: "#60a5fa",
        tag: "اصلاح",
      },
    ],

    // ── Policies ──
    policyLabel: "مواضع کلیدی سیاستی",
    policyTitle: "ماتریس سیاستی پس از تئوکراسی",
    policies: [
      {
        icon: "📈",
        title: "اقتصاد: از سرمایه‌داری دولتی سپاه به لیبرالیسم بازار آزاد",
        items: [
          {
            head: "تثبیت فوری:",
            body: "بازسازی سریع بخش بانکی با سیاست‌های مالی بسیار شفاف. احیای استقلال مطلق بانک مرکزی برای توقف ابرتورم و کاهش ارزش پول که طبقه متوسط ایرانی را نابود کرده است.",
          },
          {
            head: "خصوصی‌سازی شفاف:",
            body: "انتقال قانونی و منظم بنگاه‌های دولتی به بخش خصوصی واقعی—با انتقاد صریح از «خصوصی‌سازی کاذب» دوران رفسنجانی و خاتمی که صرفاً دارایی‌ها را به نخبگان وابسته به رژیم و شرکت‌های هلدینگ سپاه منتقل کرد.",
          },
          {
            head: "ادغام مجدد در بازار جهانی:",
            body: "همسوسازی سریع با استانداردهای نظارتی بین‌المللی: رعایت کامل FATF و بازگشت به سیستم جهانی SWIFT. طراحی‌شده برای جذب سرمایه‌گذاری مستقیم خارجی عظیم و پایان دادن به دهه‌ها انزوای اقتصادی فلج‌کننده.",
          },
          {
            head: "بازسازی محیط زیست:",
            body: "مداخلات سیاستی فوری برای احیای محیط زیست و مدیریت آب، رسیدگی به تخریب شدید اکولوژیکی—خشکسالی، کاهش سطح آب‌های زیرزمینی و آلودگی شدید—ناشی از سوءمدیریت دهه‌های رژیم.",
          },
        ],
      },
      {
        icon: "🗺",
        title: "اقلیت‌ها و جغرافیا: برابری مدنی متمرکز در برابر فدرالیسم قومی",
        items: [
          {
            head: "مخالفت قاطعانه با فدرالیسم:",
            body: "موضع بی‌تخفیف علیه فدرالیسم قومی، که انتقال اقتدار حاکمیتی در امتداد خطوط قومی را پیش‌درآمد مستقیم تجزیه و فروپاشی نهایی دولت-ملت ایران می‌داند—حزب را در تضاد ساختاری مستقیم با احزاب کرد مانند PDKI و کوملا قرار می‌دهد.",
          },
          {
            head: "ناسیونالیسم مدنی متمرکز:",
            body: "ادغام اقلیت‌ها کاملاً بر ناسیونالیسم مدنی متمرکز تکیه می‌کند—حقوق مدنی و انسانی برابر برای همه افراد صرف نظر از قومیت، نه حقوق ارضی گروه‌محور. هیچ گروه قومی‌ای استقلال اداری حاکمیتی نمی‌گیرد.",
          },
          {
            head: "سیاست زبانی:",
            body: "فارسی به‌عنوان تنها زبان رسمی و یکپارچه‌ساز ملی برای انسجام اداری، آموزشی و فرهنگی حفظ می‌شود. آموزش به زبان مادری برای جمعیت‌های غیرفارس به‌عنوان یک حق فرهنگی تکمیلی مجاز است.",
          },
          {
            head: "محدودیت‌های عدم تمرکز:",
            body: "درجه دقیق عدم تمرکز اداری مجاز زیر اقتدار دولت مرکزی (اختیارات مالیاتی یا منطقه‌بندی خاص برای شوراهای محلی) در متون رسمی مشخص نشده است.",
          },
        ],
      },
      {
        icon: "⚖",
        title: "عدالت انتقالی: قانون‌گرایی به جای انتقام",
        items: [
          {
            head: "عدم انتقام سیاسی:",
            body: "دبیرکل فواد پاشایی صریحاً تأکید می‌کند که انتقال نباید به خونریزی یا انتقام سیاسی تبدیل شود. عدالت باید کاملاً بر اساس هنجارهای حقوقی جهانی باشد و چرخه تاریخی خشونت انتقامی که ۱۳۵۷ را مشخص کرد بشکند.",
          },
          {
            head: "منطق استراتژیک عفو:",
            body: "اعطای عفو به کارمندان دولت رده‌پایین و بازیگران غیرخشن از شکل‌گیری یک شورش ضدانقلابی مبتنی بر ترس وجودی جلوگیری می‌کند. همچنین برتری حاکمیت قانون را ایجاد می‌کند و دولت جدید را در سطح بین‌المللی مشروعیت می‌بخشد.",
          },
          {
            head: "پیگرد بین‌المللی:",
            body: "مسئولان ارشد رژیم مسئول جنایات علیه بشریت، نقض فاحش حقوق بشر و فساد سیستماتیک با استفاده از استانداردهای حقوقی بین‌المللی، به‌طور بالقوه با همکاری دادگاه‌های بین‌المللی، تحت پیگرد قضایی قرار می‌گیرند.",
          },
          {
            head: "شکاف قانون تصفیه:",
            body: "مکانیسم دقیق بررسی و پاکسازی بوروکراسی گسترده دولتی بدون فروپاشی ظرفیت اداری آن—به اصطلاح قوانین تصفیه—در متون رسمی مشخص نشده است.",
          },
        ],
      },
      {
        icon: "🌐",
        title: "سیاست خارجی: بازتراز کامل طرفداری از غرب",
        items: [
          {
            head: "ریشه‌کنی محور مقاومت:",
            body: "قطع فوری و مطلق تمام حمایت‌های مالی، نظامی و لجستیکی از شبه‌نظامیان نیابتی در سراسر خاورمیانه—حزب‌الله، حماس، حوثی‌ها و شبه‌نظامیان عراقی. سرمایه دولتی عظیم به اقتصاد داخلی بازهدایت می‌شود.",
          },
          {
            head: "عادی‌سازی با اسرائیل:",
            body: "احیای روابط دیپلماتیک کامل با دولت اسرائیل یک اولویت استراتژیک اصلی است، که ضداسرائیلی‌گری ایدئولوژیک جمهوری اسلامی را صریحاً رها می‌کند تا ادغام اقتصادی و امنیتی منطقه‌ای را تقویت کند.",
          },
          {
            head: "مشارکت استراتژیک غربی:",
            body: "احیای فعالانه مشارکت‌های استراتژیک قوی با ایالات متحده و متحدان اروپایی. ایران به‌عنوان لنگر تثبیت‌کننده در خاورمیانه قرار می‌گیرد—یک قدرت وضع موجود مشارکت‌طلب که محکماً با نظم دموکراتیک لیبرال جهانی همسو شده است.",
          },
          {
            head: "قطع کامل از «نگاه به شرق»:",
            body: "معکوس کردن کامل چرخش استراتژیک جمهوری اسلامی به سمت روسیه و چین. معماری حزب مشروطه (ل.د) ایران را به سمت نظم لیبرال آتلانتیکی به‌عنوان چارچوب استراتژیک، اقتصادی و امنیتی اصلی خود هدایت می‌کند.",
          },
        ],
      },
    ],

    // ── Geopolitics ──
    geoLabel: "پیامدهای ژئوپلیتیک",
    geoTitle: "از هژمون تجدیدنظرطلب به لنگر نظم لیبرال",
    geoBody:
      "ایران تحت حکمرانی حزب مشروطه (ل.د) چشمگیرترین بازتراز تک‌ملتی در خاورمیانه پس از جنگ سرد را تشکیل می‌دهد. فروپاشی همزمان زیرساخت نیابتی محور مقاومت و عادی‌سازی روابط با هم ایالات متحده و هم اسرائیل، معماری امنیتی منطقه را فوراً بازسازی می‌کند—اصلی‌ترین محرک تشدید منطقه‌ای تعارض اسرائیلی-فلسطینی را حذف می‌کند، حزب‌الله را در لبنان بی‌پول می‌کند و لجستیک نظامی حوثی‌ها را در یمن منهدم می‌کند. ادغام مجدد اقتصاد ایران در بازارهای سرمایه جهانی از طریق SWIFT و رعایت FATF، یکی از غنی‌ترین کشورهای منابع و باسوادترین ملت‌های جهان را به‌عنوان موتور جدید سرمایه‌گذاری و تجارت منطقه‌ای آزاد خواهد کرد. با این حال، مدل ناسیونالیسم متمرکز حزب اصطکاک ساختاری پایداری با جناح‌های اقلیت کرد، بلوچ و آذربایجانی ایجاد خواهد کرد که خواسته‌های فدرالیستی آنها با چارچوب وحدت مدنی حزب آشتی‌ناپذیر است.",

    // ── Conclusion ──
    conclusionLabel: "ارزیابی استراتژیک",
    conclusionQuote:
      '«حزب مشروطه ایران (ل.د) نه به‌عنوان یک حزب سیاسی سنتی، بلکه به‌عنوان یک سیستم عملیاتی دولتی کاملاً تبیین‌شده در تبعید عمل می‌کند—یک معماری حکومتی کامل که به‌طور صریح مهندسی شده تا در لحظه‌ای که جمهوری اسلامی دچار شکست سیستماتیک فاجعه‌بار می‌شود در دستگاه دولتی ایران نصب شود، به بهای یک تنش ساختاری حل‌نشده بین ناسیونالیسم مدنی متمرکز و آرزوهای فدرالیستی حاشیه بسیار ناهمگون ایران.»',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CPILDPage() {
  const { lang, isRTL, headFont } = useLang();
  const d = DATA[lang] || DATA.en;
  const dir = isRTL ? "rtl" : "ltr";
  const ff = headFont;
  const canvasRef = useRef(null);

  return (
    <div className="cpild-page" dir={dir}>
      <canvas ref={canvasRef} className="cpild-bg-canvas" />
      <ParticleGrid canvasRef={canvasRef} />
      <div className="cpild-scanline" />

      <div className="cpild-inner" style={{ fontFamily: ff }}>

        {/* ── Hero ── */}
        <header className="cpild-hero">
          <p className="cpild-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="cpild-hero-title" style={{ fontFamily: ff }}>
            {d.heroTitle}
          </h1>
          <p className="cpild-hero-subtitle">{d.heroSubtitle}</p>
          <p className="cpild-hero-desc">{d.heroDesc}</p>
          <div className="cpild-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span
                key={i}
                className="cpild-badge"
                style={{ color: b.c, borderColor: `${b.c}35`, background: `${b.c}0e` }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </header>

        {/* ── Ideology ── */}
        <section className="cpild-section">
          <SecHead label={d.ideologyLabel} title={d.ideologyTitle} />
          <p className="cpild-body-text">{d.ideologyBody}</p>
          <p className="cpild-body-text cpild-mt-sm">{d.ideologyEvolution}</p>
          <div className="cpild-pillars">
            {d.ideologyPillars.map((p, i) => (
              <div key={i} className="cpild-pillar">
                <span className="cpild-pillar-icon">{p.icon}</span>
                <h4 className="cpild-pillar-head" style={{ color: ACCENT }}>{p.head}</h4>
                <p className="cpild-pillar-body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Methodology ── */}
        <section className="cpild-section">
          <SecHead label={d.methodLabel} title={d.methodTitle} />
          <p className="cpild-body-text">{d.methodBody}</p>
          <div className="cpild-timeline">
            {d.phases.map((ph, i) => (
              <div key={i} className="cpild-phase">
                <div
                  className="cpild-phase-marker"
                  style={{ borderColor: ph.color, background: `${ph.color}18` }}
                >
                  <span className="cpild-phase-num" style={{ color: ph.color }}>{i + 1}</span>
                </div>
                <div className="cpild-phase-content">
                  <div className="cpild-phase-header">
                    <span
                      className="cpild-phase-tag"
                      style={{ color: ph.color, borderColor: `${ph.color}40` }}
                    >
                      {ph.phase}
                    </span>
                    <h4 className="cpild-phase-name" style={{ color: ph.color }}>{ph.name}</h4>
                  </div>
                  <p className="cpild-phase-desc">{ph.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Power Structure ── */}
        <section className="cpild-section">
          <SecHead label={d.powerLabel} title={d.powerTitle} />
          <p className="cpild-body-text">{d.powerBody}</p>

          <h3 className="cpild-phase-subhead" style={{ color: ACCENT }}>
            {isRTL ? "مرحله انتقالی (۱۸۰ روز)" : "Transitional Phase (180 Days)"}
          </h3>
          <div className="cpild-power-grid cpild-power-grid--three">
            {d.transitionalNodes.map((node, i) => (
              <div key={i} className="cpild-power-node">
                <span className="cpild-power-icon">{node.icon}</span>
                <h4 className="cpild-power-title">{node.title}</h4>
                <span className="cpild-power-sub" style={{ color: ACCENT }}>{node.sub}</span>
                <p className="cpild-power-body">{node.body}</p>
              </div>
            ))}
          </div>

          <h3 className="cpild-phase-subhead cpild-mt-md" style={{ color: "#f59e0b" }}>
            {isRTL ? "مرحله دائمی (پس از تصویب قانون اساسی)" : "Permanent Phase (Post-Ratification)"}
          </h3>
          <div className="cpild-power-grid cpild-power-grid--four">
            {d.permanentNodes.map((node, i) => (
              <div
                key={i}
                className={`cpild-power-node${i === 0 ? " cpild-power-node--crown" : ""}`}
              >
                <span className="cpild-power-icon">{node.icon}</span>
                <h4 className="cpild-power-title">{node.title}</h4>
                <span className="cpild-power-sub" style={{ color: i === 0 ? ACCENT : "#f59e0b" }}>
                  {node.sub}
                </span>
                <p className="cpild-power-body">{node.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Institutional Targets ── */}
        <section className="cpild-section">
          <SecHead label={d.targetsLabel} title={d.targetsTitle} />
          <p className="cpild-body-text">{d.targetsBody}</p>
          <div className="cpild-targets">
            {d.targets.map((t, i) => (
              <div key={i} className="cpild-target" style={{ borderColor: `${t.color}30` }}>
                <div className="cpild-target-header">
                  <h4 className="cpild-target-name">{t.name}</h4>
                  <span
                    className="cpild-target-tag"
                    style={{ color: t.color, borderColor: `${t.color}50`, background: `${t.color}12` }}
                  >
                    {t.tag}
                  </span>
                </div>
                <p className="cpild-target-policy" style={{ color: t.color }}>{t.policy}</p>
                <p className="cpild-target-detail">{t.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Key Policies ── */}
        <section className="cpild-section">
          <SecHead label={d.policyLabel} title={d.policyTitle} />
          <Accordion items={d.policies} accent={ACCENT} />
        </section>

        {/* ── Geopolitics ── */}
        <section className="cpild-section">
          <SecHead label={d.geoLabel} title={d.geoTitle} />
          <p className="cpild-body-text">{d.geoBody}</p>
        </section>

        {/* ── Conclusion ── */}
        <section className="cpild-conclusion">
          <p className="cpild-conclusion-label">{d.conclusionLabel}</p>
          <blockquote className="cpild-conclusion-quote" style={{ fontFamily: ff }}>
            {d.conclusionQuote}
          </blockquote>
          <div
            className="cpild-conclusion-line"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
          />
        </section>

        {/* ── Footer Nav ── */}
        <nav className="cpild-footer-nav">
          <Link to="/plans" className="cpild-footer-nav-link">
            {isRTL ? "← همه طرح‌های انتقالی" : "← All Transitional Plans"}
          </Link>
          <Link to="/arena" className="cpild-footer-nav-link cpild-footer-nav-link--secondary">
            {isRTL ? "آرنا — تأیید طرح‌ها ←" : "Arena — Endorse Plans →"}
          </Link>
        </nav>
      </div>
    </div>
  );
}
