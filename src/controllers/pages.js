import { response } from "express";
import { PageModel, RolModel } from "../models";

export const getPages = async (req, res = response) => {
  try {
    //  const pagesA = [
    //    "Menu",
    //    "Valoraciones",
    //    "Productos",
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
    //      icono: "Menu",
    //      orden: 1,
    //      delete: ["GERENTE"],
    //      update: ["GERENTE"],
    //      insert: ["GERENTE"],
    //      select: ["GERENTE"],
    //      ver: ["GERENTE"],
    //    });
    //    console.log({ newPage });
    //    await newPage.save();
    //  });

    const pages = await PageModel.find();
    res.status(200).json({
      ok: true,
      data: pages,
    });
  } catch (error) {
    console.log({ error });
    res
      .status(500)
      .json({ ok: false, msg: "Hubo un error al obtener las pages" });
  }
};
