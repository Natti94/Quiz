import { useTranslation } from "../../../../i18n/useTranslation";

const Leaderboard = ({ pointsData, speedData, excellenceData }) => {
  const { t } = useTranslation();

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

  const overallRankings = calculateOverallRanking();

  if (!overallRankings || overallRankings.length === 0) {
    return (
      <div className="statistics__empty">
        <p>{t("statistics.noData")}</p>
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
          <thead className="statistics__table-head">
            <tr>
              <th className="statistics__table-header">
                {t("statistics.general.rank")}
              </th>
              <th className="statistics__table-header">
                {t("statistics.general.name")}
              </th>
              <th className="statistics__table-header">
                {t("statistics.general.overallScore")}
              </th>
              <th className="statistics__table-header">
                {t("statistics.general.breakdown")}
              </th>
            </tr>
          </thead>
          <tbody className="statistics__table-body">
            {overallRankings.map((entry) => (
              <tr key={entry.rank} className="statistics__table-row">
                <td className="statistics__table-cell statistics__table-cell--rank">
                  {entry.rank === 1 && "🥇"}
                  {entry.rank === 2 && "🥈"}
                  {entry.rank === 3 && "🥉"}
                  {entry.rank > 3 && entry.rank}
                </td>
                <td className="statistics__table-cell statistics__table-cell--name">
                  {entry.name}
                </td>
                <td className="statistics__table-cell statistics__table-cell--score">
                  {entry.overallScore}/100
                </td>
                <td className="statistics__table-cell statistics__table-cell--breakdown">
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
