import { CierreCajaModel } from "../CierreCaja";
import { VentaSchema } from "./VentaSchema";

VentaSchema.post("save", async function (doc) {
  // Buscar el cierre de caja del día para la sucursal específica
  let cierre = await CierreCajaModel.findOne({
    fecha: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lt: new Date().setHours(23, 59, 59, 999),
    },
    sucursal: doc.sucursal,
  });
  if (cierre) {
    // Si existe un cierre de caja para el día, actualizarlo
    if (doc.estado === true) {
      cierre.totalVentas += doc.gastoTotal;
      cierre.totalDinero += doc.gastoTotal;
    } else {
      cierre.totalVentas -= doc.gastoTotal;
      cierre.totalDinero -= doc.gastoTotal;
    }
    await cierre.save();
  } else {
    // Si no existe un cierre de caja para el día, crear uno nuevo
    if (doc.estado === true) {
      await CierreCajaModel.create({
        sucursal: doc.sucursal,
        totalVentas: doc.gastoTotal,
        totalDinero: doc.gastoTotal,
      });
    } else {
      await CierreCajaModel.create({
        sucursal: doc.sucursal,
        totalVentas: -doc.gastoTotal,
        totalDinero: -doc.gastoTotal,
      });
    }
  }
});
