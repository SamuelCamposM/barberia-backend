import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const DetCompraSchema = new Schema(
  {
    compra: {
      type: Schema.Types.ObjectId,
      ref: "Compra",
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
  },
  {
    timestamps: true,
  }
);
DetCompraSchema.plugin(mongooseAggregatePaginate);
