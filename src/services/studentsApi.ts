import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

// Define the StudentData interface
interface StudentData {
  curp: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  grado: string;
  grupo: string;
  anio_ingreso: string;
  estatus?: string; // Add the 'estatus' property as optional
}

// Define the response structure (optional, adjust based on your backend response)
interface ApiResponse {
  data: any; // Replace `any` with a more specific type if possible
  status: number;
  statusText: string;
}

export const uploadStudentsFromPdf = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file); // Matches multer.single('file')
  
  const response = await axios.post(`${API_URL}/students/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response; // Return full response to match ApiResponse type
};
export const createStudent = async (studentData: StudentData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error registrando al estudiante.');
    }
    throw new Error('Un error desconocido ha ocurrido.');
  }
};

export const getAllStudents = async (
  searchQuery: string,
  filters: { grado: string[]; grupo: string[]; }
): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/students`, {
      params: {
        searchQuery,
        grado: filters.grado.join(','),
        grupo: filters.grupo.join(','),
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching students');
    }
    throw new Error('An unknown error occurred');
  }
};
export const getStudentById = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching student');
    }
    throw new Error('An unknown error occurred');
  }
};

export const updateStudent = async (id: string, studentData: StudentData): Promise<ApiResponse> => {
  try {
    const formattedData = {
      nombres: studentData.nombres,
      apellido_paterno: studentData.apellido_paterno,
      apellido_materno: studentData.apellido_materno,
      grado: studentData.grado,
      grupo: studentData.grupo,
      anio_ingreso: studentData.anio_ingreso,
      estatus: studentData.estatus
    };
    
    const response = await axios.put(`${API_URL}/students/${id}`, formattedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Error updating student';
      throw new Error(errorMessage);
    }
    throw new Error('An unknown error occurred');
  }
};


export const deleteStudent = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(`${API_URL}/students/${id}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error deleting student');
    }
    throw new Error('An unknown error occurred');
  }
};