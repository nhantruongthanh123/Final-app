import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "#/routes/userRoute.js";
import photoRouter from "#/routes/photoRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PhotoBook API is running!" });
});

app.use("/api", userRouter);
app.use("/api", photoRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
