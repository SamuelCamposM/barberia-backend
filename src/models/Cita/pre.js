import { CitaModel } from ".";
import { CitaSchema } from "./CitaSchema";

CitaSchema.pre("save", async function (next) {
  const cita = this;
  const existingCita = await CitaModel.findOne({
    fecha: cita.fecha,
    empleado: cita.empleado,
  });
  if (existingCita) {
    throw new Error("Ya existe una cita con la misma hora para este empleado");
  }
  next();
});

CitaSchema.pre("findOneAndUpdate", async function (next) {
  const cita = this.getUpdate();
  const existingCita = await CitaModel.findOne({
    fecha: cita.fecha,
    hora: cita.hora,
    empleado: cita.empleado,
    _id: { $ne: this.getQuery()._id }, // Ignora la cita que se está actualizando
  });
  if (existingCita) {
    throw new Error("Ya existe una cita con la misma hora para este empleado");
  }
  next();
});
