// services/authService.ts
import axios from "axios";

export const login = async (telefono: string, contrasenia: string) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    {
      telefono,
      contrasenia,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};