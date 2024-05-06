import {
  agregarDetCompra,
  editarDetCompra,
  eliminarDetCompra,
} from "../controllers";
import { SocketClientCompra } from "./compra";
const SocketClientDetCompra = {
  agregar: "cliente:detCompra-agregar",
  editar: "cliente:detCompra-editar",
  eliminar: "cliente:detCompra-eliminar",
};

const SocketServerDetCompra = {
  agregar: "server:detCompra-agregar",
  editar: "server:detCompra-editar",
  eliminar: "server:detCompra-eliminar",
};

export const detCompraSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(
      SocketServerDetCompra.editar,
      async ({ data, dataCompra, dataDetCompraOld }, callback) => {
        const { error, msg, dataCompraRes } = await editarDetCompra({
          data,
          dataCompra,
          dataDetCompraOld,
        });

        if (error) {
          callback({ error, msg: msg || "Hubo un error!" });
          return;
        } else {
          callback({ error, msg: "Editado con éxito!" });
          io.emit(SocketClientCompra.detCompraListener, {
            _id: data.compra,
            dataCompraRes,
          });
          io.emit(`${SocketClientDetCompra.editar}.${data.compra}`, data);
        }
      }
    );

    socket.on(
      SocketServerDetCompra.agregar,
      async ({ data, dataCompra }, callback) => {
        const { error, item, msg, dataCompraRes } = await agregarDetCompra({
          data,
          dataCompra,
        });

        if (error) {
          callback({ error, msg: msg || "Hubo un error" });
          return;
        } else {
          callback({ error, msg: "Guardado con éxito!" });
          io.emit(SocketClientCompra.detCompraListener, {
            _id: data.compra,
            dataCompraRes,
          });
          io.emit(`${SocketClientDetCompra.agregar}.${data.compra}`, item);
        }
      }
    );

    socket.on(
      SocketServerDetCompra.eliminar,
      async ({ _id, compra, dataCompra, dataDetCompraOld }, callback) => {
        const { error, msg, dataCompraRes } = await eliminarDetCompra({
          _id,
          dataCompra,
          dataDetCompraOld,
          compra,
        });
        if (error) {
          callback({ error, msg: msg || "Hubo un error" });
          return;
        } else {
          io.emit(SocketClientCompra.detCompraListener, {
            _id: compra,
            dataCompraRes,
          });
          callback({ error, msg: "Eliminado con éxito!" });
          io.emit(`${SocketClientDetCompra.eliminar}.${compra}`, { _id: _id });
        }
      }
    );
  });
};
