// index.js
import { model } from "mongoose";
import { MarcaSchema } from "./MarcaSchema";

import "./pre";
import "./post";
export const MarcaModel = model("Marca", MarcaSchema);
