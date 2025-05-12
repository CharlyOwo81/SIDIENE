// types.ts
export type Expediente = {
  id_expediente: string;
  fecha_creacion: string;
  id_estudiante: string;
  id_incidencia: string;
  id_acuerdo: string;
};

export type Acuerdo = {
  id_acuerdo: string;
  descripcion: string;
  fecha_creacion: string;
  estatus: 'ABIERTO' | 'EN PROCESO' | 'COMPLETADO';
  id_incidencia: string;
};