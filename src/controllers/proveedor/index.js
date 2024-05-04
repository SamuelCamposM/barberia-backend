import { ProveedorModel } from "../../models";

export const getProveedoresTable = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    } = req.body;
    const aggregation = ProveedorModel.aggregate([
      {
        $match: {
          $and: [{ estado }],
          $or: [
            { nombreCompleto: new RegExp(busqueda, "i") },
            { email: new RegExp(busqueda, "i") },
            { telefono: new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await ProveedorModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener los Proveedores",
    });
  }
};
export const searchProveedor = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await ProveedorModel.find({
      nombreCompleto: new RegExp(search, "i"),
    })
      .select("-__v") // Excluye la propiedad __v
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los proveedores",
    });
  }
};

export const agregarProveedor = async (item) => {
  try {
    const newProveedor = new ProveedorModel(item);
    await newProveedor.save();
    return { item: newProveedor, error: false };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      msg: String(error) || "Hubo un error al agregar el proveedor",
    };
  }
};

export const editarProveedor = async (data) => {
  try {
    await ProveedorModel.findOneAndUpdate({ _id: data._id }, { ...data });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar el proveedor",
    };
  }
};

export const eliminarProveedor = async (item) => {
  try {
    await ProveedorModel.findOneAndUpdate({ _id: data._id }, { estado: false });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar el proveedor",
    };
  }
};
