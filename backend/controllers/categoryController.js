const CategoryModel = require('../models/categoryModel');

const getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.findAll(req.user.id);
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, color } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const category = await CategoryModel.create(req.user.id, { name, color });
        res.status(201).json({ success: true, message: 'Category created', data: category });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findById(req.user.id, req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        const updatedCategory = await CategoryModel.update(req.user.id, req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Category updated', data: updatedCategory });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await CategoryModel.findById(req.user.id, req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        await CategoryModel.remove(req.user.id, req.params.id);
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
