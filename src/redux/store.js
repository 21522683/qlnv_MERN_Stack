import { configureStore } from '@reduxjs/toolkit';
import staffSlice from '../redux/slices/staffSlice.js';

const store = configureStore({
  reducer: {
    staffManagement: staffSlice,
  },
});

export default store;