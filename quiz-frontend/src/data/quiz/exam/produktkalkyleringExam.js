export const questionsProduktkalkyleringExam = [
  {
    question:
      "Redogör för skillnaderna mellan självkostnadskalkylering och bidragskalkylering och visa med ett konkret exempel när vardera metod är mest lämplig.",
    options: [
      "Självkostnadskalkylering fördelar alla kostnader på produkter, bidragskalkylering täcker endast direkta kostnader och visar bidrag till fasta kostnader",
      "Självkostnadskalkylering används endast för tjänster, bidragskalkylering för produkter",
      "Båda metoderna är identiska och kan användas utbytbart",
      "Bidragskalkylering kräver alltid ABC-metoden för att fungera",
    ],
    correct: 0,
    explanation:
      "Självkostnadskalkylering fördelar alla kostnader (direkta + indirekta) på produkter för att få full kostnad per enhet. Bidragskalkylering visar endast direkta kostnader och bidrag till täckande av fasta kostnader. Självkostnad används för prissättning av unika produkter, bidragskalkylering för beslut om produktmix och kortsiktig prissättning.",
    level: "VG",
  },
  {
    question:
      "Genomför en kalkyl med divisionsmetoden: Företaget har totala kostnader 9 700 000 kr och en uthyrd yta totalt 28 800 m2. Beräkna självkostnad per m2 och diskutera svagheter med metoden i detta fall.",
    options: [
      "Självkostnad per m2 = 9 700 000 / 28 800 = 337 kr/m2. Svagheten är att metoden inte skiljer på olika kostnadsdrivare mellan avdelningar",
      "Självkostnad per m2 = 28 800 / 9 700 000 = 0,003 m2/kr. Metoden fungerar bra för homogena produkter",
      "Total kostnad dividerat med yta ger alltid rätt kostnad oavsett fastighetstyp",
      "Divisionsmetoden kräver alltid att alla kostnader är direkta",
    ],
    correct: 0,
    explanation:
      "Beräkning: 9 700 000 ÷ 28 800 = 337 kr/m2. Svagheten med divisionsmetoden är att den inte tar hänsyn till olika kostnadsdrivare - alla kostnader fördelas lika per m2 även om vissa avdelningar kräver mer underhåll eller har högre vakansgrad.",
    level: "VG",
  },
  {
    question:
      "Utför en påläggsmetod-kalkyl för lönekostnaden: Totala lönekostnader 12 000 000 kr, totalt 57 000 arbetstimmar; bostäder 30 000 timmar, kontor 15 000 timmar, industri 12 000 timmar. Fördela lönekostnaden per avdelning och resonera kring rimligheten i fördelningsnyckeln.",
    options: [
      "Bostäder: 12M × (30k/57k) = 6,32M kr, Kontor: 12M × (15k/57k) = 3,16M kr, Industri: 12M × (12k/57k) = 2,53M kr. Arbetade timmar är rimlig nyckel för personalintensiva kostnader",
      "Alla avdelningar får lika mycket: 12M ÷ 3 = 4M kr per avdelning",
      "Endast industriavdelningen får lönekostnader eftersom den producerar",
      "Påläggsmetoden kräver alltid samma procentuella påslag på alla produkter",
    ],
    correct: 0,
    explanation:
      "Beräkning visar proportionell fördelning baserat på arbetade timmar. Denna fördelningsnyckel är rimlig för lönekostnader eftersom den reflekterar personalåtgång per avdelning. Alternativa nycklar som yta eller intäkter kan vara mer lämpliga för andra kostnadstyper.",
    level: "VG",
  },
  {
    question:
      "Beskriv hur kritisk volym (break-even) beräknas och förklara vilka affärsbeslut som kan baseras på denna analys i fastighetskontext.",
    options: [
      "Kritisk volym = Fasta kostnader ÷ (Pris per enhet - Variabla kostnader per enhet). Används för att bestämma minsta uthyrningsgrad eller prissättning för lönsamhet",
      "Kritisk volym är alltid 50% av total kapacitet",
      "Break-even beräknas endast för tillverkande företag, inte tjänster",
      "Kritisk volym kräver att alla kostnader är variabla",
    ],
    correct: 0,
    explanation:
      "Formeln visar vid vilken volym intäkter täcker alla kostnader. I fastighetskontext används den för att bestämma lägsta uthyrningsgrad för lönsamhet, prissättning av vakanta ytor, eller beslut om investeringar i fastighetsutveckling.",
    level: "VG",
  },
];
