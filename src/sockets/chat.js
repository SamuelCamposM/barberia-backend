import {
  getUsuarios,
  grabarMensaje,
  usuarioConectado,
  usuarioDesconectado,
} from "../controllers";
import { comprobarJWT } from "../helpers";

export const chatSocket = (io) => {
  io.on("connection", async (socket) => {
    const { query } = socket.handshake;

    const { ok, uid } = comprobarJWT(query["x-token"]);

    if (!ok) {
      console.log("Socket no identificado");
      return socket.disconnect();
    }

    await usuarioConectado(uid);
    socket.join(uid);
    io.emit("lista-usuarios", await getUsuarios());

    socket.on("mensaje-personal", async (data) => {
      const mensaje = await grabarMensaje(data);
      io.to(data.para).emit("mensaje-personal", mensaje);
      io.to(data.de).emit("mensaje-personal", mensaje);
    });

    socket.on("disconnect", async (socket) => {
      await usuarioDesconectado(uid);
      io.emit("lista-usuarios", await getUsuarios());
    });
  });
};
