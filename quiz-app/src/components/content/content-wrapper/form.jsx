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
    await verifyKeyAndUnlock(key);
  };

  const verifyKeyAndUnlock = async (key) => {
    try {
      let res = await fetch("/api/verifyUnlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (res.status === 404) {
        res = await fetch("/.netlify/functions/verifyUnlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.token) {
        setError("Fel nyckel");
        return false;
      }
      localStorage.setItem("examToken", data.token);
      setExamUnlocked(true);
      onSelect && onSelect("plu-exam");
      setShowUnlock(false);
      return true;
    } catch (err) {
      setError("Tekniskt fel. Försök igen.");
      return false;
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("examToken");
      if (!token) return;
      const parts = token.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
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
      let res = await fetch("/api/requestUnlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: email }),
      });
      if (res.status === 404) {
        res = await fetch("/.netlify/functions/requestUnlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipient: email }),
        });
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Fel ${res.status}`);
      }
      setInfo("Nyckel skickad till din e-post (kolla även skräppost).");
      setRecipient("");
    } catch (err) {
      setError(`Kunde inte skicka begäran: ${err.message}`);
    }
  }

  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  async function fetchLocalKey() {
    if (!isLocal) return;
    setError("");
    setInfo("");
    try {
      const devToken = import.meta.env?.VITE_DEV_ACCESS_TOKEN;
      const baseHeaders = { "Cache-Control": "no-store" };
      const headers = devToken
        ? { ...baseHeaders, "x-dev-token": devToken }
        : baseHeaders;
      let res = await fetch("/api/getDevUnlockKey", { headers });
      if (res.status === 404) {
        res = await fetch("/.netlify/functions/getDevUnlockKey", { headers });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.key) {
        setError(data?.error || "Ingen lokal nyckel tillgänglig");
        return;
      }
      setSecretInput(data.key);
      await verifyKeyAndUnlock(data.key);
    } catch (err) {
      setError("Kunde inte hämta lokal nyckel");
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
            <div
              className="subjects__overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="unlock-title"
            >
              <form
                id="exam-unlock-panel"
                onSubmit={attemptUnlock}
                className="subjects__unlock-panel"
                aria-label="Lås upp tenta"
              >
                <h2
                  id="unlock-title"
                  className="subjects__unlock-title"
                  style={{ margin: 0, fontSize: "1rem" }}
                >
                  Lås upp tenta
                </h2>
                <label className="subjects__unlock-label">
                  Lösenord:
                  <input
                    type="password"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    className="subjects__unlock-input"
                    aria-required="true"
                    placeholder="Fyll i din nyckel här"
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
                    <label
                      className="subjects__unlock-label"
                      style={{ display: "block" }}
                    >
                      Din e-post för nyckel:
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="namn@example.com"
                        className="subjects__unlock-input"
                        autoComplete="email"
                      />
                    </label>
                    <button
                      type="button"
                      className="subjects__resend-btn"
                      onClick={requestUnlock}
                    >
                      Begär nyckel
                    </button>
                    {isLocal && (
                      <button
                        type="button"
                        className="subjects__resend-btn"
                        onClick={fetchLocalKey}
                        title="Endast lokalt"
                      >
                        Hämta lokal nyckel
                      </button>
                    )}
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
            </div>
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
