// MunicipioSchema.js
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const MunicipioSchema = new Schema({
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

MunicipioSchema.plugin(mongooseAggregatePaginate);
