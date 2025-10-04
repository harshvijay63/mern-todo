const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Board = require('../models/Board');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ order: 1, createdAt: 1 });
        res.json(tasks.map(task => ({
            ...task.toObject(),
            id: task._id.toString()
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({
            ...task.toObject(),
            id: task._id.toString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
    try {
        const { title, description, columnId, boardId, assignedTo } = req.body;

        // Get the highest order number for the column
        const lastTask = await Task.findOne({ columnId }).sort({ order: -1 });
        const order = lastTask ? lastTask.order + 1 : 0;

        const task = new Task({
            title,
            description: description || '',
            columnId,
            boardId: boardId || 'default',
            assignedTo: assignedTo || null,
            order
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, columnId, order, assignedTo } = req.body;
        console.log('Updating task:', req.params.id, 'with data:', req.body);

        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log('Task not found:', req.params.id);
            return res.status(404).json({ error: 'Task not found' });
        }

        console.log('Found task:', task.title, 'Current title:', task.title);

        // Update fields
        if (title !== undefined) {
            console.log('Updating title from', task.title, 'to', title);
            task.title = title;
        }
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (columnId !== undefined) task.columnId = columnId;
        if (order !== undefined) task.order = order;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;

        const updatedTask = await task.save();
        console.log('Task updated successfully:', updatedTask.title);

        res.json({
            ...updatedTask.toObject(),
            id: updatedTask._id.toString()
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// PUT /api/tasks/:id/status - Update task status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, columnId, order } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = status;
        if (columnId !== undefined) task.columnId = columnId;
        if (order !== undefined) task.order = order;

        const updatedTask = await task.save();
        res.json({
            ...updatedTask.toObject(),
            id: updatedTask._id.toString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

// GET /api/tasks/status/:status - Get tasks by status
router.get('/status/:status', async (req, res) => {
    try {
        const tasks = await Task.find({ status: req.params.status }).sort({ order: 1, createdAt: 1 });
        res.json(tasks.map(task => ({
            ...task.toObject(),
            id: task._id.toString()
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks by status' });
    }
});

module.exports = router;
