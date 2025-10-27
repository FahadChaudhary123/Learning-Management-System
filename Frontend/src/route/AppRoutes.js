import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute";

// Student pages
import StudentHome from "../pages/student/StudentHome";
import MyLearning from "../pages/student/MyLearning";
import CourseDetail from "../pages/student/CourseDetail";

// Instructor pages
import InstructorDashboard from "../pages/Instructor/InstructorDashboard";
import CreateCourse from "../pages/Instructor/CreateCourse";
import EditCourse from "../pages/Instructor/EditCourse";
import MyCourses from "../pages/Instructor/MyCourse";
import InstructorProfile from "../pages/Instructor/InstructorProfile";
import InstructorSettings from "../pages/Instructor/InstructorSettings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes - all managed by ProtectedRoute */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Routes>
              {/* Student routes */}
              <Route path="home" element={<StudentHome />} />
              <Route path="my-learning" element={<MyLearning />} />
              <Route path="courses/:courseId" element={<CourseDetail />} />

              {/* Instructor routes */}
              <Route
                path="instructor-home"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="instructor/create-course"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="instructor/edit-course/:courseId"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <EditCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="instructor/my-courses"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="instructor/profile"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <InstructorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="instructor/settings"
                element={
                  <ProtectedRoute requiredRole="Instructor">
                    <InstructorSettings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback for /dashboard */}
              <Route path="" element={<Navigate to="home" replace />} />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Root and unknown paths */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}