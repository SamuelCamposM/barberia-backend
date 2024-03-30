// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { validarToken } from "../middlewares/";
import { getDepto, setDepto } from "../controllers/depto";
import { DeptoModel, MunicipioModel } from "../models";
export const deptoRouter = express.Router();
deptoRouter.post("/", getDepto);
deptoRouter.get("/set", setDepto);
deptoRouter.get("/municipios", async (req, res) => {
  // Asegúrate de tener un array de municipios y sus respectivos departamentos
  const municipios = [
    { nombre: "Apaneca", deptoNombre: "Ahuachapán" },
    { nombre: "Atiquizaya", deptoNombre: "Ahuachapán" },
    { nombre: "Concepción de Ataco", deptoNombre: "Ahuachapán" },
    { nombre: "Guaymango", deptoNombre: "Ahuachapán" },
    { nombre: "Jujutla", deptoNombre: "Ahuachapán" },
    { nombre: "San Francisco Menéndez", deptoNombre: "Ahuachapán" },
    { nombre: "San Lorenzo", deptoNombre: "Ahuachapán" },
    { nombre: "San Pedro Puxtla", deptoNombre: "Ahuachapán" },
    { nombre: "Tacuba", deptoNombre: "Ahuachapán" },
    // ...agrega más municipios aquí
    // Continúa agregando más municipios según tus necesidades
  ];

  for (let { nombre, deptoNombre } of municipios) {
    // Encuentra el departamento correspondiente
    const depto = await DeptoModel.findOne({ name: deptoNombre });

    if (!depto) {
      console.log(`No se encontró el departamento: ${deptoNombre}`);
      continue;
    }

    // Crea un nuevo municipio
    const municipio = new MunicipioModel({
      name: nombre,
      depto: depto._id, // Usa el ID del departamento
    });

    // Guarda el municipio en la base de datos
    // await municipio.save();
  }

  res.status(200).json({ msg: "Municipios insertados con éxito" });
});
