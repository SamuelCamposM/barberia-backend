// RUTAS DE  USUARIOS
// HOST + "/api/pages"
import express from "express";
import { getPages } from "../controllers";
export const pagesRouter = express.Router();
pagesRouter.get("/", getPages);
