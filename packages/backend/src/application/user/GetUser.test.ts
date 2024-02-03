import {GetUser} from "./GetUser";
import { UserRepository } from "../../infrastructure/db/UserRepository";
import {jest, describe, it, expect} from "@jest/globals";
import User from "../../domain/User";

jest.mock("../../infrastructure/db/UserRepository");

describe('GetUser', () => {
    it('should get user for valid name', async () => {
        const mockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
        const userRepository = new mockUserRepository();
        userRepository.getUserByName = jest.fn<(username:string) => Promise<User | null>>(
            (username:string) => {
                if(username === 'test'){
                    return Promise.resolve(new User(1, 'test', 'password'));
                }else{
                    return Promise.resolve(null);
                }
            }
        );
        const getUser = new GetUser(userRepository);
        const user1 = await getUser.execute('test');
        expect(user1).not.toBeNull();
        if(user1 !== null){
            expect(user1.name).toBe('test');
        }

        const user2 = await getUser.execute('test2');
        expect(user2).toBeNull();
    });
});