import { Schema, model } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { updateSucursales } from "./streams";
import { SucursalModel } from "../Sucursal";
const DeptoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
// Aplica el plugin a tu esquema
DeptoSchema.plugin(mongooseAggregatePaginate);
DeptoSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  console.log({ doc });
  // Encuentra todas las sucursales que tienen este departamento y actualiza el campo `depto.name`
  await SucursalModel.updateMany(
    { "depto._id": doc._id },
    { $set: { "depto.name": doc.name } }
  );
});

export const DeptoModel = model("Depto", DeptoSchema);
