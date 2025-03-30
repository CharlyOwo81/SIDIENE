import axios from 'axios';

export const authService = async (telefono: string, contrasenia: string) => {
  console.log('Sending request:', { telefono, contrasenia });
  try {
    const response = await axios.post("http://localhost:3307/api/auth/authController", {
      telefono,
      contrasenia,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log('API response:', response.data);
    return {
      message: "Inicio de sesión exitoso",
      user: {
        curp: response.data.user.curp, // <- Asegurar que existe
        rol: response.data.user.rol,
        nombres: response.data.user.nombres,
        apellidoPaterno: response.data.user.apellidoPaterno, // Verificar nombres de campos
        apellidoMaterno: response.data.user.apellidoMaterno,
        telefono: response.data.user.telefono
      }
    };
  } catch (error) {
    console.error('API call failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};