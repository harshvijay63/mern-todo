import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setBoard, setError } from '../store/slices/boardsSlice';
import { addNotification } from '../store/slices/uiSlice';

const API_BASE_URL = 'http://localhost:5001/api';

export const useBoard = () => {
    const dispatch = useDispatch();
    const { currentBoard, loading, error } = useSelector(state => state.boards);

    const fetchBoard = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const response = await axios.get(`${API_BASE_URL}/board`);
            dispatch(setBoard(response.data));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to fetch board',
            }));
        }
    }, [dispatch]);

    const addTaskToBoard = useCallback(async (columnId, taskData) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${API_BASE_URL}/board`, {
                columnId,
                task: taskData
            });

            // Update board with new task
            dispatch(setBoard(response.data));

            dispatch(addNotification({
                type: 'success',
                message: 'Task added successfully',
            }));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to add task',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const updateBoard = useCallback(async (boardData) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.put(`${API_BASE_URL}/board`, boardData);
            dispatch(setBoard(response.data));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update board',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return {
        board: currentBoard,
        loading,
        error,
        fetchBoard,
        addTask: addTaskToBoard,
        updateBoard,
    };
};
