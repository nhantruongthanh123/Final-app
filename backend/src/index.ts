import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "#/routes/userRoute.js";
import photoRouter from "#/routes/photoRoute.js";
import albumRouter from "#/routes/albumRoute.js";
import authRouter from "#/routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PhotoBook API is running!" });
});

app.use("/api", userRouter);
app.use("/api", photoRouter);
app.use("/api", albumRouter);
app.use("/api", authRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
