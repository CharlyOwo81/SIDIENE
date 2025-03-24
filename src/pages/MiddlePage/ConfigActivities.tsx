// config.ts
import personalIcon from "../../../public/chalkboard-user.svg";
import alumnadoIcon from "../../../public/student.svg";
import reportesIcon from "../../../public/exclamation.svg";
import funcion4Icon from "../../../public/paper-plane-launch.svg";

import registerIcon from "../../icons/registerIcon.svg";
import queryIcon from "../../icons/queryIcon.svg";
import updateIcon from "../../icons/updateIcon.svg";

export const functionalities = [
  // Grupo 1: Gestión de Personal y Alumnado
  {
    id: "f1",
    label: "Registrar Personal",
    icon: registerIcon,
    roles: ["DIRECTIVO"],
    path: "/RegisterStaff",
  },
  {
    id: "f2",
    label: "Consultar Personal",
    icon: queryIcon,
    roles: ["DIRECTIVO"],
    path: "/QueryStaff",
  },
  {
    id: "f3",
    label: "Actualizar Personal",
    icon: updateIcon,
    roles: ["DIRECTIVO"],
    path: "/UpdateStaff",
  },
  {
    id: "f4",
    label: "Registrar Alumnado",
    icon: registerIcon,
    roles: ["DIRECTIVO"],
    path: "/RegisterStudents",
  },
  {
    id: "f5",
    label: "Consultar Alumnado",
    icon: queryIcon,
    roles: ["DIRECTIVO"],
    path: "/QueryStudents",
  },
  {
    id: "f6",
    label: "Actualizar Alumnado",
    icon: updateIcon,
    roles: ["DIRECTIVO"],
    path: "/UpdateStudents",
  },

  // Grupo 2: Gestión de Canalizaciones
  {
    id: "f7",
    label: "Crear canalización",
    icon: reportesIcon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/CreateChannel",
  },
  {
    id: "f8",
    label: "Consultar canalización",
    icon: funcion4Icon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/ViewChannel",
  },
  {
    id: "f9",
    label: "Actualizar canalización",
    icon: reportesIcon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/UpdateChannel",
  },
  {
    id: "f10",
    label: "Acceder a Estatus de Canalización",
    icon: reportesIcon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL", "PREFECTO"],
    path: "/ChannelStatus",
  },

  // Grupo 3: Gestión de Incidencias
  {
    id: "f11",
    label: "Crear incidencias",
    icon: reportesIcon,
    roles: ["PREFECTO", "DOCENTE"],
    path: "/CreateIncidents",
  },
  {
    id: "f12",
    label: "Consultar incidencias",
    icon: funcion4Icon,
    roles: ["PREFECTO", "TRABAJADOR SOCIAL"],
    path: "/ReadIncidents",
  },
  {
    id: "f13",
    label: "Actualizar incidencias",
    icon: funcion4Icon,
    roles: ["PREFECTO"],
    path: "/UpdateIncidents",
  },

  // Grupo 4: Gestión de Expediente Único de Incidencias
  {
    id: "f14",
    label: "Crear expediente",
    icon: reportesIcon,
    roles: ["PREFECTO"],
    path: "/CreateRecord",
  },
  {
    id: "f15",
    label: "Consultar expediente",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL", "PREFECTO"],
    path: "/ViewRecord",
  },
  {
    id: "f16",
    label: "Actualizar expediente",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL"],
    path: "/UpdateRecord",
  },
  {
    id: "f17",
    label: "Exportar expediente a PDF",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL"],
    path: "/ExportRecord",
  },
];
