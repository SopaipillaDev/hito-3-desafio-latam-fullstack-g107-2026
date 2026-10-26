import * as ProductFilesModel from '../models/productFiles.model.js';

export const createProductFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { file_url, file_name, file_size } = req.body;

    const productExists = await ProductFilesModel.productExists(id);

    if (!productExists) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    const file = await ProductFilesModel.createProductFile({
      productId: id,
      file_url,
      file_name,
      file_size
    });

    res.status(201).json(file);
  } catch (error) {
    next(error);
  }
};