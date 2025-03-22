import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3307, // Ensure this matches the port used by SQLPub
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection()
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.error('Error connecting to database:', err);
    throw err;
  });

export default db;