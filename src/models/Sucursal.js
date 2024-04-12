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
      id: {
        type: Schema.Types.ObjectId,
        ref: "Municipio",
        required: true,
      },
      name: String, // Aquí se almacena el nombre del municipio
      deptoName: String, // Aquí se almacena el nombre del departamento
    },
  },
  {
    timestamps: true,
  }
);
SucursalSchema.plugin(mongooseAggregatePaginate);
export const SucursalModel = model("Sucursal", SucursalSchema);
