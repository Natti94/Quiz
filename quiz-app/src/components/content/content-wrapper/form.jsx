import { useState, useEffect } from "react";

function Form({ onSelect }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [examUnlocked, setExamUnlocked] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleExamClick = () => {
    if (examUnlocked) {
      onSelect && onSelect("plu-exam");
      return;
    }
    setShowUnlock((v) => !v);
  };

  const attemptUnlock = async (e) => {
    e.preventDefault();
    setError("");
    const key = secretInput.trim();
    if (!key) {
      setError("Nyckel krävs");
      return;
    }
    try {
      const res = await fetch("/api/verifyUnlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.token) {
        setError("Fel nyckel");
        return;
      }
      localStorage.setItem("examToken", data.token);
      setExamUnlocked(true);
      onSelect && onSelect("plu-exam");
      setShowUnlock(false);
    } catch (err) {
      setError("Tekniskt fel. Försök igen.");
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("examToken");
      if (!token) return;
      const parts = token.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload && typeof payload.exp === "number") {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp > now) setExamUnlocked(true);
        else localStorage.removeItem("examToken");
      }
    } catch {}
  }, []);

  async function requestUnlock(e) {
    e?.preventDefault?.();
    setError("");
    setInfo("");
    const email = recipient.trim();
    if (!email) {
      setError("E-post krävs");
      return;
    }
    try {
      const res = await fetch("/api/requestUnlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Fel ${res.status}`);
      }
      setInfo("Begäran skickad. Du kontaktas via e-post.");
      setRecipient("");
    } catch (err) {
      setError(`Kunde inte skicka begäran: ${err.message}`);
    }
  }

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
                    setInfo("");
                  }}
                >
                  Avbryt
                </button>
                <div className="subjects__request-key">
                  <label className="subjects__unlock-label" style={{ display: "block" }}>
                    Din e-post för nyckel:
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="namn@example.com"
                      className="subjects__unlock-input"
                    />
                  </label>
                  <button type="button" className="subjects__resend-btn" onClick={requestUnlock}>
                    Begär nyckel
                  </button>
                </div>
              </div>
              {error && (
                <div className="subjects__unlock-error" role="alert">
                  {error}
                </div>
              )}
              {info && (
                <div className="subjects__unlock-info" role="status">
                  {info}
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
