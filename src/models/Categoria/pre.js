import { CategoriaModel } from ".";
import { CategoriaSchema } from "./CategoriaSchema";

CategoriaSchema.pre("findOneAndUpdate", async function (next) {
  const categoriaUpdate = this.getUpdate();

  if (categoriaUpdate.name) {
    const existingCategoria = await CategoriaModel.findOne({
      name: categoriaUpdate.name,
    });

    if (
      existingCategoria &&
      String(existingCategoria._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe una categoría con ese nombre");
    }
  }
  next();
});

CategoriaSchema.pre("save", async function (next) {
  const categoria = this;
  const existingCategoria = await CategoriaModel.findOne({
    name: categoria.name,
  });

  if (existingCategoria) {
    throw new Error("Ya existe una categoría con ese nombre");
  }
  next();
});
