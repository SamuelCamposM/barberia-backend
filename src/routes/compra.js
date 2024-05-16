// HOST + "/api/"
import express from "express";
import {
  getCompras,
  getDetCompras,
  pdfCompra,
  searchCompra,
} from "../controllers";
import { validarToken } from "../middlewares";
export const compraRouter = express.Router();
compraRouter.use(validarToken);
compraRouter.post("/", getCompras);
compraRouter.post("/detCompra", getDetCompras);
compraRouter.post("/search", searchCompra);
compraRouter.get("/pdf/:_idCompra", pdfCompra);
