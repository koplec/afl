import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

// This is a hardcoded user. In a real-world application, you would fetch this from a database.
type User = {
    id: number;
    name: string;
    password: string;
}

app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.post('/token', (req, res) => {
    const { name, password } = req.body;
    // For the given username fetch user from DB
    const user = {name, password};
    if(user.name !== "user" || user.password !== "pass"){
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