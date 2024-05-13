// HOST + "/api/"
import express from "express";
import { getProductoStock, getProductos, searchProducto, searchProductoForVenta } from "../controllers";
import { validarToken } from "../middlewares";
export const productoRouter = express.Router();
productoRouter.use(validarToken);
productoRouter.post("/", getProductos);
productoRouter.post("/search", searchProducto);
productoRouter.post("/searchForVenta", searchProductoForVenta);
productoRouter.post("/getProductoStock", getProductoStock);
