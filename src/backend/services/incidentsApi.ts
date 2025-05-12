import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

interface ApiResponse {
    data: any;
    status: number;
    statusText: string;
  }

  interface IncidenceData {
    id_estudiante: string;
    id_personal: string;
    fecha: string;
    nivel_severidad: 'LEVE' | 'SEVERO' | 'GRAVE';
    motivo: string;
    descripcion: string;
  }

export const createIncidence = async (incidenceData: IncidenceData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/incidences`, incidenceData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error registrando al miembro del staff.');
    }
    throw new Error('Un error desconocido ha ocurrido.');
  }
};

export const getAllStaff = async (
  searchQuery: string,
  filters: { rol: string[]}
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/incidences`, {
      params: {
        searchQuery,
        rol: filters.rol.join(','),
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el personal'
      );
    }
    throw new Error('Error desconocido');
  }
};
