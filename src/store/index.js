import { configureStore } from '@reduxjs/toolkit';
import boardsSlice from './slices/boardsSlice';
import tasksSlice from './slices/tasksSlice';
import usersSlice from './slices/usersSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        boards: boardsSlice,
        tasks: tasksSlice,
        users: usersSlice,
        ui: uiSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
