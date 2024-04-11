import { SucursalModel } from "../../models";

export const getSucursales = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    console.log(req.body);
    const aggregation = SucursalModel.aggregate([
      {
        $match: {
          $or: [
            { name: new RegExp(busqueda, "i") },
            { tel: new RegExp(busqueda, "i") },
            { direccion: new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $lookup: {
          from: "municipios", // nombre de la colección de municipios
          localField: "municipio",
          foreignField: "_id",
          as: "municipio",
          pipeline: [
            {
              $lookup: {
                from: "deptos", // nombre de la colección de departamentos
                localField: "depto",
                foreignField: "_id",
                as: "depto",
              },
            },
            {
              $unwind: "$depto", // descomponer el array de departamentos
            },
            {
              $project: {
                name: true,
                _id: true,
                depto: true, // incluir los datos del departamento
              },
            },
          ],
        },
      },
      {
        $unwind: "$municipio", // descomponer el array de municipios
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
    res
      .status(500)
      .json({ ok: false, msg: "Hubo un error al obtener las pages" });
  }
};

// SOCKET
export const agregarSucursal = async (item) => {
  try {
    const newSucursal = new SucursalModel(item);
    await newSucursal.save();
    return { item: newSucursal, error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const editarSucursal = async (item) => {
  try {
    await SucursalModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const eliminarSucursal = async (item) => {
  try {
    // Verifica si hay municipios asociados

    await SucursalModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};
