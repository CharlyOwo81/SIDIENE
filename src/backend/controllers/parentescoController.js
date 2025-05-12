import db from '../config/db.js';

export const getParentescos = async (req, res) => {
  try {
    const [parentescos] = await db.query('SELECT id, tipo FROM parentesco');
    res.json({
      success: true,
      data: parentescos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};