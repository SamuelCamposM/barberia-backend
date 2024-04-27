// HOST + "/api/"
import express from "express";
import { getProductos, searchProducto } from "../controllers";
import { validarToken } from "../middlewares";
export const productoRouter = express.Router();
productoRouter.use(validarToken);
productoRouter.post("/", getProductos);
productoRouter.post("/search", searchProducto);
