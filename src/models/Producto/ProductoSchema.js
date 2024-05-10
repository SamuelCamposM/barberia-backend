import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const ProductoSchema = new Schema(
  {
    photos: {
      type: [String],
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    marca: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Marca",
      },
      name: String, // Aquí se almacena el nombre de la marca
    },
    categoria: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
      },
      name: String, // Aquí se almacena el nombre de la categoria
    },
    tipoProducto: {
      type: String,
      enum: ["PRODUCTO", "SERVICIO"],
      required: true,
    },
    rUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    eUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
    stockTotal: { default: 0, type: Number },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
ProductoSchema.plugin(mongooseAggregatePaginate);
