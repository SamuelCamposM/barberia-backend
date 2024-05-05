import { CategoriaModel } from ".";
import { ProductoModel } from "../Producto";
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

CategoriaSchema.pre("findOneAndDelete", async function (next) {
  const categoria = await this.model.findOne(this.getFilter());
  // Busca si hay algún producto que esté utilizando esta categoria
  const producto = await ProductoModel.findOne({
    "categoria._id": categoria._id,
  });
  // Si existe un producto con esta categoria, no permitas la eliminación
  if (producto) {
    throw new Error(
      "No se puede eliminar esta categoria porque está siendo utilizada por un producto"
    );
  }
  next();
});
