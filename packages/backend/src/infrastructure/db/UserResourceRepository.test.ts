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
                password: 'password',
                directory: '/path/to/directory'
             });
        });

        it('returns null when the user resource does not exist', async () => {
            const userResource = await userResourceRepository.getUserResource(9999, 10000);
            expect(userResource).toBeNull();
        });
    });

    describe("updateUserWEBDavResource", () => {
        it("return true when the user resource is updated", async () => {
            const originalUserResource = await userResourceRepository.getUserResource(1, 1);
            expect(originalUserResource).toEqual({ 
                id: 1, userId: 1, protocolType: 'WEBDAV', 
                url: 'http://your-webdav-host.com:port', 
                username: 'username', 
                password: 'password',
                directory: '/path/to/directory'
             });
            const success = await userResourceRepository.updateUserWEBDavResource(1, 1, 
                "http://your-webdav-host2.com:port", "username2", "password2", "directory2");
            expect(success).toBe(true);
            const updatedUserResource = await userResourceRepository.getUserResource(1, 1);
            expect(updatedUserResource).toEqual({ 
                id: 1, userId: 1, protocolType: 'WEBDAV', 
                url: 'http://your-webdav-host2.com:port', 
                username: 'username2', 
                password: 'password2',
                directory: 'directory2'
             });

             const success2 = await userResourceRepository.updateUserWEBDavResource(1, 1,
                "http://your-webdav-host.com:port", "username", "password", "/path/to/directory");
            expect(success2).toBe(true);
        });
        it("return false when the user resource is not updated", async () => {
            const success = await userResourceRepository.updateUserWEBDavResource(9999, 10000, "http://your-webdav-host.com:port", "username", "password", "directory");
            expect(success).toBe(false);
        })
    });



});
