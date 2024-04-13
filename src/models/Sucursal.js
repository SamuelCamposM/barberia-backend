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
      unique: true,
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
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Municipio",
        required: true,
      },
      name: String, // Aquí se almacena el nombre del municipio
    },
    depto: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Depto",
        required: true,
      },
      name: String, // Aquí se almacena el nombre del municipio
    },
  },
  {
    timestamps: true,
  }
);
SucursalSchema.plugin(mongooseAggregatePaginate);
export const SucursalModel = model("Sucursal", SucursalSchema);
