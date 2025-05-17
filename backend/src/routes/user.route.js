import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers , getMyFriends, sendFriendRequest, acceptedFriendRequest, getFriendRequest , getOutGoingFriendReqs } from "../controllers/user.controller.js";



const router = express.Router();

//apply auth middleware to all routes
router.use(protectRoute)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friends-request/:id", sendFriendRequest)
router.put("/friends-request/:id/accept", acceptedFriendRequest)

router.get("/friends-requests", getFriendRequest)
router.get("/outgoing-friend-requests", getOutGoingFriendReqs)

export default router;