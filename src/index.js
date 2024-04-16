import express from "express";
import { config } from "dotenv";
import cors from "cors";
import pdfmake from "pdfmake";
import ExcelJS from "exceljs";
import path from "path";

config();

import { dbConnection } from "./db/config";

import {
  chatSocket,
  deptoSocket,
  pageSocket,
  municipioSocket,
  sucursalSocket,
} from "./sockets";
import {
  authRouter,
  municipioRouter,
  pagesRouter,
  mensajesRouter,
  deptoRouter,
  sucursalRouter,
  userRouter,
} from "./routes";
import { createServer } from "http";
import socketio from "socket.io";
import { v2 as cloudinary } from "cloudinary";
import { userSocket } from "./sockets/user";

dbConnection();

// Configura Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.cloudAPIKey,
  api_secret: process.env.cloudAPISecret,
});

const app = express();

// Lectura y parseo del body
app.use(express.json());
// CORS
app.use(cors());

app.use(express.static("public"));
//ROUTER
app.use("/api/auth", authRouter);
app.use("/api/mensajes", mensajesRouter);
app.use("/api/pages", pagesRouter);
app.use("/api/depto", deptoRouter);
app.use("/api/municipio", municipioRouter);
app.use("/api/sucursal", sucursalRouter);
app.use("/api/user", userRouter);

app.get("/api/report/pdf", (req, res) => {
  let fonts = {
    Roboto: {
      normal: path.join(__dirname, "/Roboto/Roboto-Regular.ttf"),
      bold: path.join(__dirname, "/Roboto/Roboto-Medium.ttf"),
      italics: path.join(__dirname, "/Roboto/Roboto-Italic.ttf"),
      bolditalics: path.join(__dirname, "/Roboto/Roboto-MediumItalic.ttf"),
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
                text: "Detalles del Cliente",
                style: "clientDetailsTitle",
              },
              {
                text: [
                  { text: "Cliente: ", bold: true },
                  "Nombre del cliente\n",
                  { text: "Correo: ", bold: true },
                  "correo@cliente.com\n",
                  { text: "Número de factura: ", bold: true },
                  "12345\n",
                  { text: "Fecha: ", bold: true },
                  "01/01/2022\n",
                  { text: "Total: ", bold: true },
                  "$50\n",
                  { text: "Descuentos: ", bold: true },
                  "$5\n",
                ],
                style: "clientDetails",
              },
            ],
          },
          {
            // Segunda columna

            margin: [10, 20, 10, 10], // Añade un margen superior de 20
            stack: [
              {
                text: "Detalles del Cliente",
                style: "clientDetailsTitle",
              },
              {
                text: [
                  { text: "Cliente: ", bold: true },
                  "Nombre del cliente\n",
                  { text: "Correo: ", bold: true },
                  "correo@cliente.com\n",
                  { text: "Número de factura: ", bold: true },
                  "12345\n",
                  { text: "Fecha: ", bold: true },
                  "01/01/2022\n",
                  { text: "Total: ", bold: true },
                  "$50\n",
                  { text: "Descuentos: ", bold: true },
                  "$5\n",
                ],
                style: "clientDetails",
              },
            ],
          },
          {
            image: "src/assets/dog4.jpg",
            width: 150,
          },
        ],
      },
      {
        text: "Subtítulo de la factura",
        style: "subheader",
        alignment: "center",
      },
      "Esta es una descripción de la factura.",
      {
        // Primera columna

        table: {
          headerRows: 1,
          widths: ["*", "auto", 100, "*"],
          body: [
            [
              { text: "Departamento", style: "tableHeader" },
              { text: "", style: "tableHeader" },
              { text: "", style: "tableHeader" },
              { text: "Total Ventas", style: "tableHeader" },
            ],
            // Departamento 1
            ["Departamento 1", "", "", ""],
            [
              {
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
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    [
                      {
                        text: "Total Departamento 1",
                        colSpan: 3,
                      },
                      {},
                      {},
                      "$39",
                    ],
                  ],
                },
                colSpan: 4,
              },
            ],
            // Departamento 2
            ["Departamento 2", "", "", ""],
            [
              {
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
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    [
                      {
                        text: "Total Departamento 1",
                        colSpan: 3,
                      },
                      {},
                      {},
                      "$39",
                    ],
                  ],
                },
                colSpan: 4,
              },
            ],
            // Departamento 2
            ["Departamento 2", "", "", ""],
            [
              {
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
                    ["Producto A", "3", "$5", "$15"],
                    ["Producto B", "2", "$12", "$24"],
                    [
                      {
                        text: "Total Departamento 1",
                        colSpan: 3,
                      },
                      {},
                      {},
                      "$39",
                    ],
                  ],
                },
                colSpan: 4,
              },
            ],
            [{ text: "Total Final", colSpan: 3 }, {}, {}, { text: "$87" }],
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
});
app.get("/api/report/excel", async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");

  // Personalizar los estilos de las cabeceras
  worksheet.columns = [
    { header: "Id", key: "id", width: 10, style: { font: { bold: true } } },
    { header: "Name", key: "name", width: 32, style: { font: { bold: true } } },
    {
      header: "D.O.B.",
      key: "dob",
      width: 15,
      style: { font: { bold: true } },
    },
  ];

  // Añadir filas con diferentes estilos
  worksheet
    .addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) })
    .eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

  worksheet
    .addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) })
    .eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
    });

  // Establecer los encabezados de respuesta HTTP
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");

  // Escribir y enviar el archivo
  await workbook.xlsx.write(res);
  res.end();
});

const server = createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

chatSocket(io);
pageSocket(io);
deptoSocket(io);
municipioSocket(io);
sucursalSocket(io);
userSocket(io);

server.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
);
