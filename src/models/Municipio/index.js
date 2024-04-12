import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
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
export const MunicipioModel = model("Municipio", MunicipioSchema);
