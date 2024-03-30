import { UsuarioModel, MensajeModel } from "../../models";

export const usuarioConectado = async (uid) => {
  const usuario = await UsuarioModel.findOneAndUpdate(
    { _id: uid },
    { online: true },
    { new: true }
  );
  return usuario;
};
export const usuarioDesconectado = async (uid) => {
  const usuario = await UsuarioModel.findOneAndUpdate(
    { _id: uid },
    { online: false },
    { new: true }
  );
  return usuario;
};

export const getUsuarios = async () => {
  const usuarios = await UsuarioModel.find().sort("-online");
  return usuarios;
};

export const grabarMensaje = async (payload) => {
  try {
    const mensaje = new MensajeModel(payload);
    await mensaje.save();
    return mensaje;
  } catch (error) {
    console.log({ error });
    return false;
  }
};
