import { Schema, model } from "mongoose";

const CitaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    fecha: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    estado: {
      type: String,
      enum: ["ACTIVO", "PENDIENTE", "FINALIZADA"], // Aquí defines los valores permitidos
      default: "ACTIVO", // Valor por defecto
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

export const CitaModel = model("Cita", CitaSchema);
