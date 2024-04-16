// index.js
import { model } from "mongoose";
import { SucursalSchema } from "./SucursalSchema";
import "./pre";
import "./post";

export const SucursalModel = model("Sucursal", SucursalSchema);
