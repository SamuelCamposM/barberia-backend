import { CompraSchema } from "./CompraSchema";
import { DetCompraModel } from "../DetCompra";
import { StockModel } from "../Stock";

CompraSchema.post("findOneAndUpdate", async function (doc) {
  console.log({ doc });
  if (doc.estado === "FINALIZADA") {
    const detCompras = await DetCompraModel.find({ compra: doc._id });

    for (let detCompra of detCompras) {
      const stock = await StockModel.findOne({
        sucursal: doc.sucursal,
        producto: detCompra.producto,
      });

      if (stock) {
        // Si el stock ya existe, actualizamos la cantidad
        stock.cantidad += detCompra.cantidad;
        await stock.save();
      } else {
        // Si el stock no existe, creamos un nuevo registro
        const newStock = new StockModel({
          sucursal: doc.sucursal,
          producto: detCompra.producto,
          cantidad: detCompra.cantidad,
        });
        console.log({ newStock });
        await newStock.save();
      }
    }
  }
});
