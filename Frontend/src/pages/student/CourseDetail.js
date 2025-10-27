import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/CourseDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCourseDetailThunk, 
  enrollCourseThunk 
} from '../../redux/thunks/courseThunks';
import { 
  selectCurrentCourse, 
  selectCourseLoading, 
  selectCourseError 
} from '../../redux/slices/courseSlice';

function CourseDetail() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const course = useSelector(selectCurrentCourse);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  // Video player state
  const [isPlayingPromo, setIsPlayingPromo] = useState(false);

  useEffect(() => {
    dispatch(fetchCourseDetailThunk(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      await dispatch(enrollCourseThunk(courseId)).unwrap();
      alert('Successfully enrolled in course!');
    } catch (err) {
      alert(err || 'Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Helper function to get video URL
  const getVideoUrl = () => {
    if (!course.promoVideo) return null;
    return typeof course.promoVideo === 'string' 
      ? course.promoVideo 
      : course.promoVideo.url;
  };

  // Helper function to get thumbnail URL
  const getThumbnailUrl = () => {
    if (!course.thumbnail) return null;
    return typeof course.thumbnail === 'string'
      ? course.thumbnail
      : (course.thumbnail?.url || '');
  };

  if (loading) {
    return (
      <div className="course-detail">
        <Header isScrolled={isScrolled} />
        
          <div className="loading-spinner"></div>
          
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail">
        <Header isScrolled={isScrolled} />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">{error || 'Course not found'}</div>
          <Link to="/dashboard/home" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  const avg = course.averageRating || 0;
  const videoUrl = getVideoUrl();
  const thumbnailUrl = getThumbnailUrl();

  return (
    <div className="course-detail">
      <Header isScrolled={isScrolled} />
      
      <div className="course-container">
        {/* Course Header */}
        <div className="course-header">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/dashboard/home">Home</Link>
              <span>•</span>
              <Link to="/dashboard/my-learning">Courses</Link>
              <span>•</span>
              <span>{course.title}</span>
            </nav>
            
            <h1>{course.title}</h1>
            <p className="course-subtitle">{course.description}</p>
            
            <div className="course-stats">
              <div className="rating">
                <span className="rating-value">{avg.toFixed(1)}</span>
                <div className="stars">
                  {'★'.repeat(Math.floor(avg))}
                  {'☆'.repeat(5 - Math.floor(avg))}
                </div>
                <span className="reviews">({course.reviewCount || 0} ratings)</span>
              </div>
              <span className="students">{course.studentsCount || 0} students</span>
              {course.lastUpdated && (
                <span className="last-updated">Last updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
              )}
            </div>
            
            <p className="instructor">
              Created by <strong>{course.instructor?.name || 'Instructor'}</strong>
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="course-content">
          <div className="container">
            <div className="course-layout">
              {/* Main content area */}
              <div className="course-main">
                <div className="course-tabs">
                  <div className="tabs-nav-wrapper">
                    <nav className="tabs-nav">
                      {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map(tab => (
                        <button
                          key={tab}
                          className={`tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab.toLowerCase())}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="tab-content">
                    {activeTab === 'overview' && (
                      <div className="overview-content">
                        <h2>What you'll learn</h2>
                        <div className="outcomes-grid">
                          {course.learningOutcomes?.map((outcome, index) => (
                            <div key={index} className="outcome-item">
                              <span>✅</span>
                              <span>{outcome}</span>
                            </div>
                          ))}
                        </div>
                        
                        <h2>Requirements</h2>
                        <ul className="requirements-list">
                          {course.requirements?.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeTab === 'curriculum' && (
                      <div className="curriculum-content">
                        <div className="curriculum-header">
                          <span>
                            {course.sections?.length || 0} sections • {course.totalLectures || 0} lectures • 
                            {course.totalDuration ? ` ${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m total length` : ''}
                          </span>
                        </div>
                        
                        <div className="sections-list">
                          {course.sections?.map((section, index) => (
                            <div key={index} className="section">
                              <div className="section-header">
                                <h3>{section.title}</h3>
                                <span>
                                  {section.lectures?.length || 0} lectures • 
                                  {section.lectures?.length ? ` ${Math.floor(section.lectures?.reduce((total, lecture) => total + (lecture.duration || 0), 0) / 60)}m` : ' 0m'}
                                </span>
                              </div>
                              <div className="lectures-list">
                                {section.lectures?.map((lecture, lectIndex) => (
                                  <div key={lectIndex} className="lecture">
                                    <span className="lecture-icon">▶️</span>
                                    <span className="lecture-title">{lecture.title}</span>
                                    <span className="lecture-duration">{lecture.duration}m</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'instructor' && (
                      <div className="instructor-content">
                        <div className="instructor-profile">
                          <div className="instructor-avatar">
                            {course.instructor?.name?.charAt(0).toUpperCase() || 'I'}
                          </div>
                          <div className="instructor-info">
                            <h3>{course.instructor?.name || 'Instructor'}</h3>
                            <p className="instructor-headline">{course.instructor?.headline || 'Course Instructor'}</p>
                            <div className="instructor-stats">
                              <div className="stat">
                                <span className="stat-value">⭐ {course.instructor?.rating || '4.5'}</span>
                                <span className="stat-label">Instructor Rating</span>
                              </div>
                              <div className="stat">
                                <span className="stat-value">👨‍🎓 {course.instructor?.students || '0'}</span>
                                <span className="stat-label">Students</span>
                              </div>
                              <div className="stat">
                                <span className="stat-value">📚 {course.instructor?.courses || '0'}</span>
                                <span className="stat-label">Courses</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="instructor-bio">
                          <p>{course.instructor?.bio || 'No instructor biography available.'}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="reviews-content">
                        <div className="reviews-summary">
                          <div className="average-rating">
                            <h3>{avg.toFixed(1)}</h3>
                            <div className="stars large">
                              {'★'.repeat(Math.floor(avg))}
                              {'☆'.repeat(5 - Math.floor(avg))}
                            </div>
                            <p>Course Rating</p>
                          </div>
                          <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map(stars => (
                              <div key={stars} className="rating-bar-item">
                                <div className="stars-label">{stars} stars</div>
                                <div className="bar-container">
                                  <div className="bar-fill" style={{ width: '65%' }}></div>
                                </div>
                                <div className="percentage">65%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="reviews-list">
                          <p className="no-reviews">No reviews yet. Be the first to review this course!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="course-sidebar">
                <div className="purchase-card">
                  {/* Video or Thumbnail */}
                  {videoUrl ? (
                    <div className="promo-video-container">
                      {isPlayingPromo ? (
                        <div className="video-player">
                          <video
                            controls
                            autoPlay
                            className="promo-video"
                            onEnded={() => setIsPlayingPromo(false)}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          <button 
                            className="close-video-btn"
                            onClick={() => setIsPlayingPromo(false)}
                            aria-label="Close video"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="video-preview" 
                          onClick={() => setIsPlayingPromo(true)}
                          style={{ 
                            backgroundImage: `url(${thumbnailUrl})` 
                          }}
                        >
                          <div className="play-overlay">
                            <div className="play-button">
                              <svg viewBox="0 0 24 24" width="60" height="60">
                                <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.8)" />
                                <path d="M16 12l-6-4.5v9l6-4.5z" fill="#1c1d1f" />
                              </svg>
                            </div>
                            <div className="preview-text">Preview this course</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : thumbnailUrl ? (
                    <div className="thumbnail-container">
                      <img src={thumbnailUrl} alt={course.title} />
                    </div>
                  ) : null}
                  
                  {/* Price Section */}
                  <div className="price-section">
                    <span className="current-price">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <>
                        <span className="original-price">${course.originalPrice}</span>
                        <span className="discount">{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off</span>
                      </>
                    )}
                  </div>
                  
                  {/* Enrollment Button */}
                  {course.isEnrolled ? (
                    <Link 
                      to={`/dashboard/courses/${courseId}/learn`}
                      className="go-to-course"
                    >
                      Go to course
                    </Link>
                  ) : (
                    <button 
                      className="enroll-btn"
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <>
                          <span className="spinner"></span>
                          <span>Enrolling...</span>
                        </>
                      ) : 'Enroll Now'}
                    </button>
                  )}
                  
                  <div className="guarantee">
                    <span className="guarantee-icon">🔒</span>
                    30-Day Money-Back Guarantee
                  </div>
                  
                  <div className="includes">
                    <h4>This course includes:</h4>
                    <ul>
                      <li>
                        <span className="includes-icon">🎬</span>
                        {course.totalDuration ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}m` : '0m'} 
                        {' '}on-demand video
                      </li>
                      <li>
                        <span className="includes-icon">📝</span>
                        {course.totalLectures || 0} lectures
                      </li>
                      <li>
                        <span className="includes-icon">⏱️</span>
                        Full lifetime access
                      </li>
                      <li>
                        <span className="includes-icon">🏆</span>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;