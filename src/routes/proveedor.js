// HOST + "/api/"
import express from "express";
import { getProveedoresTable, searchProveedor } from "../controllers";
import { validarToken } from "../middlewares";

export const proveedorRouter = express.Router();
proveedorRouter.use(validarToken);
proveedorRouter.post("/", getProveedoresTable);
proveedorRouter.post("/search", searchProveedor);
