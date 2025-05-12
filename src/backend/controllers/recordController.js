import db from "../../backend/config/db.js";

// En expedienteController.js
exports.getExpedientesByStudent = async (req, res) => {
  const { idEstudiante } = req.params;
  try {
    const expedientes = await Expediente.getByStudent(idEstudiante);
    
    // Estructurar los datos correctamente
    const formattedData = expedientes.reduce((acc, row) => {
      let expediente = acc.find(e => e.id_expediente === row.id_expediente);
      
      if (!expediente) {
        expediente = {
          id_expediente: row.id_expediente,
          id_estudiante: row.id_estudiante,
          fecha_creacion: row.fecha_creacion,
          incidencias: []
        };
        acc.push(expediente);
      }

      if (row.id_incidencia) {
        let incidencia = expediente.incidencias.find(i => i.id_incidencia === row.id_incidencia);
        
        if (!incidencia) {
          incidencia = {
            id_incidencia: row.id_incidencia,
            motivo: row.incidencia_motivo,
            fecha: row.incidencia_fecha,
            acuerdos: []
          };
          expediente.incidencias.push(incidencia);
        }

        if (row.id_acuerdo) {
          incidencia.acuerdos.push({
            id_acuerdo: row.id_acuerdo,
            descripcion: row.acuerdo_descripcion,
            estatus: row.acuerdo_estatus
          });
        }
      }
      
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener expedientes',
      error: error.message
    });
  }
};


