import { createSlice } from '@reduxjs/toolkit';
import {
  fetchInstructorCoursesThunk,
  fetchInstructorCourseThunk,
  createCourseThunk,
  updateCourseThunk,
  deleteCourseThunk,
  publishCourseThunk,
  uploadVideoThunk,
  uploadThumbnailThunk
} from '../thunks/instructorThunks';

const initialState = {
  courses: [],
  currentCourse: null,
  stats: {
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  },
  loading: false,
  error: null,
  uploadProgress: {
    video: 0,
    thumbnail: 0
  },
  filter: 'all' // all, published, draft
};

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    setUploadProgress: (state, action) => {
      const { type, progress } = action.payload;
      state.uploadProgress[type] = progress;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = { video: 0, thumbnail: 0 };
    }
  },
  extraReducers: (builder) => {
    // Fetch Instructor Courses
    builder
      .addCase(fetchInstructorCoursesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorCoursesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.stats = action.payload.stats;
      })
      .addCase(fetchInstructorCoursesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Single Course
    builder
      .addCase(fetchInstructorCourseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstructorCourseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchInstructorCourseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Course
    builder
      .addCase(createCourseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload.course);
        state.stats.totalCourses += 1;
      })
      .addCase(createCourseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Course
    builder
      .addCase(updateCourseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourseThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(c => c._id === action.payload.course._id);
        if (index !== -1) {
          state.courses[index] = action.payload.course;
        }
        state.currentCourse = action.payload.course;
      })
      .addCase(updateCourseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Course
    builder
      .addCase(deleteCourseThunk.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c._id !== action.meta.arg);
        state.stats.totalCourses -= 1;
      });

    // Publish Course
    builder
      .addCase(publishCourseThunk.fulfilled, (state, action) => {
        const course = state.courses.find(c => c._id === action.meta.arg);
        if (course) {
          course.status = 'published';
        }
      });

    // Upload Progress
    builder
      .addCase(uploadVideoThunk.pending, (state) => {
        state.uploadProgress.video = 0;
      })
      .addCase(uploadVideoThunk.fulfilled, (state) => {
        state.uploadProgress.video = 100;
      })
      .addCase(uploadThumbnailThunk.pending, (state) => {
        state.uploadProgress.thumbnail = 0;
      })
      .addCase(uploadThumbnailThunk.fulfilled, (state) => {
        state.uploadProgress.thumbnail = 100;
      });
  }
});

export const { 
  setFilter, 
  clearCurrentCourse, 
  setUploadProgress,
  resetUploadProgress 
} = instructorSlice.actions;

export default instructorSlice.reducer;

// Selectors
export const selectInstructorCourses = (state) => state.instructor.courses;
export const selectInstructorCurrentCourse = (state) => state.instructor.currentCourse;
export const selectInstructorStats = (state) => state.instructor.stats;
export const selectInstructorLoading = (state) => state.instructor.loading;
export const selectInstructorError = (state) => state.instructor.error;
export const selectUploadProgress = (state) => state.instructor.uploadProgress;
export const selectInstructorFilter = (state) => state.instructor.filter;

// Filtered courses selector
export const selectFilteredInstructorCourses = (state) => {
  const { courses, filter } = state.instructor;
  if (filter === 'all') return courses;
  return courses.filter(course => course.status === filter);
};