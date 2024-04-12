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
    res
      .status(500)
      .json({ ok: false, msg: "Hubo un error al obtener las páginas" });
  }
};

export const searchMunicipiosByDepto = async (req = request, res = response) => {
  const { deptoId } = req.body;
  try {
    const res = await MunicipioModel.find({ depto: deptoId }).limit(15);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      msg: "Hubo un error al consultar los municipios por departamento",
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
