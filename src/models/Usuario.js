import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
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
    rol: {
      type: Schema.Types.ObjectId,
      ref: "Rol",
    },
    estado: {
      type: Boolean, // Aquí defines los valores permitidos
      default: true, // Valor por defecto
    },
  },
  { timestamps: true }
);
UsuarioSchema.method("toJSON", function () {
  const { __v, ...rest } = this.toObject();
  return { ...rest, uid: rest._id };
});

export const UsuarioModel = model("Usuario", UsuarioSchema);
