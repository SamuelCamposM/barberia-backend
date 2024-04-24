import { SucursalModel } from ".";
import { SucursalSchema } from "./SucursalSchema";
SucursalSchema.pre("findOneAndUpdate", async function (next) {
  const sucursalUpdate = this.getUpdate();
  console.log({ sucursalUpdate });

  if (sucursalUpdate.name || sucursalUpdate.tel || sucursalUpdate.municipio) {
    const existingSucursal = await SucursalModel.findOne({
      $or: [
        { name: sucursalUpdate.name },
        { tel: sucursalUpdate.tel },
        { "municipio._id": sucursalUpdate.municipio?._id },
      ],
    });
    console.log({ existingSucursal });

    if (
      existingSucursal &&
      String(existingSucursal._id) !== String(this.getQuery()._id)
    ) {
      throw new Error(
        "Ya existe una sucursal con ese nombre, teléfono o municipio"
      );
    }
  }
  next();
});

SucursalSchema.pre("save", async function (next) {
  const sucursal = this;
  const existingSucursal = await SucursalModel.findOne({
    $or: [
      { name: sucursal.name },
      { tel: sucursal.tel },
      { "municipio._id": sucursal.municipio?._id },
    ],
  });

  if (existingSucursal) {
    throw new Error(
      "Ya existe una sucursal con ese nombre, teléfono o municipio"
    );
  }
  next();
});
