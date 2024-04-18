// HOST + "/api/"
import express from "express";
import { getUsuariosTable } from "../controllers";

export const usuarioRouter = express.Router();
usuarioRouter.post("/", getUsuariosTable);
