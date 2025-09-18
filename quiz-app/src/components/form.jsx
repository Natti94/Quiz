import { useState, useEffect } from "react";

const SECRET = import.meta.env.VITE_SECRET_KEY;

function Form({ onSelect }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [examUnlocked, setExamUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [error, setError] = useState("");

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
      <div className="helper-text">
        <p>Välj ett område att öva på. </p>
        <p className="warning-text">
          OBS! Avbryter du quizet innan det är klart visas ändå ditt aktuella
          resultat.
        </p>
      </div>
      <div className="subject-chooser">
        <button
          type="button"
          className="subject-card"
          onClick={() => onSelect && onSelect("plu")}
          aria-label="Välj Paketering, Leverans och Uppföljning"
        >
          <div className="icon plu" aria-hidden>
            📦
          </div>
          <div className="content">
            <div className="title">Paketering, Leverans & Uppföljning</div>
            <div className="desc">
              Planera leveranser, uppföljning och kvalitetssäkring.
            </div>
          </div>
        </button>

        <div className="gated-wrapper" aria-label="Tenta: Paketering, Leverans och Uppföljning" role="group">
          <button
            type="button"
            className={`subject-card gated-card ${examUnlocked ? "unlocked" : ""}`}
            onClick={handleExamClick}
            aria-expanded={showUnlock}
            aria-controls="exam-unlock-panel"
            aria-label={examUnlocked ? "Öppna tenta" : "Lås upp tenta"}
          >
            <div className="icon plu" aria-hidden>
              📦
            </div>
            <div className="content">
              <div className="title">Tenta: Paketering, Leverans & Uppföljning</div>
              <div className="desc">
                Planera leveranser, uppföljning och kvalitetssäkring.
                {examUnlocked ? "🔓" : "🔐"}
              </div>
            </div>
          </button>
          {showUnlock && !examUnlocked && (
            <form
              id="exam-unlock-panel"
              onSubmit={attemptUnlock}
              className="unlock-panel"
              aria-label="Lås upp tenta"
            >
              <label className="unlock-label">
                Lösenord:
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  className="unlock-input"
                  aria-required="true"
                />
              </label>
              <div className="unlock-actions">
                <button type="submit" className="unlock-btn">Lås upp</button>
                <button
                  type="button"
                  className="cancel-unlock-btn"
                  onClick={() => {
                    setShowUnlock(false);
                    setSecretInput("");
                    setError("");
                  }}
                >
                  Avbryt
                </button>
              </div>
              {error && <div className="unlock-error" role="alert">{error}</div>}
            </form>
          )}
        </div>

        <button
          type="button"
          className="subject-card"
          onClick={() => onSelect && onSelect("apt")}
          aria-label="Välj Agil Projektmetodik och Testning"
        >
          <div className="icon apt" aria-hidden>
            🧪
          </div>
          <div className="content">
            <div className="title">Agil Projektmetodik & Testning</div>
            <div className="desc">
              Scrum, sprintar, teststrategier och verktyg.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Form;
