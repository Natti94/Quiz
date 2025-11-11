import { useTranslation } from "../../i18n/useTranslation";
import Statistics from "../../components/statistics/Statistics";
import "../pages.css";

function StatisticsPage() {
  const { t } = useTranslation();
  return (
    <div className="statistics">
      <div className="statistics__header">
        <h1 className="statistics__title">{t("statistics.title")}</h1>
      </div>
      <Statistics activeCategory={"leaderboard"} />
    </div>
  );
}
export default StatisticsPage;
