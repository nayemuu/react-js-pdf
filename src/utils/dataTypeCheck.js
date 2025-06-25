export const isValidNumber = (value) => {
  return typeof value === "number"
    ? !isNaN(value)
    : value !== "" && !isNaN(Number(value));
};
