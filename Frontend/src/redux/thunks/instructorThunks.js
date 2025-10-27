import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import * as instructorApi from '../../api/instructorApi';
import { setUploadProgress } from '../slices/instructorSlice';

const getErr = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

// List courses + stats for instructor
export const fetchInstructorCoursesThunk = createAsyncThunk(
  'instructor/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await instructorApi.getInstructorCourses();
      return res; // { courses, stats }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to load instructor courses'));
    }
  }
);

// Single course by id (instructor-owned)
export const fetchInstructorCourseThunk = createAsyncThunk(
  'instructor/fetchCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.getInstructorCourse(courseId);
      return res; // { course }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to load course'));
    }
  }
);

// Create course
export const createCourseThunk = createAsyncThunk(
  'instructor/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const res = await instructorApi.createCourse(courseData);
      return res; // { course }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to create course'));
    }
  }
);

// Update course
export const updateCourseThunk = createAsyncThunk(
  'instructor/updateCourse',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const res = await instructorApi.updateCourse(courseId, courseData);
      return res; // { course }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to update course'));
    }
  }
);

// Delete course
export const deleteCourseThunk = createAsyncThunk(
  'instructor/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.deleteCourse(courseId);
      return res; // { message }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to delete course'));
    }
  }
);

// Publish course
export const publishCourseThunk = createAsyncThunk(
  'instructor/publishCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.publishCourse(courseId);
      return res; // { message }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to publish course'));
    }
  }
);

// OPTIONAL: Unpublish course (only if backend supports)
export const unpublishCourseThunk = createAsyncThunk(
  'instructor/unpublishCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.unpublishCourse(courseId);
      return res; // { message }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to unpublish course'));
    }
  }
);

// Upload thumbnail with progress
export const uploadThumbnailThunk = createAsyncThunk(
  'instructor/uploadThumbnail',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/instructor/upload/thumbnail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            const progress = Math.round((e.loaded * 100) / e.total);
            dispatch(setUploadProgress({ type: 'thumbnail', progress }));
          }
        }
      });
      return res.data; // { thumbnailUrl, publicId }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to upload thumbnail'));
    }
  }
);

// Upload video with progress
export const uploadVideoThunk = createAsyncThunk(
  'instructor/uploadVideo',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/api/instructor/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) {
            const progress = Math.round((e.loaded * 100) / e.total);
            dispatch(setUploadProgress({ type: 'video', progress }));
          }
        }
      });
      return res.data; // { videoUrl, publicId, thumbnailUrl, fileInfo }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to upload video'));
    }
  }
);

// OPTIONAL: Delete uploaded video from Cloudinary
export const deleteUploadedVideoThunk = createAsyncThunk(
  'instructor/deleteUploadedVideo',
  async (publicId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.deleteUploadedVideo(publicId);
      return res; // { message }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to delete video'));
    }
  }
);

// OPTIONAL: Upload statistics (if backend supports)
export const getUploadStatsThunk = createAsyncThunk(
  'instructor/getUploadStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await instructorApi.getUploadStats();
      return res; // { ...stats }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch upload stats'));
    }
  }
);

// OPTIONAL: Course analytics and students (if you need them now)
export const getCourseAnalyticsThunk = createAsyncThunk(
  'instructor/getCourseAnalytics',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.getCourseAnalytics(courseId);
      return res; // { ...analytics }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch course analytics'));
    }
  }
);

export const getCourseStudentsThunk = createAsyncThunk(
  'instructor/getCourseStudents',
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await instructorApi.getCourseStudents(courseId);
      return res; // { students: [...] }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to fetch students'));
    }
  }
);

// OPTIONAL: Search instructor courses with filters
export const searchInstructorCoursesThunk = createAsyncThunk(
  'instructor/searchCourses',
  async (filters, { rejectWithValue }) => {
    try {
      const res = await instructorApi.searchInstructorCourses(filters);
      return res; // { courses, stats? }
    } catch (err) {
      return rejectWithValue(getErr(err, 'Failed to search courses'));
    }
  }
);