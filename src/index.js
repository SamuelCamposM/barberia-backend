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
} from "./sockets";
import { authRouter, municipioRouter, pagesRouter } from "./routes";
import { mensajesRouter } from "./routes/mensajes";
import { createServer } from "http";
import socketio from "socket.io";
import { deptoRouter } from "./routes/depto";
import { v2 as cloudinary } from "cloudinary";
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

server.listen(process.env.PORT, () =>
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
);
