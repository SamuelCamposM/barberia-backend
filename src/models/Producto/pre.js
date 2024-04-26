import { ProductoModel } from ".";
import { ProductoSchema } from "./ProductoSchema";

ProductoSchema.pre("findOneAndUpdate", async function (next) {
  const productoUpdate = this.getUpdate();

  if (productoUpdate.name) {
    const existingProducto = await ProductoModel.findOne({
      name: productoUpdate.name,
    });

    if (
      existingProducto &&
      String(existingProducto._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un producto con ese nombre");
    }
  }
  next();
});

ProductoSchema.pre("save", async function (next) {
  const producto = this;
  const existingProducto = await ProductoModel.findOne({
    name: producto.name,
  });

  if (existingProducto) {
    throw new Error("Ya existe un producto con ese nombre");
  }
  next();
});
