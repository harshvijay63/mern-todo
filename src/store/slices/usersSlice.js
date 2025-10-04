import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [
        { id: 'u1', name: 'Alice', avatar: 'A' },
        { id: 'u2', name: 'Bob', avatar: 'B' },
    ],
    currentUser: null,
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            const { userId, updates } = action.payload;
            const index = state.users.findIndex(user => user.id === userId);
            if (index !== -1) {
                state.users[index] = { ...state.users[index], ...updates };
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setUsers,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    setLoading,
    setError,
} = usersSlice.actions;

export default usersSlice.reducer;
