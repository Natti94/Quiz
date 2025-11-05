import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { questionsPlu } from "../../../data/index";
import { questionsApt } from "../../../data/index";
import { questionsWai } from "../../../data/index";
import { questionsPluExam } from "../../../data/index";
import { questionsWaiExam } from "../../../data/index";
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleQuestion(questions) {
  return shuffleArray(questions).map((q) => {
    if (!q.options || typeof q.correct !== "number") return q;
    const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionPairs);
    const newOptions = shuffled.map((p) => p.opt);
    const newCorrect = shuffled.findIndex((p) => p.idx === q.correct);
    return { ...q, options: newOptions, correct: newCorrect };
  });
}

function Subject({ subject, mode: difficultyMode }, ref) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [mode] = useState(difficultyMode || "standard");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const question = shuffledQuestions[index];

  function filterQuestionsByMode(questions, selectedMode) {
    if (selectedMode === "AI") {
      return questions;
    }

    return questions;
  }

  useEffect(() => {
    let baseQuestions = [];

    if (subject === "plu") {
      baseQuestions = questionsPlu;
    } else if (subject === "plu-exam") {
      baseQuestions = questionsPluExam;
    } else if (subject === "apt") {
      baseQuestions = questionsApt;
    } else if (subject === "wai") {
      baseQuestions = questionsWai;
    } else if (subject === "wai-exam") {
      baseQuestions = questionsWaiExam;
    }

    const filtered = filterQuestionsByMode(baseQuestions, mode);
    setShuffledQuestions(shuffleQuestion(filtered));
    setIndex(0);
    setSelected(null);
    setScore(0);
  }, [subject, mode]);

  function nextQuestion() {
    setIndex((idx) => idx + 1);
    setSelected(null);
    setUserAnswer("");
    setAiEvaluation(null);
  }

  async function evaluateWithAI(userInput) {
    setIsEvaluating(true);
    try {
      const promptText = `Du är en lärare som bedömer studenters svar på VG-nivå (Väl Godkänt). Bedöm svaret baserat på djup förståelse, noggrannhet och om det visar VG-nivå kunskap.

Fråga: ${question.question}

Korrekt svar: ${question.explanation}

Studentens svar: ${userInput}

Bedöm om studentens svar visar VG-nivå förståelse. Svara med JSON i följande format: {"correct": true/false, "feedback": "din feedback här", "score": 0-100}`;

      const res = await fetch("/.netlify/functions/ollamaAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          model: "llama3.2:latest",
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const errorData = await res.json();
          throw new Error(
            `Rate limit exceeded. ${errorData.message || "Please wait before trying again."}`
          );
        }
        throw new Error("AI evaluation failed");
      }

      const data = await res.json();
      const content = data.response;

      let evaluation;
      try {
        evaluation = JSON.parse(content);
      } catch {
        evaluation = {
          correct:
            content.toLowerCase().includes("correct") ||
            content.toLowerCase().includes("vg"),
          feedback: content,
          score: 50,
        };
      }

      setAiEvaluation(evaluation);
      setSelected(evaluation.correct ? question.correct : -1);

      if (evaluation.correct) {
        setScore((s) => s + 1);
      }
    } catch (err) {
      setAiEvaluation({
        correct: false,
        feedback: err.message || "Kunde inte utvärdera svar. Försök igen.",
        score: 0,
      });
    } finally {
      setIsEvaluating(false);
    }
  }

  function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    if (question && i === question.correct) {
      setScore((s) => s + 1);
    }
  }

  async function handleHardModeSubmit(e) {
    e.preventDefault();
    if (!userAnswer.trim() || selected !== null) return;
    await evaluateWithAI(userAnswer.trim());
  }

  const optionClass = (i) => {
    const base = ["quiz__option"];
    if (selected === null) base.push("quiz__option--selectable");
    if (selected !== null && question) {
      if (i === question.correct) base.push("quiz__option--correct");
      if (i === selected && i !== question.correct)
        base.push("quiz__option--wrong-selected");
    }
    return base.join(" ");
  };

  function levelClass(q) {
    const lv = q?.level;
    if (!lv) return "N/A";
    if (typeof lv === "string") {
      const up = lv.toUpperCase();
      if (up === "G" || up === "VG") return up;
      return up;
    }
    if (Array.isArray(lv)) return lv.join(", ");
    if (typeof lv === "object" && lv.grade)
      return String(lv.grade).toUpperCase();
    return String(lv);
  }

  useImperativeHandle(
    ref,
    () => ({
      getStats: () => ({
        score,
        attempted: index + (selected !== null ? 1 : 0),
        total: shuffledQuestions.length,
        subject,
      }),
    }),
    [score, index, selected, shuffledQuestions.length, subject]
  );

  if (!subject) return null;

  const isQuizDone = index >= shuffledQuestions.length;

  return (
    <>
      {!isQuizDone && (
        <div className="quiz">
          <div className="quiz__left">
            <h2 className="quiz__title">
              Fråga: {index + 1} av {shuffledQuestions.length}
              <br />
              Nivå: {levelClass(question)}{" "}
              {mode === "AI" &&
                question?.level &&
                String(question.level).toUpperCase() === "VG" &&
                "(AI-bedömd)"}
            </h2>
            <p className="quiz__question">{question?.question}</p>

            {mode === "AI" ? (
              <>
                {question?.level &&
                String(question.level).toUpperCase() === "VG" ? (
                  <form onSubmit={handleHardModeSubmit}>
                    <textarea
                      className="quiz__text-answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Skriv ditt svar här... (VG-nivå förväntas)"
                      disabled={selected !== null}
                      rows={6}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        marginBottom: "12px",
                        resize: "vertical",
                      }}
                    />
                    {selected === null && (
                      <button
                        type="submit"
                        className="quiz__next-btn"
                        disabled={!userAnswer.trim() || isEvaluating}
                      >
                        {isEvaluating ? "AI bedömer..." : "Skicka svar"}
                      </button>
                    )}
                  </form>
                ) : (
                  <ul className="quiz__options">
                    {question?.options.map((opt, i) => (
                      <li
                        key={i}
                        className={optionClass(i)}
                        onClick={() => handleAnswer(i)}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <ul className="quiz__options">
                {question?.options.map((opt, i) => (
                  <li
                    key={i}
                    className={optionClass(i)}
                    onClick={() => handleAnswer(i)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            {selected !== null && (
              <>
                <button className="quiz__next-btn" onClick={nextQuestion}>
                  <strong>Nästa</strong>
                </button>
                {index + 1 === shuffledQuestions.length && (
                  <p className="quiz__next-hint">
                    Tryck nästa för att se ditt resultat!
                  </p>
                )}
              </>
            )}
          </div>
          {selected !== null && (
            <div className="quiz__explanation">
              <strong>
                {mode === "AI" &&
                question?.level &&
                String(question.level).toUpperCase() === "VG"
                  ? "AI-bedömning:"
                  : "Förklaring:"}
              </strong>
              {mode === "AI" &&
              aiEvaluation &&
              question?.level &&
              String(question.level).toUpperCase() === "VG" ? (
                <>
                  <p className="quiz__explanation-text">
                    <strong>Resultat:</strong>{" "}
                    {aiEvaluation.correct ? "Godkänt (VG)" : "Ej godkänt"}
                  </p>
                  <p className="quiz__explanation-text">
                    <strong>Feedback:</strong> {aiEvaluation.feedback}
                  </p>
                  <p className="quiz__explanation-text">
                    <strong>Korrekt svar:</strong> {question?.explanation}
                  </p>
                </>
              ) : (
                <p className="quiz__explanation-text">
                  {question?.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {isQuizDone && (
        <div className="result">
          <h2>Quiz klart!</h2>
          <p>
            Du fick {score} av {shuffledQuestions.length} rätt.
          </p>
        </div>
      )}
    </>
  );
}

export default forwardRef(Subject);
