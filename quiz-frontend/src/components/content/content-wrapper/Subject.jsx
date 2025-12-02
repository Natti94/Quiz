import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "../../../lib/i18n/useTranslation";
import { questionsPlu } from "../../../data/index";
import { questionsApt } from "../../../data/index";
import { questionsWai } from "../../../data/index";
import { questionsAefiOne } from "../../../data/index";
import { questionsAefiTwo } from "../../../data/index";
import { questionsNyckeltal } from "../../../data/index";
import { questionsProduktkalkylering } from "../../../data/index";
import { questionsAms } from "../../../data/index";
import { questionsAefiExamOne } from "../../../data/index";
import { questionsAefiExamTwo } from "../../../data/index";
import { questionsPluExam } from "../../../data/index";
import { questionsWaiExam } from "../../../data/index";
import { questionsNyckeltalExam } from "../../../data/index";
import { questionsProduktkalkyleringExam } from "../../../data/index";
import { questionsAmsExam } from "../../../data/index";
import shuffleQuestion from "../../../lib/quiz/shuffleQuestion.js";

function Subject({ subject, mode: difficultyMode }, ref) {
  const { t } = useTranslation();
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
    } else if (subject === "aefi-one") {
      baseQuestions = questionsAefiOne;
    } else if (subject === "aefi-two") {
      baseQuestions = questionsAefiTwo;
    } else if (subject === "nyckeltal") {
      baseQuestions = questionsNyckeltal;
    } else if (subject === "produktkalkylering") {
      baseQuestions = questionsProduktkalkylering;
    } else if (subject === "ams") {
      baseQuestions = questionsAms;
    } else if (subject === "aefi-exam-one") {
      baseQuestions = questionsAefiExamOne;
    } else if (subject === "aefi-exam-two") {
      baseQuestions = questionsAefiExamTwo;
    } else if (subject === "nyckeltal-exam") {
      baseQuestions = questionsNyckeltalExam;
    } else if (subject === "produktkalkylering-exam") {
      baseQuestions = questionsProduktkalkyleringExam;
    } else if (subject === "ams-exam") {
      baseQuestions = questionsAmsExam;
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
      const lang =
        t("lang.code") || (navigator.language?.startsWith("sv") ? "sv" : "en");
      let promptText;
      if (lang === "sv") {
        promptText = `Du är en lärare som bedömer studenters svar på VG-nivå (Väl Godkänt). Bedöm svaret baserat på djup förståelse, noggrannhet och om det visar VG-nivå kunskap. Om svaret inte når VG-nivå, bedöm som IG-nivå (icke godkänt).

Fråga: ${question.question}

Korrekt svar: ${question.explanation}

Studentens svar: ${userInput}

Returnera exakt detta JSON-format:
{"correct": "korrekt"/"IG", "feedback": "din feedback här", "poäng": 0-100}
Om svaret är fel, sätt "correct": "IG" och "poäng": 0.
Returnera endast JSON-objektet, utan extra text eller formatering.`;
      } else {
        promptText = `You are a teacher grading student answers at VG-level (pass with distinction). Grade based on deep understanding, accuracy, and if it shows VG-level knowledge. Otherwise, grade as IG (fail).

Question: ${question.question}

Correct answer: ${question.explanation}

Student answer: ${userInput}

Return exactly this JSON format:
{"correct": true/false, "feedback": "your feedback here", "score": 0-100}
If the answer is wrong, set "correct": false and "score": 0.
Return only the JSON object, no extra text or formatting.`;
      }

      const res = await fetch("/.netlify/functions/LLM", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          model: "natnaelberhanesv/quiz-qwen",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        if (res.status === 429) {
          throw new Error(
            `Rate limit exceeded. ${errorData.message || "Please wait before trying again."}`,
          );
        }

        if (res.status === 503 || errorData.code === "OLLAMA_UNAVAILABLE") {
          throw new Error(
            "AI evaluation service is not available. Please use Standard mode instead.",
          );
        }

        throw new Error(errorData.message || "AI evaluation failed");
      }

      const data = await res.json();
      let content = data.response;

      content = content.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      content = content.replace(/^json\s*/i, "");
      content = content.trim();

      let evaluation;
      try {
        evaluation = JSON.parse(content);
      } catch {
        if (lang === "sv") {
          evaluation = {
            correct: "IG",
            feedback: content,
            poäng: 0,
          };
        } else {
          evaluation = {
            correct: false,
            feedback: content,
            score: 0,
          };
        }
      }

      setAiEvaluation(evaluation);

      const isCorrect =
        lang === "sv" ? evaluation.correct === "korrekt" : !!evaluation.correct;
      setSelected(isCorrect ? question.correct : -1);
      if (isCorrect) {
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
    [score, index, selected, shuffledQuestions.length, subject],
  );

  if (!subject) return null;

  const isQuizDone = index >= shuffledQuestions.length;
  const lang =
    t("lang.code") ||
    (typeof navigator !== "undefined" && navigator.language?.startsWith("sv")
      ? "sv"
      : "en");

  return (
    <>
      {!isQuizDone && (
        <div className="quiz">
          <div className="quiz__left">
            <h2 className="quiz__title">
              {t("quiz.question")}: {index + 1} {t("quiz.of")}{" "}
              {shuffledQuestions.length}
              <br />
              {t("quiz.level")}: {levelClass(question)}{" "}
              {mode === "AI" &&
                question?.level &&
                String(question.level).toUpperCase() === "VG" &&
                t("quiz.aiEvaluated")}
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
                      placeholder={t("quiz.typeAnswer")}
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
                        {isEvaluating ? t("quiz.submitting") : t("quiz.submit")}
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
                  <strong>{t("quiz.next")}</strong>
                </button>
                {index + 1 === shuffledQuestions.length && (
                  <p className="quiz__next-hint">{t("quiz.nextHint")}</p>
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
                  ? t("quiz.aiEvaluation") + ":"
                  : t("quiz.explanation") + ":"}
              </strong>
              {mode === "AI" &&
              aiEvaluation &&
              question?.level &&
              String(question.level).toUpperCase() === "VG" ? (
                <>
                  <p className="quiz__explanation-text">
                    <strong>{t("quiz.result")}:</strong>{" "}
                    {lang === "sv"
                      ? aiEvaluation.correct === "korrekt"
                        ? t("quiz.approved")
                        : t("quiz.notApproved")
                      : aiEvaluation.correct
                        ? t("quiz.approved")
                        : t("quiz.notApproved")}
                  </p>
                  <p className="quiz__explanation-text">
                    <strong>{t("quiz.feedback")}:</strong>{" "}
                    {aiEvaluation.feedback}
                  </p>
                  <p className="quiz__explanation-text">
                    <strong>{t("quiz.scoreLabel")}:</strong>{" "}
                    {lang === "sv" ? aiEvaluation.poäng : aiEvaluation.score}
                  </p>
                  <p className="quiz__explanation-text">
                    <strong>{t("quiz.correctAnswer")}:</strong>{" "}
                    {question?.explanation}
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
          <h2>{t("result.completed")}</h2>
          <p>
            {t("result.yourScore")} {score} {t("result.outOf")}{" "}
            {shuffledQuestions.length} {t("result.correct")}.
          </p>
        </div>
      )}
    </>
  );
}

export default forwardRef(Subject);
