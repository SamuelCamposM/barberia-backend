import { Schema, model } from "mongoose";

const ProductoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
      type: Schema.Types.ObjectId,
      ref: "Marca",
      required: true,
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
    tipoProducto: {
      type: Schema.Types.ObjectId,
      enum: ["PRODUCTO", "SERVICIO"],
      default: "PRODUCTO",
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
  },
  {
    timestamps: true,
  }
);

export const ProductoModel = model("Producto", ProductoSchema);
