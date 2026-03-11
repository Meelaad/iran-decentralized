// data.js
// Legacy flat exports kept for backward compat (SectorsIndex, SectorPage use these directly).
// New code should import BLUEPRINTS instead.

export const SECTORS = [
    {
        id: "citizens",
        label: { en: "Citizens & Diaspora", fa: "شهروندان و دیاسپورا" },
        icon: "👥",
        subIcon: "👤",
        color: "#E8F5E9",
        border: "#2E7D32",
        x: 50, y: 45,
        tier: "core",
        contents: [
            { en: "Sovereign Digital Identity (Self-Custodied)", fa: "هویت دیجیتال مستقل (خود-حضانتی)" },
            { en: "Borderless Diaspora Integration Identity", fa: "هویت یکپارچه و بدون مرز دیاسپورا" },
            { en: "Biometric + Zero-Knowledge Auth", fa: "احراز هویت بیومتریک و دانش صفر" },
            { en: "Universal Digital Wallet", fa: "کیف پول دیجیتال یکپارچه" },
            { en: "Voting & Proposal Rights Token", fa: "توکن حق رأی و ارائه پیشنهاد" },
            { en: "Immutable Civil Liberties Registry", fa: "ثبت تغییرناپذیر آزادی‌های مدنی" },
        ],
        desc: {
            en: "The foundational layer. Every citizen—including the millions in the diaspora—holds a sovereign digital identity, enabling instant, borderless voting, investment, and participation without central gatekeepers.",
            fa: "لایه پایه. هر شهروند - از جمله میلیون‌ها نفر در دیاسپورا - دارای یک هویت دیجیتال مستقل است که امکان رأی‌دهی، سرمایه‌گذاری و مشارکت فوری و بدون مرز را بدون نیاز به نهادهای متمرکز فراهم می‌کند."
        },
    },
    {
        id: "governance",
        label: { en: "Decentralized Federalism", fa: "فدرالیسم غیرمتمرکز" },
        icon: "🌐",
        color: "#E3F2FD",
        border: "#1565C0",
        x: 50, y: 27,
        tier: "core",
        contents: [
            { en: "Provincial Shora (Council) DAOs", fa: "سازمان‌های خودمختار (DAO) شوراهای استانی" },
            { en: "Liquid Democracy (Delegate or Direct Vote)", fa: "دموکراسی سیال (رأی مستقیم یا تفویضی)" },
            { en: "Decentralized Federalism Protocol", fa: "پروتکل فدرالیسم غیرمتمرکز" },
            { en: "Smart Contract Law Execution", fa: "اجرای قوانین از طریق قراردادهای هوشمند" },
            { en: "Constitutional Smart Contract (Immutable Rights)", fa: "قرارداد هوشمند قانون اساسی (حقوق تغییرناپذیر)" },
            { en: "Public Audit Trail (Blockchain Ledger)", fa: "ردیابی حسابرسی عمومی (دفتر کل بلاک‌چین)" },
        ],
        desc: {
            en: "Power is pushed to the edges. Provincial Shoras operate as DAOs with automatic budget allocations, removing Tehran's bottleneck and ensuring true regional autonomy and representation.",
            fa: "انتقال قدرت به استان‌ها. شوراهای استانی به عنوان DAO با تخصیص بودجه خودکار عمل می‌کنند و با حذف تمرکزگرایی تهران، استقلال و نمایندگی واقعی منطقه‌ای را تضمین می‌کنند."
        },
    },
    {
        id: "economy",
        label: { en: "Economy & Finance", fa: "اقتصاد و مالی" },
        icon: "💰",
        color: "#FFF8E1",
        border: "#F9A825",
        x: 34, y: 45,
        tier: "primary",
        contents: [
            { en: "Algorithmic National Currency (Post-Rial CBDC)", fa: "ارز ملی الگوریتمی (جایگزین ریال)" },
            { en: "Universal Basic Dividend (Oil/Gas Backed)", fa: "سود پایه همگانی (با پشتوانه نفت و گاز)" },
            { en: "Programmable Tax Collection (Auto-deducted)", fa: "جمع‌آوری مالیات قابل برنامه‌ریزی (کسر خودکار)" },
            { en: "Sanction-Proof Decentralized Exchange", fa: "صرافی غیرمتمرکز و ضد تحریم" },
            { en: "Diaspora Direct Investment Pools", fa: "استخرهای سرمایه‌گذاری مستقیم دیاسپورا" },
            { en: "Anti-Corruption AI Audit Agents", fa: "عوامل حسابرسی هوش مصنوعی ضد فساد" },
        ],
        desc: {
            en: "The end of opaque state budgets. A post-Rial algorithmic currency and sanction-proof exchanges ensure financial sovereignty. Taxes auto-execute, and the national budget is a real-time public dashboard.",
            fa: "پایان بودجه‌های مبهم دولتی. یک ارز الگوریتمی جایگزین ریال و صرافی‌های ضد تحریم، حاکمیت مالی را تضمین می‌کنند. مالیات‌ها خودکار اجرا شده و بودجه ملی یک داشبورد عمومی شفاف است."
        },
    },
    {
        id: "resources",
        label: { en: "National Wealth", fa: "ثروت و منابع ملی" },
        icon: "💎",
        color: "#E8F5E9",
        border: "#1B5E20",
        x: 66, y: 45,
        tier: "primary",
        contents: [
            { en: "Tokenized Oil, Gas & Mineral Reserves", fa: "ذخایر توکن‌شده نفت، گاز و مواد معدنی" },
            { en: "Direct-to-Citizen Resource Dividend", fa: "سود مستقیم منابع به شهروندان (قرارداد هوشمند)" },
            { en: "Resource Extraction Licensing (On-Chain)", fa: "مجوزهای استخراج منابع (ثبت در شبکه)" },
            { en: "Water Rights & Drought Management", fa: "پروتکل حقوق آب و مدیریت خشکسالی" },
            { en: "Environmental Repair Fund DAO", fa: "صندوق غیرمتمرکز ترمیم محیط زیست" },
        ],
        desc: {
            en: "Iran's natural wealth is tokenized. Instead of state monopolies and shadow organizations, extraction revenues automatically trigger smart contracts that deposit dividends directly into citizens' digital wallets.",
            fa: "ثروت طبیعی ایران توکن‌سازی شده است. به جای انحصارات دولتی و نهادهای سایه، درآمدهای استخراج به طور خودکار قراردادهای هوشمندی را فعال می‌کنند که سود را مستقیماً به کیف پول شهروندان واریز می‌کند."
        },
    },
    {
        id: "infrastructure",
        label: { en: "Connectivity & Infra", fa: "زیرساخت و ارتباطات" },
        icon: "⚡",
        color: "#E8EAF6",
        border: "#283593",
        x: 50, y: 63,
        tier: "primary",
        contents: [
            { en: "Censorship-Resistant Mesh Network", fa: "شبکه غیرمتمرکز مقاوم در برابر سانسور" },
            { en: "Satellite-Backed Internet Sovereignty", fa: "لایه حاکمیت اینترنت مبتنی بر ماهواره" },
            { en: "Smart Grid & Energy Trading P2P", fa: "شبکه هوشمند و تجارت همتا به همتای انرژی" },
            { en: "Water Management IoT Mesh", fa: "شبکه اینترنت اشیا برای مدیریت آب" },
            { en: "Decentralized Cloud & Compute Network", fa: "شبکه ابری و محاسباتی غیرمتمرکز" },
        ],
        desc: {
            en: "A decentralized, censorship-resistant mesh and satellite network ensures no central authority can ever trigger an internet blackout. Critical water and power grids are IoT-monitored.",
            fa: "یک شبکه ارتباطی و ماهواره‌ای غیرمتمرکز و مقاوم در برابر سانسور تضمین می‌کند که هیچ قدرتی نتواند اینترنت را قطع کند. شبکه‌های حیاتی آب و برق توسط اینترنت اشیا نظارت می‌شوند."
        },
    },
    {
        id: "justice",
        label: { en: "Justice & Accountability", fa: "عدالت و پاسخگویی" },
        icon: "⚖️",
        color: "#FBE9E7",
        border: "#BF360C",
        x: 50, y: 15,
        tier: "secondary",
        contents: [
            { en: "Transitional Justice Immutable Ledger", fa: "دفتر کل تغییرناپذیر عدالت انتقالی" },
            { en: "Human Rights Abuse Audit Trail", fa: "ردیابی حسابرسی نقض حقوق بشر" },
            { en: "AI-Assisted Case Management", fa: "مدیریت پرونده‌ها با کمک هوش مصنوعی" },
            { en: "Decentralized Arbitration Panels", fa: "هیئت‌های داوری غیرمتمرکز" },
            { en: "On-Chain Court Records & Verdicts", fa: "سوابق و احکام دادگاه (ثبت در شبکه)" },
            { en: "Whistleblower Protection Protocol", fa: "پروتکل حمایت از افشاگران فساد" },
        ],
        desc: {
            en: "An immutable ledger handles transitional justice securely. Court records are on-chain, and whistleblower protections are baked directly into the protocol to prevent future corruption.",
            fa: "یک دفتر کل تغییرناپذیر، عدالت انتقالی را به طور امن مدیریت می‌کند. سوابق دادگاه روی شبکه ثبت می‌شوند و حمایت از افشاگران مستقیماً در پروتکل گنجانده شده تا از فساد جلوگیری شود."
        },
    },
    {
        id: "defense",
        label: { en: "Defense & Security", fa: "دفاع و امنیت" },
        icon: "🛡️",
        color: "#ECEFF1",
        border: "#37474F",
        x: 32, y: 70,
        tier: "secondary",
        contents: [
            { en: "Cybersecurity Operations Center", fa: "مرکز عملیات امنیت سایبری" },
            { en: "Decentralized Intelligence Network", fa: "شبکه اطلاعاتی غیرمتمرکز" },
            { en: "Autonomous Border Monitoring", fa: "نظارت خودمختار بر مرزها" },
            { en: "Military Chain-of-Command Protocol", fa: "پروتکل سلسله مراتب فرماندهی نظامی" },
            { en: "Civilian Oversight DAO", fa: "سازمان نظارت مدنی (شفافیت بودجه)" },
        ],
        desc: {
            en: "Cyber-first defense doctrine. A dedicated Civilian Oversight DAO ensures the military's budget and procurement are transparent, preventing the formation of shadow economies.",
            fa: "دکترین دفاعی سایبر-محور. یک نهاد مستقل نظارت مدنی تضمین می‌کند که بودجه و تدارکات نظامی شفاف باشند و از تشکیل اقتصادهای پنهان جلوگیری می‌کند."
        },
    },
    {
        id: "healthcare",
        label: { en: "Healthcare", fa: "بهداشت و درمان" },
        icon: "🏥",
        color: "#FCE4EC",
        border: "#C62828",
        x: 79, y: 35,
        tier: "secondary",
        contents: [
            { en: "Universal Health Record (Patient-Owned)", fa: "پرونده سلامت همگانی (تحت مالکیت بیمار)" },
            { en: "AI Diagnostics & Triage Network", fa: "شبکه تشخیص و تریاژ با هوش مصنوعی" },
            { en: "Decentralized Pharma Supply Chain", fa: "زنجیره تامین دارویی غیرمتمرکز" },
            { en: "Telemedicine & Remote Care Mesh", fa: "شبکه پزشکی از راه دور" },
            { en: "Post-Conflict Mental Health Network", fa: "شبکه بهداشت روان پس از بحران" },
            { en: "Community Health Worker DAO", fa: "سازمان بهورزان و مراقبان بهداشتی محلی" },
        ],
        desc: {
            en: "Citizens own their health records. AI assists diagnostics. Drug supply chains are traced end-to-end on-chain. A dedicated post-conflict mental health network addresses trauma through decentralized telemedicine.",
            fa: "شهروندان مالک سوابق پزشکی خود هستند. زنجیره تامین دارو به طور کامل روی شبکه ردیابی می‌شود. شبکه اختصاصی بهداشت روان پس از بحران، آسیب‌های روحی را از طریق پزشکی از راه دور درمان می‌کند."
        },
    },
    {
        id: "education",
        label: { en: "Education & Research", fa: "آموزش و پژوهش" },
        icon: "🎓",
        color: "#F3E5F5",
        border: "#7B1FA2",
        x: 50, y: 75,
        tier: "tertiary",
        contents: [
            { en: "Credential NFTs (Verifiable Degrees)", fa: "توکن‌های مدارک تحصیلی (قابل تأیید)" },
            { en: "Decentralized University Consortium", fa: "کنسرسیوم دانشگاهی غیرمتمرکز" },
            { en: "Open Research Commons & Funding DAOs", fa: "فضای تحقیقاتی باز و تأمین مالی" },
            { en: "Diaspora Mentorship Network", fa: "شبکه مشاوره و راهنمایی دیاسپورا" },
        ],
        desc: {
            en: "By verifying credentials on-chain and connecting funding DAOs directly to researchers, the system eliminates academic corruption and incentivizes the diaspora to return or contribute.",
            fa: "با تأیید مدارک روی شبکه و اتصال مستقیم نهادهای تأمین مالی به پژوهشگران، این سیستم فساد علمی را از بین برده و دیاسپورا را به مشارکت تشویق می‌کند."
        },
    },
    {
        id: "business",
        label: { en: "Business & Innovation", fa: "کسب‌وکار و نوآوری" },
        icon: "🏢",
        color: "#FFF3E0",
        border: "#E65100",
        x: 68, y: 70,
        tier: "tertiary",
        contents: [
            { en: "Instant Business Registration (On-Chain)", fa: "ثبت فوری کسب‌وکار (روی شبکه)" },
            { en: "Automated Regulatory Compliance", fa: "انطباق خودکار با مقررات" },
            { en: "Worker Co-op & DAO Formation Tools", fa: "ابزارهای تشکیل تعاونی‌های کارگری" },
            { en: "IP & Patent Registry (NFT-Based)", fa: "ثبت مالکیت معنوی (مبتنی بر NFT)" },
        ],
        desc: {
            en: "Frictionless commerce. Businesses register instantly on-chain, eliminating the bribery and bureaucracy historically required to start a company.",
            fa: "تجارت بدون اصطکاک. کسب‌وکارها به صورت فوری روی شبکه ثبت می‌شوند که این امر رشوه‌خواری و بروکراسی اداری برای شروع یک شرکت را از بین می‌برد."
        },
    },
    {
        id: "housing",
        label: { en: "Housing & Land", fa: "مسکن و املاک" },
        icon: "🏠",
        color: "#E0F2F1",
        border: "#00695C",
        x: 32, y: 20,
        tier: "tertiary",
        contents: [
            { en: "On-Chain Land Registry (Tokenized Titles)", fa: "ثبت اسناد املاک روی شبکه (اسناد توکن‌شده)" },
            { en: "Affordable Housing Allocation Algorithm", fa: "الگوریتم تخصیص مسکن مقرون‌به‌صرفه" },
            { en: "Building Permit Automation", fa: "اتوماسیون مجوزهای ساخت‌وساز" },
        ],
        desc: {
            en: "All land titles are tokenized on-chain, eliminating title fraud and land grabs by connected elites. Permits are automated through smart contracts.",
            fa: "تمام اسناد زمین روی شبکه توکن‌سازی می‌شوند که این امر کلاهبرداری اسناد و زمین‌خواری توسط نخبگان متصل را از بین می‌برد."
        },
    },
    {
        id: "social",
        label: { en: "Social Services", fa: "خدمات اجتماعی" },
        icon: "🤝",
        color: "#F1F8E9",
        border: "#558B2F",
        x: 21, y: 55,
        tier: "tertiary",
        contents: [
            { en: "Benefits Eligibility Engine (AI-Driven)", fa: "موتور تشخیص صلاحیت مزایا (هوش مصنوعی)" },
            { en: "Food Security & Nutrition Tracking", fa: "ردیابی امنیت غذایی و تغذیه" },
            { en: "Community Mutual Aid DAOs", fa: "سازمان‌های همیاری متقابل محلی" },
            { en: "Pension & Retirement Smart Contracts", fa: "قراردادهای هوشمند بازنشستگی و مستمری" },
            { en: "Disability Support & Accessibility Fund", fa: "صندوق حمایت از معلولان و دسترسی‌پذیری" },
            { en: "Refugee & Displaced Persons Integration", fa: "ادغام پناهندگان و آوارگان" },
        ],
        desc: {
            en: "AI determines benefits eligibility transparently, ensuring aid reaches those who need it without political patronage networks intercepting funds. Pensions, disability support, and refugee integration are automated through smart contracts.",
            fa: "هوش مصنوعی صلاحیت دریافت مزایا را به صورت شفاف تعیین می‌کند و تضمین می‌کند که کمک‌ها بدون دخالت شبکه‌های حمایت سیاسی به نیازمندان برسد. بازنشستگی، حمایت از معلولان و ادغام پناهندگان از طریق قراردادهای هوشمند خودکار می‌شوند."
        },
    },
    {
        id: "environment",
        label: { en: "Environment & Climate", fa: "محیط زیست و اقلیم" },
        icon: "🌱",
        color: "#E8F5E9",
        border: "#2E7D32",
        x: 21, y: 35,
        tier: "secondary",
        contents: [
            { en: "Water Crisis Management Protocol", fa: "پروتکل مدیریت بحران آب" },
            { en: "Lake Urmia & Wetland Restoration DAO", fa: "سازمان بازسازی دریاچه ارومیه و تالاب‌ها" },
            { en: "Carbon Credit & Emissions Trading", fa: "تجارت اعتبار کربن و انتشار گازها" },
            { en: "Desertification Monitoring (Satellite IoT)", fa: "نظارت بر بیابان‌زایی (ماهواره و اینترنت اشیا)" },
            { en: "Air Quality Real-Time Dashboard", fa: "داشبورد آنی کیفیت هوا" },
            { en: "Reforestation & Green Belt Smart Contracts", fa: "قراردادهای هوشمند جنگل‌کاری و کمربند سبز" },
        ],
        desc: {
            en: "Iran's environmental emergencies—water scarcity, dust storms, Lake Urmia's decline—are addressed through real-time IoT monitoring, satellite tracking, and community-governed restoration DAOs funded by carbon credit markets.",
            fa: "بحران‌های زیست‌محیطی ایران—کمبود آب، طوفان‌های گرد و غبار، خشک شدن دریاچه ارومیه—از طریق نظارت آنی اینترنت اشیا، ردیابی ماهواره‌ای و سازمان‌های بازسازی مردم‌محور که با بازار اعتبار کربن تأمین مالی می‌شوند، مدیریت می‌شوند."
        },
    },
    {
        id: "media",
        label: { en: "Media & Free Press", fa: "رسانه و مطبوعات آزاد" },
        icon: "📡",
        color: "#E1F5FE",
        border: "#0277BD",
        x: 68, y: 20,
        tier: "secondary",
        contents: [
            { en: "Decentralized News Verification Protocol", fa: "پروتکل تأیید اخبار غیرمتمرکز" },
            { en: "Journalist Protection & Anonymity Layer", fa: "لایه حفاظت و ناشناس‌ماندن روزنامه‌نگاران" },
            { en: "Community-Owned Media DAOs", fa: "سازمان‌های رسانه‌ای متعلق به مردم" },
            { en: "Anti-Propaganda AI Detection", fa: "تشخیص تبلیغات و اطلاعات غلط با هوش مصنوعی" },
            { en: "On-Chain Press Freedom Index", fa: "شاخص آزادی مطبوعات ثبت‌شده در شبکه" },
        ],
        desc: {
            en: "A decentralized media ecosystem where news is verified on-chain, journalists are protected by cryptographic anonymity, and community-owned DAOs replace state-controlled outlets. AI detects propaganda in real-time.",
            fa: "یک اکوسیستم رسانه‌ای غیرمتمرکز که در آن اخبار روی شبکه تأیید می‌شوند، روزنامه‌نگاران با ناشناسی رمزنگاری‌شده حفاظت می‌شوند و سازمان‌های مردم‌محور جایگزین رسانه‌های دولتی می‌شوند."
        },
    },
    {
        id: "culture",
        label: { en: "Culture & Heritage", fa: "فرهنگ و میراث" },
        icon: "🏛️",
        color: "#FFF8E1",
        border: "#FF8F00",
        x: 79, y: 55,
        tier: "tertiary",
        contents: [
            { en: "Tokenized Heritage Sites (Persepolis, Isfahan)", fa: "توکن‌سازی میراث فرهنگی (تخت‌جمشید، اصفهان)" },
            { en: "Endangered Language Preservation DAO", fa: "سازمان حفظ زبان‌های در خطر انقراض" },
            { en: "Digital Art & Music NFT Marketplace", fa: "بازار دیجیتال آثار هنری و موسیقی" },
            { en: "Cultural Festival Funding Protocol", fa: "پروتکل تأمین مالی جشنواره‌های فرهنگی" },
            { en: "Ethnic Minority Representation Registry", fa: "ثبت نمایندگی اقلیت‌های قومی" },
        ],
        desc: {
            en: "Iran's rich cultural heritage—from Persepolis to Kurdish, Balochi, and Azerbaijani traditions—is preserved through tokenized heritage sites, language preservation DAOs, and digital art marketplaces that empower diverse communities.",
            fa: "میراث فرهنگی غنی ایران—از تخت‌جمشید تا سنت‌های کردی، بلوچی و آذربایجانی—از طریق توکن‌سازی مکان‌های تاریخی، سازمان‌های حفظ زبان و بازارهای هنر دیجیتال که جوامع متنوع را توانمند می‌سازند، حفظ می‌شود."
        },
    },
];

