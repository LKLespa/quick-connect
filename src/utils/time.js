export const formatTimestamp = (timestamp) => {
  if (!timestamp?.toDate) return "";

  const date = timestamp.toDate();

  const options = {
    weekday: "short",   // Tue
    day: "2-digit",     // 16
    hour: "numeric",    // 12
    minute: "2-digit",  // 14
    hour12: true        // pm
  };

  return date.toLocaleString("en-US", options); 
}