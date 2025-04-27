import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

interface Parentesco {
  id: number;
  tipo: string;
}

interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
}

export const getParentescos = async (): Promise<Parentesco[]> => {
  try {
    const response = await axios.get(`${API_URL}/parentescos`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error fetching parentescos');
    }
    throw new Error('An unknown error occurred');
  }
};