import { useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "./i18n/useTranslation";
import Content from "./components/content/Content";
import SideNav from "./components/nav/SideNav";
import Footer from "./components/footer/Footer";
import Updates from "./components/updates/Updates";
import Header from "./components/header/header";
import CookieConsent from "./components/footer/footer-wrapper/cookies/CookieConsent";
import Pages from "./pages/Pages";

function App() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState(null);
  const [mode, setMode] = useState("AI");
  const [lastSummary, setLastSummary] = useState(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const subjectRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
  };

  const handleCancelQuiz = () => {
    const stats = subjectRef.current?.getStats?.();
    if (stats) setLastSummary(stats);
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
          <SideNav
            onNavigate={handleNavigationAttempt}
            hasActiveQuiz={!!subject}
          />
        </aside>

        <div className="app__main">
          <Header />
          <div className="app__content">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {subject && (
                      <div
                        className="app-toolbar"
                        role="toolbar"
                        aria-label={t("aria.toolbar")}
                      >
                        <div className="app-toolbar__subject">
                          <span
                            className="app-toolbar__subject-icon"
                            aria-hidden
                          >
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
                  </>
                }
              />
              <Route path="/*" element={<Pages />} />
            </Routes>
          </div>
          <Updates />
          <Footer />
        </div>
      </div>
      <CookieConsent />
    </>
  );
}

export default App;
