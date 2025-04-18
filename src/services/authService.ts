import axios from 'axios';

export const authService = async (telefono: string, contrasenia: string) => {
  try {
    const response = await axios.post("http://localhost:3307/api/auth/authController", {
      telefono,
      contrasenia,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    // Additional status check
    if (response.data.user.estatus === 'INACTIVO' || response.data.user.estatus === 'JUBILADO') {
      throw new Error(`account_${response.data.user.estatus.toLowerCase()}`);
    }

    return {
      message: response.data.message,
      user: {
        ...response.data.user,
        estatus: response.data.user.estatus // Forward status
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle backend's 403 response
      if (error.response?.status === 403) {
        throw new Error(error.response.data.message);
      }
      // Other error cases...
    }
    throw error;
  }
};