// HOST + "/api/"
import express from "express";
import { getSucursales } from "../controllers";

export const sucursalRouter = express.Router();
sucursalRouter.post("/", getSucursales);
