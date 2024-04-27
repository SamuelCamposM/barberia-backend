import {
  agregarCategoria,
  editarCategoria,
  eliminarCategoria,
} from "../controllers";
export const SocketClientCategoria = {
  agregar: "cliente:categoria-agregar",
  editar: "cliente:categoria-editar",
  eliminar: "cliente:categoria-eliminar",
};
const SocketServerCategoria = {
  agregar: "server:categoria-agregar",
  editar: "server:categoria-editar",
  eliminar: "server:categoria-eliminar",
};

export const categoriaSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerCategoria.editar, async (data, callback) => {
      const { error, msg } = await editarCategoria(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientCategoria.editar, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerCategoria.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarCategoria(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientCategoria.agregar, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerCategoria.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarCategoria(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientCategoria.eliminar, data);
      }
    });
  });
};
