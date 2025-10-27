import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InstructorHeader from "../../components/InstructorHeader";
import "../../styles/InstructorDashboard.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorCoursesThunk } from "../../redux/thunks/instructorThunks";
import {
  selectInstructorCourses,
  selectInstructorStats,
  selectInstructorLoading,
  selectInstructorError,
} from "../../redux/slices/instructorSlice";
import { selectUser } from "../../redux/slices/authSlice";
import InstructorFooter from "../../components/InstructorFooter";

function InstructorDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const courses = useSelector(selectInstructorCourses);
  const stats = useSelector(selectInstructorStats);
  const loading = useSelector(selectInstructorLoading);
  const error = useSelector(selectInstructorError);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    dispatch(fetchInstructorCoursesThunk());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getThumb = (c) =>
    typeof c.thumbnail === "string" ? c.thumbnail : c.thumbnail?.url || "";

  if (loading) {
    return (
      <div>
     
          <div class="dashboard-loading">
  
  <div class="loading-spinner"></div>
</div>
</div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <InstructorHeader isScrolled={isScrolled} />

      <div className="dashboard-container">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        <section className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Manage your courses and track your impact on students</p>
        </section>

        <section className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalCourses || 0}</span>
                <span className="stat-label">Total Courses</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-number">{stats.totalStudents || 0}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <span className="stat-number">${stats.totalRevenue || 0}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-number">
                  {stats.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link
              to="/dashboard/instructor/create-course"
              className="action-card primary"
            >
              <span className="action-icon">➕</span>
              <span className="action-text">Create New Course</span>
            </Link>

            <Link to="/dashboard/instructor/my-courses" className="action-card">
              <span className="action-icon">📚</span>
              <span className="action-text">Manage Courses</span>
            </Link>

            <Link to="/dashboard/instructor/analytics" className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-text">View Analytics</span>
            </Link>
          </div>
        </section>

        <section className="recent-courses">
          <div className="section-header">
            <h2>Your courses</h2>
            <Link
              to="/dashboard/instructor/my-courses"
              className="see-all-link"
            >
              See all
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="courses-grid">
              {courses.slice(0, 4).map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-image">
                    <img src={getThumb(course)} alt={course.title} />
                    <div className="course-status">
                      <span className={`status-badge ${course.status}`}>
                        {course.status}
                      </span>
                    </div>
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-meta">
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{course.studentsCount || 0} students</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⭐</span>
                        <span>{course.averageRating || "No ratings yet"}</span>
                      </div>
                    </div>
                    <div className="course-actions">
                      <Link
                        to={`/dashboard/instructor/edit-course/${course._id}`}
                        className="udemy-btn udemy-btn-ghost"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/dashboard/instructor/courses/${course._id}/analytics`}
                        className="udemy-btn udemy-btn-secondary"
                      >
                        Analytics
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 className="empty-title">No courses yet</h3>
              <p className="empty-description">
                Start creating your first course and share your knowledge with
                students worldwide
              </p>
              <Link
                to="/dashboard/instructor/create-course"
                className="udemy-btn udemy-btn-primary"
              >
                Create Your First Course
              </Link>
            </div>
          )}
        </section>
      </div>
        
         <InstructorFooter />
      </div>
    
  );
}

export default InstructorDashboard;
