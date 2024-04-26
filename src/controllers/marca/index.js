import { MarcaModel } from "../../models";

export const getMarcas = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;

    const aggregation = MarcaModel.aggregate([
      {
        $match: {
          $and: [{ name: new RegExp(busqueda, "i") }],
        },
      },
      {
        $project: {
          _id: true,
          name: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);
    const result = await MarcaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las marcas",
    });
  }
};

export const searchMarca = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await MarcaModel.find({ name: new RegExp(search, "i") })
      .select("-__v") // Excluye la propiedad __v
      .limit(30);
    setTimeout(() => {
      res.status(200).json(response);
    }, 5000);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las marcas",
    });
  }
};

// SOCKET
export const agregarMarca = async (item) => {
  try {
    const newMarca = new MarcaModel(item);
    await newMarca.save();
    return { item: newMarca, error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la marca",
    };
  }
};

export const editarMarca = async (item) => {
  try {
    await MarcaModel.findOneAndUpdate({ _id: item._id }, item, { new: true });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar la marca",
    };
  }
};

export const eliminarMarca = async (item) => {
  try {
    await MarcaModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la marca",
    };
  }
};
