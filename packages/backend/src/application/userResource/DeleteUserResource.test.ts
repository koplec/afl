import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";
import { DeleteUserResource} from "./DeleteUserResource";

describe("DeleteUserResource", () => {
    let deleteUserResource: DeleteUserResource;
    let userResourceRepository: UserResourceRepository;

    beforeEach(() => {
        const MockUserResourceRepo = UserResourceRepository as jest.MockedClass<typeof UserResourceRepository>;
        userResourceRepository = new MockUserResourceRepo();

        deleteUserResource = new DeleteUserResource(userResourceRepository);
    });

    it('should delete user resource successfully', async () => {
        // Arrange
        jest.spyOn(userResourceRepository, "deleteUserResource").mockResolvedValue(true);

        // Act
        const result = await deleteUserResource.execute(1, 1);

        // Assert
        expect(result).toBe(true);
    });

    it('should delete user resource with failure', async () => {

        // Arrange
        jest.spyOn(userResourceRepository, "deleteUserResource").mockResolvedValue(false);

        // Act
        const result = await deleteUserResource.execute(1, 1);

        // Assert
        expect(result).toBe(false);
    });
});