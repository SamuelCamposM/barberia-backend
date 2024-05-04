// index.js
import { model } from "mongoose";
import { DetCompraSchema } from "./DetCompraSchema";
import "./pre";
import "./post";

export const DetCompraModel = model("DetCompra", DetCompraSchema);
