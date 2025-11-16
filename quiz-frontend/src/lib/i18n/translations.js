export const translations = {
  sv: {
    nav: {
      quiz: "Quiz",
      statistics: "Statistik",
      leaderboard: "Leaderboard",
      projects: "Besök Projekt",
    },

    header: {
      title: "Quiz App",
      username: "Användarnamn",
      password: "Lösenord",
      email: "E-post",
      confirmPassword: "Bekräfta lösenord",
      login: "Logga in",
      register: "Registrera",
    },

    auth: {
      loginTitle: "Logga in",
      loginSubtitle: "Välkommen tillbaka! Logga in på ditt konto.",
      registerTitle: "Registrera",
      subject_aefi_exam_one:
        "Affärsmannaskap och ekonomi inom fastighetsbranschen 1",
      subject_aefi_exam_two:
        "Affärsmannaskap och ekonomi inom fastighetsbranschen 2",
      registerSubtitle: "Skapa ett nytt konto för att komma igång.",
      noAccount: "Har du inget konto?",
      hasAccount: "Har du redan ett konto?",
      createAccount: "Skapa konto",
      loginLink: "Logga in",
    },
    subject_aefi_exam_one:
      "Affärsmannaskap och ekonomi inom fastighetsbranschen 1",
    subject_aefi_exam_two:
      "Affärsmannaskap och ekonomi inom fastighetsbranschen 2",

    toolbar: {
      cancel: "Avbryt",
      cancelTitle: "Avbryt quiz",
    },

    navWarning: {
      title: "⚠️ Pågående Quiz",
      message:
        "Du är mitt i ett quiz. Din session är sparad, men vill du verkligen lämna sidan?",
      stay: "Stanna kvar",
      continue: "Fortsätt (Behåll session)",
      endQuiz: "Avsluta quiz",
    },

    quizSelector: {
      selectSubject: "Välj ämne",
      examMode: "Tentamensläge",
      difficulty: "Svårighetsgrad",
      standard: "Standard",
      aiEvaluation: "AI-bedömning",
      aiUnavailable: "AI-tjänsten är inte tillgänglig just nu",
      unlockExam: "Lås upp tentan",
      requestKey: "Begär nyckel",
      enterKey: "Ange låskod",
      unlock: "Lås upp",
      cancel: "Avbryt",
      verifying: "Verifierar...",
      invalidKey: "Ogiltig nyckel",
      keyExpired: "Nyckel har gått ut",
      unlocked: "Upplåst! Du kan nu ta tentorna.",
      developer: "Öppna (Utvecklare)",
      enterEmail: "Din e-postadress",
      requestUnlock: "Begär upplåsning",
      checkEmail: "Kolla din e-post!",
      step2: "Steg 2: Skicka nyckel till din e-post",
      sendKey: "Skicka nyckel",
      keySent:
        "Nyckel skickad till din e-post (kolla även skräppost). Fortsätt till steg 2 för att låsa upp.",
      requestFailed: "Kunde inte skicka begäran",
      keyInstruction:
        "En nyckel har skickats till din e-postadress. Den är giltig i 15 minuter.",
      discordInfo:
        "Alternativt kan du använda Discord-boten för att få en upplåsningskod.",
    },

    form: {
      subjects: "ÄMNEN",
      practice: "ÖVNINGAR",
      exams: "TENTAMEN",

      warningText:
        "Avbryter du quiz-sessionen innan det är klart visas ändå ditt aktuella resultat.",
      observeLabel: "OBSERVERA:",

      pluDesc: "Leveranser, Uppföljning och Kvalitetssäkring.",
      aptDesc: "Scrum, Sprintar, Teststrategier och Verktyg.",
      waiDesc: "HTTP, Säkerhet, Kryptografi och Loggning.",
      aefiDescOne: "Affärs och Ekonomi inom Fastighetsbranschen Del 1.",
      aefiDescTwo: "Affärs och Ekonomi inom Fastighetsbranschen Del 2.",
      examPrefix: "Tenta: ",

      difficultyLabel: "Svårighet:",
      standard: "Standard - Flerval",
      aiEvaluation: "AI-bedömning - Flerval & Fritext",
      aiUnavailableSuffix: " - Ej tillgänglig",

      standardExamInfo: "Alla frågor är flerval.",
      standardExamTitle: "Flerval:",
      aiUnavailableTitle: "AI-bedömning är inte tillgänglig:",
      aiUnavailableText: "AI-tjänsten är inte konfigurerad.",
      aiModeTitle: "AI-bedömning",
      aiModeText1: "Endast frågor med",
      aiModeVG: "VG",
      aiModeText2: "-nivå visas med fritext och är bedömt av AI,",
      aiModeG: "G",
      aiModeText3: "frågor besvaras som flerval.",
      aiWarning:
        "AI-bedömning har sina begränsningar, stöter ni på problem kontakta mig!",

      unlockButton: "🔐 Lås upp Tentamen",
      unlocked: "🔓",
      locked: "🔐",
      aiActivated: " • AI-bedömning aktiverad",

      unlockTitle: "Lås upp tenta",
      step1Title: "Steg 1: Verifiera admin-nyckel",
      step2Title: "Steg 2: Skicka nyckel till din e-post",
      step3Title: "Steg 3: Lås upp med din nyckel",
      verifyButton: "Verifiera",
      sendKeyButton: "Skicka nyckel",
      unlockButton2: "Lås Upp",
      cancelButton: "Avbryt",
      developerButton: "Öppna",
      developerSuffix: "(Utvecklare)",

      adminKeyPlaceholder:
        "Besök Discord server för att få tillgång till Pre-Access Nyckel",
      emailPlaceholder: "din.e-post@example.com",
      keyPlaceholder: "Engångsnyckeln från e-post",

      errorAdminKeyNeeded:
        "Du behöver en admin-nyckel. Kontakta Administratören via Discord.",
      errorInvalidAdminKey: "Fel admin-nyckel.",
      errorTechnical: "Tekniskt fel. Försök igen.",
      errorKeyRequired: "Nyckel krävs.",
      errorInvalidKey: "Fel nyckel.",
      errorEmailRequired: "E-post krävs.",
      errorAdminKeyRequired:
        "Admin-nyckel krävs innan du kan begära tentanyckel.",
      errorRequestFailed: "Kunde inte skicka begäran:",
      errorNoLocalKey: "Ingen lokal nyckel tillgänglig.",
      errorFetchLocalKey: "Kunde inte hämta lokal nyckel.",

      successAdminKeyVerified:
        "Admin-nyckel verifierad. Ange din e-post för att få tentanyckeln.",
      successExamUnlocked: "Tentamen upplåst! Välj en tenta nedan.",
      successKeySent:
        "Nyckel skickad till din e-post (kolla även skräppost). Fortsätt till steg 2 för att låsa upp.",

      ariaChooseSubject: "Välj ämne",
      ariaSelectPLU: "Välj Paketering, Leverans och Uppföljning",
      ariaSelectAPT: "Välj Agil Projektmetodik och Testning",
      ariaSelectWAI: "Välj Webbsäkerhet; Analys och Implementation",
      ariaSelectAEFI: "Välj Affärs och Ekonomi inom Fastighetsbranschen",
      ariaOpenPLUExam: "Öppna PLU tenta",
      ariaPLULocked: "PLU Tenta - Låst",
      ariaOpenWAIExam: "Öppna WAI tenta",
      ariaWAILocked: "WAI Tenta - Låst",
      ariaOpenAEFIExam: "Öppna AEFI tenta",
      ariaAEFILocked: "AEFI Tenta - Låst",
      ariaUnlockDialog: "Lås upp tenta",
      ariaDiscordLink: "Öppna Discord för att få admin-nyckeln",
      titleDiscord: "Discord",
      titleOnlyLocal: "Endast lokalt",
    },

    quiz: {
      question: "Fråga",
      scoreLabel: "Poäng",
      of: "av",
      level: "Nivå",
      aiEvaluated: "(AI-bedömd)",
      typeAnswer: "Skriv ditt svar här... (VG-nivå förväntas)",
      submit: "Skicka svar",
      submitting: "AI bedömer...",
      next: "Nästa",
      nextHint: "Tryck nästa för att se ditt resultat!",
      selectAnswer: "Välj ett alternativ för att fortsätta",
      result: "Resultat",
      feedback: "Feedback",
      correctAnswer: "Korrekt svar",
      explanation: "Förklaring",
      aiEvaluation: "AI-bedömning",
      approved: "Godkänt (VG)",
      notApproved: "Ej godkänt",
      evaluating: "Utvärderar svar...",
      evaluationError: "Kunde inte utvärdera svar. Försök igen.",
    },

    result: {
      completed: "Quiz klart!",
      yourScore: "Du fick",
      score: "poäng",
      outOf: "av",
      correct: "rätt",
      percentage: "Procent",
      tryAgain: "Försök igen",
      newQuiz: "Välj nytt quiz",
      summary: "Sammanfattning",
      summaryNote:
        "OBSERVERA: Avbryter du quiz-sessionen innan det är klart visas ändå ditt aktuella resultat.",
      attempted: "Besvarade",
      questions: "frågor",
    },

    leaderboard: {
      title: "📊 Leaderboard",
      subtitle: "Topplista över quiz-prestationer",
      underDevelopment:
        "🚧 Leaderboard är under utveckling. Funktionalitet kommer snart!",
      preview: "Förhandsvisning",
      rank: "#",
      name: "Namn",
      score: "Poäng",
      subject: "Ämne",
      date: "Datum",
    },

    projects: {
      title: "📁 Projekt",
      subtitle: "Mina utvecklingsprojekt",
      underDevelopment:
        "Projektsidan är under utveckling. Besök extern projektportfölj via navigationen.",
    },

    updates: {
      trigger: "Ändringar",
      title: "Senaste uppdateringar",
      titleFull: "Senaste Uppdateringar:",
      viewCommit: "Visa commit",
      previous: "Föregående",
      next: "Nästa",
      close: "Stäng",
      loading: "Laddar…",
      noUpdates: "Inga uppdateringar hittades",
      error: "Kunde inte hämta uppdateringar",
      ariaLabel: "Senaste ändringar",
      ariaClose: "Close updates",
      ariaPrevious: "Previous update",
      ariaNext: "Next update",
      ariaOpenCommit: "Open commit",
    },

    statistics: {
      title: "📈 Statistik",
      subtitle: "Prestationsöversikt och rankningar",
      noData: "Ingen data tillgänglig ännu",
      loading: "Laddar statistik...",
      leaderboard: {
        title: "Översikt",
        description:
          "Övergripande ranking baserad på alla kategorier - poäng, hastighet och excellens",
        rank: "Rank",
        name: "Namn",
        overallScore: "Totalpoäng",
        breakdown: "Breakdown",
      },
      points: {
        title: "Poäng",
        description: "Topplista baserad på totala poäng från genomförda quiz",
        totalPoints: "Totala poäng",
      },
      speed: {
        title: "Hastighet",
        description:
          "Snabbaste användare baserat på genomsnittlig svarstid per fråga",
        avgTime: "Genomsnittstid",
        quizzesCompleted: "Genomförda",
      },
      excellence: {
        title: "Excellens",
        description: "Högst AI-bedömda svar - bäst förklaringar och resonemang",
        aiScore: "AI-betyg",
        bestAnswer: "Bästa svar (utdrag)",
      },
    },

    footer: {
      version: "Version",
    },

    subjects: {
      plu: "Paketering, Leverans & Uppföljning",
      "plu-exam": "Tenta: Paketering, Leverans & Uppföljning",
      apt: "Agil Projektmetodik & Testning",
      wai: "Webbsäkerhet; Analys och Implementation",
      "wai-exam": "Tenta: Webbsäkerhet; Analys och Implementation",
      aefiOne: "Affärs och Ekonomi inom Fastighetsbranschen Del 1",
      "aefi-exam-one":
        "Tenta: Affärs och Ekonomi inom Fastighetsbranschen Del 1",
      aefiTwo: "Affärs och Ekonomi inom Fastighetsbranschen Del 2",
      "aefi-exam-two":
        "Tenta: Affärs och Ekonomi inom Fastighetsbranschen Del 2",
    },

    cookies: {
      title: "🍪 Vi använder cookies",
      description:
        "Vi använder cookies för att förbättra din upplevelse. Nödvändiga cookies krävs för att appen ska fungera.",
      necessary: "Nödvändiga",
      necessaryDesc:
        "Krävs för att appen ska fungera (inloggning, inställningar)",
      functional: "Funktionella",
      functionalDesc: "Sparar dina preferenser och quizframsteg",
      analytics: "Analys",
      analyticsDesc: "Hjälper oss förstå hur appen används",
      acceptAll: "Acceptera alla",
      acceptNecessary: "Endast nödvändiga",
      customize: "Anpassa",
      savePreferences: "Spara val",
      manageConsent: "Hantera cookies",
      updated: "Cookie-inställningar uppdaterade",
    },

    aria: {
      navigation: "Huvudnavigation",
      toolbar: "Quizkontroller",
      openProjects: "Öppna projektportfölj",
      visitProjects: "Besök projekt",
    },
  },

  en: {
    nav: {
      quiz: "Quiz",
      statistics: "Statistics",
      leaderboard: "Leaderboard",
      projects: "Visit Projects",
    },

    header: {
      title: "Quiz App",
      username: "Username",
      password: "Password",
      email: "Email",
      confirmPassword: "Confirm password",
      login: "Log in",
      register: "Register",
    },

    auth: {
      loginTitle: "Log in",
      loginSubtitle: "Welcome back! Log in to your account.",
      registerTitle: "Register",
      registerSubtitle: "Create a new account to get started.",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create account",
      loginLink: "Log in",
    },

    toolbar: {
      cancel: "Cancel",
      cancelTitle: "Cancel quiz",
    },

    navWarning: {
      title: "⚠️ Quiz in Progress",
      message:
        "You are in the middle of a quiz. Your session is saved, but do you really want to leave?",
      stay: "Stay",
      continue: "Continue (Keep session)",
      endQuiz: "End quiz",
    },

    quizSelector: {
      selectSubject: "Select Subject",
      examMode: "Exam Mode",
      difficulty: "Difficulty",
      standard: "Standard",
      aiEvaluation: "AI-evaluation",
      aiUnavailable: "AI service is currently unavailable",
      unlockExam: "Unlock Exam",
      requestKey: "Request Key",
      enterKey: "Enter unlock code",
      unlock: "Unlock",
      cancel: "Cancel",
      verifying: "Verifying...",
      invalidKey: "Invalid key",
      keyExpired: "Key has expired",
      unlocked: "Unlocked! You can now take the exams.",
      developer: "Open (Developer)",
      enterEmail: "Your email address",
      requestUnlock: "Request unlock",
      checkEmail: "Check your email!",
      step2: "Step 2: Send key to your email",
      sendKey: "Send key",
      keySent:
        "Key sent to your email (check spam folder too). Continue to step 2 to unlock.",
      requestFailed: "Could not send request",
      keyInstruction:
        "A key has been sent to your email address. It is valid for 15 minutes.",
      discordInfo:
        "Alternatively, you can use the Discord bot to get an unlock code.",
    },

    form: {
      subjects: "SUBJECTS",
      practice: "PRACTICE",
      exams: "EXAMS",

      warningText:
        "If you cancel the quiz session before completion, your current result will still be displayed.",
      observeLabel: "NOTE:",

      pluDesc: "Deliveries, Follow-up and Quality Assurance.",
      aptDesc: "Scrum, Sprints, Test Strategies and Tools.",
      waiDesc: "HTTP, Security, Cryptography and Logging.",
      aefiDescOne: "Business and Economics in the Real Estate Industry Part 1.",
      aefiDescTwo: "Business and Economics in the Real Estate Industry Part 2.",
      examPrefix: "Exam: ",

      difficultyLabel: "Difficulty:",
      standard: "Standard - Multiple Choice",
      aiEvaluation: "AI-evaluation - Multiple Choice & Free Text",
      aiUnavailableSuffix: " - Not available",

      standardExamInfo: "All questions are multiple choice.",
      standardExamTitle: "Multiple Choice:",
      aiUnavailableTitle: "AI-evaluation is not available:",
      aiUnavailableText: "The AI service is not configured.",
      aiModeTitle: "AI-evaluation:",
      aiModeText1: "Only questions with",
      aiModeVG: "VG",
      aiModeText2: " level are shown with free text and evaluated by AI,",
      aiModeG: "G",
      aiModeText3: "questions are answered as multiple choice.",
      aiWarning:
        "AI-evaluation has its limitations, if you encounter problems contact me!",

      unlockButton: "🔐 Unlock Exam",
      unlocked: "🔓",
      locked: "🔐",
      aiActivated: " • AI-evaluation activated",

      unlockTitle: "Unlock exam",
      step1Title: "Step 1: Verify admin key",
      step2Title: "Step 2: Send key to your email",
      step3Title: "Step 3: Unlock with your key",
      verifyButton: "Verify",
      sendKeyButton: "Send key",
      unlockButton2: "Unlock",
      cancelButton: "Cancel",
      developerButton: "Open",
      developerSuffix: "(Developer)",

      adminKeyPlaceholder:
        "Visit Discord server to get access to Pre-Access Key",
      emailPlaceholder: "your.email@example.com",
      keyPlaceholder: "One-time key from email",

      errorAdminKeyNeeded:
        "You need an admin key. Contact the Administrator via Discord.",
      errorInvalidAdminKey: "Invalid admin key.",
      errorTechnical: "Technical error. Try again.",
      errorKeyRequired: "Key required.",
      errorInvalidKey: "Invalid key.",
      errorEmailRequired: "Email required.",
      errorAdminKeyRequired:
        "Admin key required before you can request exam key.",
      errorRequestFailed: "Could not send request:",
      errorNoLocalKey: "No local key available.",
      errorFetchLocalKey: "Could not fetch local key.",

      successAdminKeyVerified:
        "Admin key verified. Enter your email to get the exam key.",
      successExamUnlocked: "Exam unlocked! Select an exam below.",
      successKeySent:
        "Key sent to your email (check spam folder too). Continue to step 2 to unlock.",

      ariaChooseSubject: "Choose subject",
      ariaSelectPLU: "Select Packaging, Delivery and Follow-up",
      ariaSelectAPT: "Select Agile Project Methodology and Testing",
      ariaSelectWAI: "Select Web Security; Analysis and Implementation",
      ariaSelectAEFI:
        "Select Business and Economics in the Real Estate Industry",
      ariaOpenPLUExam: "Open PLU exam",
      ariaPLULocked: "PLU Exam - Locked",
      ariaOpenWAIExam: "Open WAI exam",
      ariaWAILocked: "WAI Exam - Locked",
      ariaOpenAEFIExam: "Open AEFI exam",
      ariaAEFILocked: "AEFI Exam - Locked",
      ariaUnlockDialog: "Unlock exam",
      ariaDiscordLink: "Open Discord to get admin key",
      titleDiscord: "Discord",
      titleOnlyLocal: "Local only",
    },

    quiz: {
      question: "Question",
      scoreLabel: "Score",
      of: "of",
      level: "Level",
      aiEvaluated: "(AI-evaluated)",
      typeAnswer: "Type your answer here... (VG level expected)",
      submit: "Submit answer",
      submitting: "AI evaluating...",
      next: "Next",
      nextHint: "Click next to see your result!",
      selectAnswer: "Select an option to continue",
      result: "Result",
      feedback: "Feedback",
      correctAnswer: "Correct answer",
      explanation: "Explanation",
      aiEvaluation: "AI-evaluation",
      approved: "Approved (VG)",
      notApproved: "Not approved",
      evaluating: "Evaluating answer...",
      evaluationError: "Could not evaluate answer. Please try again.",
    },

    result: {
      completed: "Quiz completed!",
      yourScore: "You got",
      score: "points",
      outOf: "out of",
      correct: "correct",
      percentage: "Percentage",
      tryAgain: "Try Again",
      newQuiz: "Select New Quiz",
      summary: "Summary",
      summaryNote:
        "NOTE: If you cancel the quiz session before completion, your current result will still be displayed.",
      attempted: "Attempted",
      questions: "questions",
    },

    leaderboard: {
      title: "📊 Leaderboard",
      subtitle: "Top quiz performances",
      underDevelopment:
        "🚧 Leaderboard is under development. Functionality coming soon!",
      preview: "Preview",
      rank: "#",
      name: "Name",
      score: "Score",
      subject: "Subject",
      date: "Date",
    },

    projects: {
      title: "📁 Projects",
      subtitle: "My development projects",
      underDevelopment:
        "Projects page is under development. Visit external project portfolio via navigation.",
    },

    updates: {
      trigger: "Changes",
      title: "Latest Updates",
      titleFull: "Latest Updates:",
      viewCommit: "View commit",
      previous: "Previous",
      next: "Next",
      close: "Close",
      loading: "Loading…",
      noUpdates: "No updates found",
      error: "Could not fetch updates",
      ariaLabel: "Latest updates",
      ariaClose: "Close updates",
      ariaPrevious: "Previous update",
      ariaNext: "Next update",
      ariaOpenCommit: "Open commit",
    },

    statistics: {
      title: "📈 Statistics",
      subtitle: "Performance overview and rankings",
      noData: "No data available yet",
      loading: "Loading statistics...",
      leaderboard: {
        title: "Overview",
        description:
          "Overall ranking based on all categories - points, speed, and excellence",
        rank: "Rank",
        name: "Name",
        overallScore: "Overall Score",
        breakdown: "Breakdown",
      },
      points: {
        title: "Points",
        description: "Leaderboard based on total points from completed quizzes",
        totalPoints: "Total Points",
      },
      speed: {
        title: "Speed",
        description:
          "Fastest users based on average response time per question",
        avgTime: "Avg Time",
        quizzesCompleted: "Completed",
      },
      excellence: {
        title: "Excellence",
        description:
          "Highest AI-rated answers - best explanations and reasoning",
        aiScore: "AI Score",
        bestAnswer: "Best Answer (excerpt)",
      },
    },

    footer: {
      version: "Version",
    },

    subjects: {
      plu: "Packaging, Delivery & Follow-up",
      "plu-exam": "Exam: Packaging, Delivery & Follow-up",
      apt: "Agile Project Methodology & Testing",
      wai: "Web Security; Analysis and Implementation",
      "wai-exam": "Exam: Web Security; Analysis and Implementation",
      aefiOne: "Business and Economics in the Real Estate Industry Part 1",
      "aefi-exam-one":
        "Exam: Business and Economics in the Real Estate Industry Part 1",
      aefiTwo: "Business and Economics in the Real Estate Industry Part 2",
      "aefi-exam-two":
        "Exam: Business and Economics in the Real Estate Industry Part 2",
    },

    cookies: {
      title: "🍪 We use cookies",
      description:
        "We use cookies to improve your experience. Necessary cookies are required for the app to function.",
      necessary: "Necessary",
      necessaryDesc: "Required for the app to work (login, settings)",
      functional: "Functional",
      functionalDesc: "Saves your preferences and quiz progress",
      analytics: "Analytics",
      analyticsDesc: "Helps us understand how the app is used",
      acceptAll: "Accept all",
      acceptNecessary: "Only necessary",
      customize: "Customize",
      savePreferences: "Save preferences",
      manageConsent: "Manage cookies",
      updated: "Cookie preferences updated",
    },

    aria: {
      navigation: "Main navigation",
      toolbar: "Quiz controls",
      openProjects: "Open project portfolio",
      visitProjects: "Visit projects",
    },
  },
};

export const supportedLanguages = [
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export default translations;
