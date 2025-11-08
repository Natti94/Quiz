import express from "express";
import {
  saveScore,
  getLeaderboard,
  getTopScoresBySubject,
  getUserScores,
  getUserStats,
} from "../controllers/leaderboardController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, saveScore);
router.get("/", getLeaderboard);
router.get("/top/:subject", getTopScoresBySubject);
router.get("/user/:userId", getUserScores);
router.get("/stats/:userId", getUserStats);

export default router;
