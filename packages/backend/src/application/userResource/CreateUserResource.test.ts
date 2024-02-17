import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import {
  CreateUserResource,
  CreateUserResourceArgs,
} from "./CreateUserResource";
import { CREATE_USER_WEB_DAV_RESOURCE_FAILED, UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

describe("CreateUserResource", () => {
  let createUserResource: CreateUserResource;
  let userResourceRepository: UserResourceRepository;

  beforeEach(() => {
    const mockUserResourceRepo = UserResourceRepository as jest.MockedClass<
      typeof UserResourceRepository
    >;
    userResourceRepository = new mockUserResourceRepo();

    createUserResource = new CreateUserResource(userResourceRepository);
  });

  it("should create user resource successfully", async () => {
    // Arrange
    const args: CreateUserResourceArgs = {
      userId: 1,
      url: "https://example.com:port",
      type: "WEBDAV",
      username: "testuser",
      password: "testpassword",
      directory: "/path/to/directory",
    };
    jest
      .spyOn(userResourceRepository, "createUserWEBDavResource")
      .mockResolvedValue(123);

    // Act
    const result = await createUserResource.execute(args);

    // Assert
    expect(result).toBe(123);
  });

  it("should throw an error when the user resource is not created", async () => {
    // Arrange
    const args: CreateUserResourceArgs = {
      userId: 1,
      url: "https://example.com:port",
      type: "WEBDAV",
      username: "testuser",
      password: "testpassword",
      directory: "/path/to/directory",
    };
    jest
      .spyOn(userResourceRepository, "createUserWEBDavResource")
      .mockResolvedValue(CREATE_USER_WEB_DAV_RESOURCE_FAILED); //返されるIDがCREATE_USER_WEB_DAV_RESOURCE_FAILEDの場合はエラーとする

    // Act
    const result = createUserResource.execute(args);

    // Assert
    await expect(result).rejects.toThrow("User resource creation failed");
  });
});
