import { MarcaModel } from ".";
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
