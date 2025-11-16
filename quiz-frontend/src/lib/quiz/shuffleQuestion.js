function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function shuffleQuestion(questions) {
  return shuffleArray(questions).map((q) => {
    if (!q.options || typeof q.correct !== "number") return q;
    const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
    const shuffled = shuffleArray(optionPairs);
    const newOptions = shuffled.map((p) => p.opt);
    const newCorrect = shuffled.findIndex((p) => p.idx === q.correct);
    return { ...q, options: newOptions, correct: newCorrect };
  });
}

export default shuffleQuestion;
