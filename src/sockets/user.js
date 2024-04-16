import {
  agregarUser,
  editarUser,
  eliminarUser,
} from "../controllers";
export const SocketClientUser = {
  agregar: "cliente:user-agregar",
  editar: "cliente:user-editar",
  eliminar: "cliente:user-eliminar",
};
const SocketServerSucural = {
  agregar: "server:user-agregar",
  editar: "server:user-editar",
  eliminar: "server:user-eliminar",
};

export const userSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerSucural.editar, async (data, callback) => {
      const { error, msg } = await editarUser(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientUser.editar, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerSucural.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarUser(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientUser.agregar, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerSucural.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarUser(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientUser.eliminar, data);
      }
      // SI NO HAY ERROR
    });
  });
};
