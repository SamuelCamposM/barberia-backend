import { editarPage } from "../controllers";

export const pageSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on("server:page-editar", async (data, callback) => {
      const { item, error } = await editarPage(data);

      if (error) {
        callback({ error, msg: "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit("cliente:page-editar", item);
      }
      // SI NO HAY ERROR
    });
  });
};
