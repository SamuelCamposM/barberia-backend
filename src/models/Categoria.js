import { Schema, model } from "mongoose";

const CategoriaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const CategoriaModel = model("Categoria", CategoriaSchema);
