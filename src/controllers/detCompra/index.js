// DetCompra
import { response, request } from "express";
import { CompraModel, DetCompraModel } from "../../models";
import mongoose from "mongoose";
import { CompraSchema } from "../../models/Compra/CompraSchema";

export const getDetCompras = async (req = request, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      compra,
    } = req.body;
    const aggregation = DetCompraModel.aggregate([
      {
        $match: {
          compra: new mongoose.Types.ObjectId(compra),
        },
      },
      {
        $lookup: {
          from: "productos", // Asegúrate de que el nombre de la colección sea correcto
          localField: "producto",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          compra: true,
          _id: true,
          producto: {
            _id: true,
            name: true,
          },
          total: true,
          cantidad: true,
          precioUnidad: true,
        },
      },
      {
        $match: {
          "producto.name": new RegExp(busqueda, "i"),
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await DetCompraModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg:
        String(error) || "Hubo un error al obtener los detalles de las compras",
    });
  }
};

// SOCKET

// item = objeto detCompra
export const agregarDetCompra = async ({ data, dataCompra }) => {
  try {
    const dataCompraRes = {
      totalProductos: dataCompra.totalProductos + data.cantidad,
      gastoTotal: dataCompra.gastoTotal + data.total,
    };

    await CompraModel.updateOne({ _id: data.compra }, dataCompraRes);
    // Adaptar el objeto data al esquema de Compra
    const detCompra = {
      ...data,
      producto: data.producto._id,
    };
    const newCompra = new DetCompraModel(detCompra);
    await newCompra.save();
    return {
      item: { ...data, _id: newCompra._id },
      error: false,
      dataCompraRes,
    };
  } catch (error) {
    return {
      error: true,
      msg: String(error) || "error al agregar detalle de compra",
    };
  }
};

// item = objeto detCompra
export const editarDetCompra = async ({
  data,
  dataCompra,
  dataDetCompraOld,
}) => {
  try {
    const dataCompraRes = {
      totalProductos:
        dataCompra.totalProductos + data.cantidad - dataDetCompraOld.cantidad,
      gastoTotal: dataCompra.gastoTotal + data.total - dataDetCompraOld.total,
    };

    await CompraModel.updateOne({ _id: data.compra }, dataCompraRes);
    await DetCompraModel.findOneAndUpdate({ _id: data._id }, data, {
      new: true,
    });
    return { error: false, dataCompraRes };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "error al editar detalle de compra",
    };
  }
};

// item = {_id:_id}
export const eliminarDetCompra = async ({
  _id,
  compra,
  dataCompra,
  dataDetCompraOld,
}) => {
  try {
    const dataCompraRes = {
      totalProductos: dataCompra.totalProductos - dataDetCompraOld.cantidad,
      gastoTotal: dataCompra.gastoTotal - dataDetCompraOld.total,
    };

    await CompraModel.updateOne({ _id: compra }, dataCompraRes);
    const res = await DetCompraModel.findOneAndDelete(_id);
    console.log({ res });
    return { error: false, dataCompraRes };
  } catch (error) {
    return {
      error: true,
      msg: String(error) || "error al eliminar detalle de compra",
    };
  }
};
