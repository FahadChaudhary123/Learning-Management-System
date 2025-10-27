import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import instructorReducer from './slices/instructorSlice';
// import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

// Persist configuration
const persistConfig = {
  key: 'lms-root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['ui'] // Don't persist UI state
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  instructor: instructorReducer,
  // user: userReducer,
  ui: uiReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);