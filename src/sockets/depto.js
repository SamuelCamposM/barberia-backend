import { agregarDepto, editarDepto, eliminarDepto } from "../controllers";
const SocketClientEvent = {
  agregar: "cliente:depto-agregar",
  editar: "cliente:depto-editar",
  eliminar: "cliente:depto-eliminar",
};
const SocketServerEvent = {
  agregar: "server:depto-agregar",
  editar: "server:depto-editar",
  eliminar: "server:depto-eliminar",
};

export const deptoSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerEvent.editar, async (data, callback) => {
      const { error, msg } = await editarDepto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientEvent.editar, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerEvent.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarDepto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientEvent.agregar, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerEvent.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarDepto(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Elimnado con exito!" });
        io.emit(SocketClientEvent.eliminar, data);
      }
      // SI NO HAY ERROR
    });
  });
};
