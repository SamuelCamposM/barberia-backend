// index.js
import { model } from "mongoose";
import { CierreCajaSchema } from "./CierreCajaSchema";
import "./pre";
import "./post";

export const CierreCajaModel = model("CierreCaja", CierreCajaSchema);
