// HOST + "/api/"
import express from "express";
import { getProveedoresTable } from "../controllers";
import { validarToken } from "../middlewares";

export const proveedorRouter = express.Router();
proveedorRouter.use(validarToken);
proveedorRouter.post("/", getProveedoresTable);
