import { VentaModel, StockModel, ProductoModel } from "../../models";
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
          "cliente.name": 1,
          "cliente.lastname": 1,
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
            { "cliente.name": new RegExp(busqueda, "i") },
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
        { "cliente.name": new RegExp(search, "i") },
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
// const detVentasData = [
//   {
//     venta: "",
//     cantidad: 50,
//     precioUnidad: 50,
//     total: 2500,
//     stock: 660,
//     producto: [Object],
//     crud: [Object],
//     _id: "nuevo-948e8841-18a5-45aa-9b5e-0feb2d859815",
//   },
// ];
// const newVenta = {
//   cliente: new ObjectId("661dd907b25846c340b29f01"),
//   sucursal: new ObjectId("661c533de1820425e29bd4f1"),
//   totalProductos: 50,
//   gastoTotal: 2500,
//   rUsuario: new ObjectId("65f9f915df006187fc65b648"),
//   eUsuario: null,
//   estado: true,
//   _id: new ObjectId("6641672b81e15fb033cb4b18"),
//   createdAt: "2024-05-13T01:04:43.552Z",
//   updatedAt: "2024-05-13T01:04:43.552Z",
//   __v: 0,
// };
// Agregar una nueva venta
export const agregarVenta = async (data) => {
  try {
    const { detVentasData, ...restVenta } = data;

    // Adaptar el objeto item al esquema de Venta
    const venta = {
      ...restVenta,
      cliente: restVenta.cliente._id,
      sucursal: restVenta.sucursal._id,
      rUsuario: restVenta.rUsuario._id,
      eUsuario: null,
    };

    const newVenta = new VentaModel(venta);
    await newVenta.save();

    // Crear registros de DetVenta para cada elemento en detVentasData
    for (const detVentaItem of detVentasData) {
      const detVenta = {
        ...detVentaItem,
        venta: newVenta._id, //LLAVE FORANEA
        producto: detVentaItem.producto._id,
      };
      delete detVenta._id;
      const newDetVenta = new DetVentaModel(detVenta);
      await newDetVenta.save();

      // Buscar el Producto
      const existingProduct = await ProductoModel.findOne({
        _id: detVentaItem.producto._id,
      });
      if (!existingProduct) {
        return {
          error: true,
          msg: String(error) || "No se encontró un producto",
        };
      }

      // Buscar si ya existe un stock para la sucursal en el Producto
      const stock = existingProduct.stocks.find(
        (stock) => stock.sucursal.toString() === newVenta.sucursal.toString()
      );

      if (stock) {
        // Si existe, actualizar la cantidad del stock
        stock.cantidad -= detVentaItem.cantidad;
      }
      // Calcular el stockTotal sumando las cantidades de todos los stocks
      existingProduct.stockTotal = existingProduct.stocks.reduce(
        (total, stock) => total + stock.cantidad,
        0
      );

      // Guardar el Producto actualizado
      await existingProduct.save();
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

    // Crear registros de DetVenta para cada elemento en detVentasData
    if (!updatedVenta.estado) {
      for (const detVentaItem of detVentasData) {
        // Buscar el Producto
        const existingProduct = await ProductoModel.findOne({
          _id: detVentaItem.producto._id,
        });
        if (!existingProduct) {
          return {
            error: true,
            msg: String(error) || "No se encontró un producto",
          };
        }

        // Buscar si ya existe un stock para la sucursal en el Producto
        const stock = existingProduct.stocks.find(
          (stock) => stock.sucursal.toString() === venta.sucursal.toString()
        );

        if (stock) {
          // Si existe, actualizar la cantidad del stock
          stock.cantidad += detVentaItem.cantidad;
        }
        
        // Calcular el stockTotal sumando las cantidades de todos los stocks
        existingProduct.stockTotal = existingProduct.stocks.reduce(
          (total, stock) => total + stock.cantidad,
          0
        );
        console.log(existingProduct.stockTotal);
        // Guardar el Producto actualizado
        await existingProduct.save();
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
          stock: true,
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
