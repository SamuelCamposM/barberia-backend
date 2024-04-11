import {
  agregarSucursal,
  editarSucursal,
  eliminarSucursal,
} from "../controllers";
export const SocketClientSucursal = {
  agregar: "cliente:sucursal-agregar",
  editar: "cliente:sucursal-editar",
  eliminar: "cliente:sucursal-eliminar",
};
const SocketServerSucural = {
  agregar: "server:sucursal-agregar",
  editar: "server:sucursal-editar",
  eliminar: "server:sucursal-eliminar",
};

export const sucursalSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerSucural.editar, async (data, callback) => {
      const { error, msg } = await editarSucursal(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientSucursal.editar, data);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerSucural.agregar, async (data, callback) => {
      console.log({ data });
      const { error, item, msg } = await agregarSucursal(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientSucursal.agregar, item);
      }
      // SI NO HAY ERROR
    });
    socket.on(SocketServerSucural.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarSucursal(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientSucursal.eliminar, data);
      }
      // SI NO HAY ERROR
    });
  });
};
