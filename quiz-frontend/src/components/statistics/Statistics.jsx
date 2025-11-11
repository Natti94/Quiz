import Leaderboard from "./statistics-wrapper/leaderboard/Leaderboard";
import Points from "./statistics-wrapper/leaderboard/leaderboard-wrapper/Points";
import Speed from "./statistics-wrapper/leaderboard/leaderboard-wrapper/Speed";
import Excellence from "./statistics-wrapper/leaderboard/leaderboard-wrapper/Excellence";
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
