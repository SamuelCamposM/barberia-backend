// RUTAS DE  USUARIOS
// HOST + "/api/auth"
import express from "express";
import { check } from "express-validator";

import {
  actualizarUsuario,
  comparePassword,
  createUsuario,
  loginUsuario,
  renewToken,
} from "../controllers";
import { validarCampos } from "../middlewares";
import { validarToken } from "../middlewares/validarToken";
import { UsuarioModel } from "../models";
import { deleteFile } from "../helpers";
export const authRouter = express.Router();

authRouter.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").notEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  createUsuario
);

authRouter.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

authRouter.get("/renew", validarToken, renewToken);
authRouter.post("/edit", validarToken, actualizarUsuario);
