import User from "./User";
import {describe, it, expect, test} from "@jest/globals";

describe('User', () => {
    describe('validPassword', () => {
        it('returns true when the password is correct', () => {
            const user = new User(1, 'user', 'pass');
            expect(user.validPassword('pass')).toBe(true);
        });

        it('returns false when the password is incorrect', () => {
            const user = new User(1, 'user', 'pass');
            expect(user.validPassword('wrong')).toBe(false);
        });
    });
})