import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import InstructorHeader from '../../components/InstructorHeader';
import "../../styles/MyCourse.css"; // Fixed import path
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInstructorCoursesThunk, 
  deleteCourseThunk, 
  publishCourseThunk 
} from '../../redux/thunks/instructorThunks';
import { 
  selectInstructorCourses, 
  selectInstructorStats,
  selectInstructorLoading,
  selectInstructorError
} from '../../redux/slices/instructorSlice';

function MyCourses() {
  const dispatch = useDispatch();
  const courses = useSelector(selectInstructorCourses);
  const stats = useSelector(selectInstructorStats);
  const loading = useSelector(selectInstructorLoading);
  const error = useSelector(selectInstructorError);
  const [filter, setFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchCourses = useCallback(async () => {
    await dispatch(fetchInstructorCoursesThunk());
  }, [dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await dispatch(deleteCourseThunk(courseId)).unwrap();
      } catch (err) {
        alert(err || 'Failed to delete course');
      }
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      await dispatch(publishCourseThunk(courseId)).unwrap();
      alert('Course published successfully!');
    } catch (err) {
      alert(err || 'Failed to publish course');
    }
  };

  const filteredCourses = React.useMemo(() => {
    if (filter === 'all') return courses;
    return courses.filter(course => course.status === filter);
  }, [courses, filter]);

  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      draft: { class: 'draft', label: 'Draft' },
      published: { class: 'published', label: 'Published' },
      unpublished: { class: 'unpublished', label: 'Unpublished' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  }, []);

  const courseCounts = React.useMemo(() => ({
    all: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length
  }), [courses]);

  const getThumb = (c) => {
    const thumbnail = typeof c.thumbnail === 'string' ? c.thumbnail : (c.thumbnail?.url || '');
    return thumbnail || 'https://via.placeholder.com/300x220/f0f0f0/999999?text=No+Image';
  };

  if (loading) {
    return (
      <div className="instructor-courses">
        <InstructorHeader isScrolled={isScrolled} />
        <div className="loading">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="instructor-courses">
      <InstructorHeader isScrolled={isScrolled} />
      
      <div className="courses-container">
        {/* Fixed header with create button */}
        <div className="courses-header">
          <h1>My Courses</h1>
          <Link to="/dashboard/instructor/create-course" className="create-course-btn">
            + Create New Course
          </Link>
        </div>

        {error && <div className="error-banner"><p>{error}</p></div>}

        <div className="courses-stats">
          <div className="stat">
            <span className="number">{stats.totalCourses || 0}</span>
            <span className="label">Total Courses</span>
          </div>
          <div className="stat">
            <span className="number">{stats.totalStudents || 0}</span>
            <span className="label">Total Students</span>
          </div>
          <div className="stat">
            <span className="number">${stats.totalRevenue || 0}</span>
            <span className="label">Total Revenue</span>
          </div>
        </div>

        <div className="courses-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All Courses ({courseCounts.all})
          </button>
          <button className={`filter-btn ${filter === 'published' ? 'active' : ''}`} onClick={() => setFilter('published')}>
            Published ({courseCounts.published})
          </button>
          <button className={`filter-btn ${filter === 'draft' ? 'active' : ''}`} onClick={() => setFilter('draft')}>
            Draft ({courseCounts.draft})
          </button>
        </div>

        <div className="courses-list">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              getStatusBadge={getStatusBadge}
              onDelete={handleDeleteCourse}
              onPublish={handlePublishCourse}
              getThumb={getThumb}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <EmptyState filter={filter} />
        )}
      </div>
    </div>
  );
}

// CourseCard component - Status badge is now positioned absolutely
const CourseCard = React.memo(({ course, getStatusBadge, onDelete, onPublish, getThumb }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const defaultPlaceholder = 'https://via.placeholder.com/300x220/f0f0f0/999999?text=No+Image';
  
  return (
    <div className="course-card">
      {/* Status badge positioned absolutely on top right */}
      {getStatusBadge(course.status)}
      
      <div className="course-image-container">
        {imageLoading && (
          <div className="course-image-placeholder">
            <div className="loading-spinner">Loading...</div>
          </div>
        )}
        <img 
          src={imageError ? defaultPlaceholder : getThumb(course)} 
          alt={course.title || 'Course thumbnail'}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      </div>
      
      <div className="course-content">
        <div className="course-header">
          <h3>{course.title || 'Untitled Course'}</h3>
        </div>
        
        <div className="course-stats">
          <span>👥 {course.studentsCount || 0} students</span>
          <span>⭐ {course.averageRating || 'No ratings'}</span>
          <span>💰 ${course.price || 0}</span>
        </div>
        
        <div className="course-meta">
          <span>Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Unknown'}</span>
          {course.lastUpdated && <span>Updated: {new Date(course.lastUpdated).toLocaleDateString()}</span>}
        </div>

        <div className="course-actions">
          <div className="course-actions-row">
            <Link to={`/dashboard/instructor/edit-course/${course._id}`} className="btn btn-edit">
              Edit
            </Link>
            <button onClick={() => onDelete(course._id)} className="btn btn-delete">
              Delete
            </button>
            {course.status === 'draft' && (
              <button onClick={() => onPublish(course._id)} className="btn btn-publish">
                Publish
              </button>
            )}
          </div>
          
          <div className="course-actions-analytics">
            <Link to={`/dashboard/instructor/courses/${course._id}/analytics`} className="btn btn-analytics">
              📊 View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

const EmptyState = React.memo(({ filter }) => (
  <div className="empty-state">
    <div className="empty-icon">📚</div>
    <h3>No courses found</h3>
    <p>{filter === 'all' ? "You haven't created any courses yet." : `No ${filter} courses found.`}</p>
    <Link to="/dashboard/instructor/create-course" className="create-btn">Create Your First Course</Link>
  </div>
));

export default MyCourses;