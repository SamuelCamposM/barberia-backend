import { response } from "express";
import { MensajeModel } from "../../models";

export const obtenerChat = async (req, res = response) => {
  try {
    const miId = req.uid;
    const mensajesDe = req.params.de;

    let last30 = await MensajeModel.find({
      $or: [
        { de: miId, para: mensajesDe },
        { de: mensajesDe, para: miId },
      ],
    })
      .sort({ createdAt: "desc" })
      .limit(30);
    res.json({
      mensajes: last30.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error el chat",
    });
  }
};
