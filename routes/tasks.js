const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user with optional filtering
// @access  Private
router.get('/', [
    query('status')
        .optional()
        .isIn(['Pending', 'In Progress', 'Completed'])
        .withMessage('Status must be one of: Pending, In Progress, Completed'),
    query('sortBy')
        .optional()
        .isIn(['createdAt', 'dueDate', 'title', 'status'])
        .withMessage('Sort by must be one of: createdAt, dueDate, title, status'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { status, sortBy = 'createdAt', sortOrder = 'desc', page = 1 } = req.query;

        // Build filter object
        const filter = { user: req.user._id };
        if (status) {
            filter.status = status;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const tasks = await Task.find(filter)
            .sort(sort)
            .populate('user', 'username email');

        // Get total count for pagination
        const total = await Task.countDocuments(filter);

        res.json({
            tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            message: 'Server error',
            error: 'GET_TASKS_ERROR'
        });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
    body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title is required and must be between 1 and 100 characters')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),
    body('dueDate')
        .isISO8601()
        .withMessage('Due date must be a valid date')
        .custom((value) => {
            const dueDate = new Date(value);
            const now = new Date();
            if (dueDate < now) {
                throw new Error('Due date cannot be in the past');
            }
            return true;
        }),
    body('status')
        .optional()
        .isIn(['Pending', 'In Progress', 'Completed'])
        .withMessage('Status must be one of: Pending, In Progress, Completed')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, description, dueDate, status = 'Pending' } = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            status,
            user: req.user._id
        });

        await task.save();
        await task.populate('user', 'username email');

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            message: 'Server error',
            error: 'CREATE_TASK_ERROR'
        });
    }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch('/:id/status', [
    body('status')
        .isIn(['Pending', 'In Progress', 'Completed'])
        .withMessage('Status must be one of: Pending, In Progress, Completed')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                error: 'TASK_NOT_FOUND'
            });
        }

        task.status = req.body.status;
        await task.save();
        await task.populate('user', 'username email');

        res.json({
            message: 'Task status updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task status error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid task ID',
                error: 'INVALID_TASK_ID'
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: 'UPDATE_STATUS_ERROR'
        });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('user', 'username email');

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                error: 'TASK_NOT_FOUND'
            });
        }

        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid task ID',
                error: 'INVALID_TASK_ID'
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: 'GET_TASK_ERROR'
        });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
    body('title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    body('status')
        .optional()
        .isIn(['Pending', 'In Progress', 'Completed'])
        .withMessage('Status must be one of: Pending, In Progress, Completed')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                error: 'TASK_NOT_FOUND'
            });
        }

        // Update fields
        const { title, description, dueDate, status } = req.body;
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (status !== undefined) task.status = status;

        await task.save();
        await task.populate('user', 'username email');

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid task ID',
                error: 'INVALID_TASK_ID'
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: 'UPDATE_TASK_ERROR'
        });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                error: 'TASK_NOT_FOUND'
            });
        }

        res.json({
            message: 'Task deleted successfully',
            deletedTask: task
        });
    } catch (error) {
        console.error('Delete task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid task ID',
                error: 'INVALID_TASK_ID'
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: 'DELETE_TASK_ERROR'
        });
    }
});

module.exports = router; 