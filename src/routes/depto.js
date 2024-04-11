// HOST + "/api/"
import express from "express";
import { getDeptos } from "../controllers";
export const deptoRouter = express.Router();
deptoRouter.post("/", getDeptos);
