import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    setLoading,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    setError
} from '../store/slices/tasksSlice';
import { addNotification } from '../store/slices/uiSlice';

const API_BASE_URL = 'http://localhost:5001/api';

export const useTasks = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector(state => state.tasks);

    const fetchTasks = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const response = await axios.get(`${API_BASE_URL}/tasks`);
            dispatch(setTasks(response.data));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to fetch tasks',
            }));
        }
    }, [dispatch]);

    const createTask = useCallback(async (taskData) => {
        try {
            dispatch(setLoading(true));

            // Optimistic update
            const optimisticId = `temp_${Date.now()}`;
            const optimisticTask = {
                id: optimisticId,
                ...taskData,
                createdAt: new Date().toISOString(),
            };

            dispatch(addOptimisticUpdate({ id: optimisticId, type: 'create', data: optimisticTask }));
            dispatch(addTask(optimisticTask));

            const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);

            // Remove optimistic update and add real task
            dispatch(removeOptimisticUpdate(optimisticId));
            dispatch(deleteTask(optimisticId));
            dispatch(addTask(response.data));

            dispatch(addNotification({
                type: 'success',
                message: 'Task created successfully',
            }));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to create task',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const updateTaskById = useCallback(async (taskId, updates) => {
        try {
            dispatch(setLoading(true));

            // Optimistic update
            dispatch(updateTask({ taskId, updates }));

            const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updates);

            // Update with server response
            dispatch(updateTask({ taskId, updates: response.data }));

            dispatch(addNotification({
                type: 'success',
                message: 'Task updated successfully',
            }));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to update task',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const deleteTaskById = useCallback(async (taskId) => {
        try {
            dispatch(setLoading(true));

            // Optimistic update
            const taskToDelete = tasks.find(task => task.id === taskId || task._id === taskId);
            dispatch(deleteTask(taskId));

            await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);

            dispatch(addNotification({
                type: 'success',
                message: 'Task deleted successfully',
            }));
        } catch (error) {
            // Revert optimistic update
            if (taskToDelete) {
                dispatch(addTask(taskToDelete));
            }

            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to delete task',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, tasks]);

    const moveTaskById = useCallback(async (source, destination, draggableId) => {
        try {
            // Optimistic update
            dispatch(moveTask({ source, destination, draggableId }));

            const updateData = {
                columnId: destination.droppableId,
                status: destination.droppableId === 'todo' ? 'todo' :
                    destination.droppableId === 'inprogress' ? 'inprogress' : 'done',
                order: destination.index
            };

            await axios.put(`${API_BASE_URL}/tasks/${draggableId}`, updateData);
        } catch (error) {
            // Revert optimistic update
            dispatch(moveTask({ source: destination, destination: source, draggableId }));

            dispatch(setError(error.message));
            dispatch(addNotification({
                type: 'error',
                message: 'Failed to move task',
            }));
        }
    }, [dispatch]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask: updateTaskById,
        deleteTask: deleteTaskById,
        moveTask: moveTaskById,
    };
};
