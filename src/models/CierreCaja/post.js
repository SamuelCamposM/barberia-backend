// import { CierreCajaSchema } from "./CierreCajaSchema";
// import { DetCierreCajaModel } from "../DetCierreCaja";
// import { StockModel } from "../Stock";

// CierreCajaSchema.post("findOneAndUpdate", async function (doc) {
//   if (doc.estado === "FINALIZADA") {
//     const detCierreCajas = await DetCierreCajaModel.find({ venta: doc._id });

//     for (let detCierreCaja of detCierreCajas) {
//       const stock = await StockModel.findOne({
//         sucursal: doc.sucursal,
//         producto: detCierreCaja.producto,
//       });

//       if (stock) {
//         // Si el stock ya existe, actualizamos la cantidad
//         stock.cantidad += detCierreCaja.cantidad;
//         await stock.save();
//       } else {
//         // Si el stock no existe, creamos un nuevo registro
//         const newStock = new StockModel({
//           sucursal: doc.sucursal,
//           producto: detCierreCaja.producto,
//           cantidad: detCierreCaja.cantidad,
//         });
//         await newStock.save();
//       }
//     }
//   }
// });
