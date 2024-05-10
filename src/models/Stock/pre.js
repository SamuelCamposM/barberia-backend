import { ProductoModel } from "../Producto";
import { StockSchema } from "./StockSchema";

StockSchema.pre("save", async function (next) {
  const stock = this;
  try {
    console.log({ stock });

    // Encuentra el producto asociado con este stock y actualiza el stockTotal
    await ProductoModel.updateOne(
      { _id: stock.producto },
      { $inc: { stockTotal: stock.cantidad - stock.cantidadOld } }
    );

    // Asigna cantidad a cantidadOld en el stock
    stock.cantidadOld = stock.cantidad;

    next();
  } catch (error) {
    console.log(error);
    throw new Error("Hubo un error al actualizar el stock de la persona");
  }
  next();
});
