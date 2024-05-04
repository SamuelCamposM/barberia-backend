// HOST + "/api/"
import express from "express";
import { getCompras, searchCompra } from "../controllers";
import { validarToken } from "../middlewares";
export const compraRouter = express.Router();
compraRouter.use(validarToken);
compraRouter.post("/", getCompras);
compraRouter.post("/search", searchCompra);
