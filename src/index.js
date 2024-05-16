import express from "express";
import { config } from "dotenv";
import cors from "cors";

config();

import { dbConnection } from "./db/config";

import {
  chatSocket,
  deptoSocket,
  pageSocket,
  municipioSocket,
  sucursalSocket,
  marcaSocket,
  categoriaSocket,
  usuarioSocket,
  productoSocket,
  compraSocket,
  detCompraSocket,
  ventaSocket,
  citaSocket,
} from "./sockets";
import {
  authRouter,
  municipioRouter,
  pagesRouter,
  mensajesRouter,
  deptoRouter,
  sucursalRouter,
  usuarioRouter,
  categoriaRouter,
  marcaRouter,
  productoRouter,
  compraRouter,
  detCompraRouter,
  cierreCajaRouter,
} from "./routes";
import { createServer } from "http";
import socketio from "socket.io";
import { v2 as cloudinary } from "cloudinary";
import { proveedorRouter } from "./routes/proveedor";
import { proveedorSocket } from "./sockets/proveedor";
import { ventaRouter } from "./routes/venta";
import { citaRouter } from "./routes/cita";

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
app.use("/api/usuario", usuarioRouter);
app.use("/api/marca", marcaRouter);
app.use("/api/categoria", categoriaRouter);
app.use("/api/producto", productoRouter);
app.use("/api/proveedor", proveedorRouter);
app.use("/api/compra", compraRouter);
app.use("/api/venta", ventaRouter);
app.use("/api/cita", citaRouter);
app.use("/api/cierreCaja", cierreCajaRouter);

const server = createServer(app);
const io = socketio(server, {});

chatSocket(io);
pageSocket(io);
deptoSocket(io);
municipioSocket(io);
sucursalSocket(io);
usuarioSocket(io);
marcaSocket(io);
categoriaSocket(io);
productoSocket(io);
proveedorSocket(io);
compraSocket(io);
ventaSocket(io);
citaSocket(io);

server.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
);
