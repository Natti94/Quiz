import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

export async function saveScore(req, res) {
  try {
    const { subject, mode, score, totalQuestions, attempted, timeTaken } =
      req.body;

    if (!subject || !mode || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "Subject, mode, score, and totalQuestions are required",
      });
    }

    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const leaderboardEntry = await Leaderboard.create({
      user: user._id,
      username: user.username,
      subject,
      mode,
      score,
      totalQuestions,
      attempted: attempted || totalQuestions,
      percentage: parseFloat(percentage),
      timeTaken,
    });

    user.totalQuizzes += 1;
    user.totalScore += score;
    user.lastActive = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
      data: leaderboardEntry,
    });
  } catch (error) {
    console.error("Save score error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save score",
      error: error.message,
    });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const { subject, mode, limit = 10, skip = 0 } = req.query;

    const query = {};
    if (subject) query.subject = subject;
    if (mode) query.mode = mode;

    const entries = await Leaderboard.find(query)
      .sort({ percentage: -1, score: -1, completedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("user", "username avatar");

    const total = await Leaderboard.countDocuments(query);

    res.status(200).json({
      success: true,
      data: entries,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
}

export async function getTopScoresBySubject(req, res) {
  try {
    const { subject } = req.params;
    const { limit = 10, mode } = req.query;

    const query = { subject };
    if (mode) query.mode = mode;

    const topScores = await Leaderboard.find(query)
      .sort({ score: -1, percentage: -1, completedAt: -1 })
      .limit(parseInt(limit))
      .populate("user", "username avatar");

    res.status(200).json({
      success: true,
      subject,
      data: topScores,
    });
  } catch (error) {
    console.error("Get top scores error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top scores",
      error: error.message,
    });
  }
}

export async function getUserScores(req, res) {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const scores = await Leaderboard.find({ user: userId })
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Leaderboard.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: scores,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get user scores error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user scores",
      error: error.message,
    });
  }
}

export async function getUserStats(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "username totalQuizzes totalScore",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subjectStats = await Leaderboard.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$subject",
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgPercentage: { $avg: "$percentage" },
          bestScore: { $max: "$score" },
          bestPercentage: { $max: "$percentage" },
        },
      },
    ]);

    const modeStats = await Leaderboard.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$mode",
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgPercentage: { $avg: "$percentage" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: {
          username: user.username,
          totalQuizzes: user.totalQuizzes,
          totalScore: user.totalScore,
          avgScorePerQuiz:
            user.totalQuizzes > 0
              ? (user.totalScore / user.totalQuizzes).toFixed(2)
              : 0,
        },
        bySubject: subjectStats,
        byMode: modeStats,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
}
