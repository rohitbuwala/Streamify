import express from "express";
import cookieparser from "cookie-parser"
import "dotenv/config";
import autoRoutes from "./routes/auto.route.js";
import userRoutes from "./routes/user.route.js";    
import chatRoutes from "./routes/chat.route.js";    
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ JSON parser
app.use(express.json());
app.use(cookieparser());

// ✅ Routes
app.use("/api/auth", autoRoutes); 
app.use("/api/users", userRoutes)    
app.use("/api/chat", chatRoutes)

// ✅ Server start & DB connect
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Call the function
});
