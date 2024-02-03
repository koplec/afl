

import {jest, describe, it, expect} from "@jest/globals";
import { GetUser } from "../../application/user/GetUser";
import UserController from "./UserController";
import User from "../../domain/User";
import { UserRepository } from "../../infrastructure/db/UserRepository";

describe("UserController", () => {
    it('should return a token for a valid user', async () => {
        const mockUserRepository = jest.genMockFromModule<UserRepository>('../../infrastructure/db/UserRepository');
        const mockGetUser = GetUser as jest.MockedClass<typeof GetUser>;
        const getUser = new mockGetUser(mockUserRepository);
        getUser.execute = jest.fn<(name:string) => Promise<User | null>>(
            (name:string) => {
                // console.log("Mocking getUser.execute")
                if(name === 'test'){
                    // console.log("Returning user")
                    return Promise.resolve(new User(1, 'test', 'password'));
                }else{
                    // console.log("Returning null")
                    return Promise.resolve(null);
                }
            });
        
        const userController = new UserController(getUser);
        const req = { body: { name: 'test', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await userController.token(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });

        const req2 = { body: { name: 'test2', password: 'password' } };
        const res2 = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await userController.token(req2 as any, res2 as any);
        expect(res2.status).toHaveBeenCalledWith(401);
        expect(res2.json).toHaveBeenCalledWith({ error: expect.any(String) });
    });
})