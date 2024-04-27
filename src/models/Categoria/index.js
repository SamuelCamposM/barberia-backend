// index.js
import { model } from "mongoose";
import { CategoriaSchema } from "./CategoriaSchema";

import "./pre";
import "./post";

export const CategoriaModel = model("Categoria", CategoriaSchema);
