import express from 'express';
import jwt from 'jsonwebtoken';
import {Pool} from 'pg';

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'dbname',
    password: 'pass',
    port: 5432,
});

async function getUserFromDB(username: string){
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM mst_users WHERE name = $1', [username]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

const app = express();

app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.post('/token',async (req, res) => {
    const { name, password } = req.body;
    // For the given username fetch user from DB
    const user = await getUserFromDB(name);
    if(!user || user.password !== password){
        res.status(401).json({ error: 'Invalid username or password' });
    }
  // Sign the JWT
  jwt.sign({ user }, 'secretkey', (err: Error | null , token: string | undefined) => {
    if(err){
        res.status(500).json({ error: 'Error signing the token' });
    }else if(token){
        res.json({ token });
    }
  });
});

app.listen(5000, () => console.log('Server started on port 5000'));