// config.ts
import personalIcon from "../../../public/chalkboard-user.svg";
import alumnadoIcon from "../../../public/student.svg";
import reportesIcon from "../../../public/exclamation.svg";
import funcion4Icon from "../../../public/paper-plane-launch.svg";

export const functionalities = [
  // Grupo 1: Gestión de Personal y Alumnado
  {
    id: "f1",
    label: "Personal",
    icon: personalIcon,
    roles: ["DIRECTIVO"],
    path: "/ManageStaff",
  },
  {
    id: "f2",
    label: "Alumnado",
    icon: alumnadoIcon,
    roles: ["DIRECTIVO"],
    path: "/ManageStudents",
  },

  // Grupo 2: Gestión de Canalizaciones
  {
    id: "f3",
    label: "Crear canalización",
    icon: reportesIcon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/CreateChannel",
  },
  {
    id: "f4",
    label: "Consultar canalización",
    icon: funcion4Icon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/ViewChannel",
  },
  {
    id: "f5",
    label: "Actualizar canalización",
    icon: reportesIcon,
    roles: ["TRABAJADOR SOCIAL"],
    path: "/UpdateChannel",
  },
  {
    id: "f6",
    label: "Acceder a Estatus de Canalización",
    icon: reportesIcon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL", "PREFECTO"],
    path: "/ChannelStatus",
  },

  // Grupo 3: Gestión de Incidencias
  {
    id: "f7",
    label: "Crear incidencias",
    icon: reportesIcon,
    roles: ["PREFECTO", "DOCENTE"],
    path: "/CreateIncidents",
  },
  {
    id: "f8",
    label: "Consultar incidencias",
    icon: funcion4Icon,
    roles: ["PREFECTO", "TRABAJADOR SOCIAL"],
    path: "/ReadIncidents",
  },
  {
    id: "f9",
    label: "Actualizar incidencias",
    icon: funcion4Icon,
    roles: ["PREFECTO"],
    path: "/UpdateIncidents",
  },

  // Grupo 4: Gestión de Expediente Único de Incidencias
  {
    id: "f10",
    label: "Crear expediente",
    icon: reportesIcon,
    roles: ["PREFECTO"],
    path: "/CreateRecord",
  },
  {
    id: "f11",
    label: "Consultar expediente",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL", "PREFECTO"],
    path: "/ViewRecord",
  },
  {
    id: "f12",
    label: "Actualizar expediente",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL"],
    path: "/UpdateRecord",
  },
  {
    id: "f13",
    label: "Exportar expediente a PDF",
    icon: funcion4Icon,
    roles: ["DIRECTIVO", "TRABAJADOR SOCIAL"],
    path: "/ExportRecord",
  },
];
