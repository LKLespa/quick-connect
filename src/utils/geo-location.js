import axios from "axios";

const fetchAddressFromCoords = async (lat, lng) => {
  const apiKey = "841a5f5ecf954b918dd5f5d30b11ae2c"; // replace with your real key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;


  try {
    const res = await axios.get(url);
    const components = res.data.results[0]?.components || {};

    return {
      region: components.state || "",
      city: components.city || components.town || components.village || "",
      locality: components.suburb || components.neighbourhood || components.road || "",
    };
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return { region: "", city: "", locality: "" };
  }
};

export { fetchAddressFromCoords }