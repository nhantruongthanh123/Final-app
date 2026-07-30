import { errorHandler } from "#middlewares/error.middleware.js";
import albumRouter from "#routes/album.route.js";
import authRouter from "#routes/auth.route.js";
import photoRouter from "#routes/photo.route.js";
import userRouter from "#routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PhotoBook API is running!" });
});

app.use("/api", userRouter);
app.use("/api", photoRouter);
app.use("/api", albumRouter);
app.use("/api", authRouter);

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
