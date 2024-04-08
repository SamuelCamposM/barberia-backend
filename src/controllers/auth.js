import { response } from "express";
import { UsuarioModel } from "../models";
import bcryptjs from "bcryptjs";
import { deleteFile, generarJwt, userProps } from "../helpers";

export const createUser = async (req, res = response) => {
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
      ...userProps(usuario),
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

export const loginUser = async (req, res = response) => {
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
    res.json({
      ok: true,
      ...userProps(usuario),
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

  res.json({
    ok: true,
    ...userProps(usuario),
    token,
  });
};

export const actualizarUsuario = async (req, res) => {
  const { data, prevUrl } = req.body;
  try {
    await UsuarioModel.updateOne({ _id: data.uid }, data);
    await deleteFile(prevUrl);
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
