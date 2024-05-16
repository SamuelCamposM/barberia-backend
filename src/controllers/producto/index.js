import { deleteFile } from "../../helpers";
import { ProductoModel } from "../../models";

export const getProductos = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      tipoProducto,
      estado,
    } = req.body;

    const aggregation = ProductoModel.aggregate([
      {
        $match: {
          $or: [
            { name: new RegExp(busqueda, "i") },
            { "marca.name": new RegExp(busqueda, "i") },
            { "categoria.name": new RegExp(busqueda, "i") },
          ],
          tipoProducto,
          estado,
        },
      },

      // {
      //   $lookup: {
      //     from: "stocks",
      //     localField: "_id",
      //     foreignField: "producto",
      //     as: "stocks",
      //   },
      // },
      // {
      //   $addFields: {
      //     stockTotal2: { $sum: "$stocks.cantidad" },
      //   },
      // },
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
        $project: {
          photos: 1,
          name: 1,
          description: 1,
          price: 1,
          marca: {
            name: 1,
            _id: 1,
          },
          estado: 1,
          createdAt: 1,
          updatedAt: 1,
          tipoProducto: 1,
          categoria: {
            name: 1,
            _id: 1,
          },
          stockTotal: 1,
          stocks: 1,
          "rUsuario._id": 1,
          "rUsuario.dui": 1,
          "rUsuario.name": 1,
          "rUsuario.lastname": 1,
          "eUsuario._id": 1,
          "eUsuario.dui": 1,
          "eUsuario.name": 1,
          "eUsuario.lastname": 1,
          createdAt: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);
    const result = await ProductoModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los productos",
    });
  }
};

export const searchProducto = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await ProductoModel.find({
      name: new RegExp(search, "i"),
      estado: true,
    })
      .select(["name"]) // Excluye la propiedad __v
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los productos",
    });
  }
};
export const searchProductoForVenta = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await ProductoModel.find({
      name: new RegExp(search, "i"),
      estado: true,
    })
      .select(["name", "price", "stocks"]) // Excluye la propiedad __v
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los productos",
    });
  }
};

export const getProductoStock = async (req, res = response) => {
  const { _id } = req.body; 
  try {
    const response = await ProductoModel.findOne({ _id })
      .populate({
        path: "stocks.sucursal",
        select: ["name", "tel"], // selecciona sólo el campo 'name' y excluye el campo '_id'
      })
      .select("stocks -_id"); // sel

    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los productos",
    });
  }
};

// export const searchProductoBySucursalStock = async (req, res = response) => {
//   const { search } = req.body;
//   try {
//     const response = await ProductoModel.find({
//       name: new RegExp(search, "i"),
//       estado: true,
//     })
//       .select(["name"]) // Excluye la propiedad __v
//       .limit(30);
//     res.status(200).json(response);
//   } catch (error) {
//     console.log({ error });
//     return res.status(500).json({
//       error: true,
//       msg: "Hubo un error al obtener los productos",
//     });
//   }
// };

// SOCKET
export const agregarProducto = async (data) => {
  try {
    const { detComprasData, ...restProducto } = data;

    // Adaptar el objeto item al esquema de Compra
    const producto = {
      ...restProducto,
      rUsuario: restProducto.rUsuario._id,
      eUsuario: null,
    };
    const newProducto = new ProductoModel(producto);
    await newProducto.save();
    return {
      item: {
        ...restProducto,
        _id: newProducto._id,
        createdAt: newProducto.createdAt,
      },
      error: false,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear el producto",
    };
  }
};

export const editarProducto = async ({ data, eliminados }) => {
  try {
    console.log({ data });
    eliminados.forEach(async (element) => {
      await deleteFile(element);
    });

    const { detComprasData, ...restProducto } = data;

    // Adaptar el objeto item al esquema de Compra
    const producto = {
      ...restProducto,
      rUsuario: data.rUsuario._id,
      eUsuario: data.eUsuario._id,
    }; 
    await ProductoModel.findOneAndUpdate({ _id: data._id }, producto, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar el producto",
    };
  }
};

export const eliminarProducto = async (item) => {
  try {
    await ProductoModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar el producto",
    };
  }
};
