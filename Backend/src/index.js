import dotenv from "dotenv";

// 🔥 FORCE LOAD ENV
dotenv.config();

console.log("🔑 KEY_ID:", process.env.RAZORPAY_KEY_ID);

import { app } from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.on("error", (error) => {
    console.log("ERROR:", error);
    throw error;
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});