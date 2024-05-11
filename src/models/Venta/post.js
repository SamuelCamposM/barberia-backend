// import { VentaSchema } from "./VentaSchema";
// import { DetVentaModel } from "../DetVenta";
// import { StockModel } from "../Stock";

// VentaSchema.post("findOneAndUpdate", async function (doc) {
//   if (doc.estado === "FINALIZADA") {
//     const detVentas = await DetVentaModel.find({ venta: doc._id });

//     for (let detVenta of detVentas) {
//       const stock = await StockModel.findOne({
//         sucursal: doc.sucursal,
//         producto: detVenta.producto,
//       });

//       if (stock) {
//         // Si el stock ya existe, actualizamos la cantidad
//         stock.cantidad += detVenta.cantidad;
//         await stock.save();
//       } else {
//         // Si el stock no existe, creamos un nuevo registro
//         const newStock = new StockModel({
//           sucursal: doc.sucursal,
//           producto: detVenta.producto,
//           cantidad: detVenta.cantidad,
//         });
//         await newStock.save();
//       }
//     }
//   }
// });