export const CONNECTIONS = [
    { from: "citizens", to: "governance", label: { en: "Vote & Delegate", fa: "رأی و تفویض" }, strength: 3 },
    { from: "citizens", to: "economy", label: { en: "Diaspora Investment", fa: "سرمایه دیاسپورا" }, strength: 3 },
    { from: "resources", to: "economy", label: { en: "Wealth Dividend", fa: "سود ثروت ملی" }, strength: 3 },
    { from: "justice", to: "governance", label: { en: "Transitional Audit", fa: "حسابرسی انتقالی" }, strength: 3 },
    { from: "citizens", to: "healthcare", label: { en: "Health Records", fa: "پرونده سلامت" }, strength: 2 },
    { from: "citizens", to: "education", label: { en: "Credentials", fa: "مدارک تحصیلی" }, strength: 2 },
    { from: "citizens", to: "housing", label: { en: "Title Ownership", fa: "مالکیت اسناد" }, strength: 2 },
    { from: "citizens", to: "business", label: { en: "Registration", fa: "ثبت شرکت" }, strength: 2 },
    { from: "citizens", to: "culture", label: { en: "Cultural Identity", fa: "هویت فرهنگی" }, strength: 2 },
    { from: "governance", to: "economy", label: { en: "Budget Allocation", fa: "تخصیص بودجه" }, strength: 3 },
    { from: "governance", to: "defense", label: { en: "Civilian Oversight", fa: "نظارت مدنی" }, strength: 3 },
    { from: "governance", to: "justice", label: { en: "Legislation", fa: "قانون‌گذاری" }, strength: 3 },
    { from: "governance", to: "infrastructure", label: { en: "Provincial Works", fa: "پروژه‌های استانی" }, strength: 2 },
    { from: "governance", to: "media", label: { en: "Press Freedom Law", fa: "قانون آزادی مطبوعات" }, strength: 2 },
    { from: "governance", to: "environment", label: { en: "Climate Policy", fa: "سیاست اقلیمی" }, strength: 2 },
    { from: "economy", to: "business", label: { en: "Commerce & Tax", fa: "تجارت و مالیات" }, strength: 3 },
    { from: "economy", to: "infrastructure", label: { en: "Funding", fa: "تأمین مالی" }, strength: 2 },
    { from: "economy", to: "social", label: { en: "UBI / Dividend", fa: "سود همگانی" }, strength: 2 },
    { from: "healthcare", to: "social", label: { en: "Care Coordination", fa: "هماهنگی مراقبت" }, strength: 2 },
    { from: "education", to: "business", label: { en: "Innovation Pipeline", fa: "مسیر نوآوری" }, strength: 2 },
    { from: "education", to: "healthcare", label: { en: "Medical Research", fa: "پژوهش پزشکی" }, strength: 2 },
    { from: "education", to: "culture", label: { en: "Language & History", fa: "زبان و تاریخ" }, strength: 2 },
    { from: "defense", to: "infrastructure", label: { en: "Grid Protection", fa: "حفاظت شبکه" }, strength: 2 },
    { from: "defense", to: "justice", label: { en: "Military Courts", fa: "دادگاه‌های نظامی" }, strength: 2 },
    { from: "housing", to: "infrastructure", label: { en: "Utilities", fa: "خدمات شهری" }, strength: 2 },
    { from: "housing", to: "social", label: { en: "Homeless Services", fa: "خدمات بی‌خانمانان" }, strength: 2 },
    { from: "business", to: "resources", label: { en: "Extraction Licenses", fa: "مجوز استخراج" }, strength: 2 },
    { from: "infrastructure", to: "resources", label: { en: "Water/Energy IoT", fa: "مدیریت آب/انرژی" }, strength: 3 },
    { from: "environment", to: "resources", label: { en: "Eco Monitoring", fa: "نظارت زیست‌محیطی" }, strength: 3 },
    { from: "environment", to: "infrastructure", label: { en: "Green Energy", fa: "انرژی سبز" }, strength: 2 },
    { from: "environment", to: "healthcare", label: { en: "Public Health", fa: "بهداشت عمومی" }, strength: 2 },
    { from: "media", to: "justice", label: { en: "Transparency Reports", fa: "گزارش‌های شفافیت" }, strength: 2 },
    { from: "media", to: "infrastructure", label: { en: "Mesh Broadcasting", fa: "پخش شبکه‌ای" }, strength: 2 },
    { from: "culture", to: "media", label: { en: "Cultural Content", fa: "محتوای فرهنگی" }, strength: 2 },
    { from: "culture", to: "business", label: { en: "Creative Economy", fa: "اقتصاد خلاق" }, strength: 2 },
];

