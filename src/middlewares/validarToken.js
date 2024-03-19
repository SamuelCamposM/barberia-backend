import { response } from "express";
import jwt from "jsonwebtoken";
export const validarToken = (req, res, next = response) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay un token",
    });
  }
  try {
    const resp = jwt.verify(token, process.env.SECRET_JWT_SEED); 
    req.uid = resp.uid;
    req.name = resp.name;
  } catch (error) {
    console.log({ error });
    return res.status(401).json({ ok: false, msg: "Token no valido" });
  }
  next();
};
