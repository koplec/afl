import {jest, describe, it, expect, beforeEach} from "@jest/globals";
import { UpdateUserResource, UpdateUserResourceArgsType } from "./UpdateUserResource";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

describe("UpdateUserResource", () => {
    let updateUserResource: UpdateUserResource;
    let userResourceRepository: UserResourceRepository;

    beforeEach(() => {
        const mockUserResourceRepo = UserResourceRepository as jest.MockedClass<typeof UserResourceRepository>;
        userResourceRepository = new mockUserResourceRepo();

        updateUserResource = new UpdateUserResource(userResourceRepository);
    });

    it("should update user resource successfully", async () => {
        // Arrange
        const args: UpdateUserResourceArgsType = {
            userId: 1,
            resourceId: 1,
            url: "https://example.com:port",
            type: "WEBDAV",
            username: "testuser",
            password: "testpassword",
            directory: "/path/to/directory",
        };
        jest.spyOn(userResourceRepository, "updateUserWEBDavResource").mockResolvedValue(true);

        // Act
        const result = await updateUserResource.execute(args);

        // Assert
        expect(result).toBe(true);
    });

    it('should throw an error when the user resource is not updated', async () => {

        // Arrange
        const args: UpdateUserResourceArgsType = {
            userId: 1,
            resourceId: 1,
            url: "https://example.com:port",
            type: "WEBDAV",
            username: "testuser",
            password: "testpassword",
            directory: "/path/to/directory",
        };
        jest.spyOn(userResourceRepository, "updateUserWEBDavResource").mockResolvedValue(false);

        // Act
        const result = updateUserResource.execute(args);

        // Assert
        await expect(result).rejects.toThrow('User resource update failed');
    });
});