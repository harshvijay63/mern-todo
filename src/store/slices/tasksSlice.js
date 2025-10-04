import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    optimisticUpdates: [],
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
            state.error = null;
        },
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            const { taskId, updates } = action.payload;
            const index = state.tasks.findIndex(task => task.id === taskId || task._id === taskId);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updates };
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload && task._id !== action.payload);
        },
        moveTask: (state, action) => {
            const { source, destination, draggableId } = action.payload;

            // Find source and destination columns
            const sourceColumn = state.tasks.find(task =>
                task.id === draggableId || task._id === draggableId
            );

            if (sourceColumn) {
                // Update task position and status
                sourceColumn.columnId = destination.droppableId;
                sourceColumn.status = destination.droppableId === 'todo' ? 'todo' :
                    destination.droppableId === 'inprogress' ? 'inprogress' : 'done';
                sourceColumn.order = destination.index;
            }
        },
        addOptimisticUpdate: (state, action) => {
            state.optimisticUpdates.push(action.payload);
        },
        removeOptimisticUpdate: (state, action) => {
            state.optimisticUpdates = state.optimisticUpdates.filter(
                update => update.id !== action.payload
            );
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setLoading,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    setError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
