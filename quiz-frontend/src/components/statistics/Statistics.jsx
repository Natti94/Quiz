import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import General from "./statistics-wrapper/General";
import Points from "./statistics-wrapper/statistics-categories-wrapper/Points";
import Speed from "./statistics-wrapper/statistics-categories-wrapper/Speed";
import Excellence from "./statistics-wrapper/statistics-categories-wrapper/Excellence";
import "./statistics.css";

const Statistics = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("general");

  // Mock data for points leaderboard
  const pointsData = [
    { rank: 1, name: "Alice Johnson", points: 2450, subject: "PLU" },
    { rank: 2, name: "Bob Smith", points: 2380, subject: "WAI" },
    { rank: 3, name: "Charlie Davis", points: 2150, subject: "APT" },
    { rank: 4, name: "Diana Lee", points: 1980, subject: "PLU" },
    { rank: 5, name: "Eve Martinez", points: 1850, subject: "WAI" },
  ];

  // Mock data for speed leaderboard
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

  // Mock data for excellence leaderboard
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

  const renderActiveCategory = () => {
    switch (activeCategory) {
      case "general":
        return (
          <General
            pointsData={pointsData}
            speedData={speedData}
            excellenceData={excellenceData}
          />
        );
      case "points":
        return <Points data={pointsData} />;
      case "speed":
        return <Speed data={speedData} />;
      case "excellence":
        return <Excellence data={excellenceData} />;
      default:
        return (
          <General
            pointsData={pointsData}
            speedData={speedData}
            excellenceData={excellenceData}
          />
        );
    }
  };

  return (
    <div className="statistics">
      <div className="statistics__header">
        <h2 className="statistics__title">{t("statistics.title")}</h2>
        <p className="statistics__subtitle">{t("statistics.subtitle")}</p>
      </div>

      <div className="statistics__tabs">
        <button
          className={`statistics__tab ${
            activeCategory === "general" ? "statistics__tab--active" : ""
          }`}
          onClick={() => setActiveCategory("general")}
        >
          {t("statistics.general.title")}
        </button>
        <button
          className={`statistics__tab ${
            activeCategory === "points" ? "statistics__tab--active" : ""
          }`}
          onClick={() => setActiveCategory("points")}
        >
          {t("statistics.points.title")}
        </button>
        <button
          className={`statistics__tab ${
            activeCategory === "speed" ? "statistics__tab--active" : ""
          }`}
          onClick={() => setActiveCategory("speed")}
        >
          {t("statistics.speed.title")}
        </button>
        <button
          className={`statistics__tab ${
            activeCategory === "excellence" ? "statistics__tab--active" : ""
          }`}
          onClick={() => setActiveCategory("excellence")}
        >
          {t("statistics.excellence.title")}
        </button>
      </div>

      <div className="statistics__content">{renderActiveCategory()}</div>
    </div>
  );
};

export default Statistics;
