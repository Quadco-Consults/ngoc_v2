import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isSidebarExpanded: boolean;
}

const initialState: UIState = {
  isSidebarExpanded: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    setSidebarExpanded: (state, action) => {
      state.isSidebarExpanded = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarExpanded } = uiSlice.actions;
export default uiSlice.reducer;
