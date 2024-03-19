import { Schema, model } from "mongoose";
const RolSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
});

export const RolModel = model("Rol", RolSchema);