export const SHARED_LAYERS = [
    {
        name: { en: "Censorship-Resistant Ledger", fa: "دفتر کل مقاوم در برابر سانسور" },
        icon: "🔗",
        desc: { en: "Immutable record of all transactions, budgets, and votes, secured across distributed nodes.", fa: "ثبت تغییرناپذیر تمام تراکنش‌ها، بودجه‌ها و آرا که در گره‌های توزیع‌شده ایمن شده‌اند." }
    },
    {
        name: { en: "Zero-Knowledge Privacy", fa: "حریم خصوصی دانش صفر" },
        icon: "🔒",
        desc: { en: "Cryptographic layer allowing citizens to prove rights without revealing personal data.", fa: "لایه رمزنگاری که به شهروندان اجازه می‌دهد حقوق خود را بدون افشای داده‌های شخصی ثابت کنند." }
    },
    {
        name: { en: "Decentralized Data Mesh", fa: "شبکه داده غیرمتمرکز" },
        icon: "🗄",
        desc: { en: "Federated storage where citizens truly own their data and grant temporary access keys.", fa: "فضای ذخیره‌سازی توزیع‌شده که در آن شهروندان مالک داده‌های خود هستند و کلیدهای دسترسی موقت اعطا می‌کنند." }
    },
    {
        name: { en: "AI Anti-Corruption Engine", fa: "موتور ضد فساد هوش مصنوعی" },
        icon: "🤖",
        desc: { en: "Automated anomaly detection scanning budgets and procurement for embezzlement.", fa: "تشخیص خودکار ناهنجاری‌ها که بودجه‌ها و تدارکات را برای جلوگیری از اختلاس اسکن می‌کند." }
    },
    {
        name: { en: "Interoperability Gateway", fa: "درگاه یکپارچه‌سازی و API" },
        icon: "🔌",
        desc: { en: "Standardized protocols connecting all provincial DAOs and civic applications.", fa: "پروتکل‌های استاندارد که تمام نهادهای استانی و برنامه‌های مدنی را به هم متصل می‌کند." }
    },
];

