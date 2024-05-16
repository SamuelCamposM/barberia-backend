import { deleteFile } from "../../helpers";
import { UsuarioModel } from "../../models";
import bcryptjs from "bcryptjs";

export const getUsuariosTable = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      rol,
      estado,
    } = req.body;

    const aggregation = UsuarioModel.aggregate([
      {
        $match: {
          $and: [{ estado }, { rol }],
          $or: [
            { name: new RegExp(busqueda, "i") },
            { lastname: new RegExp(busqueda, "i") },
            { email: new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $lookup: {
          from: "sucursals",
          localField: "sucursal",
          foreignField: "_id",
          as: "sucursal",
        },
      },
      {
        $unwind: {
          path: "$sucursal",
          preserveNullAndEmptyArrays: true, // Preserva los documentos que no tienen una sucursal
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
      error: true,
      msg: String(error) || "Hubo un error al obtener los Usuarios",
    });
  }
};

// SOCKET
export const agregarUsuario = async (item) => {
  const usuario = {
    ...item,
    sucursal: item?.sucursal?._id,
  };
  try {
    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(usuario.newPassword, salt);

    const newUsuario = new UsuarioModel(usuario);
    await newUsuario.save();
    return { item: newUsuario, error: false };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      msg: String(error) || "Hubo un error al agregar el usuario",
    };
  }
};

export const editarUsuario = async ({ data, eliminados }) => {
  try {
    eliminados.forEach(async (element) => {
      await deleteFile(element);
    });

    const usuario = {
      ...data,
      sucursal: data?.sucursal?._id,
    };
    // ENCRIPTAR password
    const salt = bcryptjs.genSaltSync();
    const password =
      usuario.newPassword === ""
        ? usuario.password
        : bcryptjs.hashSync(usuario.newPassword, salt);

    await UsuarioModel.findOneAndUpdate(
      { _id: usuario._id },
      { ...usuario, password }
    );
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar el usuario",
    };
  }
};

export const eliminarUsuario = async (item) => {
  try {
    // Verifica si hay municipios asociados
    await UsuarioModel.findOneAndUpdate({ _id: data._id }, { estado: false });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la usuario",
    };
  }
};

export const searchCliente = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await UsuarioModel.find({
      $or: [
        { name: new RegExp(search, "i") },
        { lastname: new RegExp(search, "i") },
      ],
      rol: "CLIENTE",
      estado: true,
    })
      .select(["name", "lastname", "tel"])
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los clientes",
    });
  }
};
export const searchEmpleadoBySucursal = async (req, res = response) => {
  const { search, sucursal } = req.body;
  try {
    const response = await UsuarioModel.find({
      $or: [
        { name: new RegExp(search, "i") },
        { lastname: new RegExp(search, "i") },
      ],
      sucursal,
      rol: "EMPLEADO",
      estado: true,
    })
      .select(["dui", "name", "lastname", "tel"])
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las citas",
    });
  }
};
