// index.js
import { model } from "mongoose";
import { DetVentaSchema } from "./DetVentaSchema";
import "./pre";
import "./post";

export const DetVentaModel = model("DetVenta", DetVentaSchema);
