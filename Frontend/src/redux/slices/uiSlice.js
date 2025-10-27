import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {
    forgotPassword: false,
    videoPlayer: false,
    confirmDelete: false
  },
  alerts: [],
  globalLoading: false,
  sidebarCollapsed: false,
  theme: 'light',
  scrollPosition: 0
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    addAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 3000
      });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    }
  }
});

export const {
  openModal,
  closeModal,
  toggleModal,
  addAlert,
  removeAlert,
  setGlobalLoading,
  toggleSidebar,
  setTheme,
  setScrollPosition
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectModals = (state) => state.ui.modals;
export const selectAlerts = (state) => state.ui.alerts;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectTheme = (state) => state.ui.theme;