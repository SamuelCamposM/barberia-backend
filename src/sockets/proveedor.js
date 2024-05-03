import { agregarProveedor, editarProveedor, eliminarProveedor } from "../controllers";
export const SocketClientProveedor = {
  agregar: "cliente:proveedor-agregar",
  editar: "cliente:proveedor-editar",
  eliminar: "cliente:proveedor-eliminar",
};
const SocketServerProveedor = {
  agregar: "server:proveedor-agregar",
  editar: "server:proveedor-editar",
  eliminar: "server:proveedor-eliminar",
};

export const proveedorSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerProveedor.editar, async (data, callback) => {
      const { error, msg } = await editarProveedor(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientProveedor.editar, data);
      }
    });
    socket.on(SocketServerProveedor.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarProveedor(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientProveedor.agregar, item);
      }
    });
    socket.on(SocketServerProveedor.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarProveedor(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientProveedor.eliminar, data);
      }
    });
  });
};
