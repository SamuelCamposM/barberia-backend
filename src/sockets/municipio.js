import {
  agregarMunicipio,
  editarMunicipio,
  eliminarMunicipio,
} from "../controllers";
const SocketClientEvent = {
  agregar: "cliente:municipio-agregar",
  editar: "cliente:municipio-editar",
  eliminar: "cliente:municipio-eliminar",
};
const SocketServerEvent = {
  agregar: "server:municipio-agregar",
  editar: "server:municipio-editar",
  eliminar: "server:municipio-eliminar",
};

export const municipioSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerEvent.editar, async (data, callback) => {
      const { error, msg } = await editarMunicipio(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(`${SocketClientEvent.editar}.${data.depto}`, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerEvent.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarMunicipio(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(`${SocketClientEvent.agregar}.${data.depto}`, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerEvent.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarMunicipio(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(`${SocketClientEvent.eliminar}.${data.depto}`, data);
      }
      // SI NO HAY ERROR
    });
  });
};
