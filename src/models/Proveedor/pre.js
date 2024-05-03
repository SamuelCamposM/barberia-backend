import { ProveedorModel } from ".";
import { ProveedorSchema } from "./ProveedorSchema";

ProveedorSchema.pre("findOneAndUpdate", async function (next) {
  const proveedorUpdate = this.getUpdate();

  if (proveedorUpdate.email) {
    const existingProveedor = await ProveedorModel.findOne({
      email: proveedorUpdate.email,
    });

    if (
      existingProveedor &&
      String(existingProveedor._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un proveedor con ese correo electrónico");
    }
  }

  if (proveedorUpdate.telefono) {
    const existingProveedor = await ProveedorModel.findOne({
      telefono: proveedorUpdate.telefono,
    });

    if (
      existingProveedor &&
      String(existingProveedor._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un proveedor con ese número de teléfono");
    }
  }

  next();
});

ProveedorSchema.pre("save", async function (next) {
  const proveedor = this;

  const existingProveedorEmail = await ProveedorModel.findOne({
    email: proveedor.email,
  });

  if (existingProveedorEmail) {
    throw new Error("Ya existe un proveedor con ese correo electrónico");
  }

  const existingProveedorTelefono = await ProveedorModel.findOne({
    telefono: proveedor.telefono,
  });

  if (existingProveedorTelefono) {
    throw new Error("Ya existe un proveedor con ese número de teléfono");
  }

  next();
});
