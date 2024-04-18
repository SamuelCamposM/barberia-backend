import { Schema, model } from "mongoose";
import { roles } from "../helpers/usuarioProps";
const PageSchema = new Schema(
  {
    componente: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    icono: {
      type: String,
      required: true,
    },
    categoriaPadre: {
      type: Schema.Types.ObjectId,
      ref: "Page",
    },
    orden: {
      type: Number,
      required: 1,
    },
    delete: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    update: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    insert: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    select: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    ver: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
  },
  { timestamps: true }
);

export const PageModel = model("Page", PageSchema);
