import { agregarVenta, editarVenta, eliminarVenta } from "../controllers";
export const SocketClientVenta = {
  agregar: "cliente:venta-agregar",
  editar: "cliente:venta-editar",
  eliminar: "cliente:venta-eliminar",
  detVentaListener: "cliente:venta-detVenta-listener",
};
const SocketServerVenta = {
  agregar: "server:venta-agregar",
  editar: "server:venta-editar",
  eliminar: "server:venta-eliminar",
};

export const ventaSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerVenta.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarVenta(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con éxito!" });
        io.emit(SocketClientVenta.agregar, item);
      }
    });
    socket.on(SocketServerVenta.editar, async (data, callback) => {
      const { error, msg } = await editarVenta(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con éxito!" });
        io.emit(SocketClientVenta.editar, data);
      }
    });
    socket.on(SocketServerVenta.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarVenta(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con éxito!" });
        io.emit(SocketClientVenta.eliminar, data);
      }
    });
  });
};
