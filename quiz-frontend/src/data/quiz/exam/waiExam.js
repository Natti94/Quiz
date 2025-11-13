export const questionsWaiExam = [
  {
    question: "Vad är HTTPS (HyperText Transfer Protocol Secure)?",
    options: [
      "Ett säkert kommunikationsprotokoll som krypterar data mellan webbläsare och server med TLS/SSL",
      "Ett filöverföringsprotokoll för FTP-servrar",
      "En databasanslutningsmetod",
      "Ett programmeringsspråk för webbutveckling",
    ],
    correct: 0,
    explanation:
      "HTTPS är HTTP med TLS/SSL-kryptering. Det skyddar data under överföring och säkerställer autenticitet genom certifikat.",
    level: "G",
  },
  {
    question: "Vad är TLS (Transport Layer Security)?",
    options: [
      "Ett kryptografiskt protokoll som säkerställer säker kommunikation över nätverk genom kryptering och autentisering",
      "Ett operativsystem för servrar",
      "En typ av databas",
      "Ett JavaScript-ramverk",
    ],
    correct: 0,
    explanation:
      "TLS (efterföljare till SSL) krypterar data, autentiserar servern och säkerställer dataintegritet. Används av HTTPS, email, etc.",
    level: "G",
  },
  {
    question: "Vad är UDP (User Datagram Protocol)?",
    options: [
      "Ett snabbt, anslutningslöst protokoll som skickar data utan garanti för leverans eller ordning",
      "Ett säkert protokoll för filöverföring",
      "En databasklient",
      "Ett versionshanteringssystem",
    ],
    correct: 0,
    explanation:
      "UDP är snabbt men opålitligt (ingen handshake, ingen bekräftelse). Används för streaming, gaming, DNS där hastighet är viktigare än garanterad leverans.",
    level: "G",
  },
  {
    question: "Vad är TCP (Transmission Control Protocol)?",
    options: [
      "Ett pålitligt, anslutningsorienterat protokoll som garanterar leverans och ordning av datapaket",
      "Ett protokoll för trådlös kommunikation",
      "En webbläsarmotor",
      "Ett CSS-preprocessorverktyg",
    ],
    correct: 0,
    explanation:
      "TCP etablerar anslutning (3-way handshake), bekräftar leverans, ordnar paket och återskickar vid förlust. Används av HTTP, email, FTP.",
    level: "G",
  },
  {
    question: "Vad är JSON (JavaScript Object Notation)?",
    options: [
      "Ett lättviktigt dataformat för utbyte av strukturerad data baserat på JavaScript-syntax",
      "Ett programmeringsspråk",
      "En databasmotor",
      "Ett krypteringsprotokoll",
    ],
    correct: 0,
    explanation:
      "JSON är textbaserat, läsbart och språkoberoende format för att representera objekt, arrayer, strängar, nummer, boolean och null. Vanligt i API:er.",
    level: "G",
  },
  {
    question: "Vad är CSRF (Cross-Site Request Forgery)?",
    options: [
      "En attack där angripare lurar en inloggad användare att utföra oönskade handlingar på en webbplats",
      "Ett säkert autentiseringsprotokoll",
      "En metod för att kryptera cookies",
      "Ett versionshanteringssystem",
    ],
    correct: 0,
    explanation:
      "CSRF utnyttjar användarens aktiva session för att utföra handlingar utan deras vetskap. Skyddas med CSRF-tokens, SameSite cookies och Origin-kontroller.",
    level: "G",
  },
  {
    question: "Vad är en URL (Uniform Resource Locator)?",
    options: [
      "En adress som identifierar och lokaliserar en resurs på internet",
      "Ett krypteringsverktyg",
      "En databasanslutning",
      "Ett JavaScript-bibliotek",
    ],
    correct: 0,
    explanation:
      "URL består av: protokoll (https://), domän (example.com), sökväg (/path), query (?key=value) och fragment (#section). Exempel: https://example.com/page?id=123",
    level: "G",
  },
  {
    question: "Vad är ECMAScript (standarden för JavaScript)?",
    options: [
      "En specifikation som definierar JavaScript-språkets syntax, semantik och standardbibliotek",
      "En webbläsare",
      "Ett CSS-ramverk",
      "En databasserver",
    ],
    correct: 0,
    explanation:
      "ECMA-262 standardiserar JavaScript. Versioner: ES5 (2009), ES6/ES2015 (modules, arrow functions), ES2016+ (årliga uppdateringar). TC39 förvaltar standarden.",
    level: "G",
  },
  {
    question: "Vad är W3C (World Wide Web Consortium)?",
    options: [
      "En internationell organisation som utvecklar webbstandarder för HTML, CSS, accessibility och mer",
      "Ett företag som säljer webbhosting",
      "Ett programmeringsspråk",
      "En säkerhetscertifiering",
    ],
    correct: 0,
    explanation:
      "W3C utvecklar standarder för att säkerställa webbens långsiktiga tillväxt och interoperabilitet mellan webbläsare och plattformar.",
    level: "G",
  },
  {
    question:
      "OBS! Denna fråga ger mest poäng. Vad är OWASP (Open Web Application Security Project) och beskriv ett av de tio största säkerhetshoten, t.ex. XSS (Cross-Site Scripting)?",
    options: [
      "En ideell organisation som dokumenterar webbsäkerhetsrisker. XSS = injektion av skadlig JavaScript-kod i webbsidor",
      "Ett företag som säljer säkerhetsprodukter",
      "Ett programmeringsspråk för säkerhet",
      "En typ av krypteringsalgoritm",
    ],
    correct: 0,
    explanation:
      "OWASP publicerar 'Top 10' säkerhetsrisker. XSS uppstår när användarinput körs som kod. Skydda med: input-validering, output-encoding, Content Security Policy (CSP).",
    level: "VG",
  },
  {
    question:
      "Vad är GDPR (General Data Protection Regulation) och varför infördes denna lagstiftning?",
    options: [
      "EU:s dataskyddsförordning från 2018 som reglerar hantering av personuppgifter för att skydda individers integritet och rättigheter",
      "Ett amerikanskt företag som hanterar molntjänster",
      "En typ av databas",
      "Ett krypteringsprotokoll",
    ],
    correct: 0,
    explanation:
      "GDPR harmoniserar dataskydd inom EU, ger individer kontroll över sina data och kräver att organisationer hanterar personuppgifter säkert och transparent.",
    level: "VG",
  },
  {
    question:
      "Vad räknas som personuppgifter enligt GDPR (General Data Protection Regulation)?",
    options: [
      "All information som direkt eller indirekt kan identifiera en levande person (namn, IP, cookies, biometri, location, etc.)",
      "Endast personnummer och pass",
      "Endast kreditkortsinformation",
      "Endast företagsnamn",
    ],
    correct: 0,
    explanation:
      "Personuppgifter inkluderar: namn, email, telefon, IP-adress, cookies, biometriska data, GPS-position, sociala medier-profiler och mer.",
    level: "VG",
  },
  {
    question:
      "Vilka är de grundläggande principerna inom GDPR (General Data Protection Regulation)? (Ange de 7 principerna)",
    options: [
      "Laglighet, ändamålsbegränsning, minimering, korrekthet, lagringsminimering, integritet/säkerhet, ansvarsskyldighet",
      "Snabbhet, effektivitet, lönsamhet, skalbarhet, användbarhet, tillgänglighet, support",
      "Design, implementation, test, deploy, monitor, maintain, retire",
      "Endast säkerhet och kryptering",
    ],
    correct: 0,
    explanation:
      "1) Laglighet/transparens 2) Ändamålsbegränsning 3) Dataminimering 4) Korrekthet 5) Lagringsminimering 6) Integritet & säkerhet 7) Ansvarsskyldighet (accountability).",
    level: "VG",
  },
  {
    question:
      "Vad innebär 'Right to be forgotten' inom GDPR (General Data Protection Regulation) och hur påverkar det företag och användare?",
    options: [
      "Rätten att begära radering av personuppgifter när de inte längre behövs eller samtycke dras tillbaka",
      "Rätten att glömma sitt lösenord",
      "Rätten att radera företagets databas",
      "Rätten att inte betala för tjänster",
    ],
    correct: 0,
    explanation:
      "Artikel 17: Individer kan kräva radering om: samtycke dras tillbaka, uppgifter inte längre nödvändiga, inga lagliga grunder finns. Företag måste ha processer för raderingsförfrågningar.",
    level: "VG",
  },
  {
    question:
      "Vad säger artikel 25 i GDPR (General Data Protection Regulation) och hur påverkar det oss som programmerare när vi utvecklar system och applikationer?",
    options: [
      "Data Protection by Design and by Default: integritetsskydd ska byggas in från start och standardinställningar ska vara mest privata",
      "Alla system måste vara open source",
      "Alla applikationer måste använda blockchain",
      "Programmerare behöver inte tänka på GDPR",
    ],
    correct: 0,
    explanation:
      "Artikel 25 kräver: privacy från design-fasen, minimera datainsamling som standard, pseudonymisering/kryptering, principle of least privilege. Påverkar arkitektur, databaser, API:er och UI.",
    level: "VG",
  },
];
