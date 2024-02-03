import express from 'express';
import UserController from './interfaces/controllers/UserController';
import { GetUser } from './application/user/GetUser';
import { UserRepository } from './infrastructure/db/UserRepository';

const getUser = new GetUser(new UserRepository());
const userController = new UserController(getUser);

const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', userController.router);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});