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

  if (
    usuarioUpdate.dui &&
    ["GERENTE", "EMPLEADO"].includes(usuarioUpdate.rol)
  ) {
    const existingUsuario = await UsuarioModel.findOne({
      dui: usuarioUpdate.dui,
    });

    if (
      existingUsuario &&
      String(existingUsuario._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un usuario con ese DUI");
    }
  }

  next();
});

UsuarioSchema.pre("save", async function (next) {
  const usuario = this;

  const existingUsuarioEmail = await UsuarioModel.findOne({
    email: usuario.email,
  });

  if (existingUsuarioEmail) {
    throw new Error("Ya existe un usuario con ese correo electrónico");
  }

  if (usuario.dui && ["GERENTE", "EMPLEADO"].includes(usuario.rol)) {
    const existingUsuarioDUI = await UsuarioModel.findOne({
      dui: usuario.dui,
    });

    if (existingUsuarioDUI) {
      throw new Error("Ya existe un usuario con ese DUI");
    }
  }

  next();
});
