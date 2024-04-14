// Municipios
import { response, request } from "express";
import { MunicipioModel } from "../../models";
import mongoose from "mongoose";

export const getMunicipios = async (req = request, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      depto,
    } = req.body;

    const aggregation = MunicipioModel.aggregate([
      {
        $match: {
          $and: [
            { name: new RegExp(busqueda, "i") },
            { depto: new mongoose.Types.ObjectId(depto) },
          ],
        },
      },
      {
        $project: {
          depto: true,
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

    const result = await MunicipioModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: "Hubo un error al obtener los municipios xd",
    });
  }
};

export const searchMunicipiosByDepto = async (
  req = request,
  res = response
) => {
  const { deptoId, search } = req.body;
  console.log(req.body);
  try {
    const data = await MunicipioModel.find({
      depto: deptoId,
      name: new RegExp(search, "i"),
    })
      .select(["-__v", "-depto"])
      .limit(15);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Hubo un error al obtener los municipios xd",
    });
  }
};

// SOCKET
export const agregarMunicipio = async (item) => {
  try {
    const newMunicipio = new MunicipioModel(item);
    await newMunicipio.save();
    return { item: newMunicipio, error: false };
  } catch (error) {
    console.log(String(error));
    return { error: true, msg: String(error) };
  }
};

export const editarMunicipio = async (item) => {
  try {
    await MunicipioModel.findOneAndUpdate({ _id: item._id }, item, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: String(error) };
  }
};

export const eliminarMunicipio = async (item) => {
  try {
    await MunicipioModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log(String(error));
    return { error: true, msg: String(error) };
  }
};
