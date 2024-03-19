import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Schema.Types.ObjectId,
      ref: "Rol",
    },
  },
  { timestamps: true }
);
UsuarioSchema.method("toJSON", function () {
  const { __v, ...rest } = this.toObject();
  return { ...rest, uid: rest._id };
});

export const UsuarioModel = model("Usuario", UsuarioSchema);
