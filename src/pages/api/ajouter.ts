import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

// MySQL database connection pool
const pool = mysql.createPool({
  host: 'localhost',      // MySQL server address (replace with your actual MySQL host if different)
  user: 'root',           // MySQL username
  password: '',           // MySQL password
  database: 'smartbase',  // Database name
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only handle POST requests
  if (req.method === 'POST') {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs.' });
    }

    try {
      // MySQL query to insert a new user into the users table
      const query = 'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)';
      const [result] = await pool.query(query, [user_name, email, password]);

      // Send success response
      res.status(200).json({
        message: 'Utilisateur ajouté avec succès!',
        result,
      });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur.' });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
