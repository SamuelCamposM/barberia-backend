import { CierreCajaModel } from "../../models";

export const getCierreCajas = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;

    const aggregation = CierreCajaModel.aggregate([
      {
        $lookup: {
          from: "sucursals",
          localField: "sucursal",
          foreignField: "_id",
          as: "sucursal",
        },
      },
      {
        $unwind: "$sucursal",
      },
      {
        $match: {
          "sucursal.name": new RegExp(busqueda, "i"),
        },
      },
      {
        $project: {
          _id: true,
          fecha: true,
          "sucursal._id": true,
          "sucursal.name": true,
          "sucursal.tel": true,
          totalDinero: true,
          totalCompras: true,
          totalVentas: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);
    const result = await CierreCajaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los cierres de caja",
    });
  }
};
