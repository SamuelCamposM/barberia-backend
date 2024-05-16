import { response, request } from "express";
import mongoose from "mongoose";
import path from "path";
import pdfmake from "pdfmake";
import { DetVentaModel, VentaModel, ProductoModel } from "../../models";
import { formatearFecha } from "../../helpers/date";
// Obtener ventas con paginación y búsqueda
export const getVentas = async (req, res) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      estado,
    } = req.body;
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
export const pdfVenta = async (req, res) => {
  try {
    const _idVenta = req.params._idVenta;
    console.log({ _idVenta });

    // Buscar la venta
    const venta = await VentaModel.findById(_idVenta)
      .populate("cliente")
      .populate("sucursal");

    // Buscar los detalles de la venta
    const detVentas = await DetVentaModel.find({ venta: _idVenta }).populate(
      "producto"
    );
    console.log({ venta, detVentas });
    console.log(new Date(venta.createdAt).toISOString());
    // Calcular el total de la cantidad
    let totalCantidad = detVentas.reduce(
      (total, detVenta) => total + detVenta.cantidad,
      0
    );

    // Calcular el total de detVenta
    let totalDetVenta = detVentas.reduce(
      (total, detVenta) => total + detVenta.total,
      0
    );

    // Ahora puedes usar totalCantidad y totalDetVenta en tu documento

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
                  text: "Detalles de la venta",
                  style: "clientDetailsTitle",
                },
                {
                  text: [
                    { text: "Cliente: ", bold: true },
                    `${venta.cliente.lastname} ${venta.cliente.name}\n`, // Nombre del cliente
                    { text: "Correo: ", bold: true },
                    `${venta.cliente.email}\n`, // Correo del cliente
                    { text: "Número de factura: ", bold: true },
                    `${venta._id}\n`, // Número de factura
                    { text: "Fecha: ", bold: true },
                    `${formatearFecha(
                      new Date(venta.createdAt).toISOString()
                    )}\n`, // Fecha de la venta
                    { text: "Total: ", bold: true },
                    `$${venta.gastoTotal}\n`, // Total de la venta
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
          text: "Detalles de la venta",
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
              // Detalles de la venta
              ...detVentas.map((detVenta) => [
                `${detVenta.producto.name}`, // Nombre del producto
                `${detVenta.cantidad}`, // Cantidad
                `$${detVenta.precioUnidad}`, // Precio por unidad
                `$${detVenta.total}`, // Total
              ]),
              [
                { text: "Total Final", colSpan: 2 },
                {},
                { text: totalCantidad },
                { text: totalDetVenta },
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
          margin: [0, 0, 0, 10], // Espacio entre los detalles del cliente y el contenido siguiente
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

    return res.status(500).json({
      error: true,
      msg:
        String(error) || "Hubo un error al generarl el pdf de la venta",
    });
  }
};
