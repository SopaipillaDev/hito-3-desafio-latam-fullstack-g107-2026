import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  validateRegister,
  validateLogin,
} from "../validators/userValidator.js";
import * as UsersModel from "../models/users.model.js";
import { json } from "express";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN= process.env.JWT_EXPIRES_IN;

export const register = async (req, res, next) => {
  console.log('Registrar Usuario Iniciado');
  
  try {
    const errors = validateRegister(req.body); //Validacion de entradas
    if (errors.length > 0) {//si  hay errores en la validación anterior respoder error
      const err = new Error(errors.join(" "));
      err.status = 400;
      throw err;
    }
    const { name, email, password, avatar_url } = req.body;
    const existing = await UsersModel.findByEmail(email); //Buscar en la DB correo a registrar
    if (existing) {
      const err = new Error("El email ya está registrado.");
      err.status = 409;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UsersModel.createUser({
      name,
      email,
      password: hashedPassword,
      avatar_url,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body); //Valida las entradas
    if (errors.length > 0) { //Si la validación arroja errores devolver el error
      const err = new Error(errors.join(" "));
      err.status = 400;
      throw err;
    }
    const { email, password } = req.body; //Datos ingresados
    const user = await UsersModel.findByEmail(email); //Datos de la BD
    if (!user) { //Si usuario no existe arrojar error
      const err = new Error("Credenciales inválidas.");
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash); //compara contraseña ingresada con la de la base de datos
    if (!isMatch) { //Si no coiciden arrojar error
      const err = new Error("Credenciales inválidas.");
      err.status = 401;
      throw err;
    }

    const token = jwt.sign( //Firma el token de sesion
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.json({ // Responde la petición con el token, y el user.
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const aboutMe = async (req, res) => {
  console.log("aboutMe Iniciado");
  console.log('Req:', req.id)

    const usuario = await UsersModel.userMe(req.user.id);
    res.json({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      avatar_url: usuario.avatar_url,
      role: usuario.role,
      created_at: usuario.created_at,
    });

}; 
