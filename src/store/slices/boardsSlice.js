import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentBoard: null,
    loading: false,
    error: null,
};

const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setBoard: (state, action) => {
            state.currentBoard = action.payload;
            state.loading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateBoard: (state, action) => {
            if (state.currentBoard) {
                state.currentBoard = { ...state.currentBoard, ...action.payload };
            }
        },
    },
});

export const { setLoading, setBoard, setError, updateBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
