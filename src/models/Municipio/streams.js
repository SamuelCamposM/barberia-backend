// change_streams/userChangeStream.js

import { MunicipioModel } from ".";

export const MunicipioChangeStream = MunicipioModel.watch();
MunicipioChangeStream.on("change", (data) => {
  console.log("Cambio detectado en municipio:", data);
  // Aquí puedes agregar lógica adicional según tus necesidades
});
