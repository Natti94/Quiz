import { useTranslation } from "../../../../lib/i18n/useTranslation";

const Leaderboard = () => {
  const { t } = useTranslation();

  const pointsData = [
    { rank: 1, name: "Alice Johnson", points: 2450, subject: "PLU" },
    { rank: 2, name: "Bob Smith", points: 2380, subject: "WAI" },
    { rank: 3, name: "Charlie Davis", points: 2150, subject: "APT" },
    { rank: 4, name: "Diana Lee", points: 1980, subject: "PLU" },
    { rank: 5, name: "Eve Martinez", points: 1850, subject: "WAI" },
  ];

  const speedData = [
    {
      rank: 1,
      name: "Bob Smith",
      avgTime: 45,
      subject: "WAI",
      completedCount: 124,
    },
    {
      rank: 2,
      name: "Charlie Davis",
      avgTime: 52,
      subject: "APT",
      completedCount: 98,
    },
    {
      rank: 3,
      name: "Alice Johnson",
      avgTime: 58,
      subject: "PLU",
      completedCount: 156,
    },
    {
      rank: 4,
      name: "Diana Lee",
      avgTime: 63,
      subject: "PLU",
      completedCount: 87,
    },
    {
      rank: 5,
      name: "Eve Martinez",
      avgTime: 67,
      subject: "WAI",
      completedCount: 72,
    },
  ];

  const excellenceData = [
    {
      rank: 1,
      name: "Diana Lee",
      aiScore: 98,
      subject: "PLU",
      excerpt:
        "Excellent explanation of produce codes with clear regional variations...",
    },
    {
      rank: 2,
      name: "Alice Johnson",
      aiScore: 96,
      subject: "PLU",
      excerpt:
        "Comprehensive understanding of inventory systems and seasonal impacts...",
    },
    {
      rank: 3,
      name: "Charlie Davis",
      aiScore: 94,
      subject: "APT",
      excerpt:
        "Outstanding analysis of aptitude patterns with practical examples...",
    },
    {
      rank: 4,
      name: "Eve Martinez",
      aiScore: 92,
      subject: "WAI",
      excerpt: "Thorough explanation of workplace safety protocols and best...",
    },
    {
      rank: 5,
      name: "Bob Smith",
      aiScore: 90,
      subject: "WAI",
      excerpt:
        "Clear reasoning about warehouse operations and efficiency metrics...",
    },
  ];

  const calculateOverallRanking = () => {
    const userScores = {};

    pointsData.forEach((entry) => {
      if (!userScores[entry.name]) {
        userScores[entry.name] = { name: entry.name, scores: [], total: 0 };
      }
      const pointsScore = (entry.points / 2500) * 100;
      userScores[entry.name].scores.push({
        category: "Points",
        value: Math.round(pointsScore),
      });
    });

    speedData.forEach((entry) => {
      if (!userScores[entry.name]) {
        userScores[entry.name] = { name: entry.name, scores: [], total: 0 };
      }
      const speedScore = Math.max(0, 100 - entry.avgTime);
      userScores[entry.name].scores.push({
        category: "Speed",
        value: Math.round(speedScore),
      });
    });

    excellenceData.forEach((entry) => {
      if (!userScores[entry.name]) {
        userScores[entry.name] = { name: entry.name, scores: [], total: 0 };
      }
      userScores[entry.name].scores.push({
        category: "Excellence",
        value: entry.aiScore,
      });
    });

    Object.values(userScores).forEach((user) => {
      user.total =
        user.scores.reduce((sum, score) => sum + score.value, 0) /
        user.scores.length;
    });

    return Object.values(userScores)
      .sort((a, b) => b.total - a.total)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        overallScore: Math.round(user.total),
        breakdown: user.scores,
      }));
  };

  const data = calculateOverallRanking();

  if (!data || data.length === 0) {
    return (
      <div className="statistics__category">
        <div className="statistics__category-header">
          <h3 className="statistics__category-title">
            {t("statistics.general.title")}
          </h3>
          <p className="statistics__category-description">
            {t("statistics.general.description")}
          </p>
        </div>
        <div className="statistics__empty">
          <p>{t("statistics.noData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics__category">
      <div className="statistics__category-header">
        <h3 className="statistics__category-title">
          {t("statistics.general.title")}
        </h3>
        <p className="statistics__category-description">
          {t("statistics.general.description")}
        </p>
      </div>

      <div className="statistics__table-wrapper">
        <table className="statistics__table">
          <thead className="statistics__thead">
            <tr className="statistics__row">
              <th className="statistics__th statistics__th--rank">
                {t("statistics.general.rank")}
              </th>
              <th className="statistics__th">{t("statistics.general.name")}</th>
              <th className="statistics__th statistics__th--score">
                {t("statistics.general.overallScore")}
              </th>
              <th className="statistics__th">
                {t("statistics.general.breakdown")}
              </th>
            </tr>
          </thead>
          <tbody className="statistics__tbody">
            {data.map((entry) => (
              <tr key={entry.rank} className="statistics__row">
                <td className="statistics__td statistics__td--rank">
                  {entry.rank === 1 && "🥇"}
                  {entry.rank === 2 && "🥈"}
                  {entry.rank === 3 && "🥉"}
                  {entry.rank > 3 && entry.rank}
                </td>
                <td className="statistics__td">{entry.name}</td>
                <td className="statistics__td statistics__td--score">
                  {entry.overallScore}/100
                </td>
                <td className="statistics__td statistics__td--breakdown">
                  <div className="statistics__breakdown">
                    {entry.breakdown.map((score, idx) => (
                      <span key={idx} className="statistics__breakdown-item">
                        {score.category}: {score.value}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
