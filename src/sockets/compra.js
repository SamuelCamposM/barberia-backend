import { agregarCompra, editarCompra, eliminarCompra } from "../controllers";
export const SocketClientCompra = {
  agregar: "cliente:compra-agregar",
  editar: "cliente:compra-editar",
  eliminar: "cliente:compra-eliminar",
  detCompraListener: "cliente:compra-detCompra-listener",
};
const SocketServerCompra = {
  agregar: "server:compra-agregar",
  editar: "server:compra-editar",
  eliminar: "server:compra-eliminar",
};

export const compraSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerCompra.editar, async (data, callback) => {
      const { error, msg } = await editarCompra(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con éxito!" });
        io.emit(SocketClientCompra.editar, data);
      }
    });
    socket.on(SocketServerCompra.agregar, async (data, callback) => {
      console.log({ data });
      const { error, item, msg } = await agregarCompra(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con éxito!" });
        io.emit(SocketClientCompra.agregar, item);
      }
    });
    socket.on(SocketServerCompra.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarCompra(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con éxito!" });
        io.emit(SocketClientCompra.eliminar, data);
      }
    });
  });
};
