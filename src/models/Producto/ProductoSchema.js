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
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
      },
      name: String, // Aquí se almacena el nombre del usuario
      dui: String, // Aquí se almacena el dui del usuario
    },
    eUsuario: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
      },
      name: String, // Aquí se almacena el nombre del usuario
      dui: String, // Aquí se almacena el dui del usuario
    },
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
