import express from 'express';
import UserController from './interfaces/controllers/UserController';
import { GetUser } from './application/user/GetUser';
import { UserRepository } from './infrastructure/db/UserRepository';
import UserResourceController from './interfaces/controllers/UserResourceController';
import GetUserResource from './application/userResource/GetUserResource';
import { UserResourceRepository } from './infrastructure/db/UserResourceRepository';
import { UpdateUserResource } from './application/userResource/UpdateUserResource';

//repository 
const userResourceRepository = new UserResourceRepository();
const userRepository = new UserRepository();


//use cases
const getUser = new GetUser(userRepository);
const getUserResource = new GetUserResource(userResourceRepository);
const updateUserResource = new UpdateUserResource(userResourceRepository);

//controller
const userController = new UserController(getUser);
const userResoureController = new UserResourceController(getUserResource, updateUserResource);

const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', userController.router);
app.use('/api/users/:userId/resources', userResoureController.router);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});