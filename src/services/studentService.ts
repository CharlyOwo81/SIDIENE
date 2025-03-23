import axios from 'axios';

export const authService = async (telefono: string, contrasenia: string) => {
  console.log('Sending request:', { telefono, contrasenia });
  try {
    const response = await axios.post("http://localhost:3307/api/student/studentController", {
      telefono,
      contrasenia,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log('API response:', response.data);
    return response.data;
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