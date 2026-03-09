// data.js

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