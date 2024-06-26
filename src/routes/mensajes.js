// RUTAS DE  USUARIOS
// HOST + "/api/mensajes"
import express from "express";
import { validarToken } from "../middlewares/validarToken";
import { obtenerChat } from "../controllers";
export const mensajesRouter = express.Router();
mensajesRouter.use(validarToken);
mensajesRouter.get("/:de", obtenerChat);
