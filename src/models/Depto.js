import { Schema, model } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const DeptoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
// Aplica el plugin a tu esquema
DeptoSchema.plugin(mongooseAggregatePaginate);
export const DeptoModel = model("Depto", DeptoSchema);
