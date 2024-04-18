export const usuarioProps = (usuario) => {
  return {
    name: usuario.name,
    email: usuario.email,
    online: usuario.online,
    rol: usuario.rol,
    lastname: usuario.lastname,
    tel: usuario.tel,
    uid: usuario._id,
    photo: usuario.photo,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt,
  };
};

export const roles = ["GERENTE", "EMPLEADO", "CLIENTE"];
