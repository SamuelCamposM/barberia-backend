import { SucursalModel } from ".";
import { SucursalSchema } from "./SucursalSchema";

SucursalSchema.pre("findOneAndUpdate", async function (next) {
  const sucursalUpdate = this.getUpdate();
  console.log({ sucursalUpdate });
  if (sucursalUpdate.name) {
    const existingSucursal = await SucursalModel.findOne({
      name: sucursalUpdate.name,
    });
    console.log({ existingSucursal });
    if (
      existingSucursal &&
      String(existingSucursal._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe una sucursal con ese nombre");
    }
  }
  next();
});

SucursalSchema.pre("save", async function (next) {
  const municipio = this;
  const existingSucursal = await SucursalModel.findOne({
    name: municipio.name,
  });
  if (existingSucursal) {
    throw new Error("Ya existe una sucursal con ese nombre");
  }
  next();
});
