const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const videoRoutes = require("./routes/videoRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.REACT_FRONT,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✅ LMS Backend (Vercel version) is running successfully!",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
