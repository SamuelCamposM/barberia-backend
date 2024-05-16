import { CompraModel, ProductoModel } from "../../models";
import { response, request } from "express";
import { DetCompraModel } from "../../models";
import mongoose from "mongoose";
import path from "path";
import pdfmake from "pdfmake";
import { formatearFecha } from "../../helpers/date";
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
          "proveedor.nombreCompleto": 1,
          "rUsuario._id": 1,
          "rUsuario.dui": 1,
          "rUsuario.name": 1,
          "rUsuario.lastname": 1,
          "eUsuario._id": 1,
          "eUsuario.dui": 1,
          "eUsuario.name": 1,
          "eUsuario.lastname": 1,
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
          // Buscar el Producto
          const existingProduct = await ProductoModel.findOne({
            _id: detCompraItem.producto._id,
          });
          if (!existingProduct) {
            return {
              error: true,
              msg: String(error) || "Hubo un error al actualizar la compra",
            };
          }

          // Buscar si ya existe un stock para la sucursal en el Producto
          const stock = existingProduct.stocks.find(
            (stock) =>
              stock.sucursal.toString() === updatedCompra.sucursal.toString()
          );

          if (stock) {
            // Si existe, actualizar la cantidad del stock
            stock.cantidad += detCompraItem.cantidad;
          } else {
            // Si no existe, añadir un nuevo stock al array de stocks del Producto
            const newStock = {
              sucursal: updatedCompra.sucursal,
              cantidad: detCompraItem.cantidad,
              // ... otros campos necesarios para el Stock
            };
            existingProduct.stocks.push(newStock);
          }

          // Calcular el stockTotal sumando las cantidades de todos los stocks
          existingProduct.stockTotal = existingProduct.stocks.reduce(
            (total, stock) => total + stock.cantidad,
            0
          );

          // Guardar el Producto actualizado
          await existingProduct.save();
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
export const pdfCompra = async (req, res) => {
  try {
    const _idCompra = req.params._idCompra;
    console.log({ _idCompra });

    // Buscar la compra
    const compra = await CompraModel.findById(_idCompra)
      .populate("proveedor")
      .populate("sucursal");

    // Buscar los detalles de la compra
    const detCompras = await DetCompraModel.find({
      compra: _idCompra,
    }).populate("producto");
    console.log({ compra, detCompras });
    console.log(new Date(compra.createdAt).toISOString());
    // Calcular el total de la cantidad
    let totalCantidad = detCompras.reduce(
      (total, detCompra) => total + detCompra.cantidad,
      0
    );

    // Calcular el total de detCompra
    let totalDetCompra = detCompras.reduce(
      (total, detCompra) => total + detCompra.total,
      0
    );

    // Ahora puedes usar totalCantidad y totalDetCompra en tu documento

    // Resto del código...
    let fonts = {
      Roboto: {
        normal: path.join(__dirname, "../../Roboto/Roboto-Regular.ttf"),
        bold: path.join(__dirname, "../../Roboto/Roboto-Medium.ttf"),
        italics: path.join(__dirname, "../../Roboto/Roboto-Italic.ttf"),
        bolditalics: path.join(
          __dirname,
          "../../Roboto/Roboto-MediumItalic.ttf"
        ),
      },
    };

    let printer = new pdfmake(fonts);

    let docDefinition = {
      content: [
        {
          columns: [
            {
              // Segunda columna
              margin: [10, 20, 10, 10], // Añade un margen superior de 20
              stack: [
                {
                  text: "Detalles de la compra",
                  style: "clientDetailsTitle",
                },
                {
                  text: [
                    { text: "Proveedor: ", bold: true },
                    `${compra.proveedor.nombreCompleto}\n`, // Nombre del proveedor
                    { text: "Correo: ", bold: true },
                    `${compra.proveedor.email}\n`, // Correo del proveedor
                    { text: "Número de factura: ", bold: true },
                    `${compra._id}\n`, // Número de factura
                    { text: "Fecha: ", bold: true },
                    `${formatearFecha(
                      new Date(compra.createdAt).toISOString()
                    )}\n`, // Fecha de la compra
                    { text: "Total: ", bold: true },
                    `$${compra.gastoTotal}\n`, // Total de la compra
                    { text: "Descuentos: ", bold: true },
                    "$0\n", // Descuentos (si los hay)
                  ],
                  style: "clientDetails",
                },
              ],
            },
            {
              image: "src/assets/logo.png",
              width: 150,
            },
          ],
        },
        {
          text: "Detalles de la compra",
          style: "subheader",
          alignment: "center",
        },
        //   "Esta es una descripción de la factura.",
        {
          // Primera columna
          table: {
            headerRows: 1,
            widths: ["*", "auto", 100, "*"],
            body: [
              [
                { text: "Producto", style: "tableHeader" },
                { text: "Cantidad", style: "tableHeader" },
                { text: "Precio", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
              ],
              // Detalles de la compra
              ...detCompras.map((detCompra) => [
                `${detCompra.producto.name}`, // Nombre del producto
                `${detCompra.cantidad}`, // Cantidad
                `$${detCompra.precioUnidad}`, // Precio por unidad
                `$${detCompra.total}`, // Total
              ]),
              [
                { text: "Total Final", colSpan: 2 },
                {},
                { text: totalCantidad },
                { text: totalDetCompra },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0
                ? "#BFBFBF"
                : rowIndex % 2 === 0
                ? "#D9D9D9"
                : null;
            },
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? "black" : "#eee";
            },
            paddingLeft: function (i, node) {
              return 10;
            },
            paddingRight: function (i, node) {
              return 10;
            },
            paddingTop: function (i, node) {
              return 3;
            },
            paddingBottom: function (i, node) {
              return 3;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 20, 0, 10],
          color: "#007481",
        },
        subheader: {
          fontSize: 18,
          bold: false,
          italics: true,
          margin: [0, 10, 0, 5],
          color: "#005056",
        },
        invoiceTitle: {
          fontSize: 26,
          bold: true,
          alignment: "right",
          margin: [0, 40, 0, 20],
          color: "#043263",
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "white",
          fillColor: "#4E5D6C",
          alignment: "center",
        },

        clientDetailsTitle: {
          fontSize: 14,
          bold: true,
          color: "#043263",
          decoration: "underline",
          margin: [0, 0, 0, 10], // Espacio adicional debajo del título
        },
        clientDetails: {
          margin: [0, 0, 0, 10], // Espacio entre los detalles del proveedor y el contenido siguiente
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
      footer: function (currentPage, pageCount) {
        return {
          columns: [
            "Este documento es válido sin firma y sello.",
            {
              text: currentPage.toString() + " de " + pageCount,
              alignment: "right",
            },
          ],
          margin: [40, 0],
        };
      },
    };

    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al generar el pdf de compras",
    });
  }
};
