import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, page = 1, limit = 10 } = req.query;

  let query = { user: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Task.countDocuments(query);

  res.status(200).json({
    tasks,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Please add title and description');
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    status,
    dueDate
  });

  res.status(201).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});

export { getTasks, createTask, updateTask, deleteTask };
