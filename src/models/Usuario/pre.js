import { UsuarioModel } from ".";
import { UsuarioSchema } from "./UsuarioSchema";

UsuarioSchema.pre("findOneAndUpdate", async function (next) {
  const usuarioUpdate = this.getUpdate();

  if (usuarioUpdate.email) {
    const existingUsuario = await UsuarioModel.findOne({
      email: usuarioUpdate.email,
    });

    if (
      existingUsuario &&
      String(existingUsuario._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un usuario con ese correo electrónico");
    }
  }
  next();
});

UsuarioSchema.pre("save", async function (next) {
  const usuario = this;
  const existingUsuario = await UsuarioModel.findOne({
    email: usuario.email,
  });

  if (existingUsuario) {
    throw new Error("Ya existe un usuario con ese correo electrónico");
  }
  next();
});
