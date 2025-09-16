export const questionsPluExam = [
  {
    question: "Vad är en webbapplikation?",
    options: [
      "En applikation byggd med HTML, CSS och JavaScript (ofta som separata filer) som körs i webbläsaren",
      "Ett operativsystem som installeras lokalt",
      "Enbart ett mobilspel",
      "En databas utan användargränssnitt",
    ],
    correct: 0,
    explanation:
      "En webbapp använder webteknikerna HTML (struktur), CSS (stil) och JavaScript (logik) och körs i en webbläsare.",
  },
  {
    question: "Vad innebär bundling i webbutveckling?",
    options: [
      "Att samla moduler (import/export) till ett eller flera optimerade paket",
      "Att komprimera bilder med lossless-algoritmer",
      "Att skapa en databasdump",
      "Att skriva HTML manuellt utan moduler",
    ],
    correct: 0,
    explanation:
      "Bundling slår ihop beroenden och källfiler till en eller flera bundles för effektiv leverans till webbläsaren.",
  },
  {
    question: "Vad menas med packaging i frontend-sammanhang?",
    options: [
      "Att paketera kod och alla beroenden för att kunna distribueras/installeras/köras någon annanstans",
      "Att skapa en fysisk kartong för mjukvaran",
      "Att kompilera till maskinkod för CPU:n",
      "Att endast lägga till kommentarer i koden",
    ],
    correct: 0,
    explanation:
      "Packaging = göra koden till ett färdigt paket (inkl. beroenden, manifest/metadata, bundles) som kan distribueras och användas.",
  },
  {
    question: "Vad är Webpack?",
    options: [
      "Ett populärt bundlingsverktyg för JavaScript-appar",
      "Ett versionshanteringssystem",
      "Ett relationsdatabashanterare",
      "Ett UI-bibliotek för React",
    ],
    correct: 0,
    explanation:
      "Webpack är en bundler som bygger beroendegrafer från import/export och producerar bundles med stöd för loaders och plugins.",
  },
  {
    question: "Vad är en bundler?",
    options: [
      "Ett verktyg som analyserar moduler och skapar produktionsklara bundles",
      "Ett verktyg som kör end-to-end-tester",
      "Ett RAM-optimeringsprogram",
      "Ett CSS-ramverk",
    ],
    correct: 0,
    explanation:
      "Bundlers (t.ex. Webpack, Vite/Rollup, Parcel, esbuild) samlar kod och beroenden till optimerade utdata för webben.",
  },
  {
    question: "Skillnad mellan modul och paket (module vs package)?",
    options: [
      "Modul = enskild fil/enhet med export/import; Paket = distribuerbar enhet (npm) med version och package.json",
      "Modul = distribuerbar enhet; Paket = enskild fil",
      "Modul = endast CSS; Paket = endast JS",
      "Det finns ingen skillnad",
    ],
    correct: 0,
    explanation:
      "En modul är typiskt en fil eller delmodul i koden. Ett paket är en publicerad artefakt (ofta många moduler) med metadata i package.json.",
  },
  {
    question: "Vad har npm för roll?",
    options: [
      "Paket- och beroendehanterare samt registry för JavaScript/Node",
      "Ett testbibliotek för React",
      "En webbläsarmotor",
      "En databasserver",
    ],
    correct: 0,
    explanation:
      "npm installerar och hanterar beroenden, kör scripts och kopplar mot npm Registry där paket publiceras.",
  },
  {
    question: "Vilka är alternativ till npm?",
    options: [
      "Yarn, pnpm, Bun",
      "Git, Subversion, Mercurial",
      "Docker, Kubernetes, Terraform",
      "Mocha, Jest, Vitest",
    ],
    correct: 0,
    explanation:
      "Yarn, pnpm och Bun är vanliga alternativ till npm för hantering av paket och scripts.",
  },
  {
    question: "Vad är Babel?",
    options: [
      "En transpiler/översättare som gör modern JS/JSX/TS kompatibel med äldre miljöer",
      "Ett CSS-preprocessorverktyg",
      "En databasdrivrutin",
      "Ett versionshanteringssystem",
    ],
    correct: 0,
    explanation:
      "Babel översätter ES6+/JSX/ev. TS till äldre JS så att koden fungerar i fler webbläsare och miljöer.",
  },
  {
    question: "Vad menas med kompilering (compiling)?",
    options: [
      "Att översätta källkod till ett annat format (t.ex. maskinkod eller bytecode)",
      "Att formatera kodstil enligt en linter",
      "Att endast döpa om variabler",
      "Att köra koden rad för rad utan översättning",
    ],
    correct: 0,
    explanation:
      "Kompilering översätter källkod till ett målformat som datorn kan exekvera eller som en VM kan köra.",
  },
  {
    question: "Vad är transpiling?",
    options: [
      "Att konvertera mellan närliggande språk/versionsnivåer (t.ex. ES2023 → ES5)",
      "Att översätta direkt till maskinkod",
      "Att debugga med breakpoints",
      "Att skapa databastabeller",
    ],
    correct: 0,
    explanation:
      "Transpilering konverterar källkod till en annan variant på ungefär samma abstraktionsnivå. Babel är ett exempel.",
  },
  {
    question: "Vad innebär att JavaScript är interpreterat?",
    options: [
      "Koden tolkas och körs av en motor (ofta med JIT) utan ett separat manuellt kompilationssteg",
      "Koden måste alltid kompileras till maskinkod i förväg",
      "Koden kan bara köras på Linux",
      "Koden kan inte debuggas",
    ],
    correct: 0,
    explanation:
      "JS-motorer tolkar och JIT-kompilerar körningstid. Utvecklare kör normalt utan ett separat manuellt compile-steg.",
  },
  {
    question: "Vad är minifiering?",
    options: [
      "Att reducera filstorlek genom att ta bort blanksteg/kommentarer och korta identifierare",
      "Att skapa fler moduler",
      "Att lägga till typdefinitioner",
      "Att kryptera källkoden",
    ],
    correct: 0,
    explanation:
      "Minifiering optimerar leveransstorlek och därmed laddningstider utan att ändra kodens beteende.",
  },
  {
    question: "Vad uppfyller package.json för syfte?",
    options: [
      "Lista beroenden, definiera scripts och beskriva projektets version/metadata",
      "Lagrar endast CSS-variabler",
      "Innehåller databas-scheman",
      "Är en backup av README",
    ],
    correct: 0,
    explanation:
      "Kort sagt: package.json anger beroenden, scripts och projektmetadata (namn, version m.m.).",
  },
  {
    question: "Vad betyder metadata?",
    options: [
      "Information om annan information (data om data)",
      "Körbar programkod",
      "En typ av kryptering",
      "En grafikfil",
    ],
    correct: 0,
    explanation:
      "Metadata beskriver annan data, t.ex. paketnamn, version och beroenden i package.json.",
  },
  {
    question: "Vad är tree-shaking?",
    options: [
      "Att ta bort oanvänd kod (döda exporter) under bundling baserat på statisk analys",
      "Att skaka DOM-trädet för att göra layout snabbare",
      "Att rensa npm-cache",
      "Att minifiera CSS-variabler",
    ],
    correct: 0,
    explanation:
      "Tree-shaking eliminerar kod som aldrig används (t.ex. oanvända ES-modul-exporter) för mindre bundles.",
  },
  {
    question: "Vad är en source map?",
    options: [
      "En karta mellan genererad kod och originalkällor för debugging",
      "En databasindexfil",
      "En fil som innehåller hemligheter",
      "En testlogg",
    ],
    correct: 0,
    explanation:
      "Source maps gör det möjligt att felsöka bundlad/minifierad/transpilerad kod som om du kör originalkällorna.",
  },
  {
    question:
      'Vilka "typer" förekommer i praktiken när vi pratar om JavaScript?',
    options: [
      "CommonJS, ES Modules (ES6) och TypeScript – modulsystem/språkvariant som används i olika miljöer",
      "JavaScript finns i två typer: frontend och backend",
      "ES5, ES6 och ES7 är tre olika språk",
      "Varje webbläsare har sin egen JavaScript-dialekt",
    ],
    correct: 0,
    explanation:
      "I praktiken stöter vi på CommonJS (CJS) och ES Modules (ESM) som modulsystem, samt TypeScript som ett typat superset av JS.",
  },
  {
    question: "Vad innebär Separation of Concerns (SoC)?",
    options: [
      "Att dela upp systemet i tydliga ansvarsområden för enklare underhåll",
      "Att samla all logik i en fil för snabbare läsning",
      "Att skriva all CSS inline i HTML",
      "Att duplicera kod för att undvika beroenden",
    ],
    correct: 0,
    explanation:
      "SoC minskar koppling och ökar återanvändning genom att separera ansvar (t.ex. UI, state, nätverk, stil).",
  },
  {
    question: "Vad är CI/CD?",
    options: [
      "Continuous Integration och Continuous Delivery/Deployment",
      "Code Injection och Code Deletion",
      "Centralized Infrastructure och Container Daemon",
      "Cloud Interface och Client Debugger",
    ],
    correct: 0,
    explanation:
      "CI/CD automatiserar bygg, test och leverans. CI integrerar ändringar ofta; CD levererar till staging/produktion snabbt och säkert.",
  },
  {
    question: "Skillnad mellan Continuous Delivery och Continuous Deployment?",
    options: [
      "Delivery kräver manuellt godkännande; Deployment släpper automatiskt till produktion",
      "Delivery är snabbare än Deployment",
      "Deployment kräver manuellt godkännande; Delivery är alltid automatisk",
      "Ingen skillnad – de är samma sak",
    ],
    correct: 0,
    explanation:
      "I Continuous Delivery är produktionsrelease ett manuellt steg; i Continuous Deployment sker releasen automatiskt efter godkända tester.",
  },
];
