import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InstructorHeader from '../../components/InstructorHeader';
import { 
  fetchInstructorCourseThunk, 
  updateCourseThunk 
} from '../../redux/thunks/instructorThunks';
import { 
  selectInstructorLoading, 
  selectInstructorError, 
  selectInstructorCurrentCourse 
} from '../../redux/slices/instructorSlice';
import '../../styles/EditCourse.css'
function EditCourse() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const course = useSelector(selectInstructorCurrentCourse);
  const loading = useSelector(selectInstructorLoading);
  const error = useSelector(selectInstructorError);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchInstructorCourseThunk(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    if (course) {
      setValue('title', course.title);
      setValue('subtitle', course.subtitle);
      setValue('description', course.description);
      setValue('category', course.category);
      setValue('level', course.level);
      setValue('price', course.price);
      setValue('originalPrice', course.originalPrice);
      // handle both string and object
      setValue('thumbnail', typeof course.thumbnail === 'string' ? course.thumbnail : (course.thumbnail?.url || ''));
    }
  }, [course, setValue]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCourseThunk({ courseId, courseData: data })).unwrap();
      alert('Course updated successfully!');
    } catch (err) {
      // error handled via slice as well
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'settings', label: 'Settings' }
  ];

  if (loading && !course) {
    return (
      <div className="edit-course">
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="edit-course">
        <InstructorHeader isScrolled={isScrolled} />
        <div className="error-message">{error || 'Course not found'}</div>
      </div>
    );
  }

  return (
    <div className="edit-course">
      <InstructorHeader isScrolled={isScrolled} />
      
      <div className="edit-course-container">
        <div className="edit-course-header">
          <h1>Edit Course: {course.title}</h1>
          <p>Manage your course content and settings</p>
        </div>

        <div className="edit-course-layout">
          <div className="edit-sidebar">
            <nav className="edit-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`edit-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="course-preview">
              <h3>Course Status</h3>
              <div className={`status-badge ${course.status}`}>{course.status}</div>
              <p>Students: {course.studentsCount || 0}</p>
              <p>Rating: {course.averageRating || 'No ratings yet'}</p>
            </div>
          </div>

          <div className="edit-main">
            <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
              {error && <div className="error-message">{error}</div>}

              {activeTab === 'basic' && (
                <div className="tab-content">
                  <h2>Basic Information</h2>
                  
                  <div className="form-group">
                    <label>Course Title</label>
                    <input type="text" {...register("title", { required: "Title is required" })} className={errors.title ? 'error' : ''} />
                  </div>

                  <div className="form-group">
                    <label>Subtitle</label>
                    <input type="text" {...register("subtitle", { required: "Subtitle is required" })} className={errors.subtitle ? 'error' : ''} />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea {...register("description", { required: "Description is required" })} rows="6" className={errors.description ? 'error' : ''} />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select {...register("category")}>
                        <option value="development">Development</option>
                        <option value="business">Business</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="it">IT & Software</option>
                        <option value="music">Music</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Level</label>
                      <select {...register("level")}>
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input type="url" {...register("thumbnail", { required: "Thumbnail is required" })} className={errors.thumbnail ? 'error' : ''} />
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="tab-content">
                  <h2>Pricing</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Current Price ($)</label>
                      <input type="number" step="0.01" {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be positive" } })} className={errors.price ? 'error' : ''} />
                    </div>

                    <div className="form-group">
                      <label>Original Price ($)</label>
                      <input type="number" step="0.01" {...register("originalPrice")} />
                    </div>
                  </div>

                  <div className="pricing-info">
                    <h3>Pricing Strategy</h3>
                    <ul>
                      <li>Free courses attract more students but generate no revenue</li>
                      <li>Paid courses should provide clear value and outcomes</li>
                      <li>Consider offering discounts during promotions</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => navigate('/dashboard/instructor/my-courses')} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditCourse;