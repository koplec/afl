import {CREATE_USER_WEB_DAV_RESOURCE_FAILED, UserResourceRepository} from './UserResourceRepository';
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

    describe('createUserWEBDavResource', () => {
        it('returns CREATE_USER_WEB_DAV_RESOURCE_FAILED if user does not exists', async () => {
            const createID = await userResourceRepository.createUserWEBDavResource(9999, "http://your-webdav-host-invalid.com:port", "username-invalid", "password-invalid", "directory-invalid");
            expect(createID).toBe(CREATE_USER_WEB_DAV_RESOURCE_FAILED);
        });
        it('returns positive number if user exists', async () => {
            const createID = await userResourceRepository.createUserWEBDavResource(1, 
                "http://your-webdav-host-valid.com:port", 
                "username-valid", "password-valid", "directory");
            expect(createID).toBeGreaterThan(0);

            const resource = await userResourceRepository.getUserResource(1, createID);
            expect(resource).toEqual({ 
                id: createID, userId: 1, protocolType: 'WEBDAV', 
                url: 'http://your-webdav-host-valid.com:port', 
                username: 'username-valid', 
                password: 'password-valid',
                directory: 'directory'
             });
        });
    });

    describe('deleteUserResource', () => {
        it('returns true when the user resource is deleted', async () => {
            const createID = await userResourceRepository.createUserWEBDavResource(1, 
                "http://your-webdav-host-valid.com:port", 
                "username-valid", "password-valid", "directory");
            const success = await userResourceRepository.deleteUserResource(1, createID);
            expect(success).toBe(true);

            const resource = await userResourceRepository.getUserResource(1, createID);
            expect(resource).toBeNull();
        });
        it('returns false when the user resource is not deleted', async () => {
            const success = await userResourceRepository.deleteUserResource(9999, 10000);
            expect(success).toBe(false);
        });
    });
});
