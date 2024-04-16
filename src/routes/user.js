// HOST + "/api/"
import express from "express";
import { getUsers } from "../controllers";

export const userRouter = express.Router();
userRouter.post("/", getUsers);