// ── Blueprint dictionary ──────────────────────────────────────────────────────

const CM_SECTORS = [
    {
        id: "crown", label: { en: "Crown & Head of State", fa: "تاج و رئیس کشور" },
        icon: "👑", color: "#FFF8E1", border: "#F9A825",
        x: 50, y: 22, tier: "core",
        contents: [
            { en: "Constitutional Monarchy Charter", fa: "منشور پادشاهی مشروطه" },
            { en: "Royal Assent & Ceremonial Powers", fa: "تأیید سلطنتی و اختیارات تشریفاتی" },
            { en: "State Representation & Diplomacy", fa: "نمایندگی دولت و دیپلماسی" },
            { en: "National Unity & Continuity Role", fa: "نقش وحدت و تداوم ملی" },
        ],
        desc: { en: "A constitutional monarch serves as ceremonial head of state, providing national unity and continuity while executive power rests with elected officials, strictly bounded by a written constitution.", fa: "پادشاه مشروطه به عنوان رئیس تشریفاتی دولت عمل می‌کند و وحدت ملی را فراهم می‌کند، در حالی که قدرت اجرایی با مقامات منتخب است و توسط قانون اساسی محدود می‌شود." },
    },
    {
        id: "parliament", label: { en: "Parliament", fa: "پارلمان" },
        icon: "🏛️", color: "#E3F2FD", border: "#1565C0",
        x: 34, y: 38, tier: "core",
        contents: [
            { en: "Bicameral Legislature (Upper & Lower House)", fa: "قوه مقننه دو مجلسی (مجلس اعیان و عوام)" },
            { en: "Legislation & Budget Approval", fa: "قانون‌گذاری و تصویب بودجه" },
            { en: "Vote of No Confidence", fa: "رأی عدم اعتماد" },
            { en: "Parliamentary Select Committees", fa: "کمیته‌های تخصصی پارلمانی" },
            { en: "Opposition Rights & Debate", fa: "حقوق اپوزیسیون و مناظره" },
        ],
        desc: { en: "A bicameral parliament holds supreme legislative authority, passing laws, approving the national budget, and holding the government accountable through debate, committees, and confidence votes.", fa: "پارلمان دو مجلسی دارای بالاترین اقتدار قانونگذاری است و قوانین را تصویب کرده، بودجه ملی را تأیید می‌کند و دولت را از طریق مناظره، کمیته‌ها و رأی اعتماد مسئول نگه می‌دارد." },
    },
    {
        id: "primeMinister", label: { en: "Prime Minister & Cabinet", fa: "نخست‌وزیر و کابینه" },
        icon: "🎖️", color: "#E8EAF6", border: "#283593",
        x: 66, y: 38, tier: "core",
        contents: [
            { en: "Executive Government Leadership", fa: "رهبری دولت اجرایی" },
            { en: "Cabinet Portfolio Management", fa: "مدیریت پرتفولیوی کابینه" },
            { en: "Policy Implementation", fa: "اجرای سیاست‌ها" },
            { en: "Parliamentary Accountability", fa: "پاسخگویی به پارلمان" },
        ],
        desc: { en: "The Prime Minister, commanding a parliamentary majority, leads the executive branch. The Cabinet is collectively responsible to Parliament and can be removed by a vote of no confidence.", fa: "نخست‌وزیر با داشتن اکثریت پارلمانی، شاخه اجرایی را رهبری می‌کند. کابینه به طور جمعی در برابر پارلمان مسئول است و می‌تواند با رأی عدم اعتماد برکنار شود." },
    },
    {
        id: "cmTreasury", label: { en: "Treasury & Finance", fa: "خزانه‌داری و مالیه" },
        icon: "💰", color: "#FFF3E0", border: "#E65100",
        x: 27, y: 55, tier: "primary",
        contents: [
            { en: "National Budget & Fiscal Policy", fa: "بودجه ملی و سیاست مالی" },
            { en: "Taxation & Revenue Collection", fa: "مالیات و جمع‌آوری درآمد" },
            { en: "Public Debt Management", fa: "مدیریت بدهی عمومی" },
            { en: "Central Bank Oversight", fa: "نظارت بر بانک مرکزی" },
        ],
        desc: { en: "The Treasury manages national finances, sets fiscal policy, and oversees the central bank, balancing economic growth with public investment and sustainable debt levels.", fa: "خزانه‌داری امور مالی ملی را مدیریت می‌کند، سیاست مالی را تعیین می‌کند و بر بانک مرکزی نظارت می‌کند و رشد اقتصادی را با سرمایه‌گذاری عمومی و سطح بدهی پایدار متعادل می‌کند." },
    },
    {
        id: "cmJustice", label: { en: "Constitutional Court", fa: "دادگاه قانون اساسی" },
        icon: "⚖️", color: "#FBE9E7", border: "#BF360C",
        x: 50, y: 55, tier: "primary",
        contents: [
            { en: "Judicial Review of Legislation", fa: "بازنگری قضایی قوانین" },
            { en: "Rights Protection & Civil Liberties", fa: "حمایت از حقوق و آزادی‌های مدنی" },
            { en: "Constitutional Interpretation", fa: "تفسیر قانون اساسی" },
            { en: "Electoral Dispute Resolution", fa: "حل اختلافات انتخاباتی" },
        ],
        desc: { en: "An independent constitutional court reviews legislation for compliance with the constitution, protects civil liberties, and adjudicates disputes between branches of government and electoral challenges.", fa: "دادگاه قانون اساسی مستقل، قوانین را از نظر تطابق با قانون اساسی بررسی می‌کند، آزادی‌های مدنی را حفظ می‌کند و اختلافات بین قوا و چالش‌های انتخاباتی را حل و فصل می‌کند." },
    },
    {
        id: "cmCivilService", label: { en: "Civil Service", fa: "خدمات کشوری" },
        icon: "🗂️", color: "#E8F5E9", border: "#2E7D32",
        x: 73, y: 55, tier: "primary",
        contents: [
            { en: "Apolitical Professional Bureaucracy", fa: "بوروکراسی حرفه‌ای غیرسیاسی" },
            { en: "Policy Advice & Implementation", fa: "مشاوره سیاستی و اجرا" },
            { en: "Public Service Delivery", fa: "ارائه خدمات عمومی" },
            { en: "Merit-Based Civil Service Exam", fa: "آزمون خدمات کشوری مبتنی بر شایستگی" },
        ],
        desc: { en: "A professional, politically neutral civil service implements policy regardless of which party is in power, ensuring continuity of government services and providing expert advice to ministers.", fa: "خدمات کشوری حرفه‌ای و سیاسی بی‌طرف، سیاست‌ها را صرف نظر از اینکه کدام حزب در قدرت است اجرا می‌کند و تداوم خدمات دولتی را تضمین می‌کند." },
    },
    {
        id: "cmDefense", label: { en: "Defense & Security", fa: "دفاع و امنیت" },
        icon: "🛡️", color: "#ECEFF1", border: "#37474F",
        x: 27, y: 72, tier: "secondary",
        contents: [
            { en: "Armed Forces (Civilian Command)", fa: "نیروهای مسلح (فرمان مدنی)" },
            { en: "Intelligence Services (Oversight Board)", fa: "سرویس‌های اطلاعاتی (هیئت نظارت)" },
            { en: "Parliamentary Defense Committee", fa: "کمیته دفاع پارلمانی" },
            { en: "National Security Council", fa: "شورای امنیت ملی" },
        ],
        desc: { en: "Armed forces operate under strict civilian command through the Prime Minister and Parliament. An independent oversight board and parliamentary committee ensure accountability and prevent abuse.", fa: "نیروهای مسلح تحت فرمان مدنی سخت از طریق نخست‌وزیر و پارلمان عمل می‌کنند. یک هیئت نظارت مستقل و کمیته پارلمانی پاسخگویی را تضمین می‌کنند." },
    },
    {
        id: "cmMedia", label: { en: "Free Press & Media", fa: "مطبوعات آزاد و رسانه" },
        icon: "📡", color: "#E1F5FE", border: "#0277BD",
        x: 73, y: 72, tier: "secondary",
        contents: [
            { en: "Public Broadcasting Independence", fa: "استقلال رادیو و تلویزیون عمومی" },
            { en: "Press Freedom Charter", fa: "منشور آزادی مطبوعات" },
            { en: "Independent Media Regulator", fa: "تنظیم‌کننده مستقل رسانه" },
            { en: "Anti-Monopoly Media Rules", fa: "قوانین ضد انحصار رسانه" },
        ],
        desc: { en: "An independent public broadcaster and robust press freedom laws ensure citizens receive balanced information. An independent regulator prevents monopolization and protects editorial independence.", fa: "یک پخش‌کننده عمومی مستقل و قوانین قوی آزادی مطبوعات تضمین می‌کند که شهروندان اطلاعات متوازن دریافت کنند. یک تنظیم‌کننده مستقل از انحصار جلوگیری می‌کند." },
    },
    {
        id: "cmLocal", label: { en: "Local Government", fa: "حکومت محلی" },
        icon: "🏘️", color: "#F3E5F5", border: "#7B1FA2",
        x: 50, y: 72, tier: "secondary",
        contents: [
            { en: "Elected Regional Councils", fa: "شوراهای منطقه‌ای منتخب" },
            { en: "Devolved Powers & Local Budget", fa: "اختیارات تفویض‌شده و بودجه محلی" },
            { en: "Municipal Services Delivery", fa: "ارائه خدمات شهری" },
            { en: "Community Consultation Rights", fa: "حقوق مشاوره اجتماعی" },
        ],
        desc: { en: "Elected local and regional councils hold devolved powers over planning, social care, and local services, bringing governance closer to citizens and enabling regional self-determination within the constitutional framework.", fa: "شوراهای محلی و منطقه‌ای منتخب دارای اختیارات تفویض‌شده در برنامه‌ریزی، مراقبت اجتماعی و خدمات محلی هستند و حاکمیت را به شهروندان نزدیک‌تر می‌کنند." },
    },
];

