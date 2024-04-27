import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const MarcaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  estado: {
    type: Boolean, // Aquí defines los valores permitidos
    default: true, // Valor por defecto
  },
});
MarcaSchema.plugin(mongooseAggregatePaginate);
