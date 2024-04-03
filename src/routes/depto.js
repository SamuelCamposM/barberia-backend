// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { getDeptos, setDepto } from "../controllers/depto";
export const deptoRouter = express.Router();
deptoRouter.post("/", getDeptos);
deptoRouter.get("/set", setDepto);
