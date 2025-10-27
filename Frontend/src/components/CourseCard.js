import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enrollCourseThunk, addToWishlistThunk } from '../redux/thunks/courseThunks';
import { selectWishlist } from '../redux/slices/courseSlice';
import '../styles/CourseCard.css';

function CourseCard({ course }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const isWishlisted = Array.isArray(wishlist) && wishlist.some(c => c._id === course._id);


  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(enrollCourseThunk(course._id)).unwrap();
      alert('Successfully enrolled in course!');
    } catch (error) {
      alert(error || 'Failed to enroll');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToWishlistThunk(course._id)).unwrap();
    } catch (error) {
      alert(error || 'Failed to update wishlist');
    }
  };

  const getThumbnailUrl = () => {
    if (!course.thumbnail) {
      return 'https://via.placeholder.com/240x120/5624d0/ffffff?text=Course';
    }
    if (typeof course.thumbnail === 'string') return course.thumbnail;
    return course.thumbnail.url || 'https://via.placeholder.com/240x120/5624d0/ffffff?text=Course';
  };

  const getInstructorName = () => {
    if (!course.instructor) return 'Unknown Instructor';
    if (typeof course.instructor === 'object' && course.instructor.name) return course.instructor.name;
    if (typeof course.instructor === 'string') return course.instructor;
    return 'Loading...';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">★</span>);
      }
    }
    return stars;
  };

  const calculateDiscount = () => {
    if (course.originalPrice && course.price && course.originalPrice > course.price) {
      return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <div className="course-card">
      <Link to={`/dashboard/courses/${course._id}`} className="course-link">
        <div className="course-image">
          <img 
            src={getThumbnailUrl()} 
            alt={course.title}
            onError={(e) => { 
              e.target.src = 'https://via.placeholder.com/240x120/5624d0/ffffff?text=Course'; 
            }}
          />
          {course.bestseller && <span className="course-badge">Bestseller</span>}
          {course.level && <span className="course-level">{course.level}</span>}
        </div>
        
        <div className="course-content">
          <h3 className="course-title" title={course.title}>
            {course.title}
          </h3>
          <p className="course-instructor" title={getInstructorName()}>
            {getInstructorName()}
          </p>
          
          <div className="course-meta">
            <div className="course-rating">
              <span>{course.rating?.toFixed(1) || '4.5'}</span>
              <div className="course-rating-stars">
                {renderStars(course.rating || 4.5)}
              </div>
            </div>
            <span className="course-students">
              ({course.enrollments?.length || 0})
            </span>
          </div>

          <div className="course-price">
            <span className="current-price">${course.price || '19.99'}</span>
            {course.originalPrice && course.originalPrice > course.price && (
              <>
                <span className="original-price">${course.originalPrice}</span>
                {discount && <span className="discount-badge">{discount}% off</span>}
              </>
            )}
          </div>
        </div>
      </Link>
      
      <div className="course-actions">
        <button className="enroll-btn" onClick={handleEnroll}>
          Enroll
        </button>
        <button 
          className={`course-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`} 
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;