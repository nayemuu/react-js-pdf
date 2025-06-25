export const convertTime = (dateTime) => {
  const timestamp = new Date(dateTime);
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedTime;
};

export const convertDate = (inputDate) => {
  if (!inputDate) return "";

  // Remove leading zero in year if present (e.g., "02025-03-17" → "2025-03-17")
  const cleanDate = inputDate.replace(/^0+/, "");

  const date = new Date(cleanDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
