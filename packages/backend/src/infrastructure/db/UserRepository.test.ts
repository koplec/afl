import { UserRepository } from "./UserRepository";
import {describe, beforeEach, it, expect} from "@jest/globals";

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository();
    });

    describe('getUserByName', () => {
        it('returns a user when the user exists', async () => {
            const user = await userRepository.getUserByName('user');
            expect({ id: 1, name: 'user', password: 'pass' }).toEqual(user);
        });

        it('returns null when the user does not exist', async () => {
            const user = await userRepository.getUserByName('hogehoge');
            expect(user).toBeNull();
        });
    });
});