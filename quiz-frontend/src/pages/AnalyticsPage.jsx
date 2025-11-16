import { useTranslation } from "../lib/i18n/useTranslation";

function AnalyticsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("analytics.title")}</h1>
      <p>{t("analytics.description")}</p>
    </div>
  );
}

export default AnalyticsPage;
