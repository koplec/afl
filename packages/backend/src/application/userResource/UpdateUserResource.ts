import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

export type UpdateUserResourceType = {
    userId: number;
    resourceId: number;
    url: string;
    type: "WEBDAV";
    username: string;
    password: string;
    directory: string;
};

export class UpdateUserResource {
  private userResourceRepository: UserResourceRepository;

  constructor(userResourceRepository: UserResourceRepository) {
    this.userResourceRepository = userResourceRepository;
  }

  async execute(args: UpdateUserResourceType): Promise<boolean> {
    const updated = await this.userResourceRepository.updateUserWEBDavResource(
        args.userId, args.resourceId, args.url, args.username, args.password, args.directory
    );
    if (!updated) {
      throw new Error('User resource not found');
    }
    return updated;
  }
}