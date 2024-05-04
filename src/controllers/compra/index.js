import { CompraModel } from "../../models";

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

    console.log(result.docs);
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
// Agregar una nueva compra
export const agregarCompra = async (item) => {
  try {
    // Adaptar el objeto item al esquema de Compra
    const compra = {
      proveedor: item.proveedor._id,
      sucursal: item.sucursal._id,
      gastoTotal: item.gastoTotal,
      rUsuario: item.rUsuario._id,
      estado: item.estado,
      eUsuario: null,
    };
    const newCompra = new CompraModel(compra);
    await newCompra.save();
    return { item: { ...compra, _id: newCompra._id }, error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la compra",
    };
  }
};

// Editar una compra existente
export const editarCompra = async (item) => {
  console.log({ item });
  try {
    // Adaptar el objeto item al esquema de Compra
    const compra = {
      proveedor: item.proveedor._id,
      sucursal: item.sucursal._id,
      gastoTotal: item.gastoTotal,
      rUsuario: item.rUsuario._id,
      estado: item.estado,
      eUsuario: item.eUsuario._id,
    };
    await CompraModel.findOneAndUpdate({ _id: item._id }, compra, {
      new: true,
    });
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
    await CompraModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la compra",
    };
  }
};