const CM_CONNECTIONS = [
    { from: "crown", to: "parliament", label: { en: "Royal Assent", fa: "تأیید سلطنتی" }, strength: 2 },
    { from: "parliament", to: "primeMinister", label: { en: "Confidence Vote", fa: "رأی اعتماد" }, strength: 3 },
    { from: "primeMinister", to: "cmTreasury", label: { en: "Fiscal Direction", fa: "راهنمایی مالی" }, strength: 3 },
    { from: "primeMinister", to: "cmDefense", label: { en: "Civilian Command", fa: "فرمان مدنی" }, strength: 3 },
    { from: "primeMinister", to: "cmCivilService", label: { en: "Policy Delivery", fa: "اجرای سیاست" }, strength: 2 },
    { from: "parliament", to: "cmJustice", label: { en: "Legislative Review", fa: "بازنگری تقنینی" }, strength: 3 },
    { from: "cmJustice", to: "primeMinister", label: { en: "Constitutional Check", fa: "نظارت قانون اساسی" }, strength: 2 },
    { from: "cmTreasury", to: "cmLocal", label: { en: "Grant Funding", fa: "کمک مالی دولتی" }, strength: 2 },
    { from: "cmMedia", to: "parliament", label: { en: "Transparency", fa: "شفافیت" }, strength: 2 },
    { from: "cmLocal", to: "cmCivilService", label: { en: "Service Coordination", fa: "هماهنگی خدمات" }, strength: 2 },
];

