// HOST + "/api/"
import express from "express";
import { getCierreCajas } from "../controllers";
import { validarToken } from "../middlewares";
export const cierreCajaRouter = express.Router();
cierreCajaRouter.use(validarToken);
cierreCajaRouter.post("/", getCierreCajas);
