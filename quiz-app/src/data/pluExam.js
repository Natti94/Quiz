export const questionsPluExam = [
  {
    level: "G",
    question: "Vad är en webbapplikation?",
    options: [
      "En applikation byggd med HTML, CSS och JavaScript (ofta som separata filer) som körs i webbläsaren",
      "Ett operativsystem som installeras lokalt",
      "Enbart ett mobilspel",
      "En databas utan användargränssnitt",
    ],
    correct: 0,
    explanation:
      "En webbapp använder HTML (struktur), CSS (utseende) och JavaScript (logik) och körs i webbläsaren. Ex: Gmail, Spotify Web.",
  },
  {
    level: "G",
    question: "Vad är en bundler?",
    options: [
      "Ett verktyg som analyserar moduler och skapar produktionsklara bundles",
      "Ett verktyg som kör end-to-end-tester",
      "Ett RAM-optimeringsprogram",
      "Ett CSS-ramverk",
    ],
    correct: 0,
    explanation:
      "Samlar många filer (JS, CSS, assets) till få optimerade filer för webben. Ex: Webpack, Vite/Rollup, Parcel, esbuild.",
  },
  {
    level: "G",
    question: "Vad menas med packaging i frontend-sammanhang?",
    options: [
      "Att paketera kod och alla beroenden för att kunna distribueras/installeras/köras någon annanstans",
      "Att skapa en fysisk kartong för mjukvaran",
      "Att kompilera till maskinkod för CPU:n",
      "Att endast lägga till kommentarer i koden",
    ],
    correct: 0,
    explanation:
      "Packaging = färdigt paket (inkl. beroenden, manifest/metadata, bundles) som kan distribueras och användas.",
  },
  {
    level: "G",
    question: "Vad är Webpack?",
    options: [
      "Ett populärt bundlingsverktyg för JavaScript-appar",
      "Ett versionshanteringssystem",
      "Ett relationsdatabashanterare",
      "Ett UI-bibliotek för React",
    ],
    correct: 0,
    explanation:
      "En bundler som bygger beroendegraf från import/export och producerar bundles (loaders, plugins).",
  },
  {
    level: "G",
    question: "Skillnad mellan modul och paket (module vs package)?",
    options: [
      "Modul = enskild fil/enhet med export/import; Paket = distribuerbar enhet (npm) med version och package.json",
      "Modul = distribuerbar enhet; Paket = enskild fil",
      "Modul = endast CSS; Paket = endast JS",
      "Det finns ingen skillnad",
    ],
    correct: 0,
    explanation:
      "Modul är oftast en fil/delmodul. Paket är en publicerad artefakt (ofta många moduler) med metadata i package.json.",
  },
  {
    level: "G",
    question: "Vad har npm för roll?",
    options: [
      "Paket- och beroendehanterare samt registry för JavaScript/Node",
      "Ett testbibliotek för React",
      "En webbläsarmotor",
      "En databasserver",
    ],
    correct: 0,
    explanation:
      "Installerar/uppdaterar paket, kör scripts och kopplar mot npm Registry.",
  },
  {
    level: "G",
    question: "Vad är minifiering?",
    options: [
      "Att reducera filstorlek genom att ta bort blanksteg/kommentarer och korta identifierare",
      "Att skapa fler moduler",
      "Att lägga till typdefinitioner",
      "Att kryptera källkoden",
    ],
    correct: 0,
    explanation: "Mindre filer ⇒ snabbare laddning utan att ändra beteendet.",
  },
  {
    level: "G",
    question: "Vad är Babel?",
    options: [
      "En transpiler/översättare som gör modern JS/JSX/TS kompatibel med äldre miljöer",
      "Ett CSS-preprocessorverktyg",
      "En databasdrivrutin",
      "Ett versionshanteringssystem",
    ],
    correct: 0,
    explanation:
      "Översätter modern JS/JSX/TS till äldre JS så det fungerar i fler webbläsare.",
  },
  {
    level: "G",
    question: "Vad uppfyller package.json för syfte?",
    options: [
      "Lista beroenden, definiera scripts och beskriva projektets version/metadata",
      "Lagrar endast CSS-variabler",
      "Innehåller databas-scheman",
      "Är en backup av README",
    ],
    correct: 0,
    explanation: "Projektets metadata, beroenden och scripts (kommandoalias).",
  },
  {
    level: "VG",
    question: "Vad är tree-shaking?",
    options: [
      "Att ta bort oanvänd kod (döda exporter) under bundling baserat på statisk analys",
      "Att skaka DOM-trädet för att göra layout snabbare",
      "Att rensa npm-cache",
      "Att minifiera CSS-variabler",
    ],
    correct: 0,
    explanation:
      "Eliminerar oanvända exporter för mindre och snabbare bundles.",
  },
  {
    level: "VG",
    question: "Vad är en source map?",
    options: [
      "En karta mellan genererad kod och originalkällor för debugging",
      "En databasindexfil",
      "En fil som innehåller hemligheter",
      "En testlogg",
    ],
    correct: 0,
    explanation:
      "Gör det möjligt att felsöka bundlad/minifierad/transpilerad kod som om du kör originalkällorna.",
  },
  {
    level: "VG",
    question:
      "Vilka 'typer' förekommer i praktiken när vi pratar om JavaScript?",
    options: [
      "CommonJS, ES Modules (ES6) och TypeScript – modulsystem/språkvariant som används i olika miljöer",
      "JavaScript finns i två typer: frontend och backend",
      "ES5, ES6 och ES7 är tre olika språk",
      "Varje webbläsare har sin egen JavaScript-dialekt",
    ],
    correct: 0,
    explanation:
      "CJS och ESM som modulsystem; TypeScript som typat superset av JS.",
  },
  {
    level: "VG",
    question: "Vad innebär Separation of Concerns (SoC)?",
    options: [
      "Att dela upp systemet i tydliga ansvarsområden för enklare underhåll",
      "Att samla all logik i en fil för snabbare läsning",
      "Att skriva all CSS inline i HTML",
      "Att duplicera kod för att undvika beroenden",
    ],
    correct: 0,
    explanation:
      "Separera ansvar (UI, state, nätverk, stil) för läsbarhet och återanvändning.",
  },
  {
    level: "VG",
    question: "Vad är CI/CD?",
    options: [
      "Continuous Integration och Continuous Delivery/Deployment",
      "Code Injection och Code Deletion",
      "Centralized Infrastructure och Container Daemon",
      "Cloud Interface och Client Debugger",
    ],
    correct: 0,
    explanation:
      "CI = ofta integrera och testa. CD = leverera till staging/produktion snabbt och säkert.",
  },
];
