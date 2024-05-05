import {
  agregarDetCompra,
  editarDetCompra,
  eliminarDetCompra,
} from "../controllers";
const SocketClientCompra = {
  agregar: "cliente:detCompra-agregar",
  editar: "cliente:detCompra-editar",
  eliminar: "cliente:detCompra-eliminar",
};

const SocketServerCompra = {
  agregar: "server:detCompra-agregar",
  editar: "server:detCompra-editar",
  eliminar: "server:detCompra-eliminar",
};

export const detCompraSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerCompra.editar, async (data, callback) => {
      const { error, msg } = await editarDetCompra(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con éxito!" });

        io.emit(`${SocketClientCompra.editar}.${data.compra}`, data);
      }
    });

    socket.on(SocketServerCompra.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarDetCompra(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con éxito!" });

        io.emit(`${SocketClientCompra.agregar}.${data.compra}`, item);
      }
    });

    socket.on(SocketServerCompra.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarDetCompra(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con éxito!" });

        io.emit(`${SocketClientCompra.eliminar}.${data.compra}`, data);
      }
    });
  });
};
