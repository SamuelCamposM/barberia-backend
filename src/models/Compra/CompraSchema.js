import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
export const estados = ["EN PROCESO", "FINALIZADA", "ANULADA"];
export const CompraSchema = new Schema(
  {
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    sucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },
    totalProductos: {
      default: 0,
      type: Number,
    },
    gastoTotal: { default: 0, type: Number },
    rUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    eUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    estado: {
      type: String,
      enum: estados,
      default: "EN PROCESO",
    },
  },
  {
    timestamps: true,
  }
);
CompraSchema.plugin(mongooseAggregatePaginate);
