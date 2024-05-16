import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const CitaSchema = new Schema(
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
    sucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },
    empleado: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estadoCita: {
      type: String,
      enum: ["PENDIENTE", "FINALIZADA", "ANULADA", "AUSENCIA"], // Aquí defines los valores permitidos
      default: "ACTIVA", // Valor por defecto
    },
    rUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
CitaSchema.plugin(mongooseAggregatePaginate);
