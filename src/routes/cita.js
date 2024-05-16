// HOST + "/api/"
import express from "express";
import { getCitas } from "../controllers";
import { validarToken } from "../middlewares";
export const citaRouter = express.Router();
citaRouter.use(validarToken);
citaRouter.post("/", getCitas);
