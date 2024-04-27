import { CategoriaModel } from "../../models";

export const getCategorias = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    } = req.body;

    const aggregation = CategoriaModel.aggregate([
      {
        $match: {
          name: new RegExp(busqueda, "i"),
          estado,
        },
      },
      {
        $project: {
          _id: true,
          name: true,
          estado: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);
    const result = await CategoriaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las categorías",
    });
  }
};

export const searchCategoria = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await CategoriaModel.find({
      name: new RegExp(search, "i"),
      estado: true,
    })
      .select("-__v") // Excluye la propiedad __v
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las categorías",
    });
  }
};

// SOCKET
export const agregarCategoria = async (item) => {
  try {
    const newCategoria = new CategoriaModel(item);
    await newCategoria.save();
    return { item: newCategoria, error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la categoría",
    };
  }
};

export const editarCategoria = async (item) => {
  try {
    await CategoriaModel.findOneAndUpdate({ _id: item._id }, item, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar la categoría",
    };
  }
};

export const eliminarCategoria = async (item) => {
  try {
    await CategoriaModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la categoría",
    };
  }
};
