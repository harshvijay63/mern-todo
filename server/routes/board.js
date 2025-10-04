const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Task = require('../models/Task');

// GET /api/board - Get board with tasks organized by columns
router.get('/', async (req, res) => {
    try {
        // Get or create default board
        let board = await Board.findOne({ name: 'Default Board' });

        if (!board) {
            // Create default board with columns
            board = new Board({
                name: 'Default Board',
                columns: [
                    { id: 'todo', title: 'To Do', order: 0 },
                    { id: 'inprogress', title: 'In Progress', order: 1 },
                    { id: 'done', title: 'Done', order: 2 }
                ],
                users: [
                    { id: 'u1', name: 'Alice' },
                    { id: 'u2', name: 'Bob' }
                ]
            });
            await board.save();
        }

        // Get all tasks and organize by columns
        const tasks = await Task.find().sort({ order: 1, createdAt: 1 });

        // Group tasks by columnId
        const tasksByColumn = {};
        tasks.forEach(task => {
            if (!tasksByColumn[task.columnId]) {
                tasksByColumn[task.columnId] = [];
            }
            tasksByColumn[task.columnId].push(task);
        });

        // Add tasks to columns and transform _id to id
        const boardWithTasks = {
            ...board.toObject(),
            columns: board.columns.map(column => ({
                ...column.toObject(),
                tasks: (tasksByColumn[column.id] || []).map(task => ({
                    ...task.toObject(),
                    id: task._id.toString()
                }))
            }))
        };

        res.json(boardWithTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch board' });
    }
});

// POST /api/board - Add task to board
router.post('/', async (req, res) => {
    try {
        const { columnId, task } = req.body;

        // Get the highest order number for the column
        const lastTask = await Task.findOne({ columnId }).sort({ order: -1 });
        const order = lastTask ? lastTask.order + 1 : 0;

        const newTask = new Task({
            title: task.title,
            description: task.description || '',
            columnId,
            boardId: 'default',
            assignedTo: task.assignedTo || null,
            status: columnId === 'todo' ? 'todo' : columnId === 'inprogress' ? 'inprogress' : 'done',
            order
        });

        const savedTask = await newTask.save();
        res.status(201).json({
            ...savedTask.toObject(),
            id: savedTask._id.toString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// PUT /api/board - Update entire board (for drag and drop)
router.put('/', async (req, res) => {
    try {
        const { columns } = req.body;

        // Update all tasks with new positions
        for (const column of columns) {
            for (let i = 0; i < column.tasks.length; i++) {
                const task = column.tasks[i];
                await Task.findByIdAndUpdate(task._id, {
                    columnId: column.id,
                    order: i,
                    status: column.id === 'todo' ? 'todo' : column.id === 'inprogress' ? 'inprogress' : 'done'
                });
            }
        }

        // Return updated board
        const board = await Board.findOne({ name: 'Default Board' });
        const tasks = await Task.find().sort({ order: 1, createdAt: 1 });

        const tasksByColumn = {};
        tasks.forEach(task => {
            if (!tasksByColumn[task.columnId]) {
                tasksByColumn[task.columnId] = [];
            }
            tasksByColumn[task.columnId].push(task);
        });

        const boardWithTasks = {
            ...board.toObject(),
            columns: board.columns.map(column => ({
                ...column.toObject(),
                tasks: (tasksByColumn[column.id] || []).map(task => ({
                    ...task.toObject(),
                    id: task._id.toString()
                }))
            }))
        };

        res.json(boardWithTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update board' });
    }
});

module.exports = router;
