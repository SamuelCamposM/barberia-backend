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

export const searchMunicipiosByDepto = async (
  req = request,
  res = response
) => {
  const { deptoId, search } = req.body;
  try {
    const data = await MunicipioModel.find({
      depto: deptoId,
      name: new RegExp(search, "i"),
    })
      .select(["-__v", "-depto"])
      .limit(15);
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
    const existeMunicipio = await MunicipioModel.findOne({ name: item.name });
    if (existeMunicipio) {
      return {
        error: true,
        msg: `Ya existe este municipio`,
      };
    }
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
    const existeMunicipio = await MunicipioModel.findOne({
      $and: [{ name: item.name }, { _id: { $ne: item._id } }],
    });
    if (existeMunicipio) {
      return {
        error: true,
        msg: `Ya existe este municipio`,
      };
    }
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
