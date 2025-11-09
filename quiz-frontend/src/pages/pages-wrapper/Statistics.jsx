import Leaderboard from "./statistics-wrapper/LeaderboardPage";
import "./Pages.css";

function Statistics() {
  return (
    <div className="leaderboard">
      <div className="leaderboard__container">
        <Leaderboard />
      </div>
    </div>
  );
}

export default Statistics;
