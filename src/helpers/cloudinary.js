const cloudinary = require("cloudinary").v2;

export const deleteFile = async (url) => {
  if (url === "") {
    return "";
  }
  // Extrae el ID del archivo de la URL
  let publicId = url.split("/").pop().split(".")[0];

  try {
    // Llama al método destroy de Cloudinary para eliminar el archivo\
    let result = await cloudinary.uploader.destroy(`barberia/${publicId}`);
    // Comprueba si el archivo se eliminó correctamente
    if (result.result === "ok") {
      return `Archivo ${publicId} eliminado correctamente.`;
    } else {
      return `No se pudo eliminar el archivo ${publicId}.`;
    }
  } catch (error) {
    console.log({ error });
    return `Error al eliminar el archivo ${publicId}: `;
  }
};
