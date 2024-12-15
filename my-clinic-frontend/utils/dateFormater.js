export const formatDate = (dateString) => {
  const parts = dateString.split("-");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};
export const convertDateFormat = (dateString) => {
  // Split the date string into parts
  const parts = dateString.split("-");
  // Rearrange the parts to the desired format
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
};
