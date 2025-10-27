// src/api/courseApi.js
import axiosInstance from './axiosInstance';

// Get all courses with filters
export async function getCourses(filters = {}) {
  try {
    const res = await axiosInstance.get('/api/courses', { params: filters });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch courses' };
  }
}

// Get course details
export async function getCourseDetail(courseId) {
  try {
    const res = await axiosInstance.get(`/api/courses/${courseId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch course details' };
  }
}

// Enroll in course
export async function enrollCourse(courseId) {
  try {
    const res = await axiosInstance.post(`/api/courses/${courseId}/enroll`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to enroll in course' };
  }
}

// Get user's enrolled courses
export async function getMyCourses() {
  try {
    const res = await axiosInstance.get('/api/courses/user/my-courses');
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch your courses' };
  }
}

// Add to wishlist
export async function addToWishlist(courseId) {
  try {
    const res = await axiosInstance.post('/api/courses/wishlist/add', { courseId });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to add to wishlist' };
  }
}

// Get wishlist
export async function getWishlist() {
  try {
    const res = await axiosInstance.get('/api/courses/wishlist/mine');
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Failed to fetch wishlist' };
  }
}