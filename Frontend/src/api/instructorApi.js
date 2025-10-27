// src/api/instructorApi.js (Updated for Cloudinary)
import axiosInstance from './axiosInstance';

// Dashboard
export async function getInstructorDashboard() {
  try {
    const res = await axiosInstance.get('/api/instructor/dashboard');
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch dashboard data' };
  }
}

// Course Management
export async function getInstructorCourses() {
  try {
    const res = await axiosInstance.get('/api/instructor/courses');
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch instructor courses' };
  }
}

export async function getInstructorCourse(courseId) {
  try {
    const res = await axiosInstance.get(`/api/instructor/courses/${courseId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch course details' };
  }
}

// UPDATED: Create course - no changes needed, but frontend will send Cloudinary data
export async function createCourse(courseData) {
  try {
    const res = await axiosInstance.post('/api/instructor/courses', courseData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to create course' };
  }
}

// UPDATED: Update course - no changes needed, but frontend will send Cloudinary data
export async function updateCourse(courseId, courseData) {
  try {
    const res = await axiosInstance.put(`/api/instructor/courses/${courseId}`, courseData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to update course' };
  }
}

export async function publishCourse(courseId) {
  try {
    const res = await axiosInstance.patch(`/api/instructor/courses/${courseId}/publish`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to publish course' };
  }
}

export async function unpublishCourse(courseId) {
  try {
    const res = await axiosInstance.patch(`/api/instructor/courses/${courseId}/unpublish`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to unpublish course' };
  }
}

export async function deleteCourse(courseId) {
  try {
    const res = await axiosInstance.delete(`/api/instructor/courses/${courseId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to delete course' };
  }
}

// Analytics
export async function getCourseAnalytics(courseId) {
  try {
    const res = await axiosInstance.get(`/api/instructor/courses/${courseId}/analytics`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch course analytics' };
  }
}

export async function getCourseStudents(courseId) {
  try {
    const res = await axiosInstance.get(`/api/instructor/courses/${courseId}/students`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch students' };
  }
}

// UPDATED: File Upload for Cloudinary
export async function uploadCourseThumbnail(formData) {
  try {
    const res = await axiosInstance.post('/api/instructor/upload/thumbnail', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to upload thumbnail' };
  }
}

// UPDATED: Video upload with progress tracking
export async function uploadCourseVideo(formData) {
  try {
    const res = await axiosInstance.post('/api/instructor/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Optional: Add progress tracking
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${progress}%`);
          // You can emit this to a state management system or context
        }
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to upload video' };
  }
}

// NEW: Delete uploaded video from Cloudinary
export async function deleteUploadedVideo(publicId) {
  try {
    const res = await axiosInstance.delete(`/api/instructor/upload/video/${publicId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to delete video' };
  }
}

// NEW: Get upload statistics
export async function getUploadStats() {
  try {
    const res = await axiosInstance.get('/api/instructor/upload/stats');
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch upload statistics' };
  }
}

// Search & Filter
export async function searchInstructorCourses(filters) {
  try {
    const res = await axiosInstance.get('/api/instructor/courses/search', { params: filters });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to search courses' };
  }
}