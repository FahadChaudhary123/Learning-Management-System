import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesThunk, fetchMyCoursesThunk } from '../../redux/thunks/courseThunks';
import { 
  selectFeaturedCourses, 
  selectMyCourses, 
  selectCourseLoading,
  selectCourseError 
} from '../../redux/slices/courseSlice';
import { selectUser } from '../../redux/slices/authSlice';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
import '../../styles/StudentHome.css';

function StudentHome() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const featuredCourses = useSelector(selectFeaturedCourses);
  const myCourses = useSelector(selectMyCourses);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Fetch featured courses
    dispatch(fetchCoursesThunk({ featured: true, limit: 8 }));
    
    // Fetch user's enrolled courses
    if (user) {
      dispatch(fetchMyCoursesThunk());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const inProgressCourses = myCourses.filter(course => 
    course.progress > 0 && course.progress < 100
  );

  if (loading) {
    return (
      <div className="student-home">
        <Header isScrolled={isScrolled} />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-home">
      <Header isScrolled={isScrolled} />
      
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Hi {user?.name}, ready to learn? 🎓</h1>
            <p>Skills for your present (and your future). Get started with us.</p>
         
            <div className="hero-actions">
              <Link to="/dashboard/my-learning" className="cta-button primary">
                Continue Learning
              </Link>
              <Link to="/dashboard/my-learning" className="cta-button secondary">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <section className="continue-learning">
          <div className="container">
            <div className="section-header">
              <h2>Continue learning</h2>
              <Link to="/dashboard/my-learning" className="see-all">See all</Link>
            </div>
            <div className="courses-grid">
              {inProgressCourses.slice(0, 3).map(course => (
                <div key={course._id} className="progress-course-card">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="progress-content">
                    <h3>{course.title}</h3>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span>{course.progress}% complete</span>
                    <Link 
                      to={`/dashboard/courses/${course._id}`}
                      className="resume-btn"
                    >
                      Resume
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
      <section className="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>Featured courses</h2>
            <Link to="/dashboard/my-learning" className="see-all">Explore all</Link>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="courses-grid">
            {featuredCourses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Top categories</h2>
          <div className="categories-grid">
            {['Development', 'Business', 'Design', 'Marketing', 'IT & Software', 'Music'].map(category => (
              <Link 
                key={category}
                to={`/dashboard/my-learning?category=${category.toLowerCase()}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category === 'Development' && '💻'}
                  {category === 'Business' && '📊'}
                  {category === 'Design' && '🎨'}
                  {category === 'Marketing' && '📈'}
                  {category === 'IT & Software' && '🔧'}
                  {category === 'Music' && '🎵'}
                </div>
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHome;