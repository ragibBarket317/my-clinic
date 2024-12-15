export const ultimateDateFormatter = (inputDate) => {
  if (!inputDate) return "";
  return inputDate.substr(0, 10);
};

export const formatDateV3 = (inputDate) => {
  if (!inputDate) return "";
  let date = inputDate.substr(0, 10).split("-");
  return date[1] + "-" + date[2] + "-" + date[0];
};
