import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "There's no token",
    });
  }

  // Para Desarrollo
  // const token = authHeader;

  // Para Producción
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    delete payload.iat;
    delete payload.exp;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Access token has expired",
    });
  }
};

export default auth;
