// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { getMunicipios, searchMunicipiosByDepto } from "../controllers";

export const municipioRouter = express.Router();
municipioRouter.post("/", getMunicipios);
municipioRouter.post("/searchByDepto", searchMunicipiosByDepto);
