// change_streams/userChangeStream.js

import { SucursalModel } from "../Sucursal";
// En tu archivo de middleware
export async function updateSucursales(doc) {
  console.log({ doc });
  // Encuentra todas las sucursales que tienen este departamento

  const sucursales = await SucursalModel.find({ "depto._id": doc._id });

  console.log({ sucursales });
  // Actualiza el campo `depto.name` de cada sucursal
  sucursales.forEach(async (sucursal) => {
    sucursal.depto.name = doc.name;
    await sucursal.save();
  });
}
