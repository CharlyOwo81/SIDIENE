import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST, // e.g., '123.456.789.123'
  port: process.env.DB_PORT || 3307, // e.g., 3306
  user: process.env.DB_USER, // e.g., 'root'
  password: process.env.DB_PASSWORD, // e.g., 'mypassword'
  database: process.env.DB_DATABASE, // e.g., 'mydatabase'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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