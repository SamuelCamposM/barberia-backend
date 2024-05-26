import { response } from "express";
import { PageModel, RolModel } from "../../models";

export const getPages = async (req, res = response) => {
  try {
    //  const pagesA = [
    //    "Page",
    //    "Valoraciones",
    //    "Producto",
    //    "Categoria",
    //    "Cita",
    //    "Depto",
    //    "Marca",
    //    "Municipio",
    //    "Sucursal",
    //  ];
    //  pagesA.forEach(async (page) => {
    //    const newPage = new PageModel({
    //      componente: page,
    //      nombre: page,
    //      icono: "Page",
    //      orden: 1,
    //      delete: ["GERENTE"],
    //      update: ["GERENTE"],
    //      insert: ["GERENTE"],
    //      select: ["GERENTE"],
    //      ver: ["GERENTE"],
    //    });
    //    await newPage.save();
    //  });

    const pages = await PageModel.find()
      .populate({
        path: "rUsuario",
        select: ["_id", "dui", "name", "lastname"], // selecciona sólo el campo 'name' y excluye el campo '_id'
      })
      .populate({
        path: "eUsuario",
        select: ["_id", "dui", "name", "lastname"], // selecciona sólo el campo 'name' y excluye el campo '_id'
      });
    // sel ;
    console.log(pages);
    res.status(200).json({
      data: pages,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las pages",
    });
  }
};
