import { VentaModel, StockModel } from "../../models";
import { response, request } from "express";
import { DetVentaModel } from "../../models";
import mongoose from "mongoose";

// Obtener ventas con paginación y búsqueda
export const getVentas = async (req, res) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    } = req.body;
    console.log({
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    });
    const aggregation = VentaModel.aggregate([
      {
        $match: {
          estado: estado,
        },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      {
        $unwind: "$cliente",
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
          "cliente._id": 1,
          "cliente.nombreCompleto": 1,
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
            { "cliente.nombreCompleto": new RegExp(busqueda, "i") },
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

    const result = await VentaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });
    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las ventas",
    });
  }
};

// Buscar ventas por cliente o sucursal
export const searchVenta = async (req, res) => {
  const { search } = req.body;
  try {
    const response = await VentaModel.find({
      $or: [
        { "cliente.nombreCompleto": new RegExp(search, "i") },
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
      msg: "Hubo un error al buscar las ventas",
    });
  }
};

// SOCKET

const restVenta = {
  estado: "EN PROCESO",
  gastoTotal: 0,
  totalProductos: 0,
  createdAt: "",
  updatedAt: "",
  cliente: { _id: "6634665d6d6da52b9d75ddb6", nombreCompleto: "asdads" },
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
const detVentasData = [
  {
    venta: "",
    cantidad: 10,
    precioUnidad: 50,
    total: 500,
    producto: [Object],
    crud: [Object],
    _id: "nuevo-4d1a2de5-667b-4ac9-b9b6-e16d1f32a0f0",
  },
];

// Agregar una nueva venta
export const agregarVenta = async (data) => {
  try {
    const { detVentasData, ...restVenta } = data;

    // Adaptar el objeto item al esquema de Venta
    const venta = {
      ...restVenta,
      cliente: restVenta.cliente._id,
      sucursal: restVenta.sucursal._id,
      gastoTotal: restVenta.gastoTotal,
      rUsuario: restVenta.rUsuario._id,
      estado: restVenta.estado,
      eUsuario: null,
    };

    const newVenta = new VentaModel(venta);
    await newVenta.save();

    // Crear registros de DetVenta para cada elemento en detVentasData
    for (const detVentaItem of detVentasData) {
      const detVenta = {
        venta: newVenta._id,
        producto: detVentaItem.producto._id,
        cantidad: detVentaItem.cantidad,
        precioUnidad: detVentaItem.precioUnidad,
        total: detVentaItem.total,
      };

      const newDetVenta = new DetVentaModel(detVenta);
      await newDetVenta.save();
    }

    return {
      item: {
        ...restVenta,
        _id: newVenta._id,
        createdAt: newVenta.createdAt,
      },
      error: false,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la venta",
    };
  }
};

// Editar una venta existente
export const editarVenta = async (data) => {
  try {
    // Adaptar el objeto item al esquema de Venta
    const { detVentasData, ...restVenta } = data;
    const venta = {
      ...restVenta,
      cliente: data.cliente._id,
      sucursal: data.sucursal._id,
      gastoTotal: data.gastoTotal,
      rUsuario: data.rUsuario._id,
      estado: data.estado,
      eUsuario: data.eUsuario._id,
    };
    // Actualizar la venta
    const updatedVenta = await VentaModel.findOneAndUpdate(
      { _id: data._id },
      venta,
      {
        new: true,
      }
    );

    // Manejar las operaciones CRUD en detVentasData
    for (const detVentaItem of detVentasData) {
      if (detVentaItem?.crud?.nuevo) {
        // Agregar un nuevo DetVenta
        const newDetVenta = new DetVentaModel({
          venta: updatedVenta._id,
          producto: detVentaItem.producto._id,
          cantidad: detVentaItem.cantidad,
          precioUnidad: detVentaItem.precioUnidad,
          total: detVentaItem.total,
        });
        await newDetVenta.save();
      } else if (detVentaItem?.crud?.editado) {
        // Editar un DetVenta existente
        await DetVentaModel.findOneAndUpdate(
          { _id: detVentaItem._id },
          detVentaItem,
          {
            new: true,
          }
        );
      } else if (detVentaItem.crud?.eliminado) {
        // Eliminar un DetVenta
        await DetVentaModel.findByIdAndRemove(detVentaItem._id);
      }
    }

    // Crear Stocks si la venta es FINALIZADA
    if (data.estado === "FINALIZADA") {
      for (const detVentaItem of detVentasData) {
        if (!detVentaItem.crud?.eliminado) {
          // Buscar si ya existe un registro de Stock para la sucursal y producto
          const existingStock = await StockModel.findOne({
            sucursal: updatedVenta.sucursal,
            producto: detVentaItem.producto._id,
          });

          if (existingStock) {
            // Si existe, actualizar la cantidad de stock existente
            existingStock.cantidad += detVentaItem.cantidad;
            await existingStock.save();
          } else {
            // Si no existe, crear un nuevo registro de Stock
            const stock = {
              sucursal: updatedVenta.sucursal,
              producto: detVentaItem.producto._id,
              cantidad: detVentaItem.cantidad,
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
      msg: String(error) || "Hubo un error al actualizar la venta",
    };
  }
};

// Eliminar una venta
export const eliminarVenta = async (item) => {
  try {
    await VentaModel.findOneAndUpdate(item, {
      estado: item.estado === "ANULADA" ? "EN PROCESO" : "ANULADA",
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la venta",
    };
  }
};
export const getDetVentas = async (req = request, res = response) => {
  try {
    const {
      sort: { campo, asc },
      venta,
    } = req.body;
    const aggregation = DetVentaModel.aggregate([
      {
        $match: {
          venta: new mongoose.Types.ObjectId(venta),
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
          venta: true,
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
        String(error) || "Hubo un error al obtener los detalles de las ventas",
    });
  }
};
