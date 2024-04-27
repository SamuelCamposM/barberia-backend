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
      .select("-__v") // Excluye la propiedad __v
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

// SOCKET
export const agregarProducto = async (item) => {
  try {
    console.log({ item });
    const newProducto = new ProductoModel(item);
    await newProducto.save();
    return { item: newProducto, error: false };
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
    eliminados.forEach(async (element) => {
      await deleteFile(element);
    });
    await ProductoModel.findOneAndUpdate({ _id: data._id }, data, {
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
