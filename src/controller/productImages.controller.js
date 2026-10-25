import * as ProductImagesModel from '../models/productImages.model.js';

export const getProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productExists = await ProductImagesModel.productExists(id);

    if (!productExists) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    const images = await ProductImagesModel.getImagesByProductId(id);

    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

export const createProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productExists = await ProductImagesModel.productExists(id);

    if (!productExists) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    const { url, alt_text, is_cover, position } = req.body;

    const image = await ProductImagesModel.createProductImage({
      productId: id,
      url,
      alt_text,
      is_cover,
      position
    });

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};