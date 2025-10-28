const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require("path");
const connectDB = require("./config/db");
const initSocket = require("./config/socket"); 
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
//const instructorRoutes = require("./routes/instructorRoutes");
const videoRoutes = require("./routes/videoRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.REACT_FRONT,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
//app.use("/api/instructor", instructorRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running with video upload support",
    timestamp: new Date().toISOString(),
  });
});

// Connect DB
connectDB();


// const server = http.createServer(app);
// const io = initSocket(server);
// app.set("io", io);

// Start server
// const PORT = process.env.PORT;
// server.listen(PORT, () => {
//   console.log(` Server running on port ${PORT}`);
//   console.log(` Video upload + Socket.IO support enabled`);
// });
// Initialize socket only when running locally
if (require.main === module) {
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set("io", io);

  // ✅ Root route (GET)
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "LMS Backend is running successfully 🚀",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
} else {
  // Export app for Vercel serverless function
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "LMS Backend (Serverless) is running successfully on Vercel 🚀",
      environment: process.env.NODE_ENV || "production",
      timestamp: new Date().toISOString(),
    });
  });

  module.exports = app;
}

