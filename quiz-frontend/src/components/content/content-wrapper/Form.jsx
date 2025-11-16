import { useState, useEffect } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";

function Form({ onSelect }) {
  const { t } = useTranslation();
  const [examUnlocked, setExamUnlocked] = useState(true);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [showUnlock, setShowUnlock] = useState(false);
  const [hasPreAccess, setHasPreAccess] = useState(false);
  const [examMode, setExamMode] = useState("AI");
  const [unlockStep, setUnlockStep] = useState("request");
  const [preToken, setPreToken] = useState("");
  const [formKey, setFormKey] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const discordLink = import.meta.env.VITE_DISCORD_LINK;
  const isProd = import.meta.env.PROD;

  const assets = {
    discord_icon: isProd
      ? "/api/assets?asset=discord_icon"
      : import.meta.env.VITE_CLOUDINARY_DISCORD_ICON,
  };

  const handleExamClick = (examSubject) => {
    if (examUnlocked) {
      onSelect && onSelect(examSubject, examMode);
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
      setError(t("form.errorAdminKeyNeeded"));
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
        setError(data?.error || t("form.errorInvalidAdminKey"));
        return;
      }
      localStorage.setItem("preToken", data.token);
      setPreToken(data.token);
      setHasPreAccess(true);
      setInfo(t("form.successAdminKeyVerified"));
      setFormKey("");
    } catch (err) {
      setError(t("form.errorTechnical"));
    }
  };

  const attemptUnlock = async (e) => {
    e.preventDefault();
    setError("");
    const key = secretInput.trim();
    if (!key) {
      setError(t("form.errorKeyRequired"));
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
        setError(t("form.errorInvalidKey"));
        return false;
      }
      localStorage.setItem("examToken", data.token);
      setExamUnlocked(true);
      setShowUnlock(false);
      setInfo(t("form.successExamUnlocked"));
      return true;
    } catch (err) {
      setError(t("form.errorTechnical"));
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

  useEffect(() => {
    try {
      const t = localStorage.getItem("preToken");
      if (!t) return;
      const parts = t.split(".");
      if (parts.length !== 3) return;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
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

  useEffect(() => {
    const checkAI = async () => {
      try {
        const res = await fetch("/.netlify/functions/LLM", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "test", model: "llama3.2:latest" }),
        });
        const data = await res.json();

        if (res.status === 503 || data.code === "OLLAMA_UNAVAILABLE") {
          setAiAvailable(false);
          setExamMode("standard");
        }
      } catch (error) {
        setAiAvailable(false);
        setExamMode("standard");
      }
    };

    checkAI();
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
      setError(t("form.errorAdminKeyRequired"));
      return;
    }
    const email = recipient.trim();
    if (!email) {
      setError(t("form.errorEmailRequired"));
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
      setInfo(t("form.successKeySent"));
      setUnlockStep("unlock");
      setRecipient("");
    } catch (err) {
      setError(`${t("form.errorRequestFailed")} ${err.message}`);
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
        setError(data?.error || t("form.errorNoLocalKey"));
        return;
      }
      setSecretInput(data.key);
      await verifyKeyAndUnlock(data.key);
    } catch (err) {
      setError(t("form.errorFetchLocalKey"));
    }
  }

  return (
    <div
      className="result"
      role="group"
      aria-labelledby="choose-subject-heading"
    >
      <h1 id="choose-subject-heading" className="quiz-title">
        {t("form.subjects")}
      </h1>
      <div className="subjects__helper-text">
        <p className="subjects__warning-text">
          <strong>{t("form.observeLabel")}</strong> {t("form.warningText")}
        </p>
      </div>
      <hr className="subject__divider" />
      <h2
        className="quiz-title"
        style={{ fontSize: "1.5rem", marginTop: "2rem" }}
      >
        {t("form.practice")}
      </h2>
      <div className="subjects">
        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("plu", "standard")}
          aria-label={t("form.ariaSelectPLU")}
        >
          <div className="subject__icon subject__icon--plu" aria-hidden>
            📦
          </div>
          <div className="subject__content">
            <div className="subject__title">{t("subjects.plu")}</div>
            <div className="subject__desc">{t("form.pluDesc")}</div>
          </div>
        </button>

        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("apt", "standard")}
          aria-label={t("form.ariaSelectAPT")}
        >
          <div className="subject__icon subject__icon--apt" aria-hidden>
            🧪
          </div>
          <div className="subject__content">
            <div className="subject__title">{t("subjects.apt")}</div>
            <div className="subject__desc">{t("form.aptDesc")}</div>
          </div>
        </button>
        <button
          type="button"
          className="subject"
          onClick={() => onSelect && onSelect("wai", "standard")}
          aria-label={t("form.ariaSelectWAI")}
        >
          <div className="subject__icon subject__icon--wai" aria-hidden>
            🌐
          </div>
          <div className="subject__content">
            <div className="subject__title">{t("subjects.wai")}</div>
            <div className="subject__desc">{t("form.waiDesc")}</div>
          </div>
        </button>
      </div>
      <hr className="subject__divider" />
      <h2
        className="quiz-title"
        style={{ fontSize: "1.5rem", marginTop: "2rem", marginBottom: "1rem" }}
      >
        {t("form.exams")}
      </h2>
      <div className="subjects__difficulty" style={{ marginBottom: "1rem" }}>
        <label htmlFor="exam-difficulty">{t("form.difficultyLabel")}</label>
        <select
          id="exam-difficulty"
          value={examMode}
          onChange={(e) => setExamMode(e.target.value)}
          disabled={!aiAvailable && examMode !== "standard"}
        >
          <option value="standard">{t("form.standard")}</option>
          <option value="AI" disabled={!aiAvailable}>
            {t("form.aiEvaluation")}
            {!aiAvailable ? t("form.aiUnavailableSuffix") : ""}
          </option>
        </select>
      </div>
      {examMode === "standard" && (
        <div
          className="subjects__helper-text"
          style={{
            marginBottom: "1rem",
            background: "#f0fdfa",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #0d9488",
          }}
        >
          <div className="subjects__helper-text">
            <p style={{ margin: 0, color: "#0d9488" }}>
              <strong>{t("form.standardExamTitle")}</strong>{" "}
              {t("form.standardExamInfo")}
            </p>
          </div>
        </div>
      )}
      {!aiAvailable && (
        <div
          className="subjects__helper-text"
          style={{
            marginBottom: "1rem",
            background: "#fff3cd",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #ffc107",
          }}
        >
          <p style={{ margin: 0, color: "#856404" }}>
            <strong>{t("form.aiUnavailableTitle")}</strong>{" "}
            {t("form.aiUnavailableText")}
          </p>
        </div>
      )}
      {examMode === "AI" && aiAvailable && (
        <div
          className="subjects__helper-text"
          style={{
            marginBottom: "1rem",
            background: "#f0fdfa",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #0d9488",
          }}
        >
          <p style={{ margin: 0, color: "#0d9488" }}>
            <strong>{t("form.aiModeTitle")}</strong> {t("form.aiModeText1")}{" "}
            <strong>{t("form.aiModeVG")}</strong>
            {t("form.aiModeText2")} <strong>{t("form.aiModeG")}</strong>{" "}
            {t("form.aiModeText3")}
          </p>
          <p className="subjects__warning-text">
            <strong>{t("form.observeLabel")}</strong> {t("form.aiWarning")}
          </p>
        </div>
      )}
      {examMode === "AI" && !examUnlocked && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <button
            type="button"
            className="ui-btn ui-btn--primary"
            style={{ padding: "12px 24px", fontSize: "1rem" }}
            onClick={() => setShowUnlock(true)}
          >
            {t("form.unlockButton")}
          </button>
        </div>
      )}

      <div className="subjects">
        <div
          className="subjects__gated-wrapper"
          aria-label={t("form.exams")}
          role="group"
        >
          <button
            type="button"
            className={`subject ${examUnlocked ? "subject--unlocked" : ""} ${examMode === "AI" && !examUnlocked ? "subject--disabled" : ""}`}
            onClick={() => examUnlocked && handleExamClick("plu-exam")}
            disabled={examMode === "AI" && !examUnlocked}
            aria-label={
              examUnlocked ? t("form.ariaOpenPLUExam") : t("form.ariaPLULocked")
            }
            style={
              examMode === "AI" && !examUnlocked
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            <div className="subject__icon subject__icon--plu" aria-hidden>
              📦
            </div>
            <div className="subject__content">
              <div className="subject__title">
                <strong>{t("form.examPrefix")}</strong>
                {t("subjects.plu")}
              </div>
              <div className="subject__desc">
                {t("form.pluDesc")}{" "}
                {examUnlocked ? t("form.unlocked") : t("form.locked")}
                {examMode === "AI" && examUnlocked && t("form.aiActivated")}
              </div>
            </div>
          </button>
          <button
            type="button"
            className={`subject ${examUnlocked ? "subject--unlocked" : ""} ${examMode === "AI" && !examUnlocked ? "subject--disabled" : ""}`}
            onClick={() => examUnlocked && handleExamClick("wai-exam")}
            disabled={examMode === "AI" && !examUnlocked}
            aria-label={
              examUnlocked ? t("form.ariaOpenWAIExam") : t("form.ariaWAILocked")
            }
            style={
              examMode === "AI" && !examUnlocked
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            <div className="subject__icon subject__icon--wai" aria-hidden>
              🌐
            </div>
            <div className="subject__content">
              <div className="subject__title">
                <strong>{t("form.examPrefix")}</strong>
                {t("subjects.wai")}
              </div>
              <div className="subject__desc">
                {t("form.waiDesc")}{" "}
                {examUnlocked ? t("form.unlocked") : t("form.locked")}
                {examMode === "AI" && examUnlocked && t("form.aiActivated")}
              </div>
            </div>
          </button>
          <button
            type="button"
            className={`subject ${examUnlocked ? "subject--unlocked" : ""} ${examMode === "AI" && !examUnlocked ? "subject--disabled" : ""}`}
            onClick={() => examUnlocked && handleExamClick("aefi-exam-one")}
            disabled={examMode === "AI" && !examUnlocked}
            aria-label={
              examUnlocked
                ? t("form.ariaOpenAEFIExam")
                : t("form.ariaAEFILocked")
            }
            style={
              examMode === "AI" && !examUnlocked
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            <div className="subject__icon subject__icon--aefi" aria-hidden>
              💼
            </div>
            <div className="subject__content">
              <div className="subject__title">
                <strong>{t("form.examPrefix")}</strong>
                {t("subjects.aefiOne")}
              </div>
              <div className="subject__desc">
                {t("form.aefiDescOne")}{" "}
                {examUnlocked ? t("form.unlocked") : t("form.locked")}
                {examMode === "AI" && examUnlocked && t("form.aiActivated")}
              </div>
            </div>
          </button>
          <button
            type="button"
            className={`subject ${examUnlocked ? "subject--unlocked" : ""} ${examMode === "AI" && !examUnlocked ? "subject--disabled" : ""}`}
            onClick={() => examUnlocked && handleExamClick("aefi-exam-two")}
            disabled={examMode === "AI" && !examUnlocked}
            aria-label={
              examUnlocked
                ? t("form.ariaOpenAEFIExam")
                : t("form.ariaAEFILocked")
            }
            style={
              examMode === "AI" && !examUnlocked
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            <div className="subject__icon subject__icon--aefi" aria-hidden>
              💼
            </div>
            <div className="subject__content">
              <div className="subject__title">
                <strong>{t("form.examPrefix")}</strong>
                {t("subjects.aefiTwo")}
              </div>
              <div className="subject__desc">
                {t("form.aefiDescTwo")}{" "}
                {examUnlocked ? t("form.unlocked") : t("form.locked")}
                {examMode === "AI" && examUnlocked && t("form.aiActivated")}
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
                aria-label={t("form.ariaUnlockDialog")}
              >
                {}
                <a
                  href={discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subjects__discord-link"
                  aria-label={t("form.ariaDiscordLink")}
                  title={t("form.titleDiscord")}
                >
                  <img
                    src={assets.discord_icon}
                    alt={t("form.titleDiscord")}
                    className="subjects__discord-icon-static"
                  />
                </a>
                {}
                {!hasPreAccess && !isLocal && (
                  <>
                    <h2
                      id="unlock-title"
                      className="subjects__unlock-title"
                      style={{ margin: 0, fontSize: "1rem" }}
                    >
                      {t("form.step1Title")}
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
                        placeholder={t("form.adminKeyPlaceholder")}
                        className="subjects__unlock-input"
                      />
                      <button
                        type="button"
                        className="ui-btn ui-btn--secondary"
                        onClick={verifyPreAccess}
                      >
                        {t("form.verifyButton")}
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
                      {t("form.step2Title")}
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
                        placeholder={t("form.emailPlaceholder")}
                        className="subjects__unlock-input"
                        autoComplete="email"
                      />
                      <button
                        type="button"
                        className="ui-btn ui-btn--secondary"
                        onClick={requestUnlock}
                      >
                        {t("form.sendKeyButton")}
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
                      {t("form.step3Title")}
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
                        placeholder={t("form.keyPlaceholder")}
                      />
                    </label>
                    <div className="subjects__unlock-actions">
                      <button type="submit" className="ui-btn ui-btn--primary">
                        {t("form.unlockButton2")}
                      </button>
                      {isLocal && (
                        <button
                          type="button"
                          className="ui-btn ui-btn--secondary"
                          onClick={fetchLocalKey}
                          title={t("form.titleOnlyLocal")}
                        >
                          {t("form.developerButton")}{" "}
                          <strong>{t("form.developerSuffix")}</strong>
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
                    {t("form.cancelButton")}
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
      </div>
    </div>
  );
}

export default Form;
