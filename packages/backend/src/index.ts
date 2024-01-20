import express from 'express';
import router from './interfaces/controllers/UserController';
const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', router);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});