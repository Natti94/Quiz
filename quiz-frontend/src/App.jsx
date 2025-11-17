import { useRef, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "./lib/i18n/useTranslation";
import Content from "./components/content/Content";
import Nav from "./components/nav/Nav";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

import StatisticsPage from "./pages/StatisticsPage";

function App() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("AI");
  const [subject, setSubject] = useState(null);
  const [lastSummary, setLastSummary] = useState(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const subjectRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const subpagePaths = ["/statistics", "/analytics"];
  const isSubpage = subpagePaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  const subjectMeta = {
    plu: { label: t("subjects.plu"), icon: "📦" },
    "plu-exam": {
      label: t("subjects.plu-exam"),
      icon: "📦",
    },
    apt: { label: t("subjects.apt"), icon: "🧪" },
    wai: { label: t("subjects.wai"), icon: "🌐" },
    "wai-exam": {
      label: t("subjects.wai-exam"),
      icon: "🌐",
    },
    aefi: { label: t("subjects.aefi"), icon: "💼" },
    "aefi-exam-one": {
      label: t("subjects.aefi-exam-one"),
      icon: "💼",
    },
    "aefi-exam-two": {
      label: t("subjects.aefi-exam-two"),
      icon: "💼",
    },
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("quiz_session");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.subject) {
          setSubject(parsed.subject);
          if (parsed.mode) setMode(parsed.mode);
        }
      }
    } catch (err) {}
  }, []);

  const handleCancelQuiz = () => {
    const stats = subjectRef.current?.getStats?.();
    if (stats) setLastSummary(stats);
    try {
      localStorage.removeItem("quiz_session");
    } catch (err) {}
    setSubject(null);
    setShowNavigationWarning(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleNavigationAttempt = (path) => {
    if (subject && location.pathname === "/") {
      setPendingNavigation(path);
      setShowNavigationWarning(true);
      return false;
    }
    return true;
  };

  const handleContinueSession = () => {
    setShowNavigationWarning(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleStayOnPage = () => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  return (
    <>
      <div className="app">
        <aside className="app__sidebar">
          <Nav onNavigate={handleNavigationAttempt} hasActiveQuiz={!!subject} />
        </aside>
        <div className="app__main">
          <Header />
          <div className="app__content">
            {}
            <div
              className={
                isSubpage ? "app-content--hidden" : "app-content--visible"
              }
              aria-hidden={isSubpage}
              style={{ display: isSubpage ? "none" : undefined }}
            >
              {subject && (
                <div
                  className="app-toolbar"
                  role="toolbar"
                  aria-label={t("aria.toolbar")}
                >
                  <div className="app-toolbar__subject">
                    <span className="app-toolbar__subject-icon" aria-hidden>
                      {subjectMeta[subject]?.icon}
                    </span>
                    <span className="app-toolbar__subject-text">
                      {t(`subjects.${subject}`)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="app-toolbar__cancel"
                    onClick={handleCancelQuiz}
                    title={t("toolbar.cancelTitle")}
                  >
                    {t("toolbar.cancel")}
                  </button>
                </div>
              )}

              {showNavigationWarning && (
                <div className="app-nav-warning">
                  <div
                    className="app-nav-warning__overlay"
                    onClick={handleStayOnPage}
                  />
                  <div className="app-nav-warning__panel">
                    <h3 className="app-nav-warning__title">
                      {t("navWarning.title")}
                    </h3>
                    <p className="app-nav-warning__text">
                      {t("navWarning.message")}
                    </p>
                    <div className="app-nav-warning__actions">
                      <button
                        type="button"
                        className="app-nav-warning__btn app-nav-warning__btn--stay"
                        onClick={handleStayOnPage}
                      >
                        {t("navWarning.stay")}
                      </button>
                      <button
                        type="button"
                        className="app-nav-warning__btn app-nav-warning__btn--continue"
                        onClick={handleContinueSession}
                      >
                        {t("navWarning.continue")}
                      </button>
                      <button
                        type="button"
                        className="app-nav-warning__btn app-nav-warning__btn--cancel"
                        onClick={handleCancelQuiz}
                      >
                        {t("navWarning.endQuiz")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <Content
                subject={subject}
                mode={mode}
                lastSummary={lastSummary}
                subjectMeta={subjectMeta}
                subjectRef={subjectRef}
                onSelect={(s, m) => {
                  setLastSummary(null);
                  setSubject(s);
                  setMode(m || "AI");
                }}
              />
            </div>

            {}
            <div className="app__subpage">
              <Routes>
                <Route path="/statistics" element={<StatisticsPage />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
