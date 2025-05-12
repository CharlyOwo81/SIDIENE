// services/staffApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

interface StaffData {
  curp: string;
  nombre: string;
  apellido: string;
  puesto: string;
  telefono: string;
}

interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
}

export const createStaff = async (staffData: StaffData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/staff`, staffData);
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
  filters: { rol: string[] }
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/staff`, {
      params: {
        searchQuery,
        rol: filters.rol.join(','),
      }
    });

    if (response.data.warning) {
      return {
        ...response,
        data: {
          ...response.data,
          isWarning: true
        }
      };
    }

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener el personal');
    }
    throw new Error('Error desconocido');
  }
};

export const getStaffById = async (curp: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/staff/${curp}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching staff member');
    }
    throw new Error('An unknown error occurred');
  }
};

export const updateStaff = async (id: string, staffData: StaffData): Promise<ApiResponse> => {
  try {
    const response = await axios.put(`${API_URL}/staff/${id}`, staffData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error updating staff member');
    }
    throw new Error('An unknown error occurred');
  }
};

export const deleteStaff = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/staff/${id}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error deleting staff member');
    }
    throw new Error('An unknown error occurred');
  }
};