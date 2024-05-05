// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { getDetCompras } from "../controllers";
import { validarToken } from "../middlewares";

export const detCompraRouter = express.Router();

detCompraRouter.use(validarToken);
detCompraRouter.post("/", getDetCompras);
