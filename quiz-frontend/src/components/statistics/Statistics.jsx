import Leaderboard from "./statistics-wrapper/Leaderboard";
import Points from "./statistics-wrapper/leaderboard-sections/Points";
import Speed from "./statistics-wrapper/leaderboard-sections/Speed";
import Excellence from "./statistics-wrapper/leaderboard-sections/Excellence";
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
