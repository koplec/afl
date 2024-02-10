import UserResourceController from './UserResourceController';
import GetUserResource from '../../application/userResource/GetUserResource';
import {jest, describe, it, expect} from "@jest/globals";
import { UserResourceRepository } from '../../infrastructure/db/UserResourceRepository';
import { UserResourceType } from '../../domain/types';

describe("UserResourceController", () => {
    it('should return 404 when resource not found and 200 when resource', async () => {
        const mockUserResourceRepository = jest.genMockFromModule<UserResourceRepository>('../../infrastructure/db/UserResourceRepository');
        const mockGetUserResource = GetUserResource as jest.MockedClass<typeof GetUserResource>;
        const getUserResource = new mockGetUserResource(mockUserResourceRepository);
        getUserResource.execute = jest.fn<(userId: number, resourceId: number) => Promise<UserResourceType|null>>(
            (userId: number, resourceId: number) => {
                if(userId === 10 && resourceId === 34){
                    return Promise.resolve({
                        id: 10,
                        userId: 34,
                        protocolType: "WEBDAV",
                        url: "http://hogehoge-webdav:port9999",
                        username: "CCC",
                        password: "DDD"
                    });
                }else{
                    return Promise.resolve(null);
                }
            }
        );

        const userResourceController = new UserResourceController(getUserResource);
        const req = { params: { userId: 1, resourceId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await userResourceController.getResource(req as any, res as any);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Resource not found" });

        const req2 = { params: { userId: 10, resourceId: 34 } };
        const res2 = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await userResourceController.getResource(req2 as any, res2 as any);
        expect(res2.status).toHaveBeenCalledWith(200);
        expect(res2.json).toHaveBeenCalledWith({
            id: 10,
            userId: 34,
            protocolType: "WEBDAV",
            url: "http://hogehoge-webdav:port9999",
            username: "CCC",
            password: "DDD"
        });

    });
});