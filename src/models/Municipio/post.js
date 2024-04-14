// MunicipioPostMiddlewares.js
import { SucursalModel } from "../Sucursal";
import { MunicipioSchema } from "./MunicipioSchema";

MunicipioSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  console.log({ doc });
  // Encuentra todas las sucursales que tienen este municipio y actualiza el campo `municipio.name`
  await SucursalModel.updateMany(
    { "municipio._id": doc._id },
    { $set: { "municipio.name": doc.name } }
  );
});
