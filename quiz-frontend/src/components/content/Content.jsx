import { useTranslation } from "../../lib/i18n/useTranslation";
import Form from "./content-wrapper/Form";
import Subject from "./content-wrapper/Subject";
import "./Content.css";

function Content({
  subject,
  mode,
  onSelect,
  lastSummary,
  subjectMeta,
  subjectRef,
}) {
  const { t } = useTranslation();

  return (
    <section className="content" aria-label={t("aria.content") || "Content"}>
      {!subject ? (
        <>
          {lastSummary && (
            <div className="result" role="status" aria-live="polite">
              <h2 style={{ color: "red" }}>{t("result.completed")}</h2>
              <p>
                {t("result.yourScore")} {lastSummary.score} {t("result.score")}{" "}
                {t("result.outOf")} {lastSummary.attempted} (
                {t("result.attempted")} {lastSummary.total}{" "}
                {t("result.questions")}){" "}
                {subjectMeta[lastSummary.subject]?.label}.
              </p>
            </div>
          )}
          <Form onSelect={onSelect} />
        </>
      ) : (
        <Subject ref={subjectRef} subject={subject} mode={mode} />
      )}
    </section>
  );
}

export default Content;
