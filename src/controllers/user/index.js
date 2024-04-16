import { UsuarioModel } from "../../models";

export const getUsers = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    const aggregation = UsuarioModel.aggregate([
      {
        $match: {
          $or: [],
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
      error: "Hubo un error al obtener los Users",
    });
  }
};

// SOCKET
export const agregarUser = async (item) => {
  try {
    const newUser = new UsuarioModel(item);

    await newUser.save();
    return { item: newUser, error: false };
  } catch (error) {
    return { error: true, msg: "Hubo un error al agregar el User" };
  }
};

export const editarUser = async (item) => {
  try {
    await UsuarioModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al editar el User" };
  }
};

export const eliminarUser = async (item) => {
  try {
    // Verifica si hay municipios asociados
    await UsuarioModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al eliminar el User" };
  }
};
