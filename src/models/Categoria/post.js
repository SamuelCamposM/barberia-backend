import { ProductoModel } from "../Producto";
import { CategoriaSchema } from "./CategoriaSchema";

 
CategoriaSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  // Encuentra todas las sucursales que tienen este departamento y actualiza el campo `depto.name`
  await ProductoModel.updateMany(
    { "categoria._id": doc._id },
    { $set: { "categoria.name": doc.name } }
  );
});
