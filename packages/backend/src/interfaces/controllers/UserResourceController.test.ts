import UserResourceController from './UserResourceController';
import GetUserResource from '../../application/userResource/GetUserResource';
import {jest, describe, it, expect, beforeEach} from "@jest/globals";
import { UserResourceRepository } from '../../infrastructure/db/UserResourceRepository';
import { UserResourceType } from '../../domain/types';
import { UpdateUserResource, UpdateUserResourceArgsType } from '../../application/userResource/UpdateUserResource';
import { CreateUserResource, CreateUserResourceArgs } from '../../application/userResource/CreateUserResource';
import { DeleteUserResource } from '../../application/userResource/DeleteUserResource';

describe("UserResourceController", () => {

    let userResourceController: UserResourceController;
    beforeEach(() => {
        jest.clearAllMocks();
        const mockUserResourceRepository = jest.genMockFromModule<UserResourceRepository>('../../infrastructure/db/UserResourceRepository');
        const MockGetUserResource = GetUserResource as jest.MockedClass<typeof GetUserResource>;
        const getUserResource = new MockGetUserResource(mockUserResourceRepository);
        getUserResource.execute = jest.fn<(userId: number, resourceId: number) => Promise<UserResourceType|null>>(
            (userId: number, resourceId: number) => {
                if(userId === 10 && resourceId === 34){
                    return Promise.resolve({
                        id: 10,
                        userId: 34,
                        protocolType: "WEBDAV",
                        url: "http://hogehoge-webdav:port9999",
                        username: "CCC",
                        password: "DDD",
                        directory: "/path/to/directory/EEE"
                    });
                }else{
                    return Promise.resolve(null);
                }
            }
        );

        const MockUpdateUserResource = UpdateUserResource as jest.MockedClass<typeof UpdateUserResource>;
        const updateUserResource = new MockUpdateUserResource(mockUserResourceRepository);
        updateUserResource.execute = jest.fn<(args:UpdateUserResourceArgsType) => Promise<boolean>>(
            (args:UpdateUserResourceArgsType) => {
                if(args.userId === 1 && args.resourceId === 1){
                    return Promise.resolve(true);
                }else{
                    return Promise.resolve(false);
                }
            }
        );

        const MockCreateUserResource = CreateUserResource as jest.MockedClass<typeof CreateUserResource>;
        const createUserResource = new MockCreateUserResource(mockUserResourceRepository);
        createUserResource.execute= jest.fn<(args:CreateUserResourceArgs) => Promise<number>>(
            (args:CreateUserResourceArgs) => {
                if(args.type !== "WEBDAV"){
                    return Promise.reject(new Error("User resource creation failed"));
                }
                return Promise.resolve(123);
                
            }
        );

        const MockDeleteUserResource = DeleteUserResource as jest.MockedClass<typeof DeleteUserResource>;
        const deleteUserResource = new MockDeleteUserResource(mockUserResourceRepository);
        deleteUserResource.execute = jest.fn<(userId: number, resourceId: number) => Promise<boolean>>(
            (userId: number, resourceId: number) => {
                if(userId === 1 && resourceId === 1){
                    return Promise.resolve(true);
                }else{
                    return Promise.resolve(false);
                }
            }
        );

        userResourceController = new UserResourceController(
            getUserResource, updateUserResource, createUserResource, deleteUserResource
        );
    });
    describe("getResource", () => {
        it('should return 404 when resource not found and 200 when resource', async () => {
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
                password: "DDD",
                directory: "/path/to/directory/EEE"
            });

        });
    });

    describe("updateResource", () => {
        it('should return 200 when resource is updated successfully', async () => {
            const req = { params: { userId: 1, resourceId: 1 }, body: { 
                url: "http://example.com:12345",
                type: "WEBDAV",
                username: "username001",
                password: "password001",
                directory: "/path/to/directory001"
            } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.updateResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Resource updated' });
        });

        it('should return 404 when resource is not found', async () => {
            const req = { params: { userId: 1, resourceId: 2 }, body: { 
                url: "http://example.com:12345",
                type: "WEBDAV",
                username: "username001",
                password: "password001",
                directory: "/path/to/directory001"
            } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.updateResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Resource not found" });
        });
    });

    describe("createResource", () => {
        it('should return 200 when resource is created successfully', async () => {
            const req = { params: { userId: 1 }, body: { 
                url: "http://example.com:12345",
                type: "WEBDAV",
                username: "username001",
                password: "password001",
                directory: "/path/to/directory001"
            } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.createResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Resource created', resourceId: 123 });
        });

        it('should return 400 when resource type is invalid', async () => {
            const req = { params: { userId: 1 }, body: { 
                url: "http://example.com:12345",
                type: "INVALID_TYPE",
                username: "username001",
                password: "password001",
                directory: "/path/to/directory001"
            } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.createResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid resource type" });
        });
    });

    describe("deleteResource", () => {
        it('should return 200 when resource is deleted successfully', async () => {
            const req = { params: { userId: 1, resourceId: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.deleteResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Resource deleted' });
        });
        it('should return 404 when resource is not found', async () => {
            const req = { params: { userId: 1, resourceId: 2 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await userResourceController.deleteResource(req as any, res as any);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Resource not found" });
        });
    });
});