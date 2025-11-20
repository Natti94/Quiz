import { useTranslation } from "../lib/i18n/useTranslation";
import Analytics from "../components/statistics/statistics-wrapper/Analytics";

function AnalyticsPage() {
  const { t } = useTranslation();
  return (
    <div className="analytics">
      <div className="analytics_header">
        <h1>{t("analytics.title")}</h1>
        <p>{t("analytics.description")}</p>
        <Analytics />
      </div>
    </div>
  );
}

export default AnalyticsPage;
