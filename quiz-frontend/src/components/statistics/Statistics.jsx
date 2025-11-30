import Leaderboard from "./statistics-wrapper/Leaderboard";
import "./Statistics.css";

const Statistics = ({ activeCategory }) => {
  switch (activeCategory) {
    case "Leaderboard":
    case "leaderboard":
      return <Leaderboard />;
    case "points":
      return <Points />;
    case "speed":
      return <Speed />;
    case "excellence":
      return <Excellence />;
    default:
      return <Leaderboard />;
  }
};

export default Statistics;
