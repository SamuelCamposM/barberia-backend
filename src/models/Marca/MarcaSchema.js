import { Schema } from "mongoose";

export const MarcaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  estado: {
    type: Boolean, // Aquí defines los valores permitidos
    default: true, // Valor por defecto
  },
});