const CM_SHARED_LAYERS = [
    { name: { en: "Constitutional Rule of Law", fa: "حاکمیت قانون اساسی" }, icon: "📜", desc: { en: "A supreme written constitution that binds all branches, protects fundamental rights, and cannot be changed without a supermajority.", fa: "قانون اساسی مکتوب عالی که تمام شاخه‌ها را متعهد می‌کند، حقوق اساسی را حفظ کرده و بدون اکثریت مطلق قابل تغییر نیست." } },
    { name: { en: "Parliamentary Sovereignty", fa: "حاکمیت پارلمانی" }, icon: "🗳️", desc: { en: "Ultimate legislative authority vests in an elected parliament, with all executive power derived from and accountable to it.", fa: "اقتدار تقنینی نهایی در پارلمان منتخب قرار دارد و تمام قدرت اجرایی از آن منبعث و در برابر آن پاسخگو است." } },
    { name: { en: "Independent Judiciary", fa: "قوه قضاییه مستقل" }, icon: "⚖️", desc: { en: "Courts operate free from political interference, guaranteeing equal access to justice and protecting individuals from arbitrary state action.", fa: "دادگاه‌ها بدون دخالت سیاسی فعالیت می‌کنند و دسترسی برابر به عدالت را تضمین می‌کنند." } },
    { name: { en: "Free & Fair Elections", fa: "انتخابات آزاد و عادلانه" }, icon: "🗳️", desc: { en: "Universal suffrage with independent electoral commissions, proportional representation, and robust anti-corruption safeguards.", fa: "حق رأی همگانی با کمیسیون‌های انتخاباتی مستقل، نمایندگی متناسب و حفاظ‌های قوی ضد فساد." } },
];

