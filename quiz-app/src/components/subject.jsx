import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { questionsPlu } from "../data/plu";
import { questionsApt } from "../data/apt";

function Subject({ subject }, ref) {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const question = shuffledQuestions[index];

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  useEffect(() => {
    if (subject === "plu") {
      setShuffledQuestions(shuffleArray(questionsPlu));
      setIndex(0);
      setSelected(null);
      setScore(0);
    } else if (subject === "apt") {
      setShuffledQuestions(shuffleArray(questionsApt));
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
    if (index + 1 < shuffledQuestions.length) {
      setIndex((idx) => idx + 1);
      setSelected(null);
    } else {
      // END
    }
  }

  const optionClass = (i) => {
    const base = ["option"];
    if (selected === null) base.push("selectable");
    if (selected !== null && question) {
      if (i === question.correct) base.push("correct");
      if (i === selected && i !== question.correct) base.push("wrong-selected");
    }
    return base.join(" ");
  };

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

  return (
    <>
      {subject && index < shuffledQuestions.length && (
        <div className="quiz-card">
          <div className="quiz-left">
            <h2 className="quiz-title">
              Fråga {index + 1} av {shuffledQuestions.length}
            </h2>
            <p className="quiz-question">{question?.question}</p>

            <ul className="options">
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
              <button className="next-btn" onClick={nextQuestion}>
                Nästa fråga
              </button>
            )}
          </div>

          {selected !== null && (
            <div className="explanation">
              <strong>Förklaring:</strong>
              <p className="explanation-text">{question?.explanation}</p>
            </div>
          )}
        </div>
      )}

      {subject && index >= shuffledQuestions.length && (
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
