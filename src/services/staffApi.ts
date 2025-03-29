// services/staffApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

interface StaffData {
  id: string;
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
interface StaffFilters {
  rol?: string[];
  estatus?: string[];
}

export const getAllStaff = async (searchQuery: string, filters: { puesto: string[]; departamento: string[]; estatus: string[]; }, params: {
    searchQuery?: string;
    filters?: StaffFilters;
}): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/staff`, {
      params: {
        searchQuery: params.searchQuery,
        filters: JSON.stringify(params.filters)
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el personal. Por favor verifique los parámetros.'
      );
    }
    throw new Error('Error desconocido al obtener el personal');
  }
};

export const getStaffById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/staff/${id}`);
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