import { ProductoModel } from "../Producto";
import { MarcaSchema } from "./MarcaSchema";

MarcaSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  await ProductoModel.updateMany(
    { "marca._id": doc._id },
    { $set: { "marca.name": doc.name } }
  );
});
