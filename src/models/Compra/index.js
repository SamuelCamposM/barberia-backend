// index.js
import { model } from "mongoose";
import { CompraSchema } from "./CompraSchema";
import "./pre";
import "./post";

export const CompraModel = model("Compra", CompraSchema);
