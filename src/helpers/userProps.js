export const userProps = (user) => {
  return {
    name: user.name,
    email: user.email,
    online: user.online,
    uid: user._id,
  };
};
