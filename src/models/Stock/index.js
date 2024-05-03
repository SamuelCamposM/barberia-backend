// index.js
import { model } from "mongoose";
import { StockSchema } from "./StockSchema";

import "./pre";
import "./post";

export const StockModel = model("Stock", StockSchema);
