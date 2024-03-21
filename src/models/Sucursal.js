import { Schema, model } from "mongoose";

const SucursalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    tel: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true, // Valor por defecto
    },
    municipio: {
      type: Schema.Types.ObjectId,
      ref: "Municipio",
      required: true,
    },
    rUser: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    eUser: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

export const SucursalModel = model("Sucursal", SucursalSchema);
