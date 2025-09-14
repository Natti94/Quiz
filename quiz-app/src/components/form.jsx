function Form({ onSelect }) {
  return (
    <div
      className="result"
      role="group"
      aria-labelledby="choose-subject-heading"
    >
      <h1 id="choose-subject-heading" className="quiz-title">
        Välj ämne
      </h1>
      <div className="helper-text">
        <p>Välj ett område att öva på. </p>
        <p className="warning-text">
          OBS! Avbryter du quizet innan det är klart visas ändå ditt aktuella resultat.
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
