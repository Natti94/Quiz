import { useTranslation } from "../../../../i18n/useTranslation";

function Speed({ data = [] }) {
  const { t } = useTranslation();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="statistics__category">
      <h3 className="statistics__category-title">
        ⚡ {t("statistics.speed.title")}
      </h3>
      <p className="statistics__category-description">
        {t("statistics.speed.description")}
      </p>

      <div className="statistics__table-wrapper">
        <table className="statistics__table">
          <thead className="statistics__thead">
            <tr className="statistics__row">
              <th className="statistics__th statistics__th--rank">
                {t("leaderboard.rank")}
              </th>
              <th className="statistics__th">{t("leaderboard.name")}</th>
              <th className="statistics__th statistics__th--time">
                {t("statistics.speed.avgTime")}
              </th>
              <th className="statistics__th">{t("leaderboard.subject")}</th>
              <th className="statistics__th">
                {t("statistics.speed.quizzesCompleted")}
              </th>
            </tr>
          </thead>
          <tbody className="statistics__tbody">
            {data.length === 0 ? (
              <tr className="statistics__row">
                <td
                  colSpan="5"
                  className="statistics__td statistics__td--empty"
                >
                  {t("statistics.noData")}
                </td>
              </tr>
            ) : (
              data.map((entry, index) => (
                <tr key={index} className="statistics__row">
                  <td className="statistics__td statistics__td--rank">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && index + 1}
                  </td>
                  <td className="statistics__td">{entry.name}</td>
                  <td className="statistics__td statistics__td--time">
                    {formatTime(entry.avgTime)}
                  </td>
                  <td className="statistics__td">{entry.subject}</td>
                  <td className="statistics__td">{entry.completedCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Speed;
