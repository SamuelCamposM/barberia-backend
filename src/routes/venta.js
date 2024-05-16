// HOST + "/api/"
import express from "express";
import { getVentas, getDetVentas, searchVenta, pdfVenta } from "../controllers";
import { validarToken } from "../middlewares";

export const ventaRouter = express.Router();
ventaRouter.use(validarToken);
ventaRouter.post("/", getVentas);
ventaRouter.post("/detVenta", getDetVentas);
ventaRouter.post("/search", searchVenta);

ventaRouter.get("/pdf/:_idVenta", pdfVenta);
