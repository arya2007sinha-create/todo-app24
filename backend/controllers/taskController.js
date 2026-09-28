const TaskModel = require('../models/taskModel');

const getTasks = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            priority, 
            category_id, 
            search,
            sort_by = 'created_at',
            order = 'desc'
        } = req.query;

        const offset = (page - 1) * limit;
        
        const filters = { status, priority, category_id, search };
        const sort = { column: sort_by, ascending: order === 'asc' };
        const pagination = { limit: parseInt(limit), offset: parseInt(offset) };

        const { data, count } = await TaskModel.findAll(req.user.id, filters, sort, pagination);

        res.status(200).json({
            success: true,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await TaskModel.findById(req.user.id, req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, category_id, due_date, estimated_time } = req.body;

        if (!title || title.length < 3) {
            return res.status(400).json({ success: false, message: 'Task title must be at least 3 characters' });
        }
        if (title.length > 150) {
            return res.status(400).json({ success: false, message: 'Task title must not exceed 150 characters' });
        }

        const taskData = {
            title,
            description,
            priority: priority || 'medium',
            status: 'pending',
            category_id: category_id || null,
            due_date: due_date || null,
            estimated_time: estimated_time || null
        };

        const newTask = await TaskModel.create(req.user.id, taskData);
        res.status(201).json({ success: true, message: 'Task created successfully', data: newTask });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await TaskModel.findById(req.user.id, req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const updatedTask = await TaskModel.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Task updated successfully', data: updatedTask });
    } catch (error) {
        next(error);
    }
};

const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!['pending', 'in_progress', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const task = await TaskModel.findById(req.user.id, req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const updatedTask = await TaskModel.update(req.user.id, req.params.id, { status });
        res.status(200).json({ success: true, message: 'Task status updated', data: updatedTask });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await TaskModel.findById(req.user.id, req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        await TaskModel.remove(req.user.id, req.params.id);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask
};
