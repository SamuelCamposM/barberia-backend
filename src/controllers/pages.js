import { response } from "express";
import { PageModel, RolModel } from "../models";

export const getPages = async (req, res = response) => {
  try {
    // const pagesA = [
    //   {
    //     nombre: "Menu",
    //     icono: "Menu",
    //     orden: 1,
    //     delete: ["65f90e19d96dc93739a8ab3b"],
    //     update: ["65f90e19d96dc93739a8ab3b"],
    //     insert: ["65f90e19d96dc93739a8ab3b"],
    //     select: ["65f90e19d96dc93739a8ab3b"],
    //     ver: ["65f90e19d96dc93739a8ab3b"],
    //   },
    // ];
    // pagesA.forEach(async (page) => {
    //   const newPage = new PageModel(page);
    //   console.log({ newPage });
    //   await newPage.save();
    // });

    const pages = await PageModel.find()
      .populate("delete", "_id nombre")
      .populate("update", "_id nombre")
      .populate("insert", "_id nombre")
      .populate("select", "_id nombre")
      .populate("ver", "_id nombre");

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
