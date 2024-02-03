import { GetUser } from "../../application/user/GetUser";
import { UserRepository } from "../../infrastructure/db/UserRepository";
import express from 'express';
import jwt from 'jsonwebtoken';

class UserController {
    private getUser: GetUser;
    public router = express.Router();

    constructor(getUser: GetUser){
        this.getUser = getUser;
        this.router.post('/token', this.token.bind(this));
    }

    public async token(req: express.Request, res: express.Response){
        const { name, password } = req.body;
        // console.log("Authenticating user: ", name, password)

        const user = await this.getUser.execute(name);
        // console.log("User: ", user)
        if(!user || user.validPassword(password) === false){
            // console.log("Invalid username or password")
            res.status(401).json({ error: 'Invalid username or password' });
        }
        //Sign the JWT
        // console.log("Signing the token")
        const signPromise = new Promise<string>((resolve, reject) => {
            jwt.sign({user}, 'secretkey', (err: Error | null , token: string | undefined) => {
                // console.log("Token signed")
                if(err){
                    // console.log("Error signing the token")
                    reject(err);
                }else if(token){
                    // console.log("Token signed successfully")
                    resolve(token);
                }else{
                    reject(new Error("Token is undefined"));
                }
            }); 
        });

        try{
            const token = await signPromise;
            res.status(200).json({ token });
        }catch(err){
            res.status(500).json({ error: 'Error signing the token' });
        }
        // console.log("Token sent");
    }
    
}

export default UserController;