// HOST + "/api/"
import express from "express";
import { getMarcas, searchMarca } from "../controllers";
import { validarToken } from "../middlewares";
export const marcaRouter = express.Router();
marcaRouter.use(validarToken);
marcaRouter.post("/", getMarcas);
marcaRouter.post("/search", searchMarca);
