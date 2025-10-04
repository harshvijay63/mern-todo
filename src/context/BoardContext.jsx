import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const BoardContext = createContext();

const boardReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BOARD':
            return { ...state, board: action.payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'ADD_TASK':
            return {
                ...state,
                board: {
                    ...state.board,
                    columns: state.board.columns.map(col =>
                        col.id === action.payload.columnId
                            ? { ...col, tasks: [...col.tasks, action.payload.task] }
                            : col
                    )
                }
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                board: {
                    ...state.board,
                    columns: state.board.columns.map(col => ({
                        ...col,
                        tasks: col.tasks.map(task =>
                            task.id === action.payload.taskId
                                ? { ...task, ...action.payload.updates }
                                : task
                        )
                    }))
                }
            };
        case 'DELETE_TASK':
            return {
                ...state,
                board: {
                    ...state.board,
                    columns: state.board.columns.map(col => ({
                        ...col,
                        tasks: col.tasks.filter(task => task.id !== action.payload.taskId)
                    }))
                }
            };
        case 'MOVE_TASK':
            const { source, destination, draggableId } = action.payload;

            // Find source and destination columns
            const sourceColumn = state.board.columns.find(col => col.id === source.droppableId);
            const destColumn = state.board.columns.find(col => col.id === destination.droppableId);

            if (!sourceColumn || !destColumn) return state;

            // Find the task being moved
            const taskToMove = sourceColumn.tasks.find(task =>
                task.id === draggableId || task._id === draggableId
            );

            if (!taskToMove) return state;

            // Remove from source column
            const newSourceTasks = sourceColumn.tasks.filter(task =>
                task.id !== draggableId && task._id !== draggableId
            );

            // Add to destination column
            const newDestTasks = [...destColumn.tasks];
            newDestTasks.splice(destination.index, 0, {
                ...taskToMove,
                status: destination.droppableId === 'todo' ? 'todo' :
                    destination.droppableId === 'inprogress' ? 'inprogress' : 'done'
            });

            return {
                ...state,
                board: {
                    ...state.board,
                    columns: state.board.columns.map(column => {
                        if (column.id === source.droppableId) {
                            return { ...column, tasks: newSourceTasks };
                        } else if (column.id === destination.droppableId) {
                            return { ...column, tasks: newDestTasks };
                        }
                        return column;
                    })
                }
            };
        default:
            return state;
    }
};

export const BoardProvider = ({ children }) => {
    const [state, dispatch] = useReducer(boardReducer, {
        board: null,
        loading: true
    });

    useEffect(() => {
        // Initialize socket connection
        const socket = io('http://localhost:5001');

        socket.emit('join-board', 'default');

        socket.on('task:added', (task) => {
            dispatch({
                type: 'ADD_TASK',
                payload: { columnId: task.columnId, task }
            });
        });

        socket.on('task:updated', (task) => {
            dispatch({
                type: 'UPDATE_TASK',
                payload: { taskId: task._id, updates: task }
            });
        });

        socket.on('task:deleted', (taskId) => {
            dispatch({
                type: 'DELETE_TASK',
                payload: { taskId }
            });
        });

        socket.on('board:updated', (board) => {
            dispatch({
                type: 'SET_BOARD',
                payload: board
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const addTask = async (columnId, taskData) => {
        try {
            console.log('Adding task:', { columnId, taskData });
            const response = await axios.post('http://localhost:5001/api/board', {
                columnId,
                task: taskData
            });

            console.log('Task added successfully:', response.data);

            // Add the real task from server response
            dispatch({
                type: 'ADD_TASK',
                payload: {
                    columnId: response.data.columnId,
                    task: response.data
                }
            });
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            console.log('Updating task:', taskId, updates);
            const response = await axios.put(`http://localhost:5001/api/tasks/${taskId}`, updates);
            console.log('Update response:', response.data);

            dispatch({
                type: 'UPDATE_TASK',
                payload: {
                    taskId,
                    updates: response.data
                }
            });
        } catch (error) {
            console.error('Failed to update task:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5001/api/tasks/${taskId}`);

            dispatch({
                type: 'DELETE_TASK',
                payload: { taskId }
            });
        } catch (error) {
            throw error;
        }
    };

    const moveTask = async (source, destination, draggableId) => {
        console.log('Moving task:', { source, destination, draggableId });

        // Update UI immediately
        dispatch({
            type: 'MOVE_TASK',
            payload: {
                source,
                destination,
                draggableId
            }
        });

        // Update backend
        try {
            const updateData = {
                columnId: destination.droppableId,
                status: destination.droppableId === 'todo' ? 'todo' :
                    destination.droppableId === 'inprogress' ? 'inprogress' : 'done',
                order: destination.index
            };
            console.log('Sending update:', updateData);

            const response = await axios.put(`http://localhost:5001/api/tasks/${draggableId}`, updateData);
            console.log('Move task response:', response.data);
        } catch (error) {
            console.error('Failed to update task position:', error);
            console.error('Error details:', error.response?.data);

            // Revert on error
            dispatch({
                type: 'MOVE_TASK',
                payload: {
                    source: destination,
                    destination: source,
                    draggableId
                }
            });
        }
    };

    const loadBoard = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axios.get('http://localhost:5001/api/board');
            dispatch({ type: 'SET_BOARD', payload: response.data });
        } catch (error) {
            console.error('Failed to load board:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <BoardContext.Provider value={{
            state,
            dispatch,
            addTask,
            updateTask,
            deleteTask,
            moveTask,
            loadBoard
        }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};
