const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia a tu usuario de MySQL
  password: 'sidiene2025', // Cambia a tu contraseña de MySQL
  database: 'sidiene_2025', // Cambia al nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1); // Salir del proceso si hay un error
  }
  console.log('Connected to MySQL database!');

  // Obtener todas las contraseñas sin encriptar
  db.query('SELECT curp, contrasena FROM personal', async (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      db.end(); // Cerrar la conexión
      return;
    }

    // Recorrer cada usuario y encriptar su contraseña
    for (const user of results) {
      try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(user.contrasena, 10);

        // Actualizar la base de datos con la contraseña encriptada
        db.query(
          'UPDATE personal SET contrasena = ? WHERE curp = ?',
          [hashedPassword, user.curp],
          (err) => {
            if (err) {
              console.error(`Error updating user ${user.curp}:`, err);
            } else {
              console.log(`Contraseña encriptada para el usuario con ID ${user.curp}`);
            }
          }
        );
      } catch (error) {
        console.error(`Error encrypting password for user ${user.curp}:`, error);
      }
    }

    // Cerrar la conexión a la base de datos
    db.end(() => {
      console.log('MySQL connection closed.');
      process.exit(0); // Salir del proceso
    });
  });
});