import express from "express"
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/token", protectRoute,  getStreamToken )


export default router
