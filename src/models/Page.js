import { Schema, model } from "mongoose";
const PageSchema = new Schema(
  {
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
      type: [Schema.Types.ObjectId],
      ref: "Rol",
      default: [],
    },
    update: {
      type: [Schema.Types.ObjectId],
      ref: "Rol",
      default: [],
    },
    insert: {
      type: [Schema.Types.ObjectId],
      ref: "Rol",
      default: [],
    },
    select: {
      type: [Schema.Types.ObjectId],
      ref: "Rol",
      default: [],
    },
    ver: {
      type: [Schema.Types.ObjectId],
      ref: "Rol",
      default: [],
    },
  },
  { timestamps: true }
);

export const PageModel = model("Page", PageSchema);
