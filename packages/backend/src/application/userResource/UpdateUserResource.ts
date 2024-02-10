import { UserResourceRepository } from "../../infrastructure/db/UserResourceRepository";

export type UpdateUserResourceArgsType = {
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

  async execute(args: UpdateUserResourceArgsType): Promise<boolean> {
    const updated = await this.userResourceRepository.updateUserWEBDavResource(
        args.userId, args.resourceId, args.url, args.username, args.password, args.directory
    );
    if (!updated) {
      throw new Error('User resource update failed');
    }
    return updated;
  }
}