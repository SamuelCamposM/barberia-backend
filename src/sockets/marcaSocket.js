import { agregarMarca, editarMarca, eliminarMarca } from "../controllers";
export const SocketClientMarca = {
  agregar: "cliente:marca-agregar",
  editar: "cliente:marca-editar",
  eliminar: "cliente:marca-eliminar",
};
const SocketServerMarca = {
  agregar: "server:marca-agregar",
  editar: "server:marca-editar",
  eliminar: "server:marca-eliminar",
};

export const marcaSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerMarca.editar, async (data, callback) => {
      const { error, msg } = await editarMarca(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientMarca.editar, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerMarca.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarMarca(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientMarca.agregar, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerMarca.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarMarca(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientMarca.eliminar, data);
      }
      // SI NO HAY ERROR
    });
  });
};
