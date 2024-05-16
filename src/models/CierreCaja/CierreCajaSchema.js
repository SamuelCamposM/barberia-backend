import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const CierreCajaSchema = new Schema(
  {
    fecha: {
      type: Date,
      default: Date.now,
      required: true,
    },
    sucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },
    totalDinero: {
      type: Number,
      default: 0,
    },
    totalCompras: {
      type: Number,
      default: 0,
    },
    totalVentas: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CierreCajaSchema.plugin(mongooseAggregatePaginate);
