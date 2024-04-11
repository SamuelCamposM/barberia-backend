import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const SucursalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    tel: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true, // Valor por defecto
    },
    municipio: {
      type: Schema.Types.ObjectId,
      ref: "Municipio",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
SucursalSchema.plugin(mongooseAggregatePaginate);
export const SucursalModel = model("Sucursal", SucursalSchema);
