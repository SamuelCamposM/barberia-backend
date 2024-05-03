import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const StockSchema = new Schema({
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: "Sucursal",
    required: true,
  },
  idProducto: {
    type: Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0,
  },
  unidad: {
    type: String,
    required: true,
  },
});
StockSchema.plugin(mongooseAggregatePaginate);
