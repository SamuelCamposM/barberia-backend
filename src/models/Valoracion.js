import { Schema, model } from "mongoose";

const ValoracionSchema = new Schema(
  {
    calificacion: {
      type: Number,
      enum: [1, 2, 3, 4, 5], // Aquí defines los valores permitidos
      default: 1, // Valor por defecto
    },
    observacion: {
      type: String,
    },
    cita: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    rUser: {
      type: Schema.Types.ObjectId,
      ref: "Cita",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ValoracionModel = model("Valoracion", ValoracionSchema);
