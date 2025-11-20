import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userActivity } from "../../../../lib/analytics/userActivity";
import { getCurrentUser } from "../../../../services/auth/getCurrentUser";

function Activity() {
  const { t } = useTranslation();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
  const token = sessionStorage.getItem("jwtToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch("/api/user/activity", { headers });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setActivity(data);
        setSuccess(true);
  const current = getCurrentUser();
  userActivity(current?.id || current?.sub || null, "fetched_activity");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activity.length]);

  return (
    <div className="activity-page">
      <h2 className="activity-page__title">
        {t("statistics.analytics.activity.title")}
      </h2>
      <div class Name="activity-page__content">
        {success && activity.length === 0 && (
          <p>{t("statistics.analytics.activity.noActivity")}</p>
        )}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>
    </div>
  );
}

export default Activity;
