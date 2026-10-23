# 📁 `validators/`

## ¿Qué es esta carpeta?

La carpeta `validators/` contiene la lógica de **validación de datos**. Su función es asegurarse de que la información que llega desde el cliente cumpla con los requisitos esperados antes de ser procesada.

## Analogía simple

Imagina que llenas un formulario para abrir una cuenta bancaria:

- El validador revisa que escribiste tu nombre.
- Revisa que el correo tenga formato correcto.
- Revisa que la contraseña tenga el largo mínimo.

Si algo está mal, te lo dice **antes** de que la solicitud avance.

## ¿Qué debería ir aquí?

- Validación de campos obligatorios.
- Verificación de formatos (correos, contraseñas, números, fechas).
- Validación de longitudes y rangos.
- Sanitización de datos de entrada.

## ¿Por qué es importante?

Validar los datos de entrada:

- Previene errores en la base de datos.
- Protege contra ataques como inyección SQL.
- Mejora la experiencia del usuario al dar retroalimentación clara.

## Ejemplo conceptual

```js
// validators/userValidator.js
import { body, validationResult } from 'express-validator';

export const createUserValidation = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El correo no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

> **Regla de oro**: nunca confíes en los datos que envía el cliente. Siempre valida antes de procesarlos.
