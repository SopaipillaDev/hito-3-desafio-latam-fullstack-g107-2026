import * as CategoriesModel from '../models/categories.model.js';
import { validateCategory } from '../validators/categoryValidator.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoriesModel.getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const errors = validateCategory(req.body);

    if (errors.length > 0) {
      const error = new Error(errors.join(' '));
      error.status = 400;
      throw error;
    }

    const { name, slug, description } = req.body;

    const category = await CategoriesModel.createCategory({
      name,
      slug,
      description
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === '23505') {
      error.status = 409;
      error.message = 'Ya existe una categoría con ese slug.';
    }
    next(error);
  }
};