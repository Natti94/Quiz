import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Content from "./components/content/content";
import Nav from "./components/nav/nav";
import Footer from "./components/footer/footer";
import Updates from "./components/updates/updates";
import Projects from "./pages/projects";

function App() {
  const [subject, setSubject] = useState(null);
  const [lastSummary, setLastSummary] = useState(null);
  const subjectRef = useRef(null);

  const subjectMeta = {
    plu: { label: "Paketering, Leverans & Uppföljning", icon: "📦" },
    "plu-exam": {
      label: "Tenta: Paketering, Leverans & Uppföljning",
      icon: "📦",
    },
    apt: { label: "Agil Projektmetodik & Testning", icon: "🧪" },
    wai: { label: "Webbsäkerhet; Analys och Implementation", icon: "🌐" },
  };

  return (
    <>
      <div className="app">
        <aside className="app__sidebar">
          <Nav />
        </aside>

        <div className="app__main">
          <div className="app__content">
            <div className="app-header">
              <h1 className="app-header__title">Quiz App</h1>
            </div>

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {subject && (
                      <div
                        className="app-toolbar"
                        role="toolbar"
                        aria-label="Quizkontroller"
                      >
                        <div className="app-toolbar__subject">
                          <span
                            className="app-toolbar__subject-icon"
                            aria-hidden
                          >
                            {subjectMeta[subject]?.icon}
                          </span>
                          <span className="app-toolbar__subject-text">
                            {subjectMeta[subject]?.label}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="app-toolbar__cancel"
                          onClick={() => {
                            const stats = subjectRef.current?.getStats?.();
                            if (stats) setLastSummary(stats);
                            setSubject(null);
                          }}
                          title="Avbryt quiz"
                        >
                          Avbryt
                        </button>
                      </div>
                    )}

                    <Content
                      subject={subject}
                      lastSummary={lastSummary}
                      subjectMeta={subjectMeta}
                      subjectRef={subjectRef}
                      onSelect={(s) => {
                        setLastSummary(null);
                        setSubject(s);
                      }}
                    />
                  </>
                }
              />
              <Route path="/projects" element={<Projects />} />
            </Routes>
          </div>
          <Updates />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
