import { config } from 'dotenv';
import mysql from 'mysql2/promise';
config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: '',
  database: 'riddles',
});


export default pool;
