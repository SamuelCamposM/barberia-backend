// index.js
import { model } from "mongoose";
import { CitaSchema } from "./CitaSchema";
import "./pre";
import "./post";

export const CitaModel = model("Cita", CitaSchema);
