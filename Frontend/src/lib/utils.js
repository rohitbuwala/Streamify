// export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// utils.js
export const capitialize  = (str = "") => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};