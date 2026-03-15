import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../contexts/LangContext";
import "./JMIPage.css";

// ── Accent ──────────────────────────────────────────────────────────────────
const ACCENT = "#38bdf8";

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
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.7 + 0.5,
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
        ctx.fillStyle = "rgba(56,189,248,0.52)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(56,189,248,${0.11 * (1 - dist / 135)})`;
            ctx.lineWidth = 0.65;
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
    <div className="jmi-sechead">
      <span
        className="jmi-sechead-label"
        style={{ color: accent, borderColor: `${accent}40` }}
      >
        {label}
      </span>
      <h2 className="jmi-sechead-title">{title}</h2>
      <div
        className="jmi-sechead-line"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items, accent = ACCENT }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="jmi-accordion">
      {items.map((item, i) => (
        <div
          key={i}
          className={`jmi-acc-item${open === i ? " jmi-acc-open" : ""}`}
          style={{ "--c": accent }}
        >
          <button
            className="jmi-acc-head"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="jmi-acc-icon">{item.icon}</span>
            <span className="jmi-acc-label">{item.title}</span>
            <span className="jmi-acc-chevron">{open === i ? "▲" : "▼"}</span>
          </button>
          {open === i && (
            <div className="jmi-acc-body">
              {item.items.map((pt, k) => (
                <div key={k} className="jmi-acc-point">
                  <span
                    className="jmi-acc-point-head"
                    style={{ color: accent }}
                  >
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
    heroEyebrow: "Transitional Plan · National Front of Iran",
    heroTitle: "Jebhe Melli Iran",
    heroSubtitle: "Jebhe-ye Melli-ye Irân (JMI) · Est. 1949",
    heroDesc:
      'Founded by Dr. Mohammad Mossadegh in 1949, the National Front of Iran is the oldest and most historically rooted pro-democracy organization in the Iranian political spectrum. In the contemporary era it anchors the "Hamgami" (Solidarity) Coalition for a Secular Democratic Republic, offering a meticulous civil-resistance blueprint for the complete, non-violent dismantling of the Velayat-e Faqih theocracy.',
    heroBadges: [
      { label: "Mosaddeghism", c: ACCENT },
      { label: "Civil Resistance", c: "#60a5fa" },
      { label: "Secular Republic", c: "#34d399" },
      { label: "National Independence", c: "#f9a8d4" },
      { label: "Parliamentary Democracy", c: "#fbbf24" },
    ],

    // ── Ideology ──
    ideologyLabel: "IDEOLOGICAL FOUNDATION",
    ideologyTitle: "Mosaddeghism & the Secular National Compact",
    ideologyBody:
      'The ideological framework of JMI is profoundly anchored in "Mosaddeghism"—a political philosophy synthesizing civic nationalism, secular liberalism, and social democracy. From its founding in 1949 to its contemporary form, the organization\'s baseline has been the establishment of an accountable democracy premised on the conviction that genuine national independence is only achievable when a government is truly representative of its citizens. The 1953 CIA-and-MI6-backed coup that overthrew Mossadegh and reversed the nationalization of Iran\'s oil industry remains the central defining narrative of the entire organization—a historical wound that makes JMI ferociously anti-imperialist while simultaneously pro-democracy, rejecting Western and Eastern hegemony with equal force.',
    ideologyEvolution:
      "JMI's ideological stance has hardened since 1979. Prior to the revolution the Front occasionally tolerated a strictly symbolic, non-ruling constitutional monarchy provided parliament held absolute supremacy. The trauma of 1979 and the clerical consolidation of power ended this tolerance entirely. The modern articulation—codified in the 2015 Asasnameh (Charter) and the 2023 Hamgami Fundamental Principles—demands total separation of religion and state, universal human rights, and the eradication of all institutionalized discrimination based on gender, ethnicity, religion, or sexual orientation.",
    ideologyPillars: [
      {
        icon: "🏴",
        head: "Civic Nationalism",
        body: 'Fierce patriotism anchored in the concept of a "State-Nation" where the republic empowers the electorate. Absolute sovereignty of the Iranian state; non-negotiable territorial integrity.',
      },
      {
        icon: "⚖",
        head: "Secular Liberalism",
        body: "Complete separation of religion and state. No clerical oversight, no religious jurisprudence in civil law, no theocratic veto on legislation. Civil law based strictly on the Universal Declaration of Human Rights.",
      },
      {
        icon: "🤝",
        head: "Social Democracy",
        body: "Economic justice is inseparable from political freedom. State mandate to provide universal social security, free education, health insurance, and housing access. Empowerment of independent trade unions.",
      },
      {
        icon: "🌐",
        head: "Anti-Imperialism",
        body: "Strict rejection of transition models engineered by foreign powers—be they Western strikes, Eastern proxy networks, or monarchist exile blocs. Sovereignty cannot be outsourced under any circumstances.",
      },
    ],

    // ── Methodology ──
    methodLabel: "TRANSITION METHODOLOGY",
    methodTitle: "The Voice, the Pressure, and the Force of Refusal",
    methodBody:
      'JMI\'s operational methodology is anchored in "Social Force" (Zour-e Ejtemaei) and the "Force of Refusal." The coalition assesses that the Islamic Republic suffers from an irreversible crisis of legitimacy and is structurally unreformable. Therefore, transition must be engineered through the systematic, non-violent paralysis of the state apparatus via two coordinated mechanisms: the Voice (street protests and civil disobedience) and the Pressure (economic attrition through labor strikes, bazaar closures, and nationwide boycotts). JMI explicitly and vehemently rejects armed insurgency, guerrilla warfare, and foreign military intervention as catastrophic events that strengthen the security apparatus and invite balkanization.',
    phases: [
      {
        phase: "Phase 1",
        name: "Civil Resistance",
        desc: "Nationwide labor strikes, bazaar closures, economic boycotts (The Pressure) + continuous street protests and civil disobedience (The Voice). Objective: paralyze the economy, fracture elite leadership, widen \"Top Cracks\" in the security apparatus, and encourage defection of the Artesh.",
        color: ACCENT,
      },
      {
        phase: "Phase 2",
        name: "Regime Collapse",
        desc: "Non-violent capitulation of the Velayat-e Faqih system. Secure critical national infrastructure. Prevent civil war and foreign military opportunism. The conventional Artesh defects to the side of the populace.",
        color: "#60a5fa",
      },
      {
        phase: "Phase 3",
        name: "Interim Governance",
        desc: "Immediate formation of a Temporary Transition Council of diverse secular democratic forces. Manages daily state administration. Begins immediate dissolution of the IRGC and Basij parallel security apparatus.",
        color: "#34d399",
      },
      {
        phase: "Phase 4",
        name: "Constituent Assembly",
        desc: "The Transition Council organizes free, fair, and transparent elections for a Constituent Assembly (Majlis-e Moasesan), which drafts a new secular democratic constitution grounded in universal human rights.",
        color: "#f9a8d4",
      },
      {
        phase: "Phase 5",
        name: "Democratic Referendum",
        desc: "A national plebiscite ratifies the constitution and inaugurates the Secular Democratic Republic. The principle of Alternation of Power (strict term limits) is constitutionally enshrined.",
        color: "#fbbf24",
      },
    ],

    // ── Power Structure ──
    powerLabel: "PROPOSED POWER ARCHITECTURE",
    powerTitle: "The Secular Parliamentary Republic",
    powerBody:
      "The JMI blueprint demands a secular parliamentary democracy with a rigid, uncompromising separation of legislative, executive, and judicial powers. At the apex sits the Electorate, exercising absolute sovereignty. No supreme leader, no ruling monarch, no unelected guardianship council exists above the elected representatives of the people. All lifelong political institutions are explicitly abolished.",
    powerNodes: [
      {
        icon: "🗳",
        title: "The Electorate",
        sub: "Apex Authority",
        body: "Citizens of Iran exercise ultimate sovereignty through universal suffrage and national referendums. No individual, council, or religious body stands above the will of the electorate.",
      },
      {
        icon: "🏛",
        title: "National Parliament",
        sub: "Legislative Branch",
        body: "Elected directly by citizens. Holds supreme legislative authority and full oversight over the Executive Branch and the national budget. Restricted by strict term limits enforcing Alternation of Power.",
      },
      {
        icon: "🎯",
        title: "President & Cabinet",
        sub: "Executive Branch",
        body: "President directly elected; Cabinet appointed by President and confirmed by Parliament. Governance based strictly on meritocracy and specialization, stripped entirely of religious or ideological filters.",
      },
      {
        icon: "⚡",
        title: "Independent Judiciary",
        sub: "Judicial Branch",
        body: "Fully secularized. Merit-based legal professionals operating on civil law and universal human rights. Fully separated from religious jurisprudence and from the political branches.",
      },
      {
        icon: "🗺",
        title: "Provincial, District & Village Councils",
        sub: "Administrative Decentralization",
        body: "Elected local councils manage local budgets, infrastructure, and cultural preservation. Administrative decentralization only—NOT ethno-linguistic federalism. National sovereignty and territorial integrity remain absolute.",
      },
    ],

    // ── Targets ──
    targetsLabel: "INSTITUTIONAL TARGETS",
    targetsTitle: "Dismantlement, Reform, and Reconstruction",
    targetsBody:
      "The JMI blueprint draws a sharp architectural distinction: institutions fulfilling necessary national functions are purged of ideological elements and reformed; institutions created solely to protect and enrich the theocracy are entirely eradicated.",
    targets: [
      {
        name: "IRGC & Basij",
        policy: "COMPLETE DISSOLUTION",
        detail:
          "Viewed as an ideological mafia that hijacked the economy through Khatam al-Anbia conglomerates. Full legal eradication. All economic assets, real estate, and industrial monopolies confiscated and transferred to the state or competitive private sector. New laws permanently ban military/paramilitary interference in civilian politics.",
        color: "#ef4444",
        tag: "ERADICATE",
      },
      {
        name: "Artesh (Regular Army)",
        policy: "REFORMED & RETAINED",
        detail:
          "Tasked with defending territorial integrity, not ideological purity. Rebuilt with new recruitment protocols. Strictly subordinated to a civilian Ministry of Defense and absolute parliamentary oversight.",
        color: "#34d399",
        tag: "REFORM",
      },
      {
        name: "Clerical & Revolutionary Courts",
        policy: "COMPLETELY DISMANTLED",
        detail:
          "The Special Clerical Court and Islamic Revolutionary Courts are eradicated. All integration of Shiite jurisprudence into the legal system abolished. Replaced by a secular, independent civil judiciary.",
        color: "#ef4444",
        tag: "ERADICATE",
      },
      {
        name: "Bonyads (Religious Foundations)",
        policy: "CONFISCATED & INTEGRATED",
        detail:
          "Tax-exempt religious monopolies (e.g., Astan Qods Razavi) dismantled. Assets integrated into the formal, taxable national economy to fund social welfare and infrastructure.",
        color: "#f59e0b",
        tag: "CONFISCATE",
      },
      {
        name: "Civilian Ministries",
        policy: "PURGED & REFORMED",
        detail:
          "Retained but purged of ideological appointees and structural corruption. Restructured based on specialization, meritocracy, and transparent oversight by independent media and unions.",
        color: "#60a5fa",
        tag: "REFORM",
      },
    ],

    // ── Policies ──
    policyLabel: "KEY POLICY STANCES",
    policyTitle: "The Post-Theocratic Policy Matrix",
    policies: [
      {
        icon: "📊",
        title: "Economy: From Rentier State to Competitive Production",
        items: [
          {
            head: "Structural Shift:",
            body: "Transition from a corrupt, rent-seeking economy dominated by ideological conglomerates to a production-based, technologically modern economy integrated with global markets and open to foreign investment.",
          },
          {
            head: "Social Welfare Mandate:",
            body: "Universal social security, free education, comprehensive health insurance, and housing access. Economic development is explicitly linked to social justice and poverty alleviation.",
          },
          {
            head: "Labor Rights:",
            body: "Strict ban on child labor. Empowerment of independent trade unions (teachers, oil workers, artists). Strict enforcement of international labor laws.",
          },
          {
            head: "Resource Sovereignty:",
            body: "Core natural resources nationalized—a direct philosophical legacy of Mossadegh's oil nationalization. Natural wealth funds national development, not imperial or monopolistic interests.",
          },
          {
            head: "Environmental Priority:",
            body: "Drought, water-table depletion, and extreme pollution elevated to top-tier national security and economic priorities.",
          },
        ],
      },
      {
        icon: "🗺",
        title: "Minorities & Geography: Decentralization Without Federalism",
        items: [
          {
            head: "Absolute Territorial Integrity:",
            body: "JMI explicitly and vehemently rejects ethno-linguistic federalism, viewing it as a dangerous precursor to balkanization and secession, citing the Yugoslavian precedent.",
          },
          {
            head: "Administrative Decentralization:",
            body: "Power delegated to elected provincial/village councils to manage local budgets and eliminate regional economic disparities—without fracturing sovereign borders.",
          },
          {
            head: "Language Policy:",
            body: "Persian (Farsi) remains the sole official educational and common language. Regional languages (Kurdish, Balochi, Azerbaijani) are protected and promoted as shared cultural heritage.",
          },
          {
            head: "Non-Discrimination:",
            body: "Equal rights for all citizens regardless of ethnicity, gender, religion, or sexual orientation. Elimination of all institutionalized discrimination.",
          },
        ],
      },
      {
        icon: "⚖",
        title: "Transitional Justice: Accountability Without Vengeance",
        items: [
          {
            head: "No Blanket Purges:",
            body: "The blueprint explicitly rejects revolutionary executions and collective political retribution. The presumption of innocence is absolute and inviolable.",
          },
          {
            head: "Death Penalty Abolished:",
            body: "Capital punishment is eliminated as a judicial sanction. Torture is strictly outlawed under all circumstances.",
          },
          {
            head: "Individual Accountability:",
            body: "Perpetrators of state violence, human rights abuses, and severe economic corruption are prosecuted in fair, transparent, independent secular courts—based on individual provable crimes, not organizational membership.",
          },
          {
            head: "Strategic Calculation:",
            body: "By guaranteeing lower-ranking military and bureaucratic defectors will not face arbitrary prosecution, JMI actively lowers exit costs for regime personnel, accelerating collapse.",
          },
        ],
      },
      {
        icon: "🌐",
        title: "Foreign Policy: Independence, Normalization & Non-Proliferation",
        items: [
          {
            head: "Core Tenet:",
            body: "Strict independence from foreign hegemony—Western or Eastern. Deeply informed by the 1953 coup trauma. No foreign power engineers Iran's transition; sovereignty cannot be outsourced.",
          },
          {
            head: "Global Normalization:",
            body: "Peaceful, tension-free relations with all UN member states based on national interest and mutual respect—explicitly including the United States and Israel.",
          },
          {
            head: "End of Proxy Wars:",
            body: "Adamant opposition to the Islamic Republic's regional proxy networks in Lebanon, Syria, Yemen, and Gaza—they squander national wealth and invite retaliatory military strikes.",
          },
          {
            head: "Nuclear Non-Proliferation:",
            body: "Strict compliance with international non-proliferation standards. Support for prohibition of WMDs in the region. Senior JMI figures have proposed regional nuclear consortiums to manage enrichment peacefully and transparently.",
          },
        ],
      },
    ],

    // ── Geopolitics ──
    geoLabel: "GEOPOLITICAL IMPLICATIONS",
    geoTitle: "Reshaping the Middle East's Security Paradigm",
    geoBody:
      'A JMI-governed Iran would produce the most profound geopolitical realignment in the contemporary era. The termination of the Islamic Republic\'s proxy war infrastructure—Hezbollah, the Houthis, Hamas, and Iraqi PMFs—would immediately collapse the "Axis of Resistance" and fundamentally alter the threat calculus for Israel, Saudi Arabia, the Gulf states, and Turkey. The normalization of diplomatic relations with the United States and Israel, explicitly codified in the Hamgami principles, would represent an extraordinary departure from 46 years of existential regional hostility. Iran\'s pivot from ideological adventurism to production-based economic integration would redirect one of the Middle East\'s largest economies toward global markets, creating a potential new axis of regional stability. The embrace of nuclear non-proliferation and peaceful enrichment consortiums would resolve the most dangerous ongoing source of potential great-power conflict in the region.',

    // ── Conclusion ──
    conclusionLabel: "STRATEGIC ASSESSMENT",
    conclusionQuote:
      '"The JMI blueprint is the most institutionally resilient governance model on the Iranian transitional spectrum—an architecture explicitly engineered to inoculate a future Iranian state against both theocratic regression and dynastic dictatorship, at the cost of requiring near-total nationwide civil mobilization to trigger elite fracture and security apparatus defection before a single institution can be reformed."',
  },

  fa: {
    heroEyebrow: "طرح انتقالی · جبهه ملی ایران",
    heroTitle: "جبهه ملی ایران",
    heroSubtitle: "جبهه‌ی ملی ایران (جبهه‌ملی) · بنیان‌گذاری ۱۳۲۸",
    heroDesc:
      'جبهه ملی ایران که در سال ۱۳۲۸ توسط دکتر محمد مصدق بنیانگذاری شد، قدیمی‌ترین و ریشه‌دارترین سازمان طرفدار دموکراسی در طیف سیاسی ایران است. در عصر معاصر این سازمان به‌عنوان لنگر اصلی ائتلاف «همگامی» برای استقرار جمهوری دموکراتیک سکولار در ایران عمل می‌کند و یک طرح دقیق مبتنی بر مقاومت مدنی برای فروپاشی کامل و مسالمت‌آمیز نظام ولایت فقیه ارائه می‌دهد.',
    heroBadges: [
      { label: "مصدقیسم", c: ACCENT },
      { label: "مقاومت مدنی", c: "#60a5fa" },
      { label: "جمهوری سکولار", c: "#34d399" },
      { label: "استقلال ملی", c: "#f9a8d4" },
      { label: "دموکراسی پارلمانی", c: "#fbbf24" },
    ],

    // ── Ideology ──
    ideologyLabel: "پایه‌های ایدئولوژیک",
    ideologyTitle: "مصدقیسم و پیمان ملی سکولار",
    ideologyBody:
      'چارچوب ایدئولوژیک جبهه ملی عمیقاً در «مصدقیسم» ریشه دارد—فلسفه سیاسی‌ای که ناسیونالیسم مدنی، لیبرالیسم سکولار و سوسیال‌دموکراسی را در هم می‌آمیزد. از بدو تأسیس در ۱۳۲۸ تا امروز، پایه اصلی این سازمان استقرار دموکراسی پاسخگو بوده است، بر این اصل که استقلال ملی واقعی تنها زمانی دست‌یافتنی است که حکومتی حقیقتاً نماینده شهروندانش باشد. کودتای ۲۸ مرداد ۱۳۳۲—که با حمایت CIA و MI6 مصدق را سرنگون کرد و ملی شدن نفت ایران را معکوس نمود—روایت تعریف‌کننده مرکزی آگاهی سیاسی کل سازمان است؛ زخمی تاریخی که جبهه ملی را به‌شدت ضدامپریالیست می‌سازد در عین طرفداری از دموکراسی، و سلطه هر دو قطب غربی و شرقی را با قدرت یکسان رد می‌کند.',
    ideologyEvolution:
      'موضع ایدئولوژیک جبهه ملی از سال ۱۳۵۷ سخت‌تر شده است. پیش از انقلاب، جبهه گاهی سلطنت مشروطه کاملاً نمادین و غیرحاکم را تحمل می‌کرد، مشروط به آنکه پارلمان اقتدار مطلق را داشته باشد. تروما‌ی سیستماتیک ۱۳۵۷ و تثبیت قدرت روحانیون این تحمل را به‌طور کامل پایان داد. صورتبندی مدرن—که در اساسنامه ۱۳۹۴ و اصول بنیادین همگامی ۱۴۰۲ تدوین شده—خواهان جدایی کامل دین از دولت، حقوق جهانی بشر، و ریشه‌کن کردن تمام تبعیض‌های نهادی بر اساس جنسیت، قومیت، دین یا گرایش جنسی است.',
    ideologyPillars: [
      {
        icon: "🏴",
        head: "ناسیونالیسم مدنی",
        body: 'میهن‌دوستی سرسختانه‌ای که در مفهوم «دولت-ملت» ریشه دارد، جایی که جمهوری به رأی‌دهندگان توان می‌بخشد. حاکمیت مطلق دولت ایران؛ تمامیت ارضی غیرقابل مذاکره.',
      },
      {
        icon: "⚖",
        head: "لیبرالیسم سکولار",
        body: "جدایی کامل دین از دولت. هیچ نظارت روحانی، هیچ فقه اسلامی در قانون مدنی، هیچ وتوی مذهبی بر قانون‌گذاری. قانون مدنی مبتنی کاملاً بر اعلامیه جهانی حقوق بشر.",
      },
      {
        icon: "🤝",
        head: "سوسیال‌دموکراسی",
        body: "عدالت اقتصادی از آزادی سیاسی جدایی‌ناپذیر است. تعهد دولت به بیمه اجتماعی جهانی، آموزش رایگان، بیمه درمانی و دسترسی به مسکن. توانمندسازی اتحادیه‌های مستقل کارگری.",
      },
      {
        icon: "🌐",
        head: "ضدامپریالیسم",
        body: "رد قاطعانه مدل‌های انتقالی مهندسی‌شده توسط قدرت‌های خارجی—چه حملات غربی، چه شبکه‌های نیابتی شرقی، چه بلوک‌های اپوزیسیون سلطنت‌طلب. حاکمیت ملی غیرقابل مذاکره است.",
      },
    ],

    // ── Methodology ──
    methodLabel: "روش‌شناسی انتقال",
    methodTitle: "صدا، فشار و نیروی امتناع",
    methodBody:
      'روش‌شناسی عملیاتی جبهه ملی در مفهوم «زور اجتماعی» و «نیروی امتناع» ریشه دارد. ائتلاف ارزیابی می‌کند که جمهوری اسلامی از بحران مشروعیت غیرقابل برگشتی رنج می‌برد و از نظر ساختاری قابل اصلاح نیست. بنابراین انتقال باید از طریق فلج‌سازی منظم و مسالمت‌آمیز دستگاه دولتی از طریق دو مکانیسم هماهنگ مهندسی شود: صدا (اعتراضات خیابانی و نافرمانی مدنی) و فشار (فرسایش اقتصادی از طریق اعتصابات کارگری، بستن بازار و تحریم‌های سراسری). جبهه ملی به‌صراحت و با تمام وجود شورش مسلحانه، جنگ‌های چریکی و دخالت نظامی خارجی را رد می‌کند.',
    phases: [
      {
        phase: "مرحله ۱",
        name: "مقاومت مدنی",
        desc: 'اعتصابات کارگری سراسری، بستن بازار، تحریم‌های اقتصادی (فشار) + اعتراضات خیابانی مستمر و نافرمانی مدنی (صدا). هدف: فلج کردن اقتصاد، شکستن رهبری نخبگان، گسترش «ترک‌های بالا» در دستگاه امنیتی و تشویق ارتش به فرار.',
        color: ACCENT,
      },
      {
        phase: "مرحله ۲",
        name: "فروپاشی رژیم",
        desc: "تسلیم مسالمت‌آمیز نظام ولایت فقیه. تأمین زیرساخت‌های حیاتی ملی. پیشگیری از جنگ داخلی و فرصت‌طلبی نظامی خارجی. ارتش رسمی به جانب مردم فرار می‌کند.",
        color: "#60a5fa",
      },
      {
        phase: "مرحله ۳",
        name: "حکمرانی موقت",
        desc: "تشکیل فوری شورای انتقال موقت متشکل از نیروهای دموکراتیک سکولار متنوع. مدیریت امور روزانه دولتی. آغاز انحلال فوری دستگاه امنیتی موازی سپاه و بسیج.",
        color: "#34d399",
      },
      {
        phase: "مرحله ۴",
        name: "مجلس مؤسسان",
        desc: "شورای انتقال انتخابات آزاد، عادلانه و شفاف سراسری برای مجلس مؤسسان برگزار می‌کند که قانون اساسی دموکراتیک سکولار جدیدی بر پایه حقوق جهانی بشر تدوین می‌کند.",
        color: "#f9a8d4",
      },
      {
        phase: "مرحله ۵",
        name: "همه‌پرسی دموکراتیک",
        desc: "یک همه‌پرسی ملی برای تصویب قانون اساسی جدید و افتتاح رسمی جمهوری دموکراتیک سکولار برگزار می‌شود. اصل جابجایی قدرت (محدودیت‌های اجباری دوره خدمت) در قانون اساسی نهادینه می‌شود.",
        color: "#fbbf24",
      },
    ],

    // ── Power Structure ──
    powerLabel: "معماری قدرت پیشنهادی",
    powerTitle: "جمهوری پارلمانی سکولار",
    powerBody:
      "طرح جبهه ملی خواهان دموکراسی پارلمانی سکولار با تفکیک سخت و بی‌تخفیف قوای مقننه، مجریه و قضائیه است. در رأس این ساختار، ملت قرار دارد که حاکمیت مطلق را اعمال می‌کند. هیچ رهبر عالی، هیچ پادشاه حاکم و هیچ شورای نگهبان غیرمنتخبی بالاتر از نمایندگان منتخب مردم وجود ندارد. تمام نهادهای سیاسی مادام‌العمر صریحاً لغو می‌شوند.",
    powerNodes: [
      {
        icon: "🗳",
        title: "ملت",
        sub: "اقتدار برتر",
        body: "شهروندان ایران حاکمیت نهایی را از طریق رأی همگانی و همه‌پرسی‌های ملی اعمال می‌کنند. هیچ فرد، شورا یا نهاد دینی‌ای بالاتر از اراده ملت قرار ندارد.",
      },
      {
        icon: "🏛",
        title: "مجلس ملی",
        sub: "قوه مقننه",
        body: "مستقیماً توسط شهروندان انتخاب می‌شود. دارای اقتدار قانونگذاری عالی و نظارت کامل بر قوه مجریه و بودجه ملی. محدود به محدودیت‌های اجباری دوره خدمت (جابجایی قدرت).",
      },
      {
        icon: "🎯",
        title: "رئیس‌جمهور و هیئت دولت",
        sub: "قوه مجریه",
        body: "رئیس‌جمهور مستقیماً انتخاب می‌شود؛ هیئت دولت توسط رئیس‌جمهور منصوب و توسط مجلس تأیید می‌شود. حکمرانی کاملاً بر اساس شایسته‌سالاری و تخصص، بدون هرگونه فیلتر دینی یا ایدئولوژیک.",
      },
      {
        icon: "⚡",
        title: "قوه قضائیه مستقل",
        sub: "قوه قضائیه",
        body: "کاملاً سکولار شده. متخصصان حقوقی منصوب بر اساس شایسته‌سالاری قانون مدنی. عمل کاملاً بر پایه قانون مدنی و حقوق جهانی بشر. کاملاً از فقه دینی و از شاخه‌های سیاسی جدا.",
      },
      {
        icon: "🗺",
        title: "شوراهای استانی، شهرستانی و روستایی",
        sub: "عدم تمرکز اداری",
        body: "شوراهای محلی منتخب بودجه‌های محلی، زیرساخت‌ها و حفظ فرهنگ را مدیریت می‌کنند. عدم تمرکز اداری—نه فدرالیسم قومی-زبانی. حاکمیت ملی و تمامیت ارضی مطلق هستند.",
      },
    ],

    // ── Targets ──
    targetsLabel: "اهداف نهادی",
    targetsTitle: "انحلال، اصلاح و بازسازی",
    targetsBody:
      "طرح جبهه ملی تمایز معماری تیزی ترسیم می‌کند: نهادهایی که وظایف ملی ضروری را انجام می‌دهند از عناصر ایدئولوژیک پاکسازی و اصلاح می‌شوند؛ نهادهایی که صرفاً برای حفاظت و ثروت‌بخشی به تئوکراسی ایجاد شده‌اند، کاملاً ریشه‌کن می‌شوند.",
    targets: [
      {
        name: "سپاه پاسداران و بسیج",
        policy: "انحلال کامل",
        detail:
          "به‌عنوان مافیای ایدئولوژیک دیده می‌شود که اقتصاد را از طریق کنسرسیوم‌های خاتم‌الانبیاء ربوده است. ریشه‌کن شدن قانونی کامل. تمام دارایی‌های اقتصادی، اموال غیرمنقول و انحصارات صنعتی مصادره و به دولت یا بخش خصوصی رقابتی منتقل می‌شوند.",
        color: "#ef4444",
        tag: "ریشه‌کنی",
      },
      {
        name: "ارتش (نیروهای مسلح رسمی)",
        policy: "اصلاح و نگه‌داری",
        detail:
          "مأمور دفاع از تمامیت ارضی، نه خلوص ایدئولوژیک. با پروتکل‌های جدید استخدامی بازسازی می‌شود. کاملاً تابع وزارت دفاع غیرنظامی و نظارت مطلق پارلمانی.",
        color: "#34d399",
        tag: "اصلاح",
      },
      {
        name: "دادگاه‌های روحانی و انقلابی",
        policy: "انحلال کامل",
        detail:
          "دادگاه ویژه روحانیت و دادگاه‌های انقلاب اسلامی ریشه‌کن می‌شوند. یکپارچگی کامل فقه شیعه در دستگاه قضایی لغو می‌شود. جایگزین آن قوه قضائیه سکولار و مستقل.",
        color: "#ef4444",
        tag: "ریشه‌کنی",
      },
      {
        name: "بنیادها (بنیادهای اقتصادی مذهبی)",
        policy: "مصادره و ادغام",
        detail:
          "انحصارات مذهبی معاف از مالیات (مانند آستان قدس رضوی) منحل می‌شوند. دارایی‌هایشان به اقتصاد رسمی و مشمول مالیات برای تأمین رفاه اجتماعی و زیرساخت ادغام می‌شوند.",
        color: "#f59e0b",
        tag: "مصادره",
      },
      {
        name: "وزارتخانه‌های غیرنظامی",
        policy: "پاکسازی و اصلاح",
        detail:
          "حفظ می‌شوند اما از منصوبان ایدئولوژیک و فساد ساختاری پاکسازی می‌شوند. بر اساس تخصص، شایسته‌سالاری و نظارت شفاف رسانه‌ها و اتحادیه‌های مستقل بازسازی می‌شوند.",
        color: "#60a5fa",
        tag: "اصلاح",
      },
    ],

    // ── Policies ──
    policyLabel: "مواضع کلیدی سیاستی",
    policyTitle: "ماتریس سیاستی پس از تئوکراسی",
    policies: [
      {
        icon: "📊",
        title: "اقتصاد: از دولت رانتیر به تولید رقابتی",
        items: [
          {
            head: "تحول ساختاری:",
            body: "گذار از اقتصاد فاسد رانت‌خوار تحت سلطه کنسرسیوم‌های ایدئولوژیک به اقتصاد مبتنی بر تولید و فناوری مدرن که با بازارهای جهانی ادغام شده و به سرمایه‌گذاری خارجی باز است.",
          },
          {
            head: "تعهد رفاه اجتماعی:",
            body: "بیمه اجتماعی جهانی، آموزش رایگان، بیمه درمانی جامع و دسترسی به مسکن. توسعه اقتصادی صریحاً با عدالت اجتماعی و فقرزدایی گره خورده است.",
          },
          {
            head: "حقوق کارگری:",
            body: "ممنوعیت قاطع کار کودک. توانمندسازی اتحادیه‌های مستقل کارگری (معلمان، کارگران نفت، هنرمندان). اجرای کامل قوانین بین‌المللی کار.",
          },
          {
            head: "حاکمیت منابع:",
            body: "منابع طبیعی اصلی ملی می‌شوند—میراث فلسفی مستقیم ملی شدن نفت مصدق. ثروت طبیعی توسعه ملی را تأمین می‌کند، نه منافع امپریالیستی یا انحصاری.",
          },
          {
            head: "اولویت محیط زیست:",
            body: "خشکسالی، کاهش سطح آب‌های زیرزمینی و آلودگی شدید به اولویت‌های امنیت ملی و اقتصادی درجه اول ارتقا می‌یابند.",
          },
        ],
      },
      {
        icon: "🗺",
        title: "اقلیت‌ها و جغرافیا: عدم تمرکز بدون فدرالیسم",
        items: [
          {
            head: "تمامیت ارضی مطلق:",
            body: "جبهه ملی به‌صراحت و با تمام وجود فدرالیسم قومی-زبانی را رد می‌کند و آن را پیش‌درآمد خطرناک تجزیه و جدایی‌طلبی می‌داند، با استناد به تجربه یوگسلاوی.",
          },
          {
            head: "عدم تمرکز اداری:",
            body: "اختیارات به شوراهای استانی و روستایی منتخب برای مدیریت بودجه‌های محلی و رفع نابرابری‌های اقتصادی منطقه‌ای—بدون شکستن مرزهای حاکمیتی.",
          },
          {
            head: "سیاست زبانی:",
            body: "فارسی زبان رسمی و مشترک آموزشی باقی می‌ماند. زبان‌های منطقه‌ای (کردی، بلوچی، آذری) به‌عنوان میراث فرهنگی مشترک حفاظت و ترویج می‌شوند.",
          },
          {
            head: "عدم تبعیض:",
            body: "حقوق برابر برای همه شهروندان صرف نظر از قومیت، جنسیت، دین یا گرایش جنسی. رفع تمام تبعیض‌های نهادی.",
          },
        ],
      },
      {
        icon: "⚖",
        title: "عدالت انتقالی: پاسخگویی بدون انتقام",
        items: [
          {
            head: "عدم پاکسازی دسته‌جمعی:",
            body: "طرح به‌صراحت اعدام‌های انقلابی و انتقام سیاسی جمعی را رد می‌کند. اصل برائت مطلق و خدشه‌ناپذیر است.",
          },
          {
            head: "لغو مجازات اعدام:",
            body: "مجازات اعدام به‌عنوان مجازات قضایی حذف می‌شود. شکنجه در تمام شرایط به‌شدت ممنوع است.",
          },
          {
            head: "پاسخگویی فردی:",
            body: "عاملان خشونت دولتی، نقض حقوق بشر و فساد اقتصادی شدید در دادگاه‌های سکولار منصفانه، شفاف و مستقل محاکمه می‌شوند—بر اساس جرایم فردی قابل اثبات، نه عضویت سازمانی.",
          },
          {
            head: "محاسبه استراتژیک:",
            body: "با تضمین اینکه کارمندان و نظامیان رده‌پایین که از رژیم جدا می‌شوند با پیگرد قضایی خودسرانه روبرو نخواهند شد، جبهه ملی فعالانه هزینه خروج را کاهش می‌دهد و فروپاشی را تسریع می‌بخشد.",
          },
        ],
      },
      {
        icon: "🌐",
        title: "سیاست خارجی: استقلال، عادی‌سازی و عدم اشاعه هسته‌ای",
        items: [
          {
            head: "اصل بنیادین:",
            body: "استقلال قاطعانه از سلطه خارجی—غربی یا شرقی. عمیقاً متأثر از تروما‌ی کودتای ۲۸ مرداد. هیچ قدرت خارجی انتقال ایران را مهندسی نمی‌کند.",
          },
          {
            head: "عادی‌سازی جهانی:",
            body: "روابط مسالمت‌آمیز و بدون تنش با تمام کشورهای عضو سازمان ملل بر اساس منافع ملی و احترام متقابل—به‌صراحت شامل ایالات متحده و اسرائیل.",
          },
          {
            head: "پایان جنگ‌های نیابتی:",
            body: "مخالفت قاطعانه با شبکه‌های نیابتی منطقه‌ای جمهوری اسلامی در لبنان، سوریه، یمن و غزه—که ثروت ملی را هدر می‌دهند و ضربات انتقامی نظامی را دعوت می‌کنند.",
          },
          {
            head: "عدم اشاعه هسته‌ای:",
            body: "رعایت کامل استانداردهای بین‌المللی عدم اشاعه. حمایت از ممنوعیت و نابودی سلاح‌های کشتار جمعی در منطقه. شخصیت‌های ارشد جبهه ملی کنسرسیوم‌های هسته‌ای منطقه‌ای را برای مدیریت مسالمت‌آمیز غنی‌سازی پیشنهاد داده‌اند.",
          },
        ],
      },
    ],

    // ── Geopolitics ──
    geoLabel: "پیامدهای ژئوپلیتیک",
    geoTitle: "بازآرایی پارادایم امنیتی خاورمیانه",
    geoBody:
      'ایران تحت حکمرانی جبهه ملی عمیق‌ترین تحول ژئوپلیتیک عصر معاصر را رقم خواهد زد. پایان زیرساخت جنگ نیابتی جمهوری اسلامی—حزب‌الله، حوثی‌ها، حماس و گروه‌های شبه‌نظامی عراق—بلافاصله «محور مقاومت» را فرو خواهد پاشید و معادله تهدید اسرائیل، عربستان سعودی، کشورهای خلیج فارس و ترکیه را اساساً تغییر خواهد داد. عادی‌سازی روابط دیپلماتیک با ایالات متحده و اسرائیل—که به‌صراحت در اصول همگامی تدوین شده—نمایانگر گسستی استثنایی از ۴۶ سال دشمنی وجودی منطقه‌ای است. چرخش ایران از ماجراجویی ایدئولوژیک به یکپارچه‌سازی اقتصادی مبتنی بر تولید، یکی از بزرگ‌ترین اقتصادهای خاورمیانه را به سمت بازارهای جهانی هدایت خواهد کرد. پذیرش عدم اشاعه هسته‌ای و کنسرسیوم‌های غنی‌سازی مسالمت‌آمیز، خطرناک‌ترین منبع جاری تعارض بالقوه قدرت‌های بزرگ در منطقه را حل خواهد کرد.',

    // ── Conclusion ──
    conclusionLabel: "ارزیابی استراتژیک",
    conclusionQuote:
      '«طرح جبهه ملی انعطاف‌پذیرترین مدل حکمرانی از نظر نهادی در طیف انتقالی ایران است—معماری‌ای که به‌صراحت برای واکسینه کردن دولت آینده ایران در برابر هم رگرسیون تئوکراتیک و هم دیکتاتوری سلسله‌ای مهندسی شده است، به بهای نیاز به بسیج مدنی سراسری برای ایجاد شکاف نخبگان و فرار دستگاه امنیتی قبل از اینکه بتوان یک نهاد را اصلاح کرد.»',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function JMIPage() {
  const { lang, isRTL } = useLang();
  const d = DATA[lang] || DATA.en;
  const dir = isRTL ? "rtl" : "ltr";
  const ff = isRTL ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const canvasRef = useRef(null);

  return (
    <div className="jmi-page" dir={dir}>
      {/* Background */}
      <canvas ref={canvasRef} className="jmi-bg-canvas" />
      <ParticleGrid canvasRef={canvasRef} />
      <div className="jmi-scanline" />

      <div className="jmi-inner" style={{ fontFamily: ff }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <header className="jmi-hero">
          <p className="jmi-hero-eyebrow">{d.heroEyebrow}</p>
          <h1 className="jmi-hero-title" style={{ fontFamily: ff }}>
            {d.heroTitle}
          </h1>
          <p className="jmi-hero-subtitle">{d.heroSubtitle}</p>
          <p className="jmi-hero-desc">{d.heroDesc}</p>
          <div className="jmi-hero-badges">
            {d.heroBadges.map((b, i) => (
              <span
                key={i}
                className="jmi-badge"
                style={{
                  color: b.c,
                  borderColor: `${b.c}35`,
                  background: `${b.c}0e`,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </header>

        {/* ── Ideology ──────────────────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.ideologyLabel} title={d.ideologyTitle} />
          <p className="jmi-body-text">{d.ideologyBody}</p>
          <p className="jmi-body-text jmi-mt-sm">{d.ideologyEvolution}</p>
          <div className="jmi-pillars">
            {d.ideologyPillars.map((p, i) => (
              <div key={i} className="jmi-pillar">
                <span className="jmi-pillar-icon">{p.icon}</span>
                <h4
                  className="jmi-pillar-head"
                  style={{ color: ACCENT }}
                >
                  {p.head}
                </h4>
                <p className="jmi-pillar-body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Methodology ───────────────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.methodLabel} title={d.methodTitle} />
          <p className="jmi-body-text">{d.methodBody}</p>
          <div className="jmi-timeline">
            {d.phases.map((ph, i) => (
              <div key={i} className="jmi-phase">
                <div
                  className="jmi-phase-marker"
                  style={{ borderColor: ph.color, background: `${ph.color}18` }}
                >
                  <span
                    className="jmi-phase-num"
                    style={{ color: ph.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="jmi-phase-content">
                  <div className="jmi-phase-header">
                    <span
                      className="jmi-phase-tag"
                      style={{ color: ph.color, borderColor: `${ph.color}40` }}
                    >
                      {ph.phase}
                    </span>
                    <h4
                      className="jmi-phase-name"
                      style={{ color: ph.color }}
                    >
                      {ph.name}
                    </h4>
                  </div>
                  <p className="jmi-phase-desc">{ph.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Power Structure ───────────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.powerLabel} title={d.powerTitle} />
          <p className="jmi-body-text">{d.powerBody}</p>
          <div className="jmi-power-grid">
            {d.powerNodes.map((node, i) => (
              <div
                key={i}
                className={`jmi-power-node${i === 0 ? " jmi-power-node--apex" : ""}`}
                style={{ "--c": i === 0 ? ACCENT : undefined }}
              >
                <span className="jmi-power-icon">{node.icon}</span>
                <h4 className="jmi-power-title">{node.title}</h4>
                <span
                  className="jmi-power-sub"
                  style={{ color: ACCENT }}
                >
                  {node.sub}
                </span>
                <p className="jmi-power-body">{node.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Institutional Targets ─────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.targetsLabel} title={d.targetsTitle} />
          <p className="jmi-body-text">{d.targetsBody}</p>
          <div className="jmi-targets">
            {d.targets.map((t, i) => (
              <div
                key={i}
                className="jmi-target"
                style={{ borderColor: `${t.color}30` }}
              >
                <div className="jmi-target-header">
                  <h4 className="jmi-target-name">{t.name}</h4>
                  <span
                    className="jmi-target-tag"
                    style={{
                      color: t.color,
                      borderColor: `${t.color}50`,
                      background: `${t.color}12`,
                    }}
                  >
                    {t.tag}
                  </span>
                </div>
                <p
                  className="jmi-target-policy"
                  style={{ color: t.color }}
                >
                  {t.policy}
                </p>
                <p className="jmi-target-detail">{t.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Key Policies ──────────────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.policyLabel} title={d.policyTitle} />
          <Accordion items={d.policies} accent={ACCENT} />
        </section>

        {/* ── Geopolitics ───────────────────────────────────────── */}
        <section className="jmi-section">
          <SecHead label={d.geoLabel} title={d.geoTitle} />
          <p className="jmi-body-text">{d.geoBody}</p>
        </section>

        {/* ── Conclusion ────────────────────────────────────────── */}
        <section className="jmi-conclusion">
          <p className="jmi-conclusion-label">{d.conclusionLabel}</p>
          <blockquote className="jmi-conclusion-quote" style={{ fontFamily: ff }}>
            {d.conclusionQuote}
          </blockquote>
          <div
            className="jmi-conclusion-line"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
          />
        </section>

        {/* ── Footer Nav ────────────────────────────────────────── */}
        <nav className="jmi-footer-nav">
          <Link to="/plans" className="jmi-footer-nav-link">
            {isRTL ? "← همه طرح‌های انتقالی" : "← All Transitional Plans"}
          </Link>
          <Link
            to="/arena"
            className="jmi-footer-nav-link jmi-footer-nav-link--secondary"
          >
            {isRTL ? "آرنا — تأیید طرح‌ها ←" : "Arena — Endorse Plans →"}
          </Link>
        </nav>
      </div>
    </div>
  );
}
