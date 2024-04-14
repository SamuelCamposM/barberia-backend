// MunicipioPreMiddlewares.js
import { MunicipioModel } from ".";
import { SucursalModel } from "../Sucursal";
import { MunicipioSchema } from "./MunicipioSchema";

MunicipioSchema.pre("findOneAndUpdate", async function (next) {
  const municipioUpdate = this.getUpdate();
  if (municipioUpdate.name) {
    const existingMunicipio = await MunicipioModel.findOne({ name: municipioUpdate.name });
    if (
      existingMunicipio &&
      String(existingMunicipio._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un municipio con ese nombre");
    }
  }
  next();
});

MunicipioSchema.pre("save", async function (next) {
  const municipio = this;
  const existingMunicipio = await MunicipioModel.findOne({ name: municipio.name });
  if (existingMunicipio) {
    throw new Error("Ya existe un municipio con ese nombre");
  }
  next();
});

MunicipioSchema.pre("findOneAndDelete", async function (next) {
  const municipio = await this.model.findOne(this.getFilter());
  const existingSucursal = await SucursalModel.findOne({
    "municipio._id": municipio._id,
  });
  if (existingSucursal) {
    throw new Error(
      "No se puede eliminar el municipio porque ya hay una sucursal que tiene este municipio"
    );
  }
  next();
});
