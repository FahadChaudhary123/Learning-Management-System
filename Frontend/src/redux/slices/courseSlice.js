import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchCoursesThunk, 
  fetchCourseDetailThunk, 
  enrollCourseThunk,
  fetchMyCoursesThunk,
  addToWishlistThunk,
  fetchWishlistThunk
} from '../thunks/courseThunks';

const initialState = {
  courses: [],
  featuredCourses: [],
  myCourses: [],
  wishlist: [],
  currentCourse: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    search: null,
    level: null,
    price: null
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  }
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    updateCourseProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      const course = state.myCourses.find(c => c._id === courseId);
      if (course) {
        course.progress = progress;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Courses
    builder
      .addCase(fetchCoursesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination.total = action.payload.total;
        
        // Set featured courses if it's the featured request
        if (action.meta.arg?.featured) {
          state.featuredCourses = action.payload.courses;
        }
      })
      .addCase(fetchCoursesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Course Detail
    builder
      .addCase(fetchCourseDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchCourseDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Enroll Course
    builder
      .addCase(enrollCourseThunk.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.isEnrolled = true;
        }
        // Add to my courses
        state.myCourses.push(action.payload.course);
      });

    // Fetch My Courses
    builder
      .addCase(fetchMyCoursesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyCoursesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload.courses;
      })
      .addCase(fetchMyCoursesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Wishlist
    builder
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.wishlist = action.payload.courses;
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        const { courseId, added } = action.payload;
        if (added) {
          const course = state.courses.find(c => c._id === courseId);
          if (course) state.wishlist.push(course);
        } else {
          state.wishlist = state.wishlist.filter(c => c._id !== courseId);
        }
      });
  }
});

export const { 
  setFilters, 
  clearFilters, 
  setPage, 
  clearCurrentCourse,
  updateCourseProgress 
} = courseSlice.actions;

export default courseSlice.reducer;

// Selectors
export const selectCourses = (state) => state.course.courses;
export const selectFeaturedCourses = (state) => state.course.featuredCourses;
export const selectMyCourses = (state) => state.course.myCourses;
export const selectWishlist = (state) => state.course.wishlist;
export const selectCurrentCourse = (state) => state.course.currentCourse;
export const selectCourseLoading = (state) => state.course.loading;
export const selectCourseError = (state) => state.course.error;
export const selectFilters = (state) => state.course.filters;
export const selectPagination = (state) => state.course.pagination;