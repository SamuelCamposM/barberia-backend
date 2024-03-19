import { Schema, model } from "mongoose";

const MarcaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const MarcaModel = model("Marca", MarcaSchema);
