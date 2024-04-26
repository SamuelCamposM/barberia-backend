// DeptoPostMiddlewares.js
import { SucursalModel } from "../Sucursal";
import { DeptoSchema } from "./DeptoSchema";

DeptoSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  // Encuentra todas las sucursales que tienen este departamento y actualiza el campo `depto.name`
  await SucursalModel.updateMany(
    { "depto._id": doc._id },
    { $set: { "depto.name": doc.name } }
  );
});
