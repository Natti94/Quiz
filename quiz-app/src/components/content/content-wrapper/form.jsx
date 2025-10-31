import { useState, useEffect } from "react";

function Form({ onSelect }) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [examUnlocked, setExamUnlocked] = useState(false);
  const [formKey, setFormKey] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [unlockStep, setUnlockStep] = useState("request");
  const [preToken, setPreToken] = useState("");
  const [hasPreAccess, setHasPreAccess] = useState(false);

  const isProd = import.meta.env.PROD;

  const assets = {
    discord_link: isProd
      ? "/api/assets?asset=discord_link"
      : import.meta.env.VITE_DISCORD_LINK,
    discord_icon: isProd
      ? "/api/assets?asset=discord_icon"
      : import.meta.env.VITE_DISCORD_ICON,
  };

  const handleExamClick = () => {
    if (examUnlocked) {
      onSelect && onSelect("plu-exam");
      return;
    }
    setShowUnlock((v) => {
      const next = !v;
      if (next) setUnlockStep("request");
      return next;
    });
  };

  const verifyPreAccess = async (e) => {
    e.preventDefault();
    setError("");
    const adminKey = formKey.trim();
    if (!adminKey) {
      setError(
        "Du behöver en admin-nyckel. Kontakta Administratören via Discord."
      );
      return;
    }
    try {
      const res = await callFunction("verifyPreAccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.token) {
        setError(data?.error || "Fel admin-nyckel.");
        return;
      }
      localStorage.setItem("preToken", data.token);
      setPreToken(data.token);
      setHasPreAccess(true);
      setInfo(
        "Admin-nyckel verifierad. Ange din e-post för att få tentanyckeln."
      );
      setFormKey("");
    } catch (err) {
      setError("Tekniskt fel. Försök igen.");
    }
  };

  const attemptUnlock = async (e) => {
    e.preventDefault();
    setError("");
    const key = secretInput.trim();
    if (!key) {
      setError("Nyckel krävs.");
      return;
    }
    await verifyKeyAndUnlock(key);
  };

  const verifyKeyAndUnlock = async (key) => {
    try {
      const res = await callFunction("verifyUnlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.token) {
        setError("Fel nyckel.");
        return false;
      }
      localStorage.setItem("examToken", data.token);
      setExamUnlocked(true);
      onSelect && onSelect("plu-exam");
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
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      if (payload && typeof payload.exp === "number") {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp > now) setExamUnlocked(true);
        else localStorage.removeItem("examToken");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const t = localStorage.getItem("preToken");
      if (!t) return;
      const parts = t.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const now = Math.floor(Date.now() / 1000);
      if (payload && payload.exp && payload.exp > now) {
        setPreToken(t);
        setHasPreAccess(true);
      } else {
        localStorage.removeItem("preToken");
      }
    } catch {}
  }, []);

  function getFunctionBases() {
    try {
      const pref = localStorage.getItem("fnBase");
      if (pref === "/.netlify/functions")
        return ["/.netlify/functions", "/api"];
      if (pref === "/api") return ["/api", "/.netlify/functions"];
    } catch {}

    return ["/.netlify/functions", "/api"];
  }

  async function callFunction(name, init) {
    const bases = getFunctionBases();
    let lastRes;
    for (const base of bases) {
      try {
        const res = await fetch(`${base}/${name}`, init);
        lastRes = res;
        if (res.status !== 404) {
          if (res.ok) {
            try {
              localStorage.setItem("fnBase", base);
            } catch {}
          }
          return res;
        }
      } catch {}
    }
    return lastRes;
  }

  async function requestUnlock(e) {
    e?.preventDefault?.();
    setError("");
    setInfo("");
    if (!hasPreAccess || !preToken) {
      setError("Admin-nyckel krävs innan du kan begära tentanyckel.");
      return;
    }
    const email = recipient.trim();
    if (!email) {
      setError("E-post krävs.");
      return;
    }
    try {
      const res = await callFunction("requestUnlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${preToken}`,
        },
        body: JSON.stringify({ recipient: email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Fel ${res.status}`);
      }
      setInfo(
        "Nyckel skickad till din e-post (kolla även skräppost). Fortsätt till steg 2 för att låsa upp."
      );
      setUnlockStep("unlock");
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
      const res = await callFunction("getDevUnlockKey", { headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.key) {
        setError(data?.error || "Ingen lokal nyckel tillgänglig.");
        return;
      }
      setSecretInput(data.key);
      await verifyKeyAndUnlock(data.key);
    } catch (err) {
      setError("Kunde inte hämta lokal nyckel.");
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
                <strong>Tenta: </strong>Paketering, Leverans och Uppföljning
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
                {}
                <a
                  href={assets.discord_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subjects__discord-link"
                  aria-label="Öppna Discord för att få admin-nyckeln"
                  title="Öppna Discord (få admin-nyckeln)"
                >
                  <img
                    src={assets.discord_icon}
                    alt="Discord"
                    className="subjects__discord-icon-static"
                  />
                </a>
                {}
                {!hasPreAccess && (
                  <>
                    <h2
                      id="unlock-title"
                      className="subjects__unlock-title"
                      style={{ margin: 0, fontSize: "1rem" }}
                    >
                      Steg 1: Verifiera admin-nyckel
                    </h2>
                    <div
                      className="subjects__request-key"
                      style={{ marginBottom: "1rem" }}
                    >
                      <label
                        className="subjects__unlock-label"
                        htmlFor="admin-key"
                      ></label>
                      <input
                        id="admin-key"
                        type="text"
                        value={formKey}
                        onChange={(e) => setFormKey(e.target.value)}
                        placeholder="Admin-nyckel (GUID) från Administratören"
                        className="subjects__unlock-input"
                      />
                      <button
                        type="button"
                        className="ui-btn ui-btn--secondary"
                        onClick={verifyPreAccess}
                      >
                        Verifiera
                      </button>
                    </div>
                  </>
                )}

                {}
                {hasPreAccess && unlockStep !== "unlock" && (
                  <>
                    <h3
                      className="subjects__unlock-title"
                      style={{ margin: 0, fontSize: "1rem" }}
                    >
                      Steg 2: Skicka nyckel till din e-post
                    </h3>
                    <div
                      className="subjects__request-key"
                      style={{ marginBottom: "1rem" }}
                    >
                      <label
                        className="subjects__unlock-label"
                        htmlFor="email-recipient"
                      ></label>
                      <input
                        id="email-recipient"
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="din.e-post@example.com"
                        className="subjects__unlock-input"
                        autoComplete="email"
                      />
                      <button
                        type="button"
                        className="ui-btn ui-btn--secondary"
                        onClick={requestUnlock}
                      >
                        Skicka nyckel
                      </button>
                    </div>
                  </>
                )}

                {}
                {(unlockStep === "unlock" || isLocal) && (
                  <>
                    <h3
                      className="subjects__unlock-title"
                      style={{ margin: 0, fontSize: "1rem" }}
                    >
                      Steg 3: Lås upp med din nyckel
                    </h3>
                    <label
                      className="subjects__unlock-label"
                      htmlFor="exam-password"
                    >
                      <input
                        id="exam-password"
                        type="text"
                        value={secretInput}
                        onChange={(e) => setSecretInput(e.target.value)}
                        className="subjects__unlock-input"
                        aria-required="true"
                        placeholder="Engångsnyckeln från e-post"
                      />
                    </label>
                    <div className="subjects__unlock-actions">
                      <button type="submit" className="ui-btn ui-btn--primary">
                        Lås Upp
                      </button>
                      {isLocal && (
                        <button
                          type="button"
                          className="ui-btn ui-btn--secondary"
                          onClick={fetchLocalKey}
                          title="Endast lokalt"
                        >
                          Öppna {"(Utvecklare)"}
                        </button>
                      )}
                    </div>
                  </>
                )}

                <div
                  className="subjects__unlock-actions"
                  style={{ marginTop: "0.75rem" }}
                >
                  <button
                    type="button"
                    className="ui-btn ui-btn--tertiary"
                    onClick={() => {
                      setShowUnlock(false);
                      setSecretInput("");
                      setRecipient("");
                      setError("");
                      setInfo("");
                      setUnlockStep("request");
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
