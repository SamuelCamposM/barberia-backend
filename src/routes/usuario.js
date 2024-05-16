// HOST + "/api/"
import express from "express";
import { getUsuariosTable, searchCliente, searchEmpleadoBySucursal } from "../controllers";
import { validarToken } from "../middlewares";

export const usuarioRouter = express.Router();
usuarioRouter.use(validarToken);
usuarioRouter.post("/", getUsuariosTable);
usuarioRouter.post("/searchCliente", searchCliente);
usuarioRouter.post("/searchEmpleadoBySucursal", searchEmpleadoBySucursal);
 