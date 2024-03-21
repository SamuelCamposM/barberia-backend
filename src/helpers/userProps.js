export const userProps = (user) => {
  return {
    name: user.name,
    email: user.email,
    online: user.online,
    rol: user.rol,
    lastname: user.lastname,
    tel: user.tel,
    uid: user._id,
  };
};

export const roles = ["GERENTE", "EMPLEADO", "CLIENTE"];
