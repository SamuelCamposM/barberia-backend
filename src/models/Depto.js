import { Schema, model } from "mongoose";

const DeptoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const DeptoModel = model("Depto", DeptoSchema);
