export const validateCategory = ({ name, slug, description }) => {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('El nombre es obligatorio.');
  }

  if (!slug || slug.trim() === '') {
    errors.push('El slug es obligatorio.');
  }

  if (!description || description.trim() === '') {
    errors.push('La descripción es obligatoria.');
  }

  return errors;
};