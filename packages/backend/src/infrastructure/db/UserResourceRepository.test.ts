import {UserResourceRepository} from './UserResourceRepository';
import {describe, beforeEach, it, expect} from "@jest/globals";

describe('UserResourceRepository', () => {
    let userResourceRepository: UserResourceRepository;

    beforeEach(() => {
        userResourceRepository = new UserResourceRepository();
    });

    describe('getUserResource', () => {
        it('returns a user resource when the user resource exists', async () => {
            const userResource = await userResourceRepository.getUserResource(1, 1);
            expect(userResource).toEqual({ 
                id: 1, userId: 1, protocolType: 'WEBDAV', 
                url: 'http://your-webdav-host.com:port', 
                username: 'username', 
                password: 'password'
             });
        });

        it('returns null when the user resource does not exist', async () => {
            const userResource = await userResourceRepository.getUserResource(9999, 10000);
            expect(userResource).toBeNull();
        });
    });
});
