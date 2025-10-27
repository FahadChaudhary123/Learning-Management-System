import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCourseThunk, uploadVideoThunk, uploadThumbnailThunk } from '../../redux/thunks/instructorThunks';
import { selectUploadProgress, selectInstructorLoading, selectInstructorError } from '../../redux/slices/instructorSlice';
import InstructorHeader from '../../components/InstructorHeader';
import "../../styles/CreateCourse.css";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [requirements, setRequirements] = useState(['']);
  const [outcomes, setOutcomes] = useState(['']);
  const [videoData, setVideoData] = useState(null);
  const [thumbnailData, setThumbnailData] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  const { video: videoProgress, thumbnail: thumbProgress } = useSelector(selectUploadProgress);
  const loading = useSelector(selectInstructorLoading);
  const serverError = useSelector(selectInstructorError);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'onChange' });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoUpload = useCallback(async (file) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('video', file);
      const res = await dispatch(uploadVideoThunk(formData)).unwrap();
      setVideoData({
        url: res.videoUrl,
        publicId: res.publicId,
        thumbnail: res.thumbnailUrl,
        duration: res.fileInfo?.duration,
        format: res.fileInfo?.format,
        size: res.fileInfo?.size
      });
      setVideoPreview(res.videoUrl);
      return res;
    } catch (err) {
      setError(err || 'Failed to upload video');
      return null;
    }
  }, [dispatch]);

  const handleThumbnailUpload = useCallback(async (file) => {
    try {
      setError('');
      const formData = new FormData();
      formData.append('thumbnail', file);
      const res = await dispatch(uploadThumbnailThunk(formData)).unwrap();
      setThumbnailData({
        url: res.thumbnailUrl,
        publicId: res.publicId
      });
      return res;
    } catch (err) {
      setError(err || 'Failed to upload thumbnail');
      return null;
    }
  }, [dispatch]);

  const handleVideoFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video file size must be less than 100MB');
      return;
    }

    setError('');
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    handleVideoUpload(file);
  }, [handleVideoUpload]);

  const handleThumbnailFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Thumbnail file size must be less than 5MB');
      return;
    }

    setError('');
    handleThumbnailUpload(file);
  }, [handleThumbnailUpload]);

  const addRequirement = useCallback(() => setRequirements(prev => [...prev, '']), []);
  const removeRequirement = useCallback((index) => setRequirements(prev => prev.filter((_, i) => i !== index)), []);
  const updateRequirement = useCallback((index, value) => {
    setRequirements(prev => { const arr = [...prev]; arr[index] = value; return arr; });
  }, []);

  const addOutcome = useCallback(() => setOutcomes(prev => [...prev, '']), []);
  const removeOutcome = useCallback((index) => setOutcomes(prev => prev.filter((_, i) => i !== index)), []);
  const updateOutcome = useCallback((index, value) => {
    setOutcomes(prev => { const arr = [...prev]; arr[index] = value; return arr; });
  }, []);

  const filteredRequirements = useMemo(() => requirements.filter(r => r.trim() !== ''), [requirements]);
  const filteredOutcomes = useMemo(() => outcomes.filter(o => o.trim() !== ''), [outcomes]);

  const onSubmit = useCallback(async (data) => {
    try {
      setError('');

      if (!thumbnailData) {
        setError('Please upload a course thumbnail');
        return;
      }

      const courseData = {
        ...data,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : parseFloat(data.price),
        requirements: filteredRequirements,
        learningOutcomes: filteredOutcomes,
        level: data.level || 'all',
        category: data.category || 'development',
        thumbnail: thumbnailData,
        promoVideo: videoData || null
      };

      const result = await dispatch(createCourseThunk(courseData)).unwrap();
      alert('Course created successfully!');
      navigate(`/dashboard/instructor/edit-course/${result.course._id}`);
    } catch (err) {
      setError(err || 'Failed to create course');
    }
  }, [dispatch, navigate, filteredRequirements, filteredOutcomes, videoData, thumbnailData]);

  const handleCancel = useCallback(() => navigate('/dashboard/instructor/my-courses'), [navigate]);

  const removeVideo = useCallback(() => {
    setVideoData(null);
    setVideoPreview('');
    setError('');
  }, []);
  const removeThumbnail = useCallback(() => {
    setThumbnailData(null);
    setError('');
  }, []);

  return (
    <div className="create-course">
      <InstructorHeader isScrolled={isScrolled} />
      
      <div className="create-course-container">
        <div className="create-course-header">
          <h1>Create New Course</h1>
          <p>Fill in the basic information about your course</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="course-form">
          {(error || serverError) && <div className="error-message">{error || serverError}</div>}

          <div className="form-section">
            <h2>Course Basics</h2>
            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                {...register("title", { required: "Course title is required", minLength: { value: 5, message: "Title must be at least 5 characters" } })}
                placeholder="e.g., Complete Web Development Bootcamp 2024"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label>Subtitle *</label>
              <input
                type="text"
                {...register("subtitle", { required: "Subtitle is required", minLength: { value: 10, message: "Subtitle must be at least 10 characters" } })}
                placeholder="e.g., Learn HTML, CSS, JavaScript, React, Node.js and more!"
                className={errors.subtitle ? 'error' : ''}
              />
              {errors.subtitle && <span className="error-text">{errors.subtitle.message}</span>}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                {...register("description", { required: "Description is required", minLength: { value: 50, message: "Description must be at least 50 characters" } })}
                placeholder="Describe what students will learn in this course..."
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description.message}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Course Thumbnail *</h2>
            <div className="thumbnail-upload-section">
              {!thumbnailData ? (
                <div className="thumbnail-upload-area">
                  <input
                    type="file"
                    id="course-thumbnail"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleThumbnailFileChange}
                    className="thumbnail-input"
                  />
                  <label htmlFor="course-thumbnail" className="thumbnail-upload-label">
                    <div className="upload-icon">🖼️</div>
                    <div className="upload-text">
                      <div>Click to upload course thumbnail</div>
                      <div className="upload-subtext">JPEG, PNG, or WebP (Max 5MB)</div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="thumbnail-preview">
                  <div className="thumbnail-preview-container">
                    <img src={thumbnailData.url} alt="Course thumbnail" className="preview-thumbnail" />
                    <button type="button" onClick={removeThumbnail} className="remove-thumbnail-btn">
                      Remove Thumbnail
                    </button>
                  </div>
                </div>
              )}
              
              {thumbProgress > 0 && thumbProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${thumbProgress}%` }}></div>
                  </div>
                  <span>Uploading thumbnail... {thumbProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Promo Video</h2>
            <p>Upload a short promotional video for your course (optional but recommended)</p>
            
            <div className="video-upload-section">
              {!videoPreview ? (
                <div className="video-upload-area">
                  <input
                    type="file"
                    id="promo-video"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoFileChange}
                    className="video-input"
                  />
                  <label htmlFor="promo-video" className="video-upload-label">
                    <div className="upload-icon">🎬</div>
                    <div className="upload-text">
                      <div>Click to upload promo video</div>
                      <div className="upload-subtext">MP4, WebM, OGG, or MOV (Max 100MB)</div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="video-preview">
                  <div className="video-preview-container">
                    <video controls className="preview-video">
                      <source src={videoPreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button type="button" onClick={removeVideo} className="remove-video-btn">
                      Remove Video
                    </button>
                  </div>
                </div>
              )}
              
              {videoProgress > 0 && videoProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${videoProgress}%` }}></div>
                  </div>
                  <span>Uploading video to Cloudinary... {videoProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Course Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select {...register("category", { required: "Category is required" })}>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="it">IT & Software</option>
                  <option value="music">Music</option>
                </select>
              </div>

              <div className="form-group">
                <label>Level *</label>
                <select {...register("level", { required: "Level is required" })}>
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be positive" }, max: { value: 1000, message: "Price must be less than $1000" } })}
                  placeholder="84.99"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-text">{errors.price.message}</span>}
              </div>

              <div className="form-group">
                <label>Original Price ($)</label>
                <input type="number" step="0.01" min="0" max="1000" {...register("originalPrice")} placeholder="149.99" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Requirements</h2>
            <p>What should students know before taking your course?</p>
            {requirements.map((requirement, index) => (
              <DynamicInput
                key={index}
                value={requirement}
                onChange={(value) => updateRequirement(index, value)}
                onRemove={() => removeRequirement(index)}
                placeholder="e.g., Basic computer skills"
                showRemove={requirements.length > 1}
              />
            ))}
            <button type="button" onClick={addRequirement} className="add-btn">+ Add Requirement</button>
          </div>

          <div className="form-section">
            <h2>What Students Will Learn</h2>
            <p>List the key learning outcomes for your course</p>
            {outcomes.map((outcome, index) => (
              <DynamicInput
                key={index}
                value={outcome}
                onChange={(value) => updateOutcome(index, value)}
                onRemove={() => removeOutcome(index)}
                placeholder="e.g., Build real-world web applications"
                showRemove={outcomes.length > 1}
              />
            ))}
            <button type="button" onClick={addOutcome} className="add-btn">+ Add Learning Outcome</button>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !thumbnailData} className="btn-primary">
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const DynamicInput = React.memo(({ value, onChange, onRemove, placeholder, showRemove }) => (
  <div className="dynamic-input-group">
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    {showRemove && (
      <button type="button" onClick={onRemove} className="remove-btn">
        Remove
      </button>
    )}
  </div>
));

export default CreateCourse;