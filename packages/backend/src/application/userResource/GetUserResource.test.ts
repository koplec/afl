import GetUserResource from "./GetUserResource";
import { UserResourceType } from "../../domain/types";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";
import {jest, describe, it, expect, beforeEach} from "@jest/globals";

describe("GetUserResource", () => {
    let getUserResource: GetUserResource;
    let userResourceRepository: UserResourceRepository;

    beforeEach(() => {
        const mockUserResourceRepo = UserResourceRepository as jest.MockedClass<typeof UserResourceRepository>;
        userResourceRepository = new mockUserResourceRepo();

        getUserResource = new GetUserResource(userResourceRepository);
    });

    it("should return the user resource when it exists", async () => {

        // Arrange
        const userId = 1;
        const resourceId = 1;
        const expectedUserResource: UserResourceType = {
            id: resourceId,
            userId,
            protocolType: "WEBDAV",
            url: "http://hogehoge-webdav:port9999",
            username: "AAAA",
            password: "BBBBB"
            // Add other properties here
        };
        jest.spyOn(userResourceRepository, "getUserResource").mockResolvedValue(expectedUserResource);

        // Act
        const result = await getUserResource.execute(userId, resourceId);

        // Assert
        expect(result).toEqual(expectedUserResource);
        expect(userResourceRepository.getUserResource).toHaveBeenCalledWith(userId, resourceId);
    });

    it("should return null when the user resource does not exist", async () => {
        // Arrange
        const userId = 999999;
        const resourceId = 999999;
        jest.spyOn(userResourceRepository, "getUserResource").mockResolvedValue(null);

        // Act
        const result = await getUserResource.execute(userId, resourceId);

        // Assert
        expect(result).toBeNull();
        expect(userResourceRepository.getUserResource).toHaveBeenCalledWith(userId, resourceId);
    });
});
