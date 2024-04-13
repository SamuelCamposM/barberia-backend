import { SucursalModel } from "../../models";

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
            { "municipio.deptoName": new RegExp(busqueda, "i") },
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

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Hubo un error al obtener las sucursales",
    });
  }
};

// SOCKET
export const agregarSucursal = async (item) => {
  try {
    const existeSucursal = await SucursalModel.findOne({
      $or: [{ name: item.name }, { tel: item.tel }],
    });
    if (existeSucursal) {
      return {
        error: true,
        msg: `Ya existe una sucursal con este nombre o telefono`,
      };
    }

    const newSucursal = new SucursalModel(item);

    await newSucursal.save();
    return { item: newSucursal, error: false };
  } catch (error) {
    return { error: true, msg: "Hubo un error al agregar la sucursal" };
  }
};

export const editarSucursal = async (item) => {
  try {
    await SucursalModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al editar la sucursal" };
  }
};

export const eliminarSucursal = async (item) => {
  try {
    // Verifica si hay municipios asociados

    await SucursalModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: "Hubo un error al eliminar la sucursal" };
  }
};
