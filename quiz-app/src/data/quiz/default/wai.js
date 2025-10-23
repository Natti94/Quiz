export const questionsWai = [
  {
    question: "Vad står HTTP för och vad är det?",
    options: [
      "HyperText Transfer Protocol – protokoll för att överföra hypertext över nätverk",
      "High Throughput Transport – ett protokoll för filöverföring mellan servrar",
      "Hyper Terminal Text Processor – ett verktyg för att komprimera webbsidor",
      "Host Transfer Protocol – ett DNS-protokoll för att översätta domäner",
    ],
    correct: 0,
    explanation:
      "HTTP står för HyperText Transfer Protocol och används för att hämta och visa webbsidor från en server i webbläsaren.",
  },
  {
    question: "Vad betyder S i HTTPS?",
    options: [
      "Secure – krypterad överföring via SSL/TLS",
      "Static – oföränderliga resurser",
      "Server – serveroptimerad överföring",
      "Signed – digitalt signerade webbsidor",
    ],
    correct: 0,
    explanation:
      "HTTPS = Hypertext Transfer Protocol Secure och använder SSL/TLS för att kryptera trafiken mellan klient och server.",
  },
  {
    question: "Vad fyller en Certificate Authority (CA) för roll?",
    options: [
      "Utfärdar och verifierar digitala certifikat för domäner",
      "Lagrar all webbhistorik i en central databas",
      "Skapar DNS-poster automatiskt",
      "Genererar HTML-sidor på servern",
    ],
    correct: 0,
    explanation:
      "En CA är en betrodd tredje part som utfärdar certifikat som bevisar domänägarskap och möjliggör kryptering (t.ex. Let's Encrypt).",
  },
  {
    question: "Vad gör en proxy?",
    options: [
      "Agerar förmedlare mellan klient och internettrafik",
      "Krypterar alla databaser automatiskt",
      "Renderar HTML i webbläsaren",
      "Byter ut HTTP mot FTP",
    ],
    correct: 0,
    explanation:
      "En proxy är en mellanhand som vidarebefordrar trafik mellan klient och målserver, ofta för cache, filtrering eller säkerhet.",
  },
  {
    question: "Vad är en GET-request?",
    options: [
      "En begäran för att hämta data från en server",
      "En begäran för att skapa data på servern",
      "En begäran som alltid ändrar serverns tillstånd",
      "En begäran som bara används för filuppladdning",
    ],
    correct: 0,
    explanation:
      "GET hämtar resurser. Bland HTTP-verb är GET, POST, PUT och DELETE vanligast.",
  },
  {
    question: "Vad är en POST-request?",
    options: [
      "En begäran för att skicka data till servern för behandling/lagring",
      "En begäran som enbart läser data",
      "En begäran som tar bort en resurs",
      "En begäran som ändrar HTTP till HTTPS",
    ],
    correct: 0,
    explanation:
      "POST skickar data till servern, ofta för att skapa något. Andra vanliga verb är GET, PUT och DELETE.",
  },
  {
    question: "Vad menas med att ett HTTP-request är idempotent?",
    options: [
      "Att samma anrop kan köras flera gånger utan att ändra resultatet",
      "Att det alltid kräver autentisering",
      "Att det alltid är krypterat",
      "Att det alltid skapar nya resurser",
    ],
    correct: 0,
    explanation:
      "Idempotenta anrop (t.ex. GET) kan upprepas utan att resursens tillstånd förändras. POST/PUT/DELETE är typiskt icke-idempotenta.",
  },
  {
    question: "Vad är autentisering?",
    options: [
      "Verifiering av en användares identitet",
      "Tilldelning av behörigheter",
      "Kryptering av nätverkstrafik",
      "Loggning av systemhändelser",
    ],
    correct: 0,
    explanation:
      "Autentisering bekräftar vem användaren är, t.ex. via lösenord, BankID eller OAuth (Google, Apple, Git).",
  },
  {
    question: "Vad är auktorisering?",
    options: [
      "Bedömning av vad en användare får göra efter autentisering",
      "Processen att skapa användarkonton",
      "Kryptering av lösenord vid lagring",
      "Detektion av intrång i nätverket",
    ],
    correct: 0,
    explanation:
      "Auktorisering avgör behörigheter och åtkomst, ofta med t.ex. JWT som bärare av roller/claims.",
  },
  {
    question: "Vad är Helmet i Node/Express?",
    options: [
      "Middleware som sätter säkerhetshuvuden i HTTP-svar",
      "Ett ramverk för autentisering",
      "Ett lastbalanseringsverktyg",
      "Ett testbibliotek för API:er",
    ],
    correct: 0,
    explanation:
      "Helmet hjälper till att skydda mot vanliga webbsårbarheter genom att sätta säkra HTTP-huvuden (XSS, clickjacking m.m.).",
  },
  {
    question: "Vad är OWASP?",
    options: [
      "En ideell organisation som förbättrar säkerheten i webbapplikationer",
      "Ett kommersiellt antivirusprogram",
      "En webbläsarmotor",
      "En databasstandard",
    ],
    correct: 0,
    explanation:
      "OWASP (Open Web Application Security Project) publicerar bl.a. OWASP Top 10 och verktyg/guider för säkrare mjukvara.",
  },
  {
    question: "Vad är ett penetrationstest?",
    options: [
      "En aktiv testning för att hitta sårbarheter genom att simulera attacker",
      "En automatisk backup av databasen",
      "En test av användarvänlighet (UX)",
      "Enhetstest av en funktion",
    ],
    correct: 0,
    explanation:
      "Pen-test simulerar angripare för att hitta svagheter. ZAP (från OWASP) kan användas för webbsårbarhetstester.",
  },
  {
    question: "Vad är Turingtestet relaterat till CAPTCHA?",
    options: [
      "Ett sätt att skilja människor från botar med uppgifter svåra för maskiner",
      "Ett protokoll för krypterad kommunikation",
      "En teknik för att optimera databassökningar",
      "En metod för att komprimera bilder",
    ],
    correct: 0,
    explanation:
      "CAPTCHA (t.ex. reCAPTCHA) bygger på idéer från Turingtestet för att verifiera att en användare är människa.",
  },

  {
    question: "Vad är en hemlig (privat) nyckel?",
    options: [
      "Den hemliga delen av ett asymmetriskt nyckelpar som används för dekryptering och signering",
      "En publik nyckel som delas öppet",
      "Ett engångslösenord som byts varje minut",
      "En hashfunktion för att lagra lösenord",
    ],
    correct: 0,
    explanation:
      "Privata nyckeln hålls hemlig och används för att dekryptera och skapa digitala signaturer.",
  },
  {
    question: "Vad är en publik nyckel?",
    options: [
      "Den öppet delade nyckeln i asymmetrisk kryptering som andra kan använda för att kryptera eller verifiera signaturer",
      "En nyckel som lagras i cookies",
      "En master-nyckel som ger full åtkomst till systemet",
      "En hash av lösenordet",
    ],
    correct: 0,
    explanation:
      "Publika nyckeln delas fritt för att möjliggöra kryptering till mottagaren och verifiering av digitala signaturer.",
  },
  {
    question: "Vad är hashning?",
    options: [
      "En funktion som deterministiskt mappar data till ett fast längd-värde",
      "En metod för att kryptera och dekryptera data",
      "En algoritm som komprimerar bilder",
      "Ett protokoll för lastbalansering",
    ],
    correct: 0,
    explanation:
      "Hashfunktioner ger ett fast hashvärde av indata, svårt att invertera. Vanligt för integritetskontroll och lösenordslagring.",
  },
  {
    question: "Vad är saltning i samband med lösenord?",
    options: [
      "Att lägga till slumpdata till lösenord innan hashning för att göra hashvärden unika",
      "Att kryptera lösenord med en publik nyckel",
      "Att lagra lösenord i klartext men på en säker server",
      "Att byta lösenord var 90:e dag",
    ],
    correct: 0,
    explanation:
      "Saltning motverkar rainbow tables och gör förhandsberäknade angrepp svårare genom unika hashvärden per lösenord.",
  },
  {
    question: "Vad är audit-loggning?",
    options: [
      "Loggning av viktiga aktiviteter: vem gjorde vad, när och hur",
      "En logg som endast innehåller serverstart och stop",
      "Komprimerade loggar för att spara diskutrymme",
      "Automatisk radering av gamla loggar",
    ],
    correct: 0,
    explanation:
      "Auditloggar stödjer spårbarhet, regelefterlevnad och säkerhetsgranskning genom detaljer om åtgärder i systemet.",
  },
  {
    question: "Vad är access-loggning?",
    options: [
      "Registrering av alla åtkomstförsök till resurser, oavsett autentisering",
      "Loggning enbart av lyckade inloggningar",
      "Endast loggning av administratörers aktiviteter",
      "En loggtyp som bara används vid felsökning",
    ],
    correct: 0,
    explanation:
      "Accessloggar visar vem som försökte komma åt vad och när, lyckat eller misslyckat, och används för övervakning och analys.",
  },
  {
    question: "Vad är trace-loggning?",
    options: [
      "Detaljerad loggning av programflöde för felsökning",
      "En logg som endast visar fel (errors)",
      "En logg som bara visas i produktion",
      "En logg över CPU- och minnesanvändning",
    ],
    correct: 0,
    explanation:
      "Trace-loggning ger finmaskig insyn i kodens exekvering (metodanrop, variabler) och är värdefull vid felsökning.",
  },

  {
    question: "Vad avser 'Identification and Authentication Failures'?",
    options: [
      "Brister i hur identiteter verifieras och hanteras (svaga lösenord, dålig sessionshantering, bristande MFA)",
      "Brister i hur bilder komprimeras på servern",
      "Fel i hur CSS laddas i webbläsaren",
      "Avsaknad av cache-hantering i CDN",
    ],
    correct: 0,
    explanation:
      "Kategorin handlar om svag autentisering, exponerade tokens och felaktig sessionhantering. Åtgärder: starka lösenord, MFA, säkra sessioner.",
  },
  {
    question: "Vad innebär 'Vulnerable and Outdated Components'?",
    options: [
      "Risker från föråldrade/sårbara bibliotek och beroenden",
      "Att kod inte är minifierad",
      "Att CSS-variabler saknas",
      "Att bilder inte har alt-texter",
    ],
    correct: 0,
    explanation:
      "Användning av gamla/osäkra komponenter kan utnyttjas av angripare. Håll beroenden uppdaterade och använd t.ex. npm audit.",
  },
  {
    question: "Vad är 'Injection' i säkerhetssammanhang?",
    options: [
      "När osäker indata blandas med kommandon/queries (t.ex. SQL/NoSQL/kommandoinjektion)",
      "När CSS injiceras för att ändra utseende",
      "När en bild bäddas in i HTML",
      "När ett script laddas via CDN",
    ],
    correct: 0,
    explanation:
      "Förebygg med parametriserade frågor/prepared statements, inputvalidering och undvik att sammanfoga användardata med kommandon.",
  },
  {
    question: "Vad menas med 'Security Misconfiguration'?",
    options: [
      "Felaktiga/bristfälliga säkerhetsinställningar (standardlösenord, onödiga tjänster, fel konfigurerade headers)",
      "Felaktig CSS-animering",
      "Saknad av favicon",
      "Fel i responsiva breakpoints",
    ],
    correct: 0,
    explanation:
      "Säkra installationer, inaktivera onödiga funktioner och håll konfiguration uppdaterad. Automatisera härdning där möjligt.",
  },
  {
    question: "Vad avses med 'Cryptographic Failures'?",
    options: [
      "Brister i skydd av känslig data (svaga algoritmer, klartext, fel nyckelhantering)",
      "Fel i layoutgrid",
      "För många HTTP-cookies",
      "Saknad av sitemap.xml",
    ],
    correct: 0,
    explanation:
      "Använd moderna algoritmer, kryptera data i vila och i transit, hantera nycklar/certifikat korrekt.",
  },
  {
    question: "Vad är 'Software and Data Integrity Failures'?",
    options: [
      "Bristande integritetskontroller i kod/artefakter (osäkra uppdateringar, opålitliga källor, osäker deserialisering)",
      "Fel i bildkomprimering",
      "Saknad av mörkt läge",
      "Fel i ARIA-attribut",
    ],
    correct: 0,
    explanation:
      "Verifiera källor/signaturer, säkra CI/CD, undvik opålitliga repos/CDN och hantera deserialisering säkert.",
  },
  {
    question: "Vad beskriver SSRF (Server-Side Request Forgery)?",
    options: [
      "Angriparen får servern att göra nätverksanrop till interna/externa resurser",
      "En metod för att snabba upp serversvar",
      "Ett sätt att cacha assets på servern",
      "En teknik för att rendera server-side HTML",
    ],
    correct: 0,
    explanation:
      "Motverka med strikt URL-validering, allowlists, segmentering och att interna tjänster inte exponeras från utsatta endpoints.",
  },
  {
    question: "Vad innebär 'Insecure Design'?",
    options: [
      "Att nödvändiga säkerhetskontroller saknas i designen från början",
      "Att UI inte följer designguidelines",
      "Att bilder inte är optimerade",
      "Att loggar inte är färgglada",
    ],
    correct: 0,
    explanation:
      "Inför säkerhet tidigt: hotmodellering, säkra mönster/krav och kontroller i designfasen – det kan inte 'patchas' i efterhand.",
  },
  {
    question: "Vad är 'Broken Access Control'?",
    options: [
      "När åtkomstkontroller inte korrekt begränsar åtkomst till data/funktioner",
      "När användare inte kan logga in",
      "När en API-nyckel har för kort längd",
      "När servern svarar långsamt",
    ],
    correct: 0,
    explanation:
      "Implementera minst privilegium, konsekventa kontroller på servern och skydda mot manipulation av URL:er/parametrar/API-anrop.",
  },

  {
    question: "Kan man få ett CA-utfärdat certifikat för localhost?",
    options: [
      "Nej, CA validerar domäner du äger; för localhost används självsignerade/dev-certifikat",
      "Ja, alla CA utfärdar certifikat för localhost",
      "Ja, men endast som wildcard-certifikat utan domän",
      "Endast om man använder HTTP istället för HTTPS",
    ],
    correct: 0,
    explanation:
      "Publika CA utfärdar certifikat för verifierbara domäner (FQDN), inte 'localhost'. Lokalt används ofta självsignerade eller utvecklingscertifikat.",
  },

  {
    question: "I Express: var hämtar du path-parametern i routen '/user/:id'?",
    options: ["req.params.id", "req.query.id", "req.body.id", "req.headers.id"],
    correct: 0,
    explanation:
      "Path-parametrar (':id') nås via req.params.id. Query-parametrar finns i req.query och POST/JSON-data i req.body.",
  },
  {
    question:
      "I Express: var hittar du query-parametern i '/users?role=admin'?",
    options: [
      "req.query.role",
      "req.params.role",
      "req.body.role",
      "req.cookies.role",
    ],
    correct: 0,
    explanation:
      "Query-strängens nycklar finns i req.query. I exemplet hämtas 'admin' via req.query.role.",
  },
  {
    question:
      "POST med 'Content-Type: application/json' – var läser du den skickade datan i Express?",
    options: ["req.body", "req.params", "req.query", "res.locals"],
    correct: 0,
    explanation:
      "JSON-payload läses från req.body (förutsatt att JSON-body parser är aktiverad). Path/query används för parametrar i URL:en.",
  },
];
