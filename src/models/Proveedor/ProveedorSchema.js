import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const ProveedorSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    estado: {
      type: Boolean, // Aquí defines los valores permitidos
      default: true, // Valor por defecto
    },
  },
  { timestamps: true }
);

ProveedorSchema.plugin(mongooseAggregatePaginate);
