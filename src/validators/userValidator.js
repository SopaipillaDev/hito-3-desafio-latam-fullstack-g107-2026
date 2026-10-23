// Este archivo contiene funciones para validar los datos de entrada de los usuarios.
// Verifica que los campos requeridos (nombre, email y contraseña) estén presentes
// y cumplan con reglas básicas antes de ser procesados por los controladores.

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const validateRegister = (body) => {
  const { name, email, password } = body;
  const errors = [];

  if (!isNonEmptyString(name)) errors.push('El nombre es obligatorio.');
  if (!isNonEmptyString(email)) errors.push('El email es obligatorio.');
  if (!isNonEmptyString(password) || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres.');
  }

  return errors;
};

export const validateLogin = (body) => {
  const { email, password } = body;
  const errors = [];

  if (!isNonEmptyString(email)) errors.push('El email es obligatorio.');
  if (!isNonEmptyString(password)) errors.push('La contraseña es obligatoria.');

  return errors;
};
