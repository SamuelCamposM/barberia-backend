import { response } from "express";
import { UsuarioModel } from "../models";
import bcryptjs from "bcryptjs";
import { deleteFile, generarJwt, usuarioProps } from "../helpers";

export const createUsuario = async (req, res = response) => {
  const { email } = req.body;
  try {
    let usuario = await UsuarioModel.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo",
      });
    }

    usuario = new UsuarioModel(req.body);

    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.password, salt);
    await usuario.save();

    //TODO: GENERAR JWT
    const token = await generarJwt(usuario.id);
    res.status(201).json({
      ok: true,
      ...usuarioProps(usuario),
      token,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

export const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await UsuarioModel.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese correo",
      });
    }
    // MATCH PASSWORD

    const validPassword = bcryptjs.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }
    //TODO: GENERAR JWT
    const token = await generarJwt(usuario.id);
    console.log(token);
    console.log(usuario);
    res.json({
      ok: true,
      ...usuarioProps(usuario),
      token,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

export const renewToken = async (req, res = response) => {
  const { uid } = req;
  //TODO: GENERAR JWT
  const token = await generarJwt(uid);
  let usuario = await UsuarioModel.findOne({ _id: uid });
  console.log({ usuario });
  res.json({
    ok: true,
    ...usuarioProps(usuario),
    token,
  });
};

export const actualizarUsuario = async (req, res) => {
  const { data, eliminados } = req.body;
  try {
    eliminados.forEach(async (element) => {
      await deleteFile(element);
    });

    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    const password =
      data.newPassword === ""
        ? data.password
        : bcryptjs.hashSync(data.newPassword, salt);
    await UsuarioModel.updateOne({ _id: data.uid }, { ...data, password });
    return res.status(200).json({
      error: false,
      msg: "Actualizado con exito",
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      error: true,
      msg: "Hubo un error",
    });
  }
};
export const comparePassword = async (req, res) => {
  const { uid, newPassword } = req.body;
  const usuario = await UsuarioModel.findOne({ _id: uid });
  const validPassword = bcryptjs.compareSync(newPassword, usuario.password);
  if (validPassword) {
    return res.status(200).json({ error: false });
  }
  return res.status(401).json({ error: true });
};
