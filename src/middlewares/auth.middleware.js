import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = (req, res, next) => {
    console.log('entro a la authmiddleware')
    const authorization = req.header('Authorization');
        console.log('authorization', authorization)

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token no proporcionado o no valido",
      });
    }
        console.log('PAsa el IFFFF')

    const token = authorization.split(" ")[1];
            console.log('PAsa el splitt, token:', token)

    const decodeToken = jwt.verify(token, JWT_SECRET);
                console.log('PAsa el decodeToken, token:', decodeToken)

    req.user = decodeToken;

    next();
  } catch (error) {
    next(error);
  }
};
 
