// HOST + "/api/"
import express from "express";
import { getSucursales } from "../controllers";
import { validarToken } from "../middlewares";

export const sucursalRouter = express.Router();
sucursalRouter.use(validarToken);
sucursalRouter.post("/", getSucursales);