const SL_SECTORS = [
    {
        id: "slCitizens", label: { en: "Citizens & Electorate", fa: "شهروندان و رأی‌دهندگان" },
        icon: "👥", color: "#E8F5E9", border: "#2E7D32",
        x: 50, y: 20, tier: "core",
        contents: [
            { en: "Universal Suffrage & Voting Rights", fa: "حق رأی همگانی" },
            { en: "Civil Rights & Freedoms Charter", fa: "منشور حقوق و آزادی‌های مدنی" },
            { en: "Citizen Initiative & Referendum", fa: "ابتکار شهروندی و رفراندوم" },
            { en: "Digital Civic Participation Platform", fa: "پلتفرم مشارکت مدنی دیجیتال" },
            { en: "Anti-Discrimination Protections", fa: "حمایت‌های ضد تبعیض" },
        ],
        desc: { en: "Sovereign citizens are the ultimate source of political power. Universal suffrage, direct democracy mechanisms, and strong civil liberties protections form the bedrock of the secular democratic republic.", fa: "شهروندان مستقل منبع نهایی قدرت سیاسی هستند. حق رأی همگانی، مکانیزم‌های دموکراسی مستقیم و حمایت قوی از آزادی‌های مدنی، پایه جمهوری دموکراتیک سکولار را تشکیل می‌دهند." },
    },
    {
        id: "slPresident", label: { en: "Presidency", fa: "ریاست جمهوری" },
        icon: "🏛️", color: "#E3F2FD", border: "#1565C0",
        x: 33, y: 37, tier: "core",
        contents: [
            { en: "Directly Elected Head of State", fa: "رئیس کشور با انتخاب مستقیم" },
            { en: "Executive Authority & Cabinet Formation", fa: "اقتدار اجرایی و تشکیل کابینه" },
            { en: "Foreign Policy & Treaty Ratification", fa: "سیاست خارجی و تصویب معاهدات" },
            { en: "Emergency Powers (Parliamentary Oversight)", fa: "اختیارات اضطراری (با نظارت پارلمان)" },
            { en: "Term Limits (2 × 4-year terms)", fa: "محدودیت دوره تصدی (۲ × ۴ سال)" },
        ],
        desc: { en: "A directly elected president serves as both head of state and government, commanding the executive branch with a clear term limit, subject to impeachment by parliament and constitutional court review.", fa: "رئیس‌جمهور با انتخاب مستقیم هم به عنوان رئیس کشور و هم رئیس دولت عمل می‌کند، با محدودیت دوره تصدی مشخص و مشروط به استیضاح توسط پارلمان." },
    },
    {
        id: "slParliament", label: { en: "National Assembly", fa: "مجلس ملی" },
        icon: "🗳️", color: "#E8EAF6", border: "#283593",
        x: 67, y: 37, tier: "core",
        contents: [
            { en: "Proportional Representation Elections", fa: "انتخابات با نمایندگی متناسب" },
            { en: "Legislative Authority & Oversight", fa: "اقتدار تقنینی و نظارت" },
            { en: "Budget Approval & Audit", fa: "تصویب بودجه و حسابرسی" },
            { en: "Presidential Impeachment Process", fa: "فرآیند استیضاح رئیس‌جمهور" },
            { en: "Parliamentary Questions & Committees", fa: "سوالات پارلمانی و کمیته‌ها" },
        ],
        desc: { en: "A unicameral assembly elected by proportional representation holds legislative power, approves budgets, oversees the executive, and can initiate impeachment proceedings against the president.", fa: "مجلس یک‌مجلسی با انتخاب نمایندگی متناسب دارای قدرت قانونگذاری است، بودجه‌ها را تصویب می‌کند، بر قوه مجریه نظارت می‌کند و می‌تواند روند استیضاح رئیس‌جمهور را آغاز کند." },
    },
    {
        id: "slCourt", label: { en: "Constitutional Court", fa: "دادگاه قانون اساسی" },
        icon: "⚖️", color: "#FBE9E7", border: "#BF360C",
        x: 22, y: 55, tier: "primary",
        contents: [
            { en: "Judicial Review & Rights Enforcement", fa: "بازنگری قضایی و اجرای حقوق" },
            { en: "Secularism & Church-State Separation", fa: "سکولاریسم و جدایی دین از دولت" },
            { en: "Individual Rights Adjudication", fa: "دادرسی حقوق فردی" },
            { en: "Anti-Corruption Prosecution", fa: "تعقیب قضایی فساد" },
        ],
        desc: { en: "An independent constitutional court enforces secularism, reviews laws for rights compliance, and prosecutes corruption. Judicial appointments require supermajority parliamentary confirmation to prevent political capture.", fa: "دادگاه قانون اساسی مستقل، سکولاریسم را اجرا می‌کند، قوانین را از نظر رعایت حقوق بررسی کرده و فساد را تعقیب قضایی می‌کند." },
    },
    {
        id: "slFinance", label: { en: "Ministry of Finance", fa: "وزارت دارایی" },
        icon: "💰", color: "#FFF8E1", border: "#F9A825",
        x: 50, y: 55, tier: "primary",
        contents: [
            { en: "Progressive Taxation System", fa: "سیستم مالیات تصاعدی" },
            { en: "National Budget & Fiscal Discipline", fa: "بودجه ملی و انضباط مالی" },
            { en: "Sovereign Wealth Fund", fa: "صندوق ثروت ملی" },
            { en: "Independent Audit Court", fa: "دیوان محاسبات مستقل" },
        ],
        desc: { en: "A transparent, independently audited finance ministry implements progressive taxation, manages the national budget, and oversees a sovereign wealth fund that distributes resource revenues equitably.", fa: "وزارت دارایی شفاف و مستقل با نظارت حسابرسی، مالیات تصاعدی را اجرا می‌کند، بودجه ملی را مدیریت می‌کند و بر صندوق ثروت ملی نظارت می‌کند." },
    },
    {
        id: "slCivilSociety", label: { en: "Civil Society & NGOs", fa: "جامعه مدنی و سازمان‌های غیردولتی" },
        icon: "🤝", color: "#F1F8E9", border: "#558B2F",
        x: 78, y: 55, tier: "primary",
        contents: [
            { en: "Free Association & Assembly Rights", fa: "حقوق آزادی اجتماعات و تجمع" },
            { en: "NGO Registration & Independence", fa: "ثبت و استقلال سازمان‌های غیردولتی" },
            { en: "Watchdog & Accountability Groups", fa: "گروه‌های نظارتی و پاسخگویی" },
            { en: "Trade Unions & Labor Rights", fa: "اتحادیه‌های کارگری و حقوق کار" },
        ],
        desc: { en: "A vibrant civil society with protected rights to organize, advocate, and hold power accountable acts as the fourth pillar of democracy, checking both government and corporate power.", fa: "جامعه مدنی پویا با حقوق محافظت‌شده برای سازماندهی، حمایت و پاسخگویی نگه داشتن قدرت، به عنوان رکن چهارم دموکراسی عمل می‌کند." },
    },
    {
        id: "slDefense", label: { en: "Defense Forces", fa: "نیروهای دفاعی" },
        icon: "🛡️", color: "#ECEFF1", border: "#37474F",
        x: 28, y: 72, tier: "secondary",
        contents: [
            { en: "Civilian Supremacy Over Military", fa: "برتری مدنی بر نظامی" },
            { en: "Parliamentary Defense Oversight", fa: "نظارت پارلمانی بر دفاع" },
            { en: "Transparent Defense Budget", fa: "بودجه دفاعی شفاف" },
            { en: "Professional Volunteer Armed Forces", fa: "نیروهای مسلح حرفه‌ای داوطلب" },
        ],
        desc: { en: "Defense forces operate under absolute civilian control with fully transparent budgets, parliamentary oversight, and a professional volunteer structure — preventing the emergence of any praetorianism.", fa: "نیروهای دفاعی تحت کنترل مطلق مدنی با بودجه کاملاً شفاف، نظارت پارلمانی و ساختار داوطلبانه حرفه‌ای فعالیت می‌کنند." },
    },
    {
        id: "slMedia", label: { en: "Free Media & Press", fa: "رسانه و مطبوعات آزاد" },
        icon: "📡", color: "#E1F5FE", border: "#0277BD",
        x: 50, y: 72, tier: "secondary",
        contents: [
            { en: "Press Freedom Constitutional Guarantee", fa: "تضمین قانون اساسی آزادی مطبوعات" },
            { en: "Pluralistic Media Ownership Rules", fa: "قوانین مالکیت رسانه‌ای چندگانه" },
            { en: "Public Broadcaster Independence", fa: "استقلال رادیو و تلویزیون عمومی" },
            { en: "Journalist Protection Law", fa: "قانون حمایت از روزنامه‌نگاران" },
        ],
        desc: { en: "Constitutional press freedom guarantees, anti-monopoly media rules, and a publicly funded but editorially independent broadcaster create an information ecosystem that sustains democratic accountability.", fa: "تضمین‌های قانون اساسی آزادی مطبوعات، قوانین ضد انحصار رسانه‌ای و یک رادیو و تلویزیون عمومی مستقل، یک اکوسیستم اطلاعاتی ایجاد می‌کند که پاسخگویی دموکراتیک را حفظ می‌کند." },
    },
    {
        id: "slRegions", label: { en: "Regional Government", fa: "دولت منطقه‌ای" },
        icon: "🗺️", color: "#E0F2F1", border: "#00695C",
        x: 72, y: 72, tier: "secondary",
        contents: [
            { en: "Elected Regional Governors", fa: "استانداران منتخب منطقه‌ای" },
            { en: "Fiscal Autonomy & Local Taxation", fa: "خودمختاری مالی و مالیات محلی" },
            { en: "Regional Language & Cultural Rights", fa: "حقوق زبانی و فرهنگی منطقه‌ای" },
            { en: "Regional Development Councils", fa: "شوراهای توسعه منطقه‌ای" },
        ],
        desc: { en: "Elected regional governments hold meaningful fiscal and legislative autonomy, protecting linguistic and cultural minorities while coordinating with the national government on cross-regional issues.", fa: "دولت‌های منطقه‌ای منتخب دارای خودمختاری مالی و قانونگذاری معنادار هستند و از اقلیت‌های زبانی و فرهنگی حمایت می‌کنند." },
    },
];

