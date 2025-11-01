import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { questionsPlu } from "../../../data/index";
import { questionsApt } from "../../../data/index";
import { questionsWai } from "../../../data/index";
import { questionsPluExam } from "../../../data/index";

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleQuestions(questions) {
  return shuffleArray(questions).map((q) => {
    if (!q.options || typeof q.correct !== "number") return q;
    const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionPairs);
    const newOptions = shuffled.map((p) => p.opt);
    const newCorrect = shuffled.findIndex((p) => p.idx === q.correct);
    return { ...q, options: newOptions, correct: newCorrect };
  });
}

function Subject({ subject }, ref) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const question = shuffledQuestions[index];

  useEffect(() => {
    if (subject === "plu") {
      setShuffledQuestions(shuffleQuestions(questionsPlu));
      setIndex(0);
      setSelected(null);
      setScore(0);
    } else if (subject === "plu-exam") {
      setShuffledQuestions(shuffleQuestions(questionsPluExam));
      setIndex(0);
      setSelected(null);
      setScore(0);
    } else if (subject === "apt") {
      setShuffledQuestions(shuffleQuestions(questionsApt));
      setIndex(0);
      setSelected(null);
      setScore(0);
    } else if (subject === "wai") {
      setShuffledQuestions(shuffleQuestions(questionsWai));
      setIndex(0);
      setSelected(null);
      setScore(0);
    } else {
      setShuffledQuestions([]);
      setIndex(0);
      setSelected(null);
      setScore(0);
    }
  }, [subject]);

  function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    if (question && i === question.correct) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    setIndex((idx) => idx + 1);
    setSelected(null);
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
              Nivå: {levelClass(question)}
            </h2>
            <p className="quiz__question">{question?.question}</p>
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
              <strong>Förklaring:</strong>
              <p className="quiz__explanation-text">{question?.explanation}</p>
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
