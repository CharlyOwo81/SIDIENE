import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

// Define the TutorData interface
interface TutorData {
  curp: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email: string;
  parentesco_id: number;
  estudiantes?: string[]; // Array of student CURPs
}

interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
}

export const uploadTutorsFromPdf = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/tutors/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const createTutor = async (tutorData: TutorData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/tutors`, tutorData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error registrando al tutor.');
    }
    throw new Error('Un error desconocido ha ocurrido.');
  }
};

export const getAllTutors = async (
  searchQuery: string,
  filters: { grado: string[]; grupo: string[]; }
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/tutors`, {
      params: {
        searchQuery,
        grado: filters.grado.join(','),
        grupo: filters.grupo.join(','),
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || 'Error buscando tutores';
      throw new Error(msg);
    }
    throw new Error('Error desconocido');
  }
};

export const getTutorByCurp = async (curp: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/tutors/${curp}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching tutor');
    }
    throw new Error('An unknown error occurred');
  }
};

export const updateTutor = async (curp: string, tutorData: TutorData): Promise<ApiResponse> => {
  try {
    const response = await axios.put(`${API_URL}/tutors/${curp}`, tutorData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Error actualizando tutor';
      throw new Error(errorMessage);
    }
    throw new Error('An unknown error occurred');
  }
};

export const deleteTutor = async (curp: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/tutors/${curp}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error eliminando tutor');
    }
    throw new Error('An unknown error occurred');
  }
};

// Additional specific tutor endpoints
export const getTutorsByStudent = async (studentCurp: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/tutors/student/${studentCurp}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching student tutors');
    }
    throw new Error('An unknown error occurred');
  }
};

export const exportTutorsPdf = async (filters: { grado?: string; grupo?: string }): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/tutors/export`, {
      params: filters,
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error generando PDF');
    }
    throw new Error('An unknown error occurred');
  }
};