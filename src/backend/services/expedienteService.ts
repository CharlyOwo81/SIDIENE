// src/services/expedienteService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3307/api';

export interface Acuerdo {
  id_acuerdo: number;
  descripcion: string;
  fecha_creacion: string;
  estatus: 'ABIERTO' | 'EN PROCESO' | 'COMPLETADO';
}

export interface Incidencia {
  id_incidencia: number;
  motivo: string;
  fecha: string;
  nivel_severidad: 'LEVE' | 'SEVERO' | 'GRAVE';
  descripcion: string;
  acuerdos: Acuerdo[];
}

export interface Expediente {
  id_expediente: number;
  id_estudiante: string;
  fecha_creacion: string;
  incidencias: Incidencia[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const ExpedienteService = {
  async getByStudent(curp: string): Promise<ApiResponse<Expediente[]>> {
    try {
      const response = await axios.get(`${API_URL}/expedientes/student/${curp}`);
      console.log('Raw API response:', response.data);

      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || 'No se encontró expediente para este estudiante',
        };
      }

      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      return this.handleError(error, 'Error al obtener expedientes');
    }
  },

  async createExpediente(idEstudiante: string): Promise<ApiResponse<Expediente>> {
    try {
      const response = await axios.post(`${API_URL}/expedientes`, { id_estudiante: idEstudiante });
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Error al crear expediente');
    }
  },

  async addAcuerdo(
    idIncidencia: number,
    acuerdoData: {
      descripcion: string;
      estatus: 'ABIERTO' | 'EN PROCESO' | 'COMPLETADO';
    }
  ): Promise<ApiResponse<Acuerdo>> {
    try {
      const response = await axios.post(`${API_URL}/expedientes/incidencia/${idIncidencia}/acuerdos`, acuerdoData);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Error al agregar acuerdo');
    }
  },

  async updateAcuerdoStatus(
    idAcuerdo: number,
    newStatus: 'ABIERTO' | 'EN PROCESO' | 'COMPLETADO'
  ): Promise<ApiResponse<Acuerdo>> {
    try {
      const response = await axios.patch(`${API_URL}/acuerdos/${idAcuerdo}/estatus`, {
        estatus: newStatus,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Error al actualizar acuerdo');
    }
  },

  async getStudentsWithExpediente(
    grado: string,
    grupo: string
  ): Promise<ApiResponse<Array<{ curp: string; nombres: string; apellido_paterno: string; apellido_materno: string; expediente_count: number }>>> {
    try {
      const response = await axios.get(`${API_URL}/students/with-expediente`, {
        params: { grado, grupo },
      });
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Error al obtener estudiantes');
    }
  },

  handleError(error: any, defaultMessage: string): ApiResponse<any> {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || defaultMessage,
        error: error.message,
      };
    }
    return {
      success: false,
      message: defaultMessage,
      error: 'Error desconocido',
    };
  },
  
};