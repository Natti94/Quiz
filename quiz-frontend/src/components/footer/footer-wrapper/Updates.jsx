import { useEffect, useState } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import { formatRelativeTime } from "../../../lib/updates/relativeTime";

export default function Updates() {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME,
      per_page: "5",
      page: "1",
      all_repos: "false",
    });
    setLoading(true);
    setError("");
    const funcBase =
      import.meta.env.VITE_FUNCTIONS_BASE || "/.netlify/functions";
    const apiUrl = `/api/commits?${params.toString()}`;
    const functionUrl = `${funcBase}/getCommits?${params.toString()}`;

    const fetchFromApi = () =>
      fetch(apiUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });

    const fetchFromFunction = () =>
      fetch(functionUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });

    const fetchFromGithub = () => {
      const perPage = 5;
      const page = 1;
      const updatesUrl = import.meta.env.VITE_GITHUB_QUIZ_UPDATES_URL;
      if (updatesUrl) {
        const ghUrl = `${updatesUrl}?per_page=${perPage}&page=${page}`;
        return fetch(ghUrl).then((res) => {
          if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
          return res.json();
        });
      }
    };

    fetchFromApi()
      .catch(() => fetchFromFunction())
      .catch(() => fetchFromGithub())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((c) => ({
              hash: c.sha?.substring(0, 7) || c.hash,
              author:
                c.commit?.author?.name ||
                c.author?.login ||
                c.author ||
                "Unknown",
              date: c.commit?.author?.date || c.date,
              message: c.commit?.message || c.message,
              url: c.html_url || c.url,
              repository: c.repository || "Natti94/Quiz",
            }))
          : [];
        const sorted = normalized
          .filter((c) => c && c.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const sliced = sorted.slice(0, 5);
        setUpdates(sliced);
        setCurrent(0);
      })
      .catch((e) => setError(e.message || "Failed to load commits"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="updates__container">
      <button
        type="button"
        className="updates__btn updates__trigger app-footer__cookie-btn app-footer__updates-trigger"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="updates-dialog"
      >
        <span className="app-footer__updates-icon" aria-hidden>
          🔄
        </span>
        {t("updates.trigger")}
      </button>
      {isOpen && (
        <div
          id="updates-dialog"
          className="updates__overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("updates.ariaLabel")}
          onClick={(e) => {
            if (e.target.classList.contains("updates__overlay"))
              setIsOpen(false);
          }}
        >
          <section
            className="updates__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="updates__modal-header">
              <div className="updates__title">{t("updates.titleFull")}</div>
              <button
                type="button"
                className="updates__btn updates__close"
                aria-label={t("updates.ariaClose")}
                onClick={() => setIsOpen(false)}
              >
                {t("updates.close")}
              </button>
            </div>
            {loading && (
              <div className="updates__empty">{t("updates.loading")}</div>
            )}
            {!loading && error && (
              <div className="updates__error" role="status">
                {error}
              </div>
            )}
            {!loading && !error && updates.length === 0 && (
              <div className="updates__empty">{t("updates.noUpdates")}</div>
            )}
            {!loading && !error && updates.length > 0 && (
              <div className="updates__viewer">
                <div className="updates__row">
                  {updates[current]?.url ? (
                    <a
                      href={updates[current].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="updates__message"
                      aria-label={`${t("updates.ariaOpenCommit")}: ${updates[current].message}`}
                    >
                      {updates[current].message}
                    </a>
                  ) : (
                    <span className="updates__message">
                      {updates[current].message}
                    </span>
                  )}
                  <time
                    className="updates__date"
                    dateTime={updates[current].date}
                  >
                    {formatRelativeTime(updates[current].date)}
                  </time>
                </div>
                <div className="updates__controls">
                  <button
                    type="button"
                    className="updates__btn updates__btn--prev"
                    onClick={() =>
                      setCurrent(
                        (i) => (i - 1 + updates.length) % updates.length
                      )
                    }
                    aria-label={t("updates.ariaPrevious")}
                  >
                    {t("updates.previous")}
                  </button>
                  <div className="updates__counter">
                    {current + 1} / {updates.length}
                  </div>
                  <button
                    type="button"
                    className="updates__btn updates__btn--next"
                    onClick={() => setCurrent((i) => (i + 1) % updates.length)}
                    aria-label={t("updates.ariaNext")}
                  >
                    {t("updates.next")}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
