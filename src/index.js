import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" }); // ensure it loads your .env

(async () => {
  try {
    await connectDB();
    // Start your server here if needed
  } catch (error) {
    console.error("ERROR:", error.message);
  }
})();
