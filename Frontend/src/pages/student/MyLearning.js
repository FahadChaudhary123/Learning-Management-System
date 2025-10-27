import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header';
import CourseCard from '../../components/CourseCard';
import '../../styles/MyLearning.css';
import { 
  fetchMyCoursesThunk,
  fetchWishlistThunk,
  fetchCoursesThunk
} from '../../redux/thunks/courseThunks';
import { 
  selectMyCourses, 
  selectWishlist, 
  selectCourses,
  selectCourseLoading,
  selectCourseError
} from '../../redux/slices/courseSlice';
import { selectUser } from '../../redux/slices/authSlice';

function MyLearning() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const user = useSelector(selectUser);
  const enrolledCourses = useSelector(selectMyCourses) || [];
const wishlistCourses = useSelector(selectWishlist) || [];
const browseCourses = useSelector(selectCourses) || [];

  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);

  const [activeTab, setActiveTab] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    dispatch(fetchMyCoursesThunk());
    dispatch(fetchWishlistThunk());

    const filters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (category || search) {
      dispatch(fetchCoursesThunk(filters));
    }
  }, [dispatch, category, search]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
  { id: 'all', label: 'All Courses', count: Array.isArray(enrolledCourses) ? enrolledCourses.length : 0 },
  { id: 'in-progress', label: 'In Progress', count: Array.isArray(enrolledCourses) ? enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length : 0 },
  { id: 'completed', label: 'Completed', count: Array.isArray(enrolledCourses) ? enrolledCourses.filter(c => c.progress === 100).length : 0 },
  { id: 'wishlist', label: 'Wishlist', count: Array.isArray(wishlistCourses) ? wishlistCourses.length : 0 }
];

  const filteredCourses = enrolledCourses.filter(course => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'in-progress' && course.progress > 0 && course.progress < 100) ||
                      (activeTab === 'completed' && course.progress === 100);
    return matchesTab;
  });

  const displayCourses = activeTab === 'wishlist' ? wishlistCourses : 
                        (category || search) ? browseCourses : filteredCourses;

  if (loading) {
    return (
      <div className="my-learning">
        <Header isScrolled={isScrolled} />
        <div className="loading">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="my-learning">
      <Header isScrolled={isScrolled} />
      
      <div className="learning-container">
        <div className="learning-header">
          <h1>
            {category
              ? `${category} Courses`
              : search
              ? `Search: "${search}"`
              : `My Learning, ${user?.name || 'Student'}`}
          </h1>
          {(category || search) && (
            <p>{browseCourses.length} courses found</p>
          )}
        </div>

        {!category && !search && (
          <div className="learning-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="learning-content">
          {error && <div className="error-message">{error}</div>}
          
          {displayCourses.length > 0 ? (
            <div className="courses-grid">
              {displayCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                {activeTab === 'wishlist' ? '❤️' : '📚'}
              </div>
              <h3>
                {activeTab === 'wishlist' ? 'Your wishlist is empty' :
                 category ? `No ${category} courses found` :
                 search ? `No courses found for "${search}"` :
                 'No courses found'}
              </h3>
              <p>
                {activeTab === 'wishlist' ? 
                  'Start adding courses you love to your wishlist!' :
                  'Explore our course catalog to find something you like.'}
              </p>
              <Link to="/dashboard/home" className="browse-btn">
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {(category || search) && browseCourses.length > 0 && (
          <section className="recommended-section">
            <h2>More courses you might like</h2>
            <div className="courses-grid">
              {browseCourses.slice(0, 4).map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MyLearning;