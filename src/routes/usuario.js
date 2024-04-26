// HOST + "/api/"
import express from "express";
import { getUsuariosTable } from "../controllers";
import { validarToken } from "../middlewares";

export const usuarioRouter = express.Router();
usuarioRouter.use(validarToken);
usuarioRouter.post("/", getUsuariosTable);
