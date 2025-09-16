import { useRef, useState } from "react";
import Form from "./components/form";
import Nav from "./components/nav";
import Subject from "./components/subject";

function App() {
  const [subject, setSubject] = useState(null);
  const [lastSummary, setLastSummary] = useState(null);
  const subjectRef = useRef(null);

  const subjectMeta = {
    plu: { label: "Paketering, Leverans & Uppföljning", icon: "📦" },
    apt: { label: "Agil Projektmetodik & Testning", icon: "🧪" },
    // Support both kebab-case and camelCase keys for exam subject
    "plu-exam": {
      label: "[Tenta] Paketering, Leverans & Uppföljning",
      icon: "📦",
    },
    pluExam: {
      label: "[Tenta] Paketering, Leverans & Uppföljning",
      icon: "📦",
    },
  };

  return (
    <>
      <div className="app-shell">
        <div className="quiz-wrapper">
          <div className="header-bar">
            <h1 className="app-title">
              Quiz App - Made by Natnael Berhane. Visit other projects on my
              portfolio page.
            </h1>
            <Nav />
          </div>
          {subject && (
            <div className="top-bar" role="toolbar" aria-label="Quizkontroller">
              <div className="subject-pill">
                <span className="pill-icon" aria-hidden>
                  {subjectMeta[subject]?.icon}
                </span>
                <span className="pill-text">{subjectMeta[subject]?.label}</span>
              </div>
              <button
                type="button"
                className="cancel-btn"
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

          {!subject ? (
            <>
              {lastSummary && (
                <div className="result" role="status" aria-live="polite">
                  <h2 style={{ color: "red" }}>Quiz avbrutet!</h2>
                  <p>
                    Du fick {lastSummary.score} poäng av {lastSummary.attempted}{" "}
                    försök (totalt {lastSummary.total} frågor) i{" "}
                    {subjectMeta[lastSummary.subject]?.label}.
                  </p>
                </div>
              )}
              <Form
                onSelect={(s) => {
                  setLastSummary(null);
                  setSubject(s);
                }}
              />
            </>
          ) : (
            <Subject ref={subjectRef} subject={subject} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
