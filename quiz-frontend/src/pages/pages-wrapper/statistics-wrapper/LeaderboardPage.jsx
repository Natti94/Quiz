import Leaderboard from "../../../components/statistics/statistics-wrapper/leaderboard/Leaderboard";
import "./Pages.css";

function LeaderboardPage() {
  const pointsData = [
    { rank: 1, name: "Alice Johnson", points: 2450, subject: "PLU" },
    { rank: 2, name: "Bob Smith", points: 2380, subject: "WAI" },
    { rank: 3, name: "Charlie Davis", points: 2150, subject: "APT" },
    { rank: 4, name: "Diana Lee", points: 1980, subject: "PLU" },
    { rank: 5, name: "Eve Martinez", points: 1850, subject: "WAI" },
  ];

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
      avgTime: 62,
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

  const excellenceData = [
    {
      rank: 1,
      name: "Alice Johnson",
      aiScore: 95,
      subject: "PLU",
      bestAnswer: "Excellent explanation of packaging principles...",
    },
    {
      rank: 2,
      name: "Charlie Davis",
      aiScore: 92,
      subject: "APT",
      bestAnswer: "Outstanding analysis of Agile methodologies...",
    },
    {
      rank: 3,
      name: "Bob Smith",
      aiScore: 88,
      subject: "WAI",
      bestAnswer: "Comprehensive security analysis with clear examples...",
    },
    {
      rank: 4,
      name: "Diana Lee",
      aiScore: 85,
      subject: "PLU",
      bestAnswer: "Well-structured response on quality assurance...",
    },
    {
      rank: 5,
      name: "Eve Martinez",
      aiScore: 82,
      subject: "WAI",
      bestAnswer: "Good understanding of web security principles...",
    },
  ];

  return (
    <div className="leaderboard">
      <div className="leaderboard__container">
        <Leaderboard
          pointsData={pointsData}
          speedData={speedData}
          excellenceData={excellenceData}
        />
      </div>
    </div>
  );
}

export default LeaderboardPage;
