import { createAsyncThunk } from '@reduxjs/toolkit';
import * as courseApi from '../../api/courseApi';

const getErr = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// Get all/browse courses (supports filters like { featured, category, search, limit })
export const fetchCoursesThunk = createAsyncThunk(
  'course/fetchCourses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await courseApi.getCourses(filters);
      return res; // { courses, total? }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch courses'));
    }
  }
);

// Get single course detail
export const fetchCourseDetailThunk = createAsyncThunk(
  'course/fetchCourseDetail',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await courseApi.getCourseDetail(courseId);
      return res; // { course }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch course details'));
    }
  }
);

// Enroll in course
export const enrollCourseThunk = createAsyncThunk(
  'course/enroll',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await courseApi.enrollCourse(courseId);
      return res; // expected: { course, message? }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to enroll in course'));
    }
  }
);

// Get user's enrolled courses
export const fetchMyCoursesThunk = createAsyncThunk(
  'course/fetchMyCourses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await courseApi.getMyCourses();
      return res; // { courses: [...] }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch your courses'));
    }
  }
);

// Add/remove to wishlist (toggles locally if backend doesn't return "added")
export const addToWishlistThunk = createAsyncThunk(
  'course/addToWishlist',
  async (courseId, { rejectWithValue, getState }) => {
    try {
      const res = await courseApi.addToWishlist(courseId);
      const wasInWishlist = getState().course.wishlist.some(c => c._id === courseId);
      const added = typeof res.added === 'boolean' ? res.added : !wasInWishlist;
      return { courseId, added };
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to update wishlist'));
    }
  }
);

// Fetch wishlist
export const fetchWishlistThunk = createAsyncThunk(
  'course/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await courseApi.getWishlist();
      return res; // { courses: [...] }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch wishlist'));
    }
  }
);