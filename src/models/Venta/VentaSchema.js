import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
export const VentaSchema = new Schema(
  {
    cliente: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
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
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
VentaSchema.plugin(mongooseAggregatePaginate);
