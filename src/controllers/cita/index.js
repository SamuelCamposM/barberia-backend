import { CitaModel } from "../../models";

export const getCitas = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estadoCita,
      sucursal, // Agrega el _id de la sucursal aquí
    } = req.body;

    const matchCondition = {
      $and: [{ estadoCita }],
    };
    if (sucursal && sucursal !== "") {
      matchCondition.$and.push({ sucursal });
    }
    const aggregation = CitaModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "empleado",
          foreignField: "_id",
          as: "empleado",
        },
      },
      {
        $unwind: "$empleado",
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
        $unwind: "$sucursal",
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "rUsuario",
          foreignField: "_id",
          as: "rUsuario",
        },
      },
      {
        $unwind: "$rUsuario",
      },
      {
        $project: {
          titulo: 1,
          fecha: 1,
          hora: 1,
          description: 1,
          sucursal: {
            _id: 1,
            name: 1,
            tel: 1,
          },
          estadoCita: 1,
          empleado: {
            _id: 1,
            name: 1,
            lastname: 1,
            dui: 1,
            tel: 1,
          },
          rUsuario: {
            _id: 1,
            name: 1,
            lastname: 1,
            tel: 1,
          },
          createdAt: true,
        },
      },
      {
        $match: {
          $or: [
            { "empleado.name": new RegExp(busqueda, "i") },
            { "empleado.lastname": new RegExp(busqueda, "i") },
            { "rUsuario.name": new RegExp(busqueda, "i") },
            { "rUsuario.lastname": new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);
    const result = await CitaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las citas",
    });
  }
};

export const searchCita = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await CitaModel.find({
      "empleado.name": new RegExp(search, "i"),
      estadoCita: true,
    })
      .select([
        "titulo",
        "fecha",
        "description",
        "sucursal",
        "estadoCita",
        "empleado",
      ])
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
export const agregarCita = async (data) => {
  console.log({ data });
  try {
    const cita = {
      ...data,
      empleado: data.empleado._id,
      sucursal: data.sucursal._id,
      rUsuario: data.rUsuario._id,
    }; 
    const newCita = new CitaModel(cita);
    await newCita.save();
    return {
      item: {
        ...data,
        _id: newCita._id,
        createdAt: newCita.createdAt,
      },
      error: false,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la cita",
    };
  }
};

export const editarCita = async ({ data }) => {
  try {
    const cita = {
      ...data,
      empleado: data.empleado._id,
      sucursal: data.sucursal._id,
      rUsuario: data.rUsuario._id,
    };
    await CitaModel.findOneAndUpdate({ _id: data._id }, cita, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar la cita",
    };
  }
};

export const eliminarCita = async (item) => {
  try {
    await CitaModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la cita",
    };
  }
};
