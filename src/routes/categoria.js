// HOST + "/api/"
import express from "express";
import { getCategorias, searchCategoria } from "../controllers";
import { validarToken } from "../middlewares";
export const categoriaRouter = express.Router();
categoriaRouter.use(validarToken);
categoriaRouter.post("/", getCategorias);
categoriaRouter.post("/search", searchCategoria);
