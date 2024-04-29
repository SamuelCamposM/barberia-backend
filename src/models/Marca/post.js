import { ProductoModel } from "../Producto";
import { MarcaSchema } from "./MarcaSchema";

 
MarcaSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  // Encuentra todas las sucursales que tienen este departamento y actualiza el campo `depto.name`
  await ProductoModel.updateMany(
    { "marca._id": doc._id },
    { $set: { "marca.name": doc.name } }
  );
});
