export const questionsAmsExam = [
  {
    question:
      "Redogör för de tre huvudsakliga företagsformerna i Sverige. Diskutera fördelar och nackdelar med varje form samt hur valet påverkar företagets utveckling.",
    options: [
      "Enskild firma är enkel men med obegränsat ansvar, handelsbolag kräver delat ansvar mellan delägare, aktiebolag ger begränsat ansvar och professionell struktur - valet påverkar finansiering, juridiskt ansvar och tillväxtmöjligheter",
      "Alla företagsformer är likvärdiga och valet spelar ingen roll",
      "Endast aktiebolag är lagliga i Sverige",
      "Företagsform påverkar endast skattebetalningar",
    ],
    correct: 0,
    explanation:
      "Enskild firma är enkel att starta men innebär obegränsat personligt ansvar. Handelsbolag har minst två delägare med delat personligt ansvar. Aktiebolag har begränsat ansvar för aktieägare, kräver större kapital (50 000 kr) och mer administration men ger bättre möjligheter för tillväxt och investeringar. Valet påverkar ansvar, kapitalbehov, administrativa krav och möjligheter att attrahera investerare.",
    level: "VG",
  },
  {
    question:
      "Förklara grundprincipen för dubbel bokföring. Ge exempel på hur en affärshändelse bokförs och visa hur balansen upprätthålls.",
    options: [
      "Varje transaktion påverkar minst två konton med lika debet och kredit - exempel: vid inköp debiteras varukostnad och krediteras bank/leverantörsskuld, summan på debet = summan på kredit",
      "Dubbel bokföring innebär att bokföra allt två gånger",
      "Endast stora företag behöver använda dubbel bokföring",
      "Debet och kredit behöver inte vara lika stora",
    ],
    correct: 0,
    explanation:
      "Dubbel bokföring innebär att varje affärshändelse påverkar minst två konton - ett debet och ett kredit med lika stora belopp. Exempel: Vid inköp av varor för 10 000 kr på kredit debiteras konto 4000 (Varukostnader) med 10 000 kr och krediteras konto 2440 (Leverantörsskulder) med 10 000 kr. Detta säkerställer att totalbalansen (debet = kredit) alltid upprätthålls och ger inbyggd kontroll.",
    level: "VG",
  },
  {
    question:
      "Analysera sambandet mellan balansräkning och resultaträkning. Förklara hur resultaträkningens utfall påverkar balansräkningen.",
    options: [
      "Resultaträkningens slutresultat (vinst/förlust) påverkar balansräkningens eget kapital - vinst ökar eget kapital, förlust minskar det, vilket upprätthåller grundekvationen Tillgångar = Skulder + Eget kapital",
      "Balansräkning och resultaträkning är helt oberoende av varandra",
      "Endast resultaträkningen är viktig för företaget",
      "Resultaträkningen visar tillgångar och skulder",
    ],
    correct: 0,
    explanation:
      "Resultaträkningen visar periodens intäkter minus kostnader vilket ger årets resultat. Detta resultat läggs till (vinst) eller dras från (förlust) det egna kapitalet i balansräkningen. Grundekvationen Tillgångar = Skulder + Eget kapital upprätthålls alltid. En vinst ökar företagets egna kapital och därmed den finansiella stabiliteten, medan förlust minskar det egna kapitalet.",
    level: "VG",
  },
  {
    question:
      "Beskriv skillnaden mellan fasta och rörliga kostnader. Ge konkreta exempel och förklara hur denna indelning används vid break-even-analys.",
    options: [
      "Fasta kostnader (hyra, löner) är konstanta oavsett volym, rörliga (råvaror, frakt) varierar med volymen - break-even = Fasta kostnader / (Pris per enhet - Rörlig kostnad per enhet)",
      "Alla kostnader är fasta",
      "Rörliga kostnader kan aldrig beräknas",
      "Break-even-analys använder endast totala kostnader",
    ],
    correct: 0,
    explanation:
      "Fasta kostnader (t.ex. lokalhyra 20 000 kr/mån, fasta löner) är konstanta under en period oavsett produktionsvolym. Rörliga kostnader (t.ex. material 50 kr/enhet, emballage) varierar direkt med volymen. Vid break-even-analys beräknas täckningsbidrag per enhet (pris - rörlig kostnad) och break-even-volym = Fasta kostnader / Täckningsbidrag per enhet. Exempel: Fasta kostnader 100 000 kr, pris 200 kr, rörlig kostnad 120 kr ger break-even vid 100 000/(200-120) = 1 250 enheter.",
    level: "VG",
  },
  {
    question:
      "Redogör för de fyra P:na i marknadsmixen och ge exempel på hur de kan användas för att utveckla en marknadsföringsstrategi för en ny produkt.",
    options: [
      "Product (produktutveckling och design), Price (prissättningsstrategi), Place (distributionskanaler), Promotion (marknadsföring och kommunikation) - tillsammans skapar de en sammanhängande marknadsstrategi",
      "De fyra P:na är endast relevanta för stora företag",
      "Endast priset är viktigt i marknadsföring",
      "Marknadsmixen kan inte användas för nya produkter",
    ],
    correct: 0,
    explanation:
      "Product: Designa produkten efter kundbehov (funktioner, kvalitet, förpackning). Price: Välj prissättning baserat på kostnad, konkurrens och positionering (penetration/skimming). Place: Bestäm distributionskanaler (e-handel, butik, grossist). Promotion: Planera kommunikation (reklam, sociala medier, PR). Exempel för ny ekologisk hudvårdsprodukt: Premium kvalitet (Product), högt pris (Price), specialbutiker + e-handel (Place), influencer-marknadsföring (Promotion).",
    level: "VG",
  },
  {
    question:
      "Genomför en SWOT-analys för ett påhittat företag. Förklara hur analysen kan användas för att utveckla konkreta strategiska beslut.",
    options: [
      "Styrkor (t.ex. stark varumärke, kompetent personal), Svagheter (begränsat kapital, liten marknadsandel), Möjligheter (ny målgrupp, teknologi), Hot (konkurrens, lagändringar) - använd styrkor för möjligheter, åtgärda svagheter, förbered för hot",
      "SWOT-analys är endast för externa faktorer",
      "Alla företag har samma SWOT",
      "SWOT används endast vid uppstart",
    ],
    correct: 0,
    explanation:
      "Exempel för nytt café: Styrkor - unikt koncept, erfarna baristas. Svagheter - begränsat kapital, ingen etablerad kundbas. Möjligheter - växande kaffemarknaden, turistflöde. Hot - etablerad konkurrens, stigande råvarukostnader. Strategiska beslut: Utnyttja styrkor för möjligheter (unikt koncept för turister), åtgärda svagheter (söka investerare, bygga kundbas via sociala medier), förbereda för hot (differentiering från konkurrenter, långsiktiga leverantörsavtal).",
    level: "VG",
  },
  {
    question:
      "Förklara vad eget kapital är och hur det beräknas. Diskutera varför eget kapital är viktigt för företagets finansiella stabilitet och kreditvärdighet.",
    options: [
      "Eget kapital = Tillgångar - Skulder, representerar ägarnas kapital inklusive upparbetade vinster - högt eget kapital ger finansiell stabilitet, minskar risk och förbättrar kreditvärdighet",
      "Eget kapital är samma som banksaldo",
      "Eget kapital påverkar inte företagets stabilitet",
      "Endast vinst räknas som eget kapital",
    ],
    correct: 0,
    explanation:
      "Eget kapital beräknas som Tillgångar minus Skulder och utgörs av aktiekapital, överkursfond och balanserade vinstmedel. Ett högt eget kapital indikerar att företaget finansieras med egna medel snarare än lån, vilket minskar finansiell risk. Detta ger bättre soliditet (Eget kapital/Totala tillgångar), förbättrar möjligheten att få lån, minskar räntekostnader och ökar motståndskraften mot ekonomiska nedgångar. Banker och leverantörer bedömer kreditvärdighet utifrån soliditet och eget kapital.",
    level: "VG",
  },
  {
    question:
      "Beskriv processen för att upprätta en budget för ett företag. Vilka komponenter ingår och hur används budgeten för styrning och uppföljning?",
    options: [
      "Budgetprocessen inkluderar försäljningsprognos, kostnadsbudget, investeringsplan och likviditetsbudget - används för mål, resursfördelning och avvikelseanalys genom jämförelse med utfall",
      "Budget är endast en skattedeklaration",
      "Budgeten upprättas endast en gång och ändras aldrig",
      "Endast stora företag behöver budgetar",
    ],
    correct: 0,
    explanation:
      "Budgetprocessen: 1) Försäljningsprognos baserad på historik och marknad, 2) Kostnadsbudget för personal, material, overhead, 3) Investeringsplan för utrustning/lokaler, 4) Likviditetsbudget för kassaflöde. Budgeten används för att sätta mål, fördela resurser mellan avdelningar och koordinera verksamheten. Uppföljning sker genom månatlig avvikelseanalys där utfall jämförs med budget för att identifiera problem och justera åtgärder.",
    level: "VG",
  },
  {
    question:
      "Förklara soliditet och likviditet som nyckeltal. Ge exempel på beräkningar och diskutera vad som är acceptabla nivåer för olika branscher.",
    options: [
      "Soliditet = (Eget kapital/Totala tillgångar) × 100% visar långsiktig stabilitet, Likviditet = Omsättningstillgångar/Kortfristiga skulder visar betalningsförmåga - acceptabla nivåer varierar: fastighet >30% soliditet, handel >20%",
      "Soliditet och likviditet är samma sak",
      "Endast likviditet är viktigt",
      "Alla branscher har samma krav",
    ],
    correct: 0,
    explanation:
      "Soliditet visar andel eget kapital. Exempel: Tillgångar 1 000 000, EK 400 000 ger soliditet 40%. Likviditet (kassalikviditet eller kortfristig) visar betalningsförmåga. Exempel: Omsättningstillgångar 300 000, kortfristiga skulder 200 000 ger likviditet 1,5. Fastighetsbolag accepterar lägre soliditet (30-40%) p.g.a. stabila tillgångar och kassaflöden. Handelsföretag kräver högre likviditet (>2) för att hantera varulager och kundfordringar. Tillverkande industri behöver balans mellan båda.",
    level: "VG",
  },
  {
    question:
      "Analysera sambandet mellan direkta och indirekta kostnader i produktkalkyler. Förklara hur indirekta kostnader kan fördelas och ge exempel på pålägg.",
    options: [
      "Direkta kostnader (material, direkt arbete) kopplas direkt till produkten, indirekta (overhead, hyra, administration) fördelas via pålägg baserat på t.ex. direkta timmar eller materialkostnad - exempel: 40% pålägg på material",
      "Alla kostnader är direkta",
      "Indirekta kostnader kan inte fördelas",
      "Pålägg används endast för prissättning",
    ],
    correct: 0,
    explanation:
      "Direkta kostnader kan direkt hänföras till produkten (t.ex. 500 kr material, 300 kr direkt arbete). Indirekta kostnader (lokalhyra, maskinavskrivning, administration) delas via fördelningsnycklar. Exempel med pålägg: Material 500 kr, direkt arbete 300 kr = direkta kostnader 800 kr. Om påläggssatsen är 60% blir indirekta kostnader 480 kr. Total självkostnad = 800 + 480 = 1 280 kr. Påläggssatsen beräknas som (Totala indirekta kostnader/Totala direkta kostnader) × 100%.",
    level: "VG",
  },
  {
    question:
      "Förklara vad en affärsplan är och vilka huvuddelar den bör innehålla. Diskutera hur affärsplanen används i praktiken.",
    options: [
      "Affärsplan innehåller affärsidé, målgrupp, marknadsanalys, SWOT, organisation, marknadsföringsstrategi och ekonomisk planering - används för styrning, finansiering och kommunikation med intressenter",
      "Affärsplan är endast för nystartade företag",
      "Affärsplanen skrivs en gång och glöms bort",
      "Endast ekonomisk del är viktig",
    ],
    correct: 0,
    explanation:
      "En affärsplan innehåller: 1) Affärsidé och vision, 2) Målgrupp och marknadsbehov, 3) Marknadsanalys (konkurrenter, trender), 4) SWOT-analys, 5) Marknadsföringsstrategi (4P), 6) Organisation och resurser, 7) Ekonomisk planering (budget, finansiering, prognoser). Praktisk användning: Internt som styrdokument och för beslutsfattande. Externt för att attrahera investerare, få banklån och kommunicera med partners. Affärsplanen uppdateras regelbundet när verksamheten utvecklas.",
    level: "VG",
  },
  {
    question:
      "Beskriv vad verifikationer är i bokföringen och varför de är viktiga. Ge exempel på olika typer av verifikationer och deras betydelse för revision.",
    options: [
      "Verifikationer är underlag som bevisar affärshändelser (fakturor, kvitton, bankutdrag, lönebesked) - krävs enligt bokföringslagen och är avgörande för revision och kontroll",
      "Verifikationer är endast för skatteverket",
      "Muntliga överenskommelser räcker som verifikation",
      "Verifikationer kan kastas direkt efter bokföring",
    ],
    correct: 0,
    explanation:
      "Enligt bokföringslagen måste varje bokföringspost ha en verifikation. Typer: Externa (inköpsfakturor, försäljningsfakturor, kvitton, bankutdrag) och interna (lönebesked, minnesanteckningar, avskrivningar). Verifikationer måste numreras, dateras och sparas i 7 år. De är avgörande vid revision för att verifiera att bokföringen är korrekt och fullständig, vid skattekontroll för att bevisa avdrag, och för intern kontroll för att förhindra fel och oegentligheter.",
    level: "VG",
  },
  {
    question:
      "Förklara break-even-analys med ett konkret exempel. Beräkna nollpunkten och diskutera hur känslighetsanalys kan användas.",
    options: [
      "Break-even = Fasta kostnader / Täckningsbidrag per enhet - exempel: Fasta 150 000 kr, pris 500 kr, rörlig kostnad 300 kr ger break-even vid 750 enheter - känslighetsanalys visar hur volym ändras vid prisändringar",
      "Break-even kan inte beräknas exakt",
      "Endast stora företag behöver break-even-analys",
      "Täckningsbidrag är samma som vinst",
    ],
    correct: 0,
    explanation:
      "Exempel: Café med fasta kostnader 150 000 kr/mån (hyra, löner, försäkring). Pris per kaffe 50 kr, rörlig kostnad 20 kr (bönor, mjölk, glas). Täckningsbidrag = 50 - 20 = 30 kr. Break-even = 150 000/30 = 5 000 kaffekoppar/mån. Känslighetsanalys: Vid prishöjning till 55 kr blir break-even 150 000/(55-20) = 4 286 koppar. Vid kostnadsökning till 25 kr blir break-even 150 000/(50-25) = 6 000 koppar. Detta hjälper att förstå hur förändringar påverkar lönsamhet.",
    level: "VG",
  },
  {
    question:
      "Analysera kassaflöde och dess betydelse jämfört med redovisat resultat. Ge exempel på hur ett företag kan ha vinst men negativ likviditet.",
    options: [
      "Kassaflöde visar faktiska betalningar, resultat visar periodiserade intäkter/kostnader - företag kan ha vinst men negativ likviditet vid t.ex. stora kundfordringar, investeringar eller snabb tillväxt",
      "Kassaflöde och resultat är alltid identiska",
      "Endast resultat är viktigt för företaget",
      "Negativ likviditet innebär alltid konkurs",
    ],
    correct: 0,
    explanation:
      "Resultaträkningen periodiserar enligt bokföringsmässiga grunder - försäljning bokförs vid leverans även om betalning sker senare. Exempel: Företag säljer för 500 000 kr (vinst 100 000 kr) men ger 60 dagars kredit. Samtidigt investeras 200 000 kr i maskiner. Resultat visar vinst 100 000 kr men kassaflöde är -100 000 kr (0 från kunder, -200 000 investering). Detta är vanligt vid snabb tillväxt och kräver extern finansiering. Kassaflödesanalys är därför avgörande för likviditetsstyrning.",
    level: "VG",
  },
  {
    question:
      "Förklara kontoplanen och dess struktur enligt BAS-systemet. Ge exempel på kontonummer för olika typer av konton.",
    options: [
      "BAS-kontoplanen strukturerar konton i grupper: 1xxx Tillgångar, 2xxx Skulder och EK, 3xxx Intäkter, 4-8xxx Kostnader - exempel: 1930 Bank, 2440 Leverantörsskulder, 3000 Försäljning",
      "Kontoplanen är olika för varje företag utan standard",
      "Endast banken behöver kontonummer",
      "Kontonummer spelar ingen roll i bokföringen",
    ],
    correct: 0,
    explanation:
      "BAS-kontoplanen är Sveriges standard med hierarkisk struktur. Klass 1 (1000-1999): Tillgångar (1910 Kassa, 1930 Bank, 1510 Kundfordringar). Klass 2 (2000-2999): Skulder och Eget kapital (2081 Eget kapital, 2440 Leverantörsskulder). Klass 3 (3000-3999): Intäkter (3000 Försäljning). Klass 4-8: Kostnader (4000 Materialkostnader, 7010 Lokalhyra). Strukturen underlättar bokföring, rapportering och jämförelser mellan företag.",
    level: "VG",
  },
  {
    question:
      "Diskutera sambandet mellan marknadsföring och ekonomi i ett företag. Hur kan marknadsföringsbeslut påverka företagets ekonomiska resultat?",
    options: [
      "Marknadsföring kräver investeringar (kostnader) men genererar ökad försäljning (intäkter) - ROI på marknadsföring beräknas som (Ökad vinst - Marknadsföringskostnad) / Marknadsföringskostnad - strategiska beslut balanserar kostnad och effekt",
      "Marknadsföring har inget samband med ekonomi",
      "Marknadsföring är endast kostnader utan intäkter",
      "Ekonomi och marknadsföring är helt separata funktioner",
    ],
    correct: 0,
    explanation:
      "Marknadsföringsbeslut påverkar direkt ekonomin: Prissättning avgör täckningsbidrag, distribution påverkar kostnader, kampanjer kräver budget men ska generera försäljning. Exempel: Kampanj kostar 50 000 kr, genererar 200 nya kunder som köper för 500 kr (täckningsbidrag 200 kr/st). Kampanjintäkt = 200 × 200 = 40 000 kr, ROI = (40 000 - 50 000)/50 000 = -20% (förlust). Vid 300 kunder blir ROI = (60 000 - 50 000)/50 000 = 20% vinst. Analys av marknadsförings-ROI är avgörande för strategiska beslut.",
    level: "VG",
  },
  {
    question:
      "Förklara skillnaden mellan kortsiktig och långsiktig finansiering. Ge exempel på olika finansieringsformer och diskutera när respektive typ är lämplig.",
    options: [
      "Kortsiktig (<1 år): kassakrediter, fakturabelåning för löpande drift - Långsiktig (>1 år): banklån, obligationer för investeringar - matchningsprincipen: finansiera tillgångar med motsvarande löptid",
      "All finansiering är likadan",
      "Endast långsiktig finansiering är säker",
      "Finansieringsformen spelar ingen roll",
    ],
    correct: 0,
    explanation:
      "Kortsiktig finansiering (kassakredit, fakturabelåning, leverantörsskulder) används för rörelsekapital och säsongssvängningar, har högre ränta och kräver löpande betalningar. Långsiktig finansiering (banklån, obligationer, ägartillskott) används för fastigheter, maskiner och stora investeringar, har lägre ränta och längre amorteringstid. Matchningsprincipen: Finansiera långsiktiga tillgångar (maskin med 10 års livslängd) med långsiktiga lån, kortsiktiga behov (varulager) med kortsiktig kredit. Felaktig matchning ökar refinansieringsrisk och räntekostnader.",
    level: "VG",
  },
  {
    question:
      "Beskriv olika prissättningsstrategier och deras konsekvenser. Ge exempel på när varje strategi är lämplig.",
    options: [
      "Kostnadspålägg (självkostnad + pålägg), marknadspris (konkurrenters pris), värdepris (kundens upplevda värde) - strategier påverkar volym, lönsamhet och positionering - exempel: premiumpris för exklusiva produkter",
      "Alla produkter ska ha lägsta möjliga pris",
      "Pris spelar ingen roll för försäljning",
      "Endast kostnadspålägg är korrekt metod",
    ],
    correct: 0,
    explanation:
      "Prissättningsstrategier: 1) Kostnadspålägg: Självkostnad + marginal, säkerställer lönsamhet men ignorerar marknad. 2) Marknadspris: Anpassning till konkurrenter, lämpligt för homogena produkter. 3) Värdepris: Baserat på kundens upplevda värde, möjliggör premiumpriser för unika produkter. 4) Penetration: Lågt inträdespris för snabb marknadsandel. 5) Skimming: Högt pris initialt, sänks successivt. Exempel: Ny innovativ produkt - värdepris för early adopters, sedan marknadspris när konkurrenter kommer. Prissättningen påverkar volym, lönsamhet per enhet och varumärkespositionering.",
    level: "VG",
  },
  {
    question:
      "Analysera hur digitalisering påverkar affärsmannaskap och företagsekonomi. Ge konkreta exempel på hur digitala verktyg kan förbättra ekonomistyrning och marknadsföring.",
    options: [
      "Digitalisering möjliggör realtidsuppföljning av ekonomi (molnbaserad bokföring), datadriven marknadsföring (Google Analytics, CRM), automatisering av processer och ökad kostnadseffektivitet",
      "Digitalisering har ingen påverkan på ekonomi",
      "Endast stora företag kan dra nytta av digitalisering",
      "Digitala verktyg ersätter ekonomisk kompetens helt",
    ],
    correct: 0,
    explanation:
      "Digitaliseringens påverkan: 1) Ekonomistyrning: Molnbaserad bokföring (Fortnox, Visma) ger realtidsrapporter, automatisk avstämning och förbättrad likviditetskontroll. 2) Marknadsföring: Digital annonsering (Google, Facebook) möjliggör exakt målgruppsinriktning och ROI-mätning. CRM-system (HubSpot) spårar kundresor och förbättrar konvertering. 3) E-handel minskar distributionskostnader och når global marknad. 4) Automatisering (fakturering, löner) frigör tid för analys. 5) Big data och AI förbättrar prognoser och beslutsfattande. Digital kompetens är avgörande för konkurrenskraft.",
    level: "VG",
  },
];
