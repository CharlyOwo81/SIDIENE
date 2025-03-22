import axios from "axios";

export const login = async (telefono: string, contrasenia: string) => {
  try {
    console.log("Sending request:", { telefono, contrasenia });
    const response = await axios.post("/api/auth/login", { telefono, contrasenia }, { headers: { "Content-Type": "application/json" } });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};