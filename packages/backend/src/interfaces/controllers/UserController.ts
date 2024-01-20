import { GetUser } from "../../application/user/GetUser";
import { UserRepository } from "../../infrastructure/db/UserRepository";
import express from 'express';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();
const getUser = new GetUser(userRepository);

const router = express.Router();

router.post('/token',async (req, res) => {
    const { name, password } = req.body;

    const user = await getUser.execute(name);
    if(!user || user.validPassword(password) === false){
        res.status(401).json({ error: 'Invalid username or password' });
    }
    //Sign the JWT
    jwt.sign({user}, 'secretkey', (err: Error | null , token: string | undefined) => {
        if(err){
            res.status(500).json({ error: 'Error signing the token' });
        }else if(token){
            res.json({ token });
        }
    });
});

export default router;