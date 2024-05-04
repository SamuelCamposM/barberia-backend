import { SucursalModel } from "../../models/Sucursal";

export const getSucursales = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    const aggregation = SucursalModel.aggregate([
      {
        $match: {
          $or: [
            { name: new RegExp(busqueda, "i") },
            { tel: new RegExp(busqueda, "i") },
            { direccion: new RegExp(busqueda, "i") },
            { "municipio.name": new RegExp(busqueda, "i") },
            { "depto.name": new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await SucursalModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las sucursales",
    });
  }
};

// SOCKET
export const searchSucursal = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await SucursalModel.find({
      name: new RegExp(search, "i"),
      estado: true,
    })
      .select(["name", "tel"])
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las sucursales",
    });
  }
};
export const agregarSucursal = async (item) => {
  try {
    const newSucursal = new SucursalModel(item);
    await newSucursal.save();
    return { item: newSucursal, error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la sucursal",
    };
  }
};
export const editarSucursal = async (item) => {
  try {
    await SucursalModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la sucursal",
    };
  }
};

export const eliminarSucursal = async (item) => {
  try {
    // Verifica si hay municipios asociados

    await SucursalModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la sucursal",
    };
  }
};