const SL_CONNECTIONS = [
    { from: "slCitizens", to: "slPresident", label: { en: "Direct Election", fa: "انتخاب مستقیم" }, strength: 3 },
    { from: "slCitizens", to: "slParliament", label: { en: "Direct Election", fa: "انتخاب مستقیم" }, strength: 3 },
    { from: "slPresident", to: "slFinance", label: { en: "Budget Authority", fa: "اقتدار بودجه" }, strength: 3 },
    { from: "slPresident", to: "slDefense", label: { en: "Commander-in-Chief", fa: "فرمانده کل" }, strength: 3 },
    { from: "slParliament", to: "slCourt", label: { en: "Appointment Confirmation", fa: "تأیید انتصاب" }, strength: 2 },
    { from: "slCourt", to: "slPresident", label: { en: "Constitutional Check", fa: "نظارت قانون اساسی" }, strength: 3 },
    { from: "slCourt", to: "slParliament", label: { en: "Judicial Review", fa: "بازنگری قضایی" }, strength: 2 },
    { from: "slCivilSociety", to: "slParliament", label: { en: "Advocacy & Pressure", fa: "حمایت و فشار" }, strength: 2 },
    { from: "slFinance", to: "slRegions", label: { en: "Fiscal Transfers", fa: "انتقال مالی" }, strength: 2 },
    { from: "slMedia", to: "slParliament", label: { en: "Accountability", fa: "پاسخگویی" }, strength: 2 },
    { from: "slMedia", to: "slCivilSociety", label: { en: "Public Discourse", fa: "گفتمان عمومی" }, strength: 2 },
    { from: "slRegions", to: "slCivilSociety", label: { en: "Local Organizing", fa: "سازماندهی محلی" }, strength: 1 },
];

const SL_SHARED_LAYERS = [
    { name: { en: "Strict Secularism", fa: "سکولاریسم سخت" }, icon: "🔭", desc: { en: "Complete separation of religion and state: no religious body may influence law, and all citizens are equal regardless of faith, with full freedom of belief and practice.", fa: "جدایی کامل دین از دولت: هیچ نهاد دینی نمی‌تواند بر قانون تأثیر بگذارد و تمام شهروندان صرف نظر از اعتقادشان برابر هستند." } },
    { name: { en: "Constitutional Rights Charter", fa: "منشور حقوق قانون اساسی" }, icon: "📜", desc: { en: "A comprehensive bill of rights entrenched in the constitution guarantees civil, political, economic, and social rights enforceable in court.", fa: "یک منشور جامع حقوق در قانون اساسی، حقوق مدنی، سیاسی، اقتصادی و اجتماعی قابل اجرا در دادگاه را تضمین می‌کند." } },
    { name: { en: "Separation of Powers", fa: "تفکیک قوا" }, icon: "⚖️", desc: { en: "Legislative, executive, and judicial branches are strictly separated with mutual checks and balances preventing any concentration of power.", fa: "قوای مقننه، مجریه و قضاییه به طور کامل از هم جدا هستند و با بررسی و توازن متقابل از تمرکز قدرت جلوگیری می‌کنند." } },
    { name: { en: "Open Government & Transparency", fa: "دولت باز و شفافیت" }, icon: "🔍", desc: { en: "Freedom of information laws, mandatory asset declarations for officials, open budget data, and whistleblower protection create radical governmental transparency.", fa: "قوانین آزادی اطلاعات، اعلام اجباری دارایی مقامات، داده‌های بودجه باز و حمایت از افشاگران، شفافیت رادیکال دولتی ایجاد می‌کند." } },
];

export const BLUEPRINTS = {
    decentralized: {
        id: "decentralized",
        name: { en: "Decentralized Digital Government", fa: "دولت دیجیتال و غیرمتمرکز" },
        sectors: SECTORS,
        connections: CONNECTIONS,
        sharedLayers: SHARED_LAYERS,
    },
    constMonarchy: {
        id: "constMonarchy",
        name: { en: "Constitutional Monarchy", fa: "پادشاهی مشروطه" },
        sectors: CM_SECTORS,
        connections: CM_CONNECTIONS,
        sharedLayers: CM_SHARED_LAYERS,
    },
    secularLiberal: {
        id: "secularLiberal",
        name: { en: "Secular Democratic Republic", fa: "جمهوری دموکراتیک سکولار" },
        sectors: SL_SECTORS,
        connections: SL_CONNECTIONS,
        sharedLayers: SL_SHARED_LAYERS,
    },
};