// Utility to map day name to index for backend
export const dayNameToIndex = (day: string): number => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.indexOf(day);
};
