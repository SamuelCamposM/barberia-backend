// DetCompra
import { response, request } from "express";
import { DetCompraModel } from "../../models";
import mongoose from "mongoose";

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
export const agregarDetCompra = async (item) => {
  try {
    // Adaptar el objeto item al esquema de Compra
    const detCompra = {
      ...item,
      producto: item.producto._id,
    };
    const newCompra = new DetCompraModel(detCompra);
    await newCompra.save();
    return { item: { ...item, _id: newCompra._id }, error: false };
  } catch (error) {
    return {
      error: true,
      msg: String(error) || "error al agregar detalle de compra",
    };
  }
};

// item = objeto detCompra
export const editarDetCompra = async (item) => {
  try {
    await DetCompraModel.findOneAndUpdate({ _id: item._id }, item, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "error al editar detalle de compra",
    };
  }
};

// item = {_id:_id}
export const eliminarDetCompra = async (item) => {
  try {
    await DetCompraModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    return {
      error: true,
      msg: String(error) || "error al eliminar detalle de compra",
    };
  }
};
