import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const StockSchema = new Schema({
  sucursal: {
    type: Schema.Types.ObjectId,
    ref: "Sucursal",
    required: true,
  },
  producto: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0,
  },
  cantidadOld: {
    type: Number,
    default: 0,
  },
});
StockSchema.plugin(mongooseAggregatePaginate);
