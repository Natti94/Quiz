export const questionsNyckeltalExam = [
  {
    question:
      "Analysera skillnaden mellan soliditet och likviditet i ett fastighetsbolag. Ge exempel på hur förändringar i dessa nyckeltal påverkar bankfinansiering och investeringsbeslut.",
    options: [
      "Soliditet visar långsiktig betalningsförmåga genom eget kapital/totala tillgångar, likviditet visar kortsiktig genom omsättningstillgångar/kortsiktiga skulder",
      "Soliditet och likviditet är samma begrepp och används utbytbart",
      "Soliditet mäter endast kontanter, likviditet mäter alla tillgångar",
      "Båda nyckeltalen beräknas endast på årsbasis",
    ],
    correct: 0,
    explanation:
      "Soliditet (eget kapital/totala tillgångar) visar finansiell styrka och förmåga att överleva förluster. Likviditet (omsättningstillgångar/kortsiktiga skulder) visar förmåga att betala löpande skulder. Högre soliditet förbättrar kreditvärdighet, högre likviditet minskar refinansieringsrisker.",
    level: "VG",
  },
  {
    question:
      "Beräkna driftnettot, direktavkastning och marknadsvärde för en kontorsfastighet med följande uppgifter: Fastighetspris 300 000 000 kr, Hyresintäkter 15 000 000 kr, Driftkostnader 3 000 000 kr, Underhåll 700 000 kr, Fastighetsskatt 1 500 000 kr. Motivera ditt svar och diskutera om fastigheten verkar rimligt värderad vid ett direktavkastningskrav på 5%.",
    options: [
      "Driftnetto = 15M - 3M - 0,7M - 1,5M = 9,8M kr. Direktavkastning = 9,8M/300M = 3,27%. Marknadsvärde = 9,8M/0,05 = 196M kr. Fastigheten verkar övervärderad",
      "Driftnetto = 15M + 3M + 0,7M + 1,5M = 20M kr. Direktavkastning = 20M/300M = 6,67%. Marknadsvärde = 20M/0,05 = 400M kr",
      "Direktavkastning beräknas alltid som pris dividerat med hyresintäkter",
      "Marknadsvärde är alltid samma som bokfört värde",
    ],
    correct: 0,
    explanation:
      "Driftnetto = hyresintäkter minus alla driftskostnader = 9,8M kr. Direktavkastning = driftnetto/pris = 3,27%. Vid 5% avkastningskrav bör värdet vara 9,8M ÷ 0,05 = 196M kr. Det faktiska priset på 300M kr indikerar övervärdering eller högre risk.",
    level: "VG",
  },
  {
    question:
      "Beskriv hur vakansgrad och driftnetto samspelar i värdering av en fastighet och ge ett exempel hur förändrad vakansgrad påverkar marknadsvärdet.",
    options: [
      "Högre vakansgrad minskar hyresintäkter vilket sänker driftnetto och därmed värdet. Ex: 10% vakansminskning kan öka värdet med motsvarande intäktsökning dividerat med avkastningskrav",
      "Vakansgrad påverkar endast driftnetto men inte marknadsvärde",
      "Lägre vakansgrad minskar alltid fastighetens värde",
      "Vakansgrad och driftnetto är oberoende av varandra",
    ],
    correct: 0,
    explanation:
      "Vakansgrad direkt påverkar hyresintäkter och därmed driftnetto. Ex: Om vakansgrad sjunker från 10% till 5% på en fastighet med 10M kr i potentiella intäkter, ökar driftnetto med 500k kr. Vid 5% avkastningskrav ökar värdet med 500k ÷ 0,05 = 10M kr.",
    level: "VG",
  },
  {
    question:
      "Redogör för hur du skulle använda benchmarking för att bedöma ett fastighetsbestånds prestanda. Vilka nyckeltal skulle du jämföra och varför?",
    options: [
      "Jämför driftnetto per m2, vakansgrad, direktavkastning och LTV mot branschgenomsnitt för att identifiera styrkor/svagheter och förbättringsområden",
      "Benchmarking används endast för att jämföra fastighetspriser",
      "Alla fastigheter ska ha identiska nyckeltal oavsett läge och typ",
      "Benchmarking kräver endast jämförelse av totala intäkter",
    ],
    correct: 0,
    explanation:
      "Benchmarking hjälper identifiera avvikelser från marknaden. Nyckeltal som driftnetto/m2 visar effektivitet, vakansgrad visar uthyrningsframgång, direktavkastning visar avkastning, LTV visar finansiell risk. Jämförelse med liknande fastigheter ger insikter för förbättringar.",
    level: "VG",
  },
];
