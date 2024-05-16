import {
  agregarCita,
  editarCita,
  eliminarCita,
} from "../controllers";
export const SocketClientCita = {
  agregar: "cliente:cita-agregar",
  editar: "cliente:cita-editar",
  eliminar: "cliente:cita-eliminar",
};
const SocketServerCita = {
  agregar: "server:cita-agregar",
  editar: "server:cita-editar",
  eliminar: "server:cita-eliminar",
};

export const citaSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerCita.editar, async (data, callback) => {
      const { error, msg } = await editarCita(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editada con éxito!" });
        io.emit(SocketClientCita.editar, data.data);
      }
    });
    socket.on(SocketServerCita.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarCita(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardada con éxito!" });
        io.emit(SocketClientCita.agregar, item);
      }
      
    });
    socket.on(SocketServerCita.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarCita(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminada con éxito!" });
        io.emit(SocketClientCita.eliminar, data);
      }
    });
  });
};
