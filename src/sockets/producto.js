import {
  agregarProducto,
  editarProducto,
  eliminarProducto,
} from "../controllers";
export const SocketClientProducto = {
  agregar: "cliente:producto-agregar",
  editar: "cliente:producto-editar",
  eliminar: "cliente:producto-eliminar",
};
const SocketServerProducto = {
  agregar: "server:producto-agregar",
  editar: "server:producto-editar",
  eliminar: "server:producto-eliminar",
};

export const productoSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerProducto.editar, async (data, callback) => {
      const { error, msg } = await editarProducto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientProducto.editar, data.data);
      }
    });
    socket.on(SocketServerProducto.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarProducto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientProducto.agregar, item);
      }
      
    });
    socket.on(SocketServerProducto.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarProducto(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientProducto.eliminar, data);
      }
    });
  });
};
