import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";
import { DeleteUserResource} from "./DeleteUserResource";

describe("DeleteUserResource", () => {
    let deleteUserResource: DeleteUserResource;
    let userResourceRepository: UserResourceRepository;

    beforeEach(() => {
        const mockUserResourceRepo = UserResourceRepository as jest.MockedClass<typeof UserResourceRepository>;
        userResourceRepository = new mockUserResourceRepo();

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

    it('should throw an error when the user resource is not deleted', async () => {

        // Arrange
        jest.spyOn(userResourceRepository, "deleteUserResource").mockResolvedValue(false);

        // Act
        const result = deleteUserResource.execute(1, 1);

        // Assert
        await expect(result).rejects.toThrow('User resource deletion failed');
    });
});