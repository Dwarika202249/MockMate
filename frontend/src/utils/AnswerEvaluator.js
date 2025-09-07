const AnswerEvaluator = {
  evaluate: (transcript = "", keywords = []) => {
    const text = (transcript || "").toLowerCase();
    const words = text.split(/\W+/).filter(Boolean);
    const unique = new Set(words);
    const totalKeywords = keywords.length || 0;
    let matches = 0;

    for (const k of keywords) {
      if (!k) continue;
      const kk = k.toLowerCase();
      if (text.includes(kk) || unique.has(kk)) matches++;
    }

    // length factor (short answer penalty)
    const lengthScore = Math.min(1, words.length / 20); // upto 20 words full score
    const keywordScore = totalKeywords ? matches / totalKeywords : 0;

    const score = Math.round(((keywordScore * 0.7) + (lengthScore * 0.3)) * 100); // 0-100

    let label = "Needs improvement";
    if (score > 75) label = "Good";
    else if (score > 45) label = "Okay";

    const summary = `Score: ${score}. Keywords matched: ${matches}/${totalKeywords}.`;

    return { score, label, summary };
  }
};

export default AnswerEvaluator;
