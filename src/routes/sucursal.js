// HOST + "/api/"
import express from "express";
import { getSucursales } from "../controllers";

export const userRouter = express.Router();
userRouter.post("/", getSucursales);
