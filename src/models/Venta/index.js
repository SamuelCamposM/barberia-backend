// index.js
import { model } from "mongoose";
import { VentaSchema } from "./VentaSchema";
import "./pre";
import "./post";

export const VentaModel = model("Venta", VentaSchema);
