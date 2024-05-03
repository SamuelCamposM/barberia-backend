// index.js
import { model } from "mongoose";
import { ProveedorSchema } from "./ProveedorSchema";
import "./pre";
import "./post";

export const ProveedorModel = model("Proveedor", ProveedorSchema);
