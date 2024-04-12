// HOST + "/api/"
import express from "express";
import { getDeptos, searchDepto } from "../controllers";
export const deptoRouter = express.Router();

deptoRouter.post("/", getDeptos);
deptoRouter.post("/search", searchDepto);
