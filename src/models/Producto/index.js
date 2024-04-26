// index.js
import { model } from "mongoose";
import { ProductoSchema } from "./ProductoSchema";
import "./pre";
import "./post";

export const ProductoModel = model("Producto", ProductoSchema);
