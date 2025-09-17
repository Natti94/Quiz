export const questionsApt = [
  {
    question: "Vad gör beforeAll() i ett test?",
    options: [
      "Kör ett test innan alla andra",
      "Kör en cleanup efter alla tester",
      "Kör en gång innan testsviten startar",
      "Kör före varje enskilt test",
    ],
    correct: 2,
    explanation:
      "beforeAll körs en gång före alla tester i describe-blocket, t.ex. för att hämta token.",
  },
  {
    question: "Vad används beforeEach() till i testning?",
    options: [
      "Att skapa data innan varje test körs",
      "Att ta bort data efter varje test",
      "Att köra tester parallellt",
      "Att köra tester i slumpmässig ordning",
    ],
    correct: 0,
    explanation:
      "beforeEach körs före varje enskilt test, ofta för att skapa en testresurs (t.ex. en film).",
  },
  {
    question: "Vad är syftet med afterEach() i tester?",
    options: [
      "Köra en cleanup efter varje test",
      "Spara testdata",
      "Starta servern",
      "Stoppa hela testsviten",
    ],
    correct: 0,
    explanation:
      "afterEach används för att ta bort det som skapades i beforeEach, t.ex. ta bort testdata.",
  },
  {
    question: "Vad är skillnaden mellan enhets- och integrationstest?",
    options: [
      "Integrationstest är snabbare",
      "Enhetstest testar samverkan mellan system",
      "Enhetstest testar små delar, integrationstest testar helheten",
      "Det finns ingen skillnad",
    ],
    correct: 2,
    explanation:
      "Enhetstester testar små isolerade delar, medan integrationstester testar flera delar tillsammans.",
  },
  {
    question: "När använder man cURL i testning?",
    options: [
      "För att testa UI-komponenter",
      "För att automatiskt klicka i en app",
      "För att skicka HTTP-anrop från terminalen",
      "För att rita diagram",
    ],
    correct: 2,
    explanation:
      "cURL är ett terminalverktyg för att skicka GET, POST, PUT och DELETE mot API:er.",
  },
  {
    question: "Vad är Postman?",
    options: [
      "Ett bibliotek för enhetstester",
      "En webbläsare",
      "Ett grafiskt verktyg för att testa API:er",
      "Ett sätt att skriva dokumentation",
    ],
    correct: 2,
    explanation:
      "Postman används för att testa och organisera HTTP-anrop mot API:er med grafiskt gränssnitt.",
  },
  {
    question: "Vad händer när du kör npm run vitest?",
    options: [
      "Du startar utvecklingsservern",
      "Du kör testsviten",
      "Du komprimerar din kod",
      "Du skapar en ny komponent",
    ],
    correct: 1,
    explanation:
      "Kommandot kör dina testfiler i projektet, vanligtvis de som slutar på `.test.js/.jsx`.",
  },
  {
    question: "Vad testas oftast i integrationstestning?",
    options: [
      "Syntaktisk korrekthet",
      "Samarbetet mellan delar av systemet",
      "Enskilda funktioner",
      "Testdokumentationen",
    ],
    correct: 1,
    explanation:
      "Integrationstester kollar att flera komponenter fungerar tillsammans, t.ex. API och databas.",
  },
  {
    question:
      "Vilken Scrum-roll ansvarar för att teamet arbetar effektivt enligt Scrum?",
    options: [
      "Produktägare",
      "Scrum Master",
      "Utvecklingsteam",
      "Projektledare",
    ],
    correct: 1,
    explanation:
      "Scrum Mastern stöttar teamet, faciliterar ceremonier och ser till att Scrum följs.",
  },
  {
    question: "Vad är syftet med en retrospektiv?",
    options: [
      "Att prioritera uppgifter",
      "Att planera nästa sprint",
      "Att reflektera över arbetssätt och förbättra teamet",
      "Att redovisa resultat för chefen",
    ],
    correct: 2,
    explanation:
      "Retrospektiv används för att förbättra hur teamet arbetar tillsammans.",
  },
  {
    question: "Vad betyder MVP?",
    options: [
      "Minsta användbara produkt",
      "Mest värdefulla produkt",
      "Minimal visuell plan",
      "Mellanvärde produkt",
    ],
    correct: 0,
    explanation:
      "MVP står för Minimum Viable Product, den minsta version som skapar värde.",
  },
  {
    question: "Vilken ceremoni sker dagligen i Scrum?",
    options: [
      "Sprint Review",
      "Planning Poker",
      "Daily Standup",
      "Backlog Grooming",
    ],
    correct: 2,
    explanation:
      "Daily Standup hålls setiap dag för att synka arbetet i teamet.",
  },
  {
    question: "Vilket artefakt beskriver allt som ska göras i framtiden?",
    options: ["Sprint backlog", "Roadmap", "Product backlog", "User story"],
    correct: 2,
    explanation:
      "Product backlog innehåller allt arbete som kan komma att göras.",
  },
  {
    question:
      "Vad är ett vanligt verktyg för att visualisera arbetsflödet i Kanban?",
    options: ["Sprint Review", "Burndown chart", "Backlog", "Kanban board"],
    correct: 3,
    explanation:
      "Kanban board används för att visualisera flödet av uppgifter.",
  },
  {
    question: "Vilket påstående stämmer om Agila Manifestet?",
    options: [
      "Fokus på dokumentation före samarbete",
      "Fokin på att följa plan före att anpassa sig",
      "Fokus på att leverera fungerande mjukvara",
      "Fokus på tunga processer och verktyg",
    ],
    correct: 2,
    explanation:
      "Ett av de agila värdena är att leverera fungerande mjukvara ofta.",
  },
  {
    question: "Vad är en user story?",
    options: [
      "Ett krav från chefen",
      "En teknisk specifikation",
      "En uppgift skriven från användarens perspektiv",
      "En logg över buggar",
    ],
    correct: 2,
    explanation:
      "User stories skrivs ur användarens perspektiv för att fokusera på nytta.",
  },
  {
    question: "Vad är syftet med Planning Poker?",
    options: [
      "Fördela arbete i teamet",
      "Utvärdera förra sprinten",
      "Estimering av arbetskomplexitet",
      "Planera vilka verktyg som ska användas",
    ],
    correct: 2,
    explanation:
      "Planning Poker är en teknik för att estimera hur komplex en uppgift är.",
  },
  {
    question: "Vilken roll prioriterar backloggen?",
    options: ["Scrum Master", "Utvecklare", "Stakeholder", "Produktägare"],
    correct: 3,
    explanation:
      "Produktägaren ansvarar för att prioritera vad som ska göras i backloggen.",
  },
  {
    question: "Vad menas med validering i testning?",
    options: [
      "Att koden är fri från syntaxfel",
      "Att systemet fungerar enligt specifikation",
      "Att systemet gör rätt saker för användaren",
      "Att inga tester kraschar",
    ],
    correct: 2,
    explanation:
      "Validering kontrollerar att systemet uppfyller användarens behov.",
  },
  {
    question: "Vilken testtyp är oftast snabbast och billigast?",
    options: ["Systemtest", "Manuell test", "Integrationstest", "Enhetstest"],
    correct: 3,
    explanation: "Enhetstester är små, snabba och billiga att köra och skriva.",
  },
  {
    question: "Vilken typ av test fokuserar på flera delar som fungerar ihop?",
    options: ["Systemtest", "Integrationstest", "Enhetstest", "Acceptanstest"],
    correct: 1,
    explanation:
      "Integrationstester kontrollerar att komponenter samverkar korrekt.",
  },
  {
    question: "Vad är testautomatisering?",
    options: [
      "Manuellt klickande i UI",
      "Att låta användare testa produkten",
      "Att skriva skript som kör tester automatiskt",
      "Att testa produkten på olika datorer",
    ],
    correct: 2,
    explanation:
      "Testautomatisering innebär att man kör tester automatiskt med kod.",
  },
  {
    question: "När är det extra lämpligt att automatisera tester?",
    options: [
      "För en ny engångsfunktion",
      "När man testar användarupplevelse",
      "Vid återkommande regressionstester",
      "När man inte har kod ännu",
    ],
    correct: 2,
    explanation: "Automatiserade tester passar bäst för återkommande testfall.",
  },
  {
    question: "Vad är skillnaden mellan synkrona och asynkrona tester?",
    options: [
      "Synkrona tester väntar på att det föregående ska bli klart",
      "Asynkrona tester körs sekventiellt",
      "Synkrona tester körs parallellt",
      "Asynkrona tester väntar på att det föregående ska bli klart",
    ],
    correct: 0,
    explanation:
      "Synkrona tester väntar på att ett test ska slutföras innan nästa körs, medan asynkrona tester kan köras parallellt utan att vänta.",
  },
  {
    question: "Vad innebär det att en testsvit är idempotent?",
    options: [
      "Testsviten kan köras flera gånger utan att ändra resultatet",
      "Testsviten kan köras parallellt utan problem",
      "Testsviten kan köra flera olika testsviter samtidigt",
      "Testsviten körs bara en gång",
    ],
    correct: 0,
    explanation:
      "En idempotent testsvit betyder att tester kan köras om utan att resultatet påverkas.",
  },
  {
    question: "Vad är syftet med Continuous Integration (CI)?",
    options: [
      "Att kontinuerligt testa och bygga kod för att upptäcka problem tidigt",
      "Att säkerställa att koden är klar för produktion",
      "Att förhindra kodändringar",
      "Att skriva automatiserade tester",
    ],
    correct: 0,
    explanation:
      "Continuous Integration innebär att man regelbundet integrerar kodändringar och kör tester för att upptäcka problem tidigt.",
  },
  {
    question: "Vad menas med en mock i tester?",
    options: [
      "En simulation av ett system för att testa dess funktioner",
      "En faktisk implementation av en funktion",
      "En test som körs i en riktig miljö",
      "En test som är beroende av externa system",
    ],
    correct: 0,
    explanation:
      "En mock är en simulering av en del av systemet som gör att vi kan testa funktioner isolerat utan att behöva köra hela systemet.",
  },
  {
    question: "Vad innebär TDD (Test Driven Development)?",
    options: [
      "Att skriva tester innan man skriver kod",
      "Att skriva kod och sen testa den",
      "Att skriva tester efter att programmet är klart",
      "Att automatisera tester helt och hållet",
    ],
    correct: 0,
    explanation:
      "TDD innebär att skriva tester först, och sedan skriva kod för att få testerna att passera.",
  },
  {
    question: "Vad är en testdriven utvecklingsprocess för fördelar?",
    options: [
      "Snabbare utvecklingstid",
      "Färre buggar och mer pålitlig kod",
      "Mindre fokus på dokumentation",
      "Färre tester behövs",
    ],
    correct: 1,
    explanation:
      "Testdriven utveckling förbättrar kodkvaliteten genom att fokusera på att lösa problem innan de inträffar.",
  },
  {
    question: "Vad innebär det att en test är 'flaky'?",
    options: [
      "Testet misslyckas sporadiskt utan någon uppenbar anledning",
      "Testet är mycket stabilt och pålitligt",
      "Testet kan köras parallellt utan problem",
      "Testet har ingen koppling till den faktiska koden",
    ],
    correct: 0,
    explanation:
      "En 'flaky' test är en test som misslyckas ibland utan att det finns någon uppenbar anledning, vilket gör den svår att lita på.",
  },
  {
    question:
      "Vad är skillnaden mellan manuell testning och automatiserad testning?",
    options: [
      "Manuell testning är snabbare, automatiserad är noggrannare",
      "Manuell testning görs av människor, automatiserad görs med skript",
      "Manuell testning används för API:er, automatiserad för UI",
      "Det finns ingen skillnad",
    ],
    correct: 1,
    explanation:
      "Manuell testning utförs av människor som klickar eller skriver, medan automatiserad testning använder skript för att köra tester snabbt och upprepade gånger.",
  },
  {
    question: "Vad är syftet med ett enhetstest (unit test)?",
    options: [
      "Att testa hela systemet",
      "Att testa små, isolerade delar av koden",
      "Att testa användargränssnittet",
      "Att testa integrationen mellan system",
    ],
    correct: 1,
    explanation:
      "Enhetstester fokuserar på att testa små, isolerade delar av koden, som en funktion, för att säkerställa att de fungerar korrekt.",
  },
  {
    question: "Vad är ett acceptanstest och vem är mest intresserad av det?",
    options: [
      "Ett test för att kontrollera kodkvalitet, intresserar utvecklare",
      "Ett test för att säkerställa att produkten möter kundens krav, intresserar kunden",
      "Ett test för att kolla prestanda, intresserar testare",
      "Ett test för att kontrollera säkerhet, intresserar säkerhetsteamet",
    ],
    correct: 1,
    explanation:
      "Acceptanstester verifierar att produkten uppfyller kundens krav och är ofta mest intressanta för kunden eller produktägaren.",
  },
  {
    question: "Vad är ett systemtest?",
    options: [
      "Ett test av enskilda funktioner",
      "Ett test av hela systemet i en produktionslik miljö",
      "Ett test av användargränssnittet",
      "Ett test av databasen",
    ],
    correct: 1,
    explanation:
      "Systemtest testar hela systemet som en helhet i en miljö som liknar produktion för att säkerställa att allt fungerar tillsammans.",
  },
  {
    question: "Vad är regressionstestning och varför är det viktigt?",
    options: [
      "Testar nya funktioner, viktigt för att lansera snabbt",
      "Testar att gamla funktioner fortfarande fungerar, viktigt för stabilitet",
      "Testar prestanda, viktigt för skalbarhet",
      "Testar säkerhet, viktigt för dataskydd",
    ],
    correct: 1,
    explanation:
      "Regressionstestning kontrollerar att befintliga funktioner inte har påverkats negativt av nya ändringar, vilket är viktigt för att bibehålla stabilitet.",
  },
  {
    question:
      "Vad är skillnaden mellan manuella och automatiserade tester gällande hastighet och noggrannhet?",
    options: [
      "Manuella är snabbare men mindre noggranna",
      "Automatiserade är snabbare och ofta mer noggranna",
      "Manuella är noggrannare men långsammare",
      "Det finns ingen skillnad",
    ],
    correct: 1,
    explanation:
      "Automatiserade tester körs snabbare och är mer konsekventa, medan manuella tester kan vara långsammare men bättre för explorativ testning.",
  },
  {
    question: "Vad gör expect().toBe() i Vitest?",
    options: [
      "Jämför två värden för exakt likhet",
      "Kontrollerar om ett test körs utan fel",
      "Simulerar ett API-anrop",
      "Renderar en komponent",
    ],
    correct: 0,
    explanation:
      "expect().toBe() används i Vitest för att jämföra två värden och säkerställa att de är exakt lika, t.ex. expect(2 + 2).toBe(4).",
  },
  {
    question: "Vad gör render() i ett komponenttest?",
    options: [
      "Skickar ett HTTP-anrop",
      "Ritar en komponent i DOM för testning",
      "Mockar en API-respons",
      "Kör ett enhetstest",
    ],
    correct: 1,
    explanation:
      "render() används i bibliotek som Testing Library för att rendera en React-komponent i en virtuell DOM för att testa dess beteende.",
  },
  {
    question: "Vad används screen.getByText() och fireEvent.click() till?",
    options: [
      "Att hämta element och simulera klick i tester",
      "Att mocka API-anrop",
      "Att kontrollera CSS-styling",
      "Att köra tester parallellt",
    ],
    correct: 0,
    explanation:
      "screen.getByText() används för att hitta element baserat på textinnehåll, och fireEvent.click() simulerar ett klick på ett element i tester.",
  },
  {
    question:
      "Vad är skillnaden på komponenttest och integrationstest i React?",
    options: [
      "Komponenttest testar flera komponenter, integrationstest testar en",
      "Komponenttest testar en komponent isolerat, integrationstest testar flera tillsammans",
      "Komponenttest är manuella, integrationstest är automatiserade",
      "Det finns ingen skillnad",
    ],
    correct: 1,
    explanation:
      "Komponenttest fokuserar på en enskild React-komponent isolerat, medan integrationstest testar hur flera komponenter fungerar tillsammans.",
  },
  {
    question: "Vad gör MSW (Mock Service Worker)?",
    options: [
      "Renderar komponenter för tester",
      "Mockar HTTP-anrop genom att fånga upp och simulera svar",
      "Kör tester parallellt",
      "Kontrollerar kodkvalitet",
    ],
    correct: 1,
    explanation:
      "MSW (Mock Service Worker) används för att fånga upp och mocka HTTP-anrop i tester, vilket simulerar API-svar utan att kontakta en riktig server.",
  },
  {
    question: "Vilka är fördelarna med mockning i tester?",
    options: [
      "Ökar beroendet av externa system",
      "Gör tester snabbare och mer kontrollerade",
      "Gör testerna långsammare men mer realistiska",
      "Eliminerar behovet av tester",
    ],
    correct: 1,
    explanation:
      "Mockning gör tester snabbare, mer förutsägbara och oberoende av externa system genom att simulera deras beteende.",
  },
  {
    question: "Vad är fetch och vad testar man när man använder fetch i test?",
    options: [
      "En metod för att rendera komponenter, testar UI",
      "En metod för HTTP-anrop, testar API-interaktioner",
      "En metod för att mocka data, testar databasen",
      "En metod för att köra tester, testar testsviten",
    ],
    correct: 1,
    explanation:
      "fetch är en JavaScript-metod för att göra HTTP-anrop. I tester kontrollerar man att API-anrop görs korrekt och hanterar svar eller fel.",
  },
  {
    question: "Varför används async/await i tester av API:er?",
    options: [
      "För att göra testerna snabbare",
      "För att hantera asynkrona anrop och vänta på svar",
      "För att mocka API-svar",
      "För att köra tester parallellt",
    ],
    correct: 1,
    explanation:
      "async/await används för att hantera asynkrona API-anrop i tester, så att testet väntar på svaret innan det fortsätter.",
  },
  {
    question: "Vad var problemet med vattenfallsmetoden?",
    options: [
      "Den var för snabb och saknade planering",
      "Den var för långsam och inflexibel för förändringar",
      "Den saknade tester helt",
      "Den fokuserade för mycket på teamarbete",
    ],
    correct: 1,
    explanation:
      "Vattenfallsmetoden är sekventiell och gör det svårt att anpassa sig till förändringar, vilket ofta leder till försenade eller felaktiga leveranser.",
  },
  {
    question: "Vad betyder WIP-limit i Kanban?",
    options: [
      "Begränsning av antalet uppgifter som kan påbörjas samtidigt",
      "Begränsning av sprintlängden",
      "Begränsning av antalet teammedlemmar",
      "Begränsning av antalet user stories",
    ],
    correct: 0,
    explanation:
      "WIP-limit (Work In Progress) begränsar antalet uppgifter som teamet arbetar på samtidigt för att förbättra fokus och flöde.",
  },
  {
    question: "Vad kännetecknar Scrum?",
    options: [
      "Kontinuerligt flöde utan iterationer",
      "Tidsbegränsade iterationer och regelbundna leveranser",
      "Fokus på enstaka stora leveranser",
      "Ingen teamstruktur",
    ],
    correct: 1,
    explanation:
      "Scrum kännetecknas av korta iterationer (sprintar), regelbundna leveranser och ett strukturerat team med tydliga roller.",
  },
  {
    question: "Vilka roller finns i ett Scrumteam?",
    options: [
      "Projektledare, Testare, Designer",
      "Produktägare, Scrum Master, Utvecklingsteam",
      "Stakeholder, Produktägare, Testare",
      "Scrum Master, Utvecklare, Kund",
    ],
    correct: 1,
    explanation:
      "Ett Scrumteam består av Produktägare (prioriterar backloggen), Scrum Master (stöttar processen) och Utvecklingsteam (bygger produkten).",
  },
  {
    question: "Vad gör utvecklingsteamet i Scrum?",
    options: [
      "Prioriterar backloggen",
      "Bygger och levererar produkten",
      "Faciliterar möten",
      "Skapar roadmaps",
    ],
    correct: 1,
    explanation:
      "Utvecklingsteamet ansvarar för att bygga och leverera produkten enligt backloggen under sprintarna.",
  },
  {
    question: "Vad är sprintplanering?",
    options: [
      "En ceremoni för att reflektera över teamets prestation",
      "En ceremoni för att planera vad som ska göras i en sprint",
      "En ceremoni för att visa produkten för kunder",
      "En ceremoni för att mocka API:er",
    ],
    correct: 1,
    explanation:
      "Sprintplanering är en Scrum-ceremoni där teamet bestämmer vilka uppgifter från backloggen som ska göras i den kommande sprinten.",
  },
  {
    question: "Vad är en sprint review?",
    options: [
      "En ceremoni för att planera nästa sprint",
      "En ceremoni för att visa vad som byggts och få feedback",
      "En ceremoni för att förbättra teamets processer",
      "En ceremoni för att mocka tester",
    ],
    correct: 1,
    explanation:
      "Sprint review är en ceremoni där teamet visar vad som byggts under sprinten och får feedback från intressenter.",
  },
  {
    question: "Vad är en roadmap i agila projekt?",
    options: [
      "En detaljerad plan för hela projektet",
      "En hög nivå-plan för framtida mål och leveranser",
      "En lista över dagliga uppgifter",
      "En teknisk specifikation",
    ],
    correct: 1,
    explanation:
      "En roadmap ger en översikt över projektets långsiktiga mål och förväntade leveranser, men är flexibel för förändringar.",
  },
  {
    question: "Hur skriver man en user story?",
    options: [
      "Som [användare], vill jag [göra något], så att [nytta uppnås]",
      "Som [utvecklare], vill jag [koda något], så att [teknik fungerar]",
      "Som [chef], vill jag [få rapport], så att [jag är nöjd]",
      "Som [testare], vill jag [hitta buggar], så att [koden är perfekt]",
    ],
    correct: 0,
    explanation:
      "En user story skrivs i formatet 'Som [användare], vill jag [göra något], så att [nytta uppnås]' för att fokusera på användarens behov.",
  },
  {
    question: "Varför är working agreements viktiga?",
    options: [
      "De bestämmer vilka verktyg teamet ska använda",
      "De definierar hur teamet samarbetar och kommunicerar",
      "De prioriterar backloggen",
      "De ersätter sprintplanering",
    ],
    correct: 1,
    explanation:
      "Working agreements är gemensamma regler för hur teamet arbetar tillsammans, vilket förbättrar samarbete och effektivitet.",
  },
  {
    question: "Vad innebär servant leadership?",
    options: [
      "Att leda genom att ge order",
      "Att leda genom att stötta och möjliggöra för teamet",
      "Att leda genom att prioritera backloggen",
      "Att leda genom att skriva kod",
    ],
    correct: 1,
    explanation:
      "Servant leadership innebär att en ledare (t.ex. Scrum Master) fokuserar på att stötta teamet och ta bort hinder för att möjliggöra framgång.",
  },
  {
    question: "Vad betyder tvärfunktionellt team?",
    options: [
      "Ett team med medlemmar från samma avdelning",
      "Ett team med olika kompetenser för att leverera en produkt",
      "Ett team som bara arbetar med tester",
      "Ett team som bara arbetar med planering",
    ],
    correct: 1,
    explanation:
      "Ett tvärfunktionellt team har medlemmar med olika kompetenser (t.ex. utvecklare, testare, designers) för att leverera en produkt självständigt.",
  },
  {
    question: "Vad är psykologisk trygghet i ett team?",
    options: [
      "Att alla alltid är överens",
      "Att teamet känner sig tryggt att ta risker och dela idéer",
      "Att teamet har hög teknisk kompetens",
      "Att teamet levererar snabbt",
    ],
    correct: 1,
    explanation:
      "Psykologisk trygghet innebär att teammedlemmar känner sig trygga att uttrycka idéer, ställa frågor eller erkänna misstag utan rädsla för kritik.",
  },
  {
    question: "Ge två exempel på hur man bygger psykologisk trygghet.",
    options: [
      "Ge beröm offentligt och uppmuntra öppna diskussioner",
      "Ge strikta regler och deadlines",
      "Fokusera på individuella prestationer och tävling",
      "Undvika feedback och konflikter",
    ],
    correct: 0,
    explanation:
      "Att ge beröm offentligt och uppmuntra öppna diskussioner skapar en miljö där teammedlemmar känner sig trygga att dela idéer och ta risker.",
  },
  {
    question: "Vad är Project Aristotle och vad visade den studien?",
    options: [
      "En studie om kodkvalitet, visade att tester är viktigast",
      "En studie om team, visade att psykologisk trygghet är nyckeln till framgång",
      "En studie om agila metoder, visade att Scrum är bäst",
      "En studie om ledarskap, visade att auktoritärt ledarskap fungerar",
    ],
    correct: 1,
    explanation:
      "Project Aristotle var en Google-studie som visade att psykologisk trygghet är den viktigaste faktorn för effektiva team.",
  },
  {
    question: "Vad innebär pålitlighet i teamarbete?",
    options: [
      "Att teamet alltid levererar i tid",
      "Att teammedlemmar håller sina löften och levererar kvalitet",
      "Att teamet undviker konflikter",
      "Att teamet har många möten",
    ],
    correct: 1,
    explanation:
      "Pålitlighet betyder att teammedlemmar håller vad de lovar, levererar arbete av hög kvalitet och är ansvariga för sina uppgifter.",
  },
  {
    question: "Hur kan retrospektiv bidra till tryggare team?",
    options: [
      "Genom att prioritera uppgifter",
      "Genom att skapa en säker plats för reflektion och feedback",
      "Genom att fokusera på tekniska lösningar",
      "Genom att undvika diskussioner",
    ],
    correct: 1,
    explanation:
      "Retrospektiv ger teamet en säker miljö att diskutera vad som gick bra och vad som kan förbättras, vilket bygger psykologisk trygghet.",
  },
  {
    question: "Vad är Continuous Deployment (CD)?",
    options: [
      "Att automatiskt distribuera kod till produktion efter tester",
      "Att köra tester manuellt innan lansering",
      "Att planera sprintar i förväg",
      "Att mocka API:er i tester",
    ],
    correct: 0,
    explanation:
      "Continuous Deployment (CD) innebär att kod automatiskt distribueras till produktion efter att ha passerat alla tester, vilket möjliggör snabba leveranser.",
  },
  {
    question: "Vad innebär parprogrammering och mobbprogrammering?",
    options: [
      "Att en person kodar och en testar",
      "Att två eller fler kodar tillsammans för att förbättra kvalitet",
      "Att teamet planerar sprintar tillsammans",
      "Att en person kodar och andra dokumenterar",
    ],
    correct: 1,
    explanation:
      "Parprogrammering innebär att två personer kodar tillsammans, medan mobbprogrammering involverar hela teamet för att samarbeta och förbättra kodkvaliteten.",
  },
];