import { Schema, model } from "mongoose";

const MunicipioSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  depto: {
    type: Schema.Types.ObjectId,
    ref: "Depto",
    required: true,
  },
});

export const MunicipioModel = model("Municipio", MunicipioSchema);
