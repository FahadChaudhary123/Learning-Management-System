// backend/config/socket.js
const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.REACT_FRONT,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    //  Course creation notifications
    socket.on("courseCreated", (data) => {
      console.log("🎓 New course created:", data.courseTitle);
      io.emit("newCourseNotification", {
        type: "course_created",
        message: `New course: ${data.courseTitle}`,
        courseId: data.courseId,
        instructor: data.instructorName,
        timestamp: new Date(),
      });
    });

    // ✅ Video upload progress
    socket.on("videoUploadProgress", (data) => {
      console.log(" Video upload progress:", data);
      socket.emit("uploadProgress", data);
    });

    // ✅ General notifications
    socket.on("sendNotification", (data) => {
      console.log(" Notification received:", data);
      io.emit("receiveNotification", data);
    });

    // ✅ Course room join/leave
    socket.on("joinCourseRoom", (courseId) => {
      socket.join(`course_${courseId}`);
      console.log(`User ${socket.id} joined course room: ${courseId}`);
    });

    socket.on("leaveCourseRoom", (courseId) => {
      socket.leave(`course_${courseId}`);
      console.log(`User ${socket.id} left course room: ${courseId}`);
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initSocket;
