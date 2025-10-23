import Form from "./content-wrapper/form";
import Subject from "./content-wrapper/subject";
import "./content.css";

function Content({ subject, onSelect, lastSummary, subjectMeta, subjectRef }) {
  return (
    <section className="content" aria-label="Innehåll">
      {!subject ? (
        <>
          {lastSummary && (
            <div className="result" role="status" aria-live="polite">
              <h2 style={{ color: "red" }}>Quiz Avbrutet!</h2>
              <p>
                Du fick {lastSummary.score} poäng av {lastSummary.attempted}{" "}
                försök (totalt {lastSummary.total} frågor) i{" "}
                {subjectMeta[lastSummary.subject]?.label}.
              </p>
            </div>
          )}
          <Form onSelect={onSelect} />
        </>
      ) : (
        <Subject ref={subjectRef} subject={subject} />
      )}
    </section>
  );
}

export default Content;
