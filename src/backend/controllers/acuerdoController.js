// src/controllers/acuerdoController.js
export const createAcuerdo = async (req, res) => {
  try {
    const { id_incidencia } = req.params;
    const { descripcion, estatus } = req.body; // ← Campo corregido

    if (!id_incidencia || !descripcion || !estatus) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    const [result] = await db.query(
      `INSERT INTO acuerdo 
      (descripcion, estatus, fecha_creacion, id_incidencia) 
      VALUES (?, ?, NOW(), ?)`, // ← Orden corregido
      [descripcion, estatus, id_incidencia]
    );

    res.json({
      success: true,
      data: {
        id_acuerdo: result.insertId,
        id_incidencia,
        descripcion,
        estatus
      }
    });
  } catch (error) {
    console.error('Error creating acuerdo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear acuerdo: ' + error.message
    });
  }
};