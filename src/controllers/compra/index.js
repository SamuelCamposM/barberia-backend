import { CompraModel, StockModel } from "../../models";
import { response, request } from "express";
import { DetCompraModel } from "../../models";
import mongoose from "mongoose";

// Obtener compras con paginación y búsqueda
export const getCompras = async (req, res) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    } = req.body;

    const aggregation = CompraModel.aggregate([
      {
        $match: {
          estado: estado,
        },
      },
      {
        $lookup: {
          from: "proveedors",
          localField: "proveedor",
          foreignField: "_id",
          as: "proveedor",
        },
      },
      {
        $unwind: "$proveedor",
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
        $lookup: {
          from: "usuarios",
          localField: "eUsuario",
          foreignField: "_id",
          as: "eUsuario",
        },
      },
      {
        $unwind: {
          path: "$eUsuario",
          preserveNullAndEmptyArrays: true,
        },
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
        $project: {
          estado: 1,
          gastoTotal: 1,
          totalProductos: 1,
          "proveedor._id": 1,
          "proveedor.email": 1,
          "proveedor.nombreCompleto": 1,
          "proveedor.telefono": 1,
          "rUsuario._id": 1,
          "rUsuario.dui": 1,
          "rUsuario.name": 1,
          "eUsuario._id": 1,
          "eUsuario.dui": 1,
          "eUsuario.name": 1,
          "sucursal._id": 1,
          "sucursal.name": 1,
          "sucursal.tel": 1,
          createdAt: true,
        },
      },
      {
        $match: {
          $or: [
            { "proveedor.nombreCompleto": new RegExp(busqueda, "i") },
            { "sucursal.name": new RegExp(busqueda, "i") },
            // Agrega más campos de búsqueda si es necesario
          ],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await CompraModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las compras",
    });
  }
};

// Buscar compras por proveedor o sucursal
export const searchCompra = async (req, res) => {
  const { search } = req.body;
  try {
    const response = await CompraModel.find({
      $or: [
        { "proveedor.nombreCompleto": new RegExp(search, "i") },
        { "sucursal.name": new RegExp(search, "i") },
        // Agrega más campos de búsqueda si es necesario
      ],
    })
      .select("-__v")
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al buscar las compras",
    });
  }
};

// SOCKET

const restCompra = {
  estado: "EN PROCESO",
  gastoTotal: 0,
  totalProductos: 0,
  createdAt: "",
  updatedAt: "",
  proveedor: { _id: "6634665d6d6da52b9d75ddb6", nombreCompleto: "asdads" },
  rUsuario: {
    _id: "65f9f915df006187fc65b648",
    name: "Samuel",
    dui: "SIN DUI",
  },
  eUsuario: { _id: "", dui: "", name: "" },
  sucursal: {
    _id: "661c533de1820425e29bd4f1",
    name: "SUCURSAL EL AHUACHAPAN",
    tel: "awda",
  },
  crud: { agregando: true },
};
const detComprasData = [
  {
    compra: "",
    cantidad: 10,
    precioUnidad: 50,
    total: 500,
    producto: [Object],
    crud: [Object],
    _id: "nuevo-4d1a2de5-667b-4ac9-b9b6-e16d1f32a0f0",
  },
];

// Agregar una nueva compra
export const agregarCompra = async (data) => {
  try {
    const { detComprasData, ...restCompra } = data;

    // Adaptar el objeto item al esquema de Compra
    const compra = {
      ...restCompra,
      proveedor: restCompra.proveedor._id,
      sucursal: restCompra.sucursal._id,
      gastoTotal: restCompra.gastoTotal,
      rUsuario: restCompra.rUsuario._id,
      estado: restCompra.estado,
      eUsuario: null,
    };

    const newCompra = new CompraModel(compra);
    await newCompra.save();

    // Crear registros de DetCompra para cada elemento en detComprasData
    for (const detCompraItem of detComprasData) {
      const detCompra = {
        compra: newCompra._id,
        producto: detCompraItem.producto._id,
        cantidad: detCompraItem.cantidad,
        precioUnidad: detCompraItem.precioUnidad,
        total: detCompraItem.total,
      };

      const newDetCompra = new DetCompraModel(detCompra);
      await newDetCompra.save();
    }

    return {
      item: {
        ...restCompra,
        _id: newCompra._id,
        createdAt: newCompra.createdAt,
      },
      error: false,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la compra",
    };
  }
};

// Editar una compra existente
export const editarCompra = async (data) => {
  try {
    // Adaptar el objeto item al esquema de Compra
    const { detComprasData, ...restCompra } = data;
    const compra = {
      ...restCompra,
      proveedor: data.proveedor._id,
      sucursal: data.sucursal._id,
      gastoTotal: data.gastoTotal,
      rUsuario: data.rUsuario._id,
      estado: data.estado,
      eUsuario: data.eUsuario._id,
    };
    // Actualizar la compra
    const updatedCompra = await CompraModel.findOneAndUpdate(
      { _id: data._id },
      compra,
      {
        new: true,
      }
    );

    // Manejar las operaciones CRUD en detComprasData
    for (const detCompraItem of detComprasData) {
      if (detCompraItem?.crud?.nuevo) {
        // Agregar un nuevo DetCompra
        const newDetCompra = new DetCompraModel({
          compra: updatedCompra._id,
          producto: detCompraItem.producto._id,
          cantidad: detCompraItem.cantidad,
          precioUnidad: detCompraItem.precioUnidad,
          total: detCompraItem.total,
        });
        await newDetCompra.save();
      } else if (detCompraItem?.crud?.editado) {
        // Editar un DetCompra existente
        await DetCompraModel.findOneAndUpdate(
          { _id: detCompraItem._id },
          detCompraItem,
          {
            new: true,
          }
        );
      } else if (detCompraItem.crud?.eliminado) {
        // Eliminar un DetCompra
        await DetCompraModel.findByIdAndRemove(detCompraItem._id);
      }
    }

    // Crear Stocks si la compra es FINALIZADA
    if (data.estado === "FINALIZADA") {
      for (const detCompraItem of detComprasData) {
        if (!detCompraItem.crud?.eliminado) {
          // Buscar si ya existe un registro de Stock para la sucursal y producto
          const existingStock = await StockModel.findOne({
            sucursal: updatedCompra.sucursal,
            producto: detCompraItem.producto._id,
          });

          if (existingStock) {
            // Si existe, actualizar la cantidad de stock existente
            existingStock.cantidad += detCompraItem.cantidad;
            await existingStock.save();
          } else {
            // Si no existe, crear un nuevo registro de Stock
            const stock = {
              sucursal: updatedCompra.sucursal,
              producto: detCompraItem.producto._id,
              cantidad: detCompraItem.cantidad,
              // ... otros campos necesarios para el Stock
            };
            const newStock = new StockModel(stock);
            await newStock.save();
          }
        }
      }
    }

    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar la compra",
    };
  }
};

// Eliminar una compra
export const eliminarCompra = async (item) => {
  try {
    await CompraModel.findOneAndUpdate(item, {
      estado: item.estado === "ANULADA" ? "EN PROCESO" : "ANULADA",
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la compra",
    };
  }
};
export const getDetCompras = async (req = request, res = response) => {
  try {
    const {
      sort: { campo, asc },
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
        $unwind: "$producto", //[{}] => {}
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
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await aggregation.exec();

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
