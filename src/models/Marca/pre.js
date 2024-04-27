import { MarcaModel } from ".";
import { ProductoModel } from "../Producto";
import { MarcaSchema } from "./MarcaSchema";

MarcaSchema.pre("findOneAndUpdate", async function (next) {
  const marcaUpdate = this.getUpdate();

  if (marcaUpdate.name) {
    const existingMarca = await MarcaModel.findOne({
      name: marcaUpdate.name,
    });

    if (
      existingMarca &&
      String(existingMarca._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe una marca con ese nombre");
    }
  }
  next();
});

MarcaSchema.pre("save", async function (next) {
  const marca = this;
  const existingMarca = await MarcaModel.findOne({
    name: marca.name,
  });

  if (existingMarca) {
    throw new Error("Ya existe una marca con ese nombre");
  }
  next();
});

MarcaSchema.pre("findOneAndDelete", async function (next) {
  const marca = await this.model.findOne(this.getFilter());
  console.log({ marca });
  // Busca si hay algún producto que esté utilizando esta marca
  const producto = await ProductoModel.findOne({ "marca._id": marca._id });
  console.log({ producto });
  // Si existe un producto con esta marca, no permitas la eliminación
  if (producto) {
    throw new Error(
      "No se puede eliminar esta marca porque está siendo utilizada por un producto"
    );
  }
  next();
});
