// HOST + "/api/"
import express from "express";
import { getSucursales, searchSucursal } from "../controllers";
import { validarToken } from "../middlewares";

export const sucursalRouter = express.Router();
sucursalRouter.use(validarToken);
sucursalRouter.post("/", getSucursales);
sucursalRouter.post("/search", searchSucursal);