import { CierreCajaModel } from "../CierreCaja";
import { CompraSchema } from "./CompraSchema";

CompraSchema.post("findOneAndUpdate", async function (doc) {
  if (doc.estado === "FINALIZADA") {
    console.log({ doc });
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
      cierre.totalCompras += doc.gastoTotal;
      cierre.totalDinero -= doc.gastoTotal;
      await cierre.save();
    } else {
      // Si no existe un cierre de caja para el día, crear uno nuevo
      await CierreCajaModel.create({
        sucursal: doc.sucursal,
        totalCompras: doc.gastoTotal,
        totalDinero: -doc.gastoTotal,
      });
    }
  }
});
