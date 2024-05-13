import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const DetVentaSchema = new Schema({
  venta: {
    type: Schema.Types.ObjectId,
    ref: "Venta",
    required: true,
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
  },
  precioUnidad: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  total: {
    type: Number,
  },
});
DetVentaSchema.plugin(mongooseAggregatePaginate);
