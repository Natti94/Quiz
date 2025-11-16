import { useTranslation } from "../../../../../lib/i18n/useTranslation";

function Points({ data = [] }) {
  const { t } = useTranslation();

  return (
    <div className="statistics__category">
      <h3 className="statistics__category-title">
        📊 {t("statistics.points.title")}
      </h3>
      <p className="statistics__category-description">
        {t("statistics.points.description")}
      </p>

      <div className="statistics__table-wrapper">
        <table className="statistics__table">
          <thead className="statistics__thead">
            <tr className="statistics__row">
              <th className="statistics__th statistics__th--rank">
                {t("leaderboard.rank")}
              </th>
              <th className="statistics__th">{t("leaderboard.name")}</th>
              <th className="statistics__th statistics__th--score">
                {t("statistics.points.totalPoints")}
              </th>
              <th className="statistics__th">{t("leaderboard.subject")}</th>
            </tr>
          </thead>
          <tbody className="statistics__tbody">
            {data.length === 0 ? (
              <tr className="statistics__row">
                <td
                  colSpan="4"
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
                  <td className="statistics__td statistics__td--score">
                    {entry.points}
                  </td>
                  <td className="statistics__td">{entry.subject}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Points;
