import { useState, useEffect } from "react";

function Form({ onSelect }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [examUnlocked, setExamUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [error, setError] = useState("");

  const SECRET = import.meta.env.VITE_SECRET_KEY;

  const handleExamClick = () => {
    if (examUnlocked) {
      onSelect && onSelect("plu-exam");
      return;
    }
    setShowUnlock((v) => !v);
  };

  const attemptUnlock = (e) => {
    e.preventDefault();
    if (!secretInput.trim()) {
      setError("Nyckel krävs");
      return;
    }
    if (secretInput === SECRET) {
      setExamUnlocked(true);
      setError("");
      onSelect && onSelect("plu-exam");
      localStorage.setItem("examUnlocked", "true");
      setShowUnlock(false);
    } else {
      setError("Fel nyckel");
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("examUnlocked");
      if (stored === "true") {
        setExamUnlocked(true);
      }
    } catch (err) {}
  }, []);

  return (
    <div
      className="result"
      role="group"
      aria-labelledby="choose-subject-heading"
    >
      <h1 id="choose-subject-heading" className="quiz-title">
        Ämnen
      </h1>

      <div className="subjects__helper-text">
        <p>Välj ett område att öva på:</p>
        <p className="subjects__warning-text">
          OBS! Avbryter du quizet innan det är klart visas ändå ditt aktuella
          resultat.
        </p>
      </div>

      <div className="subjects">
        {}
        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("plu")}
          aria-label="Välj Paketering, Leverans och Uppföljning"
        >
          <div className="subject__icon subject__icon--plu" aria-hidden>
            📦
          </div>
          <div className="subject__content">
            <div className="subject__title">
              Paketering, Leverans och Uppföljning
            </div>
            <div className="subject__desc">
              Leveranser, Uppföljning och Kvalitetssäkring.
            </div>
          </div>
        </button>

        {}
        <div
          className="subjects__gated-wrapper"
          aria-label="Tenta: Paketering, Leverans och Uppföljning"
          role="group"
        >
          <button
            type="button"
            className={`subject subject--gated ${examUnlocked ? "subject--unlocked" : ""}`}
            onClick={handleExamClick}
            aria-expanded={showUnlock}
            aria-controls="exam-unlock-panel"
            aria-label={examUnlocked ? "Öppna tenta" : "Lås upp tenta"}
          >
            <div className="subject__icon subject__icon--plu" aria-hidden>
              📦
            </div>
            <div className="subject__content">
              <div className="subject__title">
                Tenta: Paketering, Leverans och Uppföljning
              </div>
              <div className="subject__desc">
                Leveranser, Uppföljning och Kvalitetssäkring.{" "}
                {examUnlocked ? "🔓" : "🔐"}
              </div>
            </div>
          </button>

          {showUnlock && !examUnlocked && (
            <form
              id="exam-unlock-panel"
              onSubmit={attemptUnlock}
              className="subjects__unlock-panel"
              aria-label="Lås upp tenta"
            >
              <label className="subjects__unlock-label">
                Lösenord:
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  className="subjects__unlock-input"
                  aria-required="true"
                />
              </label>
              <div className="subjects__unlock-actions">
                <button type="submit" className="subjects__unlock-btn">
                  Lås upp
                </button>
                <button
                  type="button"
                  className="subjects__cancel-unlock-btn"
                  onClick={() => {
                    setShowUnlock(false);
                    setSecretInput("");
                    setError("");
                  }}
                >
                  Avbryt
                </button>
              </div>
              {error && (
                <div className="subjects__unlock-error" role="alert">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {}
        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("apt")}
          aria-label="Välj Agil Projektmetodik och Testning"
        >
          <div className="subject__icon subject__icon--apt" aria-hidden>
            🧪
          </div>
          <div className="subject__content">
            <div className="subject__title">Agil Projektmetodik & Testning</div>
            <div className="subject__desc">
              Scrum, Sprintar, Teststrategier och Verktyg.
            </div>
          </div>
        </button>

        {}
        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("wai")}
          aria-label="Välj Webbsäkerhet; Analys och Implementation"
        >
          <div className="subject__icon subject__icon--wai" aria-hidden>
            🌐
          </div>
          <div className="subject__content">
            <div className="subject__title">
              Webbsäkerhet; Analys och Implementation
            </div>
            <div className="subject__desc">
              HTTP, Säkerhet, Kryptografi och Loggning.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Form;
