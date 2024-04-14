// DeptoPreMiddlewares.js
import { DeptoModel } from ".";
import { MunicipioModel } from "../Municipio";
import { SucursalModel } from "../Sucursal";
import { DeptoSchema } from "./DeptoSchema";

DeptoSchema.pre("findOneAndUpdate", async function (next) {
  const deptoUpdate = this.getUpdate();
  if (deptoUpdate.name) {
    const existingDepto = await DeptoModel.findOne({ name: deptoUpdate.name });
    if (
      existingDepto &&
      String(existingDepto._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un departamento con ese nombre");
    }
  }
  next();
});

DeptoSchema.pre("save", async function (next) {
  const depto = this;
  const existingDepto = await DeptoModel.findOne({ name: depto.name });
  if (existingDepto) {
    throw new Error("Ya existe un departamento con ese nombre");
  }
  next();
});

DeptoSchema.pre("findOneAndDelete", async function (next) {
  console.log({ getFilter: this.getFilter() });
  const depto = await this.model.findOne(this.getFilter()); 
  const existingMunicipio = await MunicipioModel.findOne({
    depto: depto._id,
  });
  if (existingMunicipio) {
    throw new Error(
      "No se puede eliminar el departamento porque ya hay municipios asociados a este departamento"
    );
  }
  const existingSucursal = await SucursalModel.findOne({
    "depto._id": depto._id,
  });
  if (existingSucursal) {
    throw new Error(
      "No se puede eliminar el departamento porque ya hay una sucursal que tiene este departamento"
    );
  }
  next();
});
