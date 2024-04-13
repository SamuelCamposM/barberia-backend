import { DeptoModel, MunicipioModel } from "../../models";

export const getDeptos = async (req, res = response) => {
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
    return res.status(500).json({
      error: "Hubo un error al obtener los departamenos",
    });
  }
};
export const searchDepto = async (req, res = response) => {
  console.log(req.body);
  const { search } = req.body;
  try {
    const response = await DeptoModel.find({ name: new RegExp(search, "i") })
      .select("-__v") // Excluye la propiedad __v
      .limit(15);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Hubo un error al obtener los departamentos",
    });
  }
};

// SOCKET
export const agregarDepto = async (item) => {
  try {
    const existeDepto = await DeptoModel.findOne({ name: item.name });
    if (existeDepto) {
      return {
        error: true,
        msg: `Ya existe este departamento`,
      };
    }
    const newDepto = new DeptoModel(item);
    await newDepto.save();
    return { item: newDepto, error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const editarDepto = async (item) => {
  try {
    const existeDepto = await DeptoModel.findOne({
      $and: [{ name: item.name }, { _id: { $ne: item._id } }],
    });
    if (existeDepto) {
      return {
        error: true,
        msg: `Ya existe este departamento`,
      };
    }
    await DeptoModel.findOneAndUpdate({ _id: item._id }, item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};

export const eliminarDepto = async (item) => {
  try {
    // Verifica si hay municipios asociados
    const municipios = await MunicipioModel.find({ depto: item._id });
    if (municipios.length > 0) {
      return {
        error: true,
        msg: "No se puede eliminar el departamento con municipios asociados",
      };
    }

    await DeptoModel.deleteOne(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: error?.codeName };
  }
};
