import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { SucursalModel } from "../Sucursal";
const MunicipioSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  depto: {
    type: Schema.Types.ObjectId,
    ref: "Depto",
    required: true,
    index: true,
  },
});
// Aplica el plugin a tu esquema
MunicipioSchema.plugin(mongooseAggregatePaginate);
MunicipioSchema.post("findOneAndUpdate", async function updateSucursales(doc) {
  try {
    console.log({ doc });
    // Encuentra todas las sucursales que tienen este departamento y actualiza el campo `depto.name`
    await SucursalModel.updateMany(
      { "municipio._id": doc._id },
      { $set: { "municipio.name": doc.name } }
    );
  } catch (error) {
    console.error(`Error updating sucursales: ${error}`);
  }
});


export const MunicipioModel = model("Municipio", MunicipioSchema);
