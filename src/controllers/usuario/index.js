import { deleteFile } from "../../helpers";
import { UsuarioModel } from "../../models";
import bcryptjs from "bcryptjs";
export const getUsuariosTable = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    const aggregation = UsuarioModel.aggregate([
      {
        $match: {
          $or: [{ estado: true }],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await UsuarioModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Hubo un error al obtener los Usuarios",
    });
  }
};

// SOCKET
export const agregarUsuario = async (item) => {
  try {
    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    item.password = bcryptjs.hashSync(item.newPassword, salt);
    const newUsuario = new UsuarioModel(item);

    await newUsuario.save();
    return { item: newUsuario, error: false };
  } catch (error) {
    return { error: true, msg: "Hubo un error al agregar el Usuario" };
  }
};

export const editarUsuario = async ({ data, eliminados }) => {
  try {
    eliminados.forEach(async (element) => {
      await deleteFile(element);
    });

    console.log(data);
    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    const password =
      data.newPassword === ""
        ? data.password
        : bcryptjs.hashSync(data.newPassword, salt);
    await UsuarioModel.findOneAndUpdate(
      { _id: data._id },
      { ...data, password }
    );
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al editar el Usuario" };
  }
};

export const eliminarUsuario = async (item) => {
  try {
    // Verifica si hay municipios asociados
    await UsuarioModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al eliminar el Usuario" };
  }
};
