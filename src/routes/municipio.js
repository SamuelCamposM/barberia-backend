// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { getMunicipios } from "../controllers";

export const municipioRouter = express.Router();
municipioRouter.post("/", getMunicipios);
