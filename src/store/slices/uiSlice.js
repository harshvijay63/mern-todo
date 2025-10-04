import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    filters: {
        status: 'all',
        assignedTo: 'all',
        searchTerm: '',
    },
    searchTerm: '',
    sidebarOpen: false,
    theme: 'light',
    notifications: [],
    loading: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.filters.searchTerm = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                status: 'all',
                assignedTo: 'all',
                searchTerm: '',
            };
            state.searchTerm = '';
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push({
                id: Date.now(),
                ...action.payload,
            });
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setFilter,
    setSearchTerm,
    clearFilters,
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    addNotification,
    removeNotification,
    setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
