import { MunicipioModel } from "../../models";

// Municipios
export const getMunicipios = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    // const aggregation = DeptoModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "municipios",
    //       let: { depto_id: "$_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$depto", "$$depto_id"] },
    //                 {
    //                   $or: [
    //                     // Busca por el nombre del municipio
    //                     {
    //                       $regexMatch: {
    //                         input: "$name",
    //                         regex: new RegExp(busqueda, "i"),
    //                       },
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 1,
    //             // name: 1,
    //             // depto: 1,
    //           },
    //         },
    //         // {
    //         //   $sort: {
    //         //     name: -1, // 1 para ascendente, -1 para descendente
    //         //   },
    //         // },
    //       ],
    //       as: "filteredMunicipios",
    //     },
    //   },
    //   {
    //     $project: {
    //       totalMunicipios: { $size: "$filteredMunicipios" },
    //       _id: true,
    //       name: true,
    //       // filteredMunicipios: -1,
    //     },
    //   },
    //   {
    //     $match: {
    //       $or: [
    //         // Busca por el nombre del departamento
    //         { name: new RegExp(busqueda, "i") },
    //         // Si totalMunicipios > 0, incluye el departamento
    //         { totalMunicipios: { $gt: 0 } },
    //       ],
    //     },
    //   },
    //   {
    //     $sort: {
    //       name: 1, // 1 para ascendente, -1 para descendente
    //     },
    //   },
    // ]);

    // const result = await DeptoModel.aggregatePaginate(aggregation, {
    //   page,
    //   limit,
    // });
    // retrn res.status(200).json({ result });
    const aggregation = DeptoModel.aggregate([
      {
        $match: {
          $or: [
            // Busca por el nombre del departamento
            { name: new RegExp(busqueda, "i") },
            // Si totalMunicipios > 0, incluye el departamento
          ],
        },
      },

      {
        $lookup: {
          from: "municipios",
          localField: "_id",
          foreignField: "depto",
          as: "filteredMunicipios",
        },
      },

      {
        $project: {
          totalMunicipios: { $size: "$filteredMunicipios" },
          _id: true,
          name: true,
          // filteredMunicipios: -1,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1, // 1 para ascendente, -1 para descendente
        },
      },
    ]);

    const result = await DeptoModel.aggregatePaginate(aggregation, {
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
export const agregarMunicipio = async (item) => {
  try {
    const newMunicipio = new MunicipioModel(item);
    await newMunicipio.save();
    return { item: newMunicipio, error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const editarMunicipio = async (item) => {
  try {
    await MunicipioModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const eliminarMunicipio = async (item) => {
  try {
    await MunicipioModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};
